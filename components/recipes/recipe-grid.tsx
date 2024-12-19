"use client"

import { Recipe } from '@/lib/db/schema'
import { RecipeCard } from "./recipe-card"
import { useEffect, useState, ChangeEvent } from "react"
import { useSupabase } from '@/hooks/use-supabase'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

export function RecipeGrid() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)
  const { supabase, session } = useSupabase()

  useEffect(() => {
    let mounted = true

    const fetchRecipes = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false })

        if (debouncedSearch) {
          query = query.ilike('title', `%${debouncedSearch}%`)
        }

        // Show all recipes (published) or drafts for the current user
        if (session?.user?.id) {
          query = query.or(`status.eq.published,and(status.eq.draft,user_id.eq.${session.user.id})`)
        } else {
          query = query.eq('status', 'published')
        }

        const { data } = await query

        if (mounted && data) {
          setRecipes(data as Recipe[])
        }
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchRecipes()

    return () => {
      mounted = false
    }
  }, [supabase, debouncedSearch, session])

  const handleDelete = (id: string) => {
    // Optimistically remove the recipe from the UI
    setRecipes(recipes => recipes.filter(recipe => recipe.id !== id))
  }

  const RecipeCardSkeleton = () => (
    <Card className="overflow-hidden h-[300px] flex flex-col">
      <div className="relative w-full h-40 bg-gray-800 animate-pulse" />
      <CardHeader className="flex-1 py-3 space-y-2">
        <div className="h-6 bg-gray-800 rounded animate-pulse w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3" />
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between py-3 border-t">
        <div className="h-4 bg-gray-800 rounded animate-pulse w-20" />
        <div className="h-4 bg-gray-800 rounded animate-pulse w-20" />
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show loading skeletons that match the recipe card structure
          Array.from({ length: 6 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No recipes found
          </div>
        )}
      </div>
    </div>
  )
}
