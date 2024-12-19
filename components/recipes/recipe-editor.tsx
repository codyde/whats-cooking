"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Label } from "@/components/ui/label"
import { MenuBar } from './menu-bar'

interface RecipeEditorProps {
  onContentChange: (content: string) => void
}

export function RecipeEditor({ onContentChange }: RecipeEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your recipe here...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
  })

  return (
    <div className="space-y-4">
      <Label>Recipe Content</Label>
      <div className="border rounded-lg overflow-hidden">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="p-4" />
      </div>
    </div>
  )
}
