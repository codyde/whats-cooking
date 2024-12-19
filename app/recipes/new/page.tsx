"use client"

import { RecipeForm } from "@/components/recipes/recipe-form"

export default function NewRecipePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>
      <RecipeForm />
    </div>
  )
}
