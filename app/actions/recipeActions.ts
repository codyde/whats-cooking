// app/actions/recipeActions.ts
'use server'

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { RecipeFormData } from "@/types/recipe"
import { headers } from "next/headers"
import * as Sentry from "@sentry/nextjs"

export async function saveRecipeDraft(
    data: Partial<RecipeFormData>, 
    userId: string, 
    recipeId?: string
  ) {
    "use server"
    return await Sentry.withServerActionInstrumentation(
      "saveRecipeDraft",
      {
        // @ts-ignore
        data: { userId, recipeId, ...data },
        headers: headers(),
        recordResponse: true,
      },
      async () => {
        const supabase = createServerSupabaseClient()
        
        const recipeData = {
          ...data,
          user_id: userId,
          status: 'draft'
        }
  
        try {
          if (recipeId) {
            const { data: savedRecipe, error } = await supabase
              .from("recips")
              .update(recipeData)
              .eq('id', recipeId)
              .select()
              .single()
              
            if (error) throw error
            return { savedRecipe, error: null }
          }
  
          const { data: savedRecipe, error } = await supabase
            .from("recipes")
            .insert(recipeData)
            .select()
            .single()
          
          if (error) throw error
          return { savedRecipe, error: null }
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              action: 'saveRecipeDraft',
              userId,
              recipeId: recipeId || 'new'
            }
          })
          return { 
            savedRecipe: null, 
            error: error instanceof Error ? error : new Error('Unknown error saving recipe') 
          }
        }
      }
    )
  }
  
  export async function publishRecipe(
    data: Partial<RecipeFormData>, 
    userId: string, 
    recipeId?: string
  ) {
    return await Sentry.withServerActionInstrumentation(
      "publishRecipe",
      {
        // @ts-ignore
        data: { userId, recipeId, ...data },
        headers: headers(),
        recordResponse: true,
      },
      async () => {
        const supabase = createServerSupabaseClient()
        
        try {
          const { error } = await supabase
            .from("recipes")
            .upsert({
              ...data,
              id: recipeId,
              status: "published",
              user_id: userId,
            })
  
          if (error) throw error
          return { error: null }
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              action: 'publishRecipe',
              userId,
              recipeId: recipeId || 'new'
            }
          })
          return { 
            error: error instanceof Error ? error : new Error('Unknown error publishing recipe')
          }
        }
      }
    )
  }