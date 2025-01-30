"use client"

import { useCallback, useEffect, useState } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { RecipeFormData } from "@/types/recipe"
import { useDebounce } from "@/hooks/use-debounce"
import { ImageUploader } from "./image-uploader"
import { RecipeHeader } from "./recipe-header"
import { RecipeBasicInfo } from "./recipe-basic-info"
import { RecipeEditor } from "./recipe-editor"
import { RecipeMetadata } from "./recipe-metadata"
import { saveRecipeDraft, publishRecipe } from "@/app/actions/recipeActions"

export function RecipeForm() {
  const [formData, setFormData] = useState<Partial<RecipeFormData>>({
    title: "",
    description: "",
    image: null,
    ingredients: [],
    instructions: [],
    cooking_time: 0,
    temperature: 0,
    category: "",
    status: "draft"
  })
  const [recipeId, setRecipeId] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const debouncedFormData = useDebounce(formData, 1000)
  const { session } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()

  const saveDraft = useCallback(async (data: Partial<RecipeFormData>) => {
    if (!session?.user?.id || !data.title) return

    const { savedRecipe, error } = await saveRecipeDraft(
      data, 
      session.user.id, 
      recipeId || undefined
    )

    if (error) {
      toast({
        title: "Error saving draft",
        description: error.message,
        variant: "destructive",
      })
    } else if (savedRecipe) {
      setRecipeId(savedRecipe.id)
      setLastSaved(new Date())
      router.refresh()
    }
  }, [session, toast, router, recipeId])

  useEffect(() => {
    if (Object.keys(debouncedFormData).length > 0 && formData.title) {
      saveDraft(debouncedFormData)
    }
  }, [debouncedFormData, saveDraft, formData.title])

  const handlePublish = async () => {
    if (!session?.user?.id) return

    const { error } = await publishRecipe(
      formData, 
      session.user.id, 
      recipeId || undefined
    )

    if (error) {
      toast({
        title: "Error publishing recipe",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Recipe published",
        description: "Your recipe has been published successfully.",
      })
      router.push("/recipes")
    }
  }

  return (
    <div className="space-y-8 max-w-8xl mx-auto p-6">
      <RecipeHeader 
        lastSaved={lastSaved} 
        recipeName={formData.title || "New Recipe"} 
      />

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader 
            onImageUpload={(url) => setFormData((prev: Partial<RecipeFormData>) => ({ 
              ...prev, 
              image: url 
            }))} 
          />

          <div className="space-y-6">
            <RecipeBasicInfo
              title={formData.title || ""}
              description={formData.description || ""}
              onTitleChange={(value) => setFormData((prev: Partial<RecipeFormData>) => ({ 
                ...prev, 
                title: value 
              }))}
              onDescriptionChange={(value) => setFormData((prev: Partial<RecipeFormData>) => ({ 
                ...prev, 
                description: value 
              }))}
            />

            <RecipeMetadata
              cookingTime={formData.cooking_time || 0}
              temperature={formData.temperature || 0}
              onCookingTimeChange={(value) => setFormData((prev: Partial<RecipeFormData>) => ({ 
                ...prev, 
                cooking_time: value 
              }))}
              onTemperatureChange={(value) => setFormData((prev: Partial<RecipeFormData>) => ({ 
                ...prev, 
                temperature: value 
              }))}
            />
          </div>
        </div>

        <RecipeEditor
          onContentChange={(content) => setFormData((prev: Partial<RecipeFormData>) => ({ 
            ...prev, 
            instructions: [content]
          }))}
        />

        <div className="flex justify-end">
          <Button type="button" onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </form>
    </div>
  )
}