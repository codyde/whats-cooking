"use client"

import { Clock } from "lucide-react"
import { format } from "date-fns"
import { RecipeBreadcrumbs } from "./recipe-breadcrumbs"

interface RecipeHeaderProps {
  lastSaved: Date | null
  recipeName: string
}

export function RecipeHeader({ lastSaved, recipeName }: RecipeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <RecipeBreadcrumbs recipeName={recipeName} />
      {lastSaved && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          Last saved: {format(lastSaved, 'HH:mm:ss')}
        </div>
      )}
    </div>
  )
}
