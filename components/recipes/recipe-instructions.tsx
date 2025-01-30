"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { MenuBar } from './menu-bar'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Pencil, Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RecipeInstructionsProps {
  instructions: string[]
  recipeId: string
  onUpdate?: () => void
  editMode: boolean
}

export function RecipeInstructions({ 
  instructions, 
  recipeId, 
  onUpdate,
  editMode 
}: RecipeInstructionsProps) {
  const [isEditing, setIsEditing] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your instructions here...',
      }),
    ],
    content: `<ol>${instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol>`,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      // Just store the current state in the editor itself
      // We'll only extract it when saving
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
  })

  // Update editor content when instructions change
  useEffect(() => {
    if (editor && instructions) {
      const content = `<ol>${instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol>`
      editor.commands.setContent(content)
    }
  }, [editor, instructions])

  // Update editor's editable state when isEditing changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing)
    }
  }, [isEditing, editor])

  const handleSave = async () => {
    if (!editor) return

    try {
      // Convert editor content back to array of instructions
      const doc = new DOMParser().parseFromString(editor.getHTML(), 'text/html')
      const instructionsArray = Array.from(doc.querySelectorAll('li'))
        .map(li => li.textContent?.trim())
        .filter((text): text is string => text !== undefined && text !== '')

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructions: instructionsArray
        })
      })

      if (!response.ok) throw new Error('Failed to update recipe')
      onUpdate?.()
      setIsEditing(false) // Exit edit mode after successful save
    } catch (error) {
      console.error('Error updating recipe:', error)
      alert('Failed to update recipe')
    }
  }

  // If not in edit mode or not currently editing, render as regular numbered list
  if (!editMode || !isEditing) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold">Instructions</h2>
          {editMode && !isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-white hover:text-white/80"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ol className="list-decimal pl-6 space-y-4">
          {instructions.map((instruction, index) => (
            <li key={index} className="pl-2">{instruction}</li>
          ))}
        </ol>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
      <div className="border rounded-lg overflow-hidden mb-4">
        <MenuBar editor={editor} />
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          size="sm"
        >
          <Check className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(false)}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </Card>
  )
}
