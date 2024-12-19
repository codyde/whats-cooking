"use client"

import { RecipeGrid } from "@/components/recipes/recipe-grid"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useSupabase } from "@/hooks/use-supabase"
import { useEffect } from "react"

export default function RecipesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { session } = useSupabase()

  const handleNewRecipe = () => {
    router.push("/recipes/new")
  }

  const isAdmin = session?.user?.email === "codydearkland@gmail.com"

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipies</h1>
        {isAdmin && (
          <Button onClick={handleNewRecipe}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Recipe
          </Button>
        )}
      </div>
      {/* Add key to force remount when pathname changes */}
      <RecipeGrid key={pathname} />
    </div>
  )
}
