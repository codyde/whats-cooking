"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Recipe } from '@/lib/db/schema'
import { EditableField } from '@/components/recipes/editable-field'
import { ImageDialog } from '@/components/recipes/image-dialog'
import { RecipeMetadataDisplay } from '@/components/recipes/recipe-metadata-display'
import { Card } from '@/components/ui/card'
import { RecipeBreadcrumbs } from '@/components/recipes/recipe-breadcrumbs'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/hooks/use-supabase'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function RecipePage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const { session } = useSupabase()

  const isOwner = session?.user?.email === 'codydearkland@gmail.com'

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch recipe')
      const data = await response.json()
      setRecipe(data)
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'published' }),
      })
      
      if (!response.ok) throw new Error('Failed to publish recipe')
      
      // Refresh the recipe data
      await fetchRecipe()
    } catch (error) {
      console.error('Error publishing recipe:', error)
    }
  }

  useEffect(() => {
    fetchRecipe()
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  if (!recipe) {
    return <div className="container mx-auto py-8">Recipe not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-8xl mx-auto">
        {/* Breadcrumbs and Edit Toggle */}
        <div className="flex justify-between items-center mb-6">
          <RecipeBreadcrumbs recipeName={recipe.title} />
          {isOwner && (
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-mode"
                checked={editMode}
                onCheckedChange={setEditMode}
              />
              <Label htmlFor="edit-mode">Edit Mode</Label>
            </div>
          )}
        </div>

        {/* Title, Description, and Publish Button */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="text-4xl font-bold">
              <EditableField
                value={recipe.title}
                fieldName="title"
                recipeId={recipe.id}
                onUpdate={fetchRecipe}
                editMode={editMode}
              />
            </div>
            {isOwner && recipe.status === 'draft' && (
              <Button 
                onClick={handlePublish}
                className="ml-4"
              >
                Publish Recipe
              </Button>
            )}
          </div>
          <div className="text-lg text-muted-foreground">
            <EditableField
              value={recipe.description}
              fieldName="description"
              recipeId={recipe.id}
              type="textarea"
              onUpdate={fetchRecipe}
              editMode={editMode}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <ImageDialog
              src={recipe.image || '/images/Placeholder_BBQ.jpeg'}
              alt={recipe.title}
            />
          </div>

          {/* Right Column - Metadata and Ingredients */}
          <div className="space-y-6">
            {/* Metadata */}
            <RecipeMetadataDisplay
              cookingTime={recipe.cooking_time}
              temperature={recipe.temperature}
              recipeId={recipe.id}
              onUpdate={fetchRecipe}
              editMode={editMode}
            />

            {/* Ingredients */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
              <ul className="list-disc pl-6 space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <EditableField
                      value={ingredient}
                      fieldName={`ingredients[${index}]`}
                      recipeId={recipe.id}
                      onUpdate={fetchRecipe}
                      editMode={editMode}
                    />
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Instructions - Full Width Below */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal pl-6 space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>
                <EditableField
                  value={instruction}
                  fieldName={`instructions[${index}]`}
                  recipeId={recipe.id}
                  type="textarea"
                  onUpdate={fetchRecipe}
                  editMode={editMode}
                />
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  )
}
