"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '../ui/dialog'

interface ImageDialogProps {
  src: string
  alt: string
}

export function ImageDialog({ src, alt }: ImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Thumbnail */}
      <div 
        className="relative w-full h-[300px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative w-full h-[600px]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
