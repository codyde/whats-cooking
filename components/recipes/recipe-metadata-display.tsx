"use client"

import { Clock, Thermometer } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { EditableField } from '@/components/recipes/editable-field'

interface RecipeMetadataDisplayProps {
  cookingTime: number
  temperature: number
  recipeId: string
  onUpdate: () => void
  editMode?: boolean
}

export function RecipeMetadataDisplay({
  cookingTime,
  temperature,
  recipeId,
  onUpdate,
  editMode = false
}: RecipeMetadataDisplayProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Cooking Details</h2>
      <div className="flex gap-8">
        <div>
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Cooking Time</span>
          </div>
          <EditableField
            value={cookingTime.toString()}
            fieldName="cooking_time"
            recipeId={recipeId}
            onUpdate={onUpdate}
            unit="minutes"
            editMode={editMode}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <Thermometer className="h-5 w-5" />
            <span className="font-medium">Temperature</span>
          </div>
          <EditableField
            value={temperature.toString()}
            fieldName="temperature"
            recipeId={recipeId}
            onUpdate={onUpdate}
            unit="°F"
            editMode={editMode}
          />
        </div>
      </div>
    </Card>
  )
}
