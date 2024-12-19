"use client"

import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/hooks/use-supabase'

interface EditableFieldProps {
  value: string
  fieldName: string
  recipeId: string
  type?: 'input' | 'textarea'
  onUpdate?: () => void
  unit?: string
  editMode?: boolean
}

export function EditableField({ 
  value, 
  fieldName, 
  recipeId, 
  type = 'input',
  onUpdate,
  unit,
  editMode = false
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const { session } = useSupabase()

  const isAdmin = session?.user?.email === 'codydearkland@gmail.com'

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [fieldName]: editValue
        })
      })

      if (!response.ok) throw new Error('Failed to update recipe')

      setIsEditing(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error updating recipe:', error)
      alert('Failed to update recipe')
    }
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span>{value}</span>
        {unit && <span className="text-muted-foreground">{unit}</span>}
        {isAdmin && editMode && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {type === 'input' ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full"
        />
      ) : (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full"
        />
      )}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          <Check className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditValue(value)
            setIsEditing(false)
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
