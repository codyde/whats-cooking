"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface RecipeBasicInfoProps {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

export function RecipeBasicInfo({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}: RecipeBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Recipe Title</Label>
        <Input
          id="title"
          placeholder="Enter recipe title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of your recipe"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="h-[120px]"
        />
      </div>
    </div>
  )
}
