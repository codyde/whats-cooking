'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2 } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/components/ui/use-toast'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploaderProps {
  onImageUpload: (url: string) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const { supabase, session } = useSupabase()
  const { toast } = useToast()

  const processImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const handleLoad = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create blob'))
            }
          },
          'image/jpeg',
          0.9
        )
      }

      img.onload = handleLoad
      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        reject(new Error('Failed to load image'))
      }

      const url = URL.createObjectURL(file)
      img.src = url
    })
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      
      if (!session?.user?.id) {
        throw new Error('User not authenticated')
      }

      // Create a local preview immediately
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      // Process and upload the image
      const processedBlob = await processImage(file)
      const fileName = `${uuidv4()}.jpg`
      const filePath = `${session.user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, processedBlob, {
          contentType: 'image/jpeg'
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath)

      // Clean up the local preview URL
      URL.revokeObjectURL(previewUrl)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error uploading image',
        description: 'Please try again',
        variant: 'destructive',
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      try {
        const publicUrl = await uploadImage(file)
        if (publicUrl) {
          setImagePreview(publicUrl)
          onImageUpload(publicUrl)
        }
      } catch (error) {
        console.error('Error handling file:', error)
        toast({
          title: 'Error processing image',
          description: 'Please try again',
          variant: 'destructive',
        })
      }
    }
  }, [onImageUpload, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.heic']
    },
    maxFiles: 1,
    disabled: uploading,
    noKeyboard: true,
    multiple: false,
    useFsAccessApi: false
  })

  return (
    <div {...getRootProps()} className={`
      border-2 border-primary/50 rounded-lg p-6 cursor-pointer
      flex flex-col items-center justify-center
      h-[300px] max-h-[300px] w-full
      transition-colors duration-200
      ${isDragActive ? 'bg-primary/10' : 'bg-background hover:bg-primary/5'}
      ${uploading ? 'opacity-80 cursor-not-allowed' : ''}
    `}>
      <input {...getInputProps()} />
      {imagePreview ? (
        <div className="relative w-full h-full max-h-[250px] overflow-hidden">
          <img
            src={imagePreview}
            alt="Recipe preview"
            className="w-full h-full object-cover rounded-lg"
            style={{ maxHeight: '250px' }}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-2 text-sm text-foreground/80">
            {uploading ? 'Uploading...' : 'Drag and drop an image here, or click to select'}
          </p>
        </div>
      )}
    </div>
  )
}
