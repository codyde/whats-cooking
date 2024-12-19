"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Clock, Thermometer } from "lucide-react"

interface RecipeMetadataProps {
  cookingTime: number
  temperature: number
  onCookingTimeChange: (value: number) => void
  onTemperatureChange: (value: number) => void
}

export function RecipeMetadata({
  cookingTime,
  temperature,
  onCookingTimeChange,
  onTemperatureChange
}: RecipeMetadataProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Clock className="w-5 h-5 text-red-500" />
          <Label htmlFor="cookingTime">Estimated Time (minutes)</Label>
        </div>
        <Input
          id="cookingTime"
          type="number"
          value={cookingTime}
          onChange={(e) => onCookingTimeChange(parseInt(e.target.value) || 0)}
          className="border-red-200 focus:ring-red-500 focus:border-red-500"
          min={0}
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Thermometer className="w-5 h-5 text-red-500" />
          <Label htmlFor="temperature">Temperature</Label>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <Slider
              id="temperature"
              min={0}
              max={600}
              step={5}
              value={[temperature]}
              onValueChange={(value) => onTemperatureChange(value[0])}
              className="flex-1 [&>[role=slider]]:bg-red-500 [&>[role=slider]]:border-red-500 [&>[role=slider]]:hover:bg-red-600 [&>div]:bg-red-500 [&>div]:hover:bg-red-600"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseInt(e.target.value) || 0)}
                className="w-20 border-red-200 focus:ring-red-500 focus:border-red-500"
                min={0}
                max={600}
              />
              <span className="text-sm text-muted-foreground">°F</span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground px-2">
            <span>0°F</span>
            <span>600°F</span>
          </div>
        </div>
      </div>
    </div>
  )
}
