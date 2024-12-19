import { Recipe } from "@/lib/db/schema"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Clock, Thermometer, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useSupabase } from "@/hooks/use-supabase"

interface RecipeCardProps {
  recipe: Recipe
  onDelete?: (id: string) => void
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const { session } = useSupabase()
  const isOwner = session?.user?.email === "codydearkland@gmail.com"

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    if (!confirm("Are you sure you want to delete this recipe?")) return

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete recipe')
      }

      onDelete?.(recipe.id)
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe')
    }
  }

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-[300px] flex flex-col relative">
        <div className="relative w-full h-40">
          <Image
            src={recipe.image || '/images/Placeholder_BBQ.jpeg'}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {recipe.status === 'draft' && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Draft
            </Badge>
          )}
          {isOwner && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardHeader className="flex-1 py-3">
          <h3 className="text-lg font-semibold line-clamp-1">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
        </CardHeader>
        <CardFooter className="flex justify-between py-3 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {recipe.cooking_time} mins
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Thermometer className="mr-1 h-4 w-4" />
            {recipe.temperature}°F
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
