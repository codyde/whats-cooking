"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { Editor } from '@tiptap/react'

interface MenuBarProps {
  editor: Editor | null
}

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b p-2 flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={editor.isActive('bold') ? 'bg-muted' : ''}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={editor.isActive('italic') ? 'bg-muted' : ''}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  )
}
