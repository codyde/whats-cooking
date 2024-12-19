import { Button } from "@/components/ui/button"
import { ChefHat, ClipboardList, Flame } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto text-center">
          <Flame className="h-16 w-16 mx-auto mb-6 text-red-500 animate-pulse" />
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
           What's Cooking?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Stop searching across random messages and notes for your favorite recipies. Find recipies from the community, log your cooks, and share your meals!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white">
              <Link href="/recipes">
                Explore Recipes
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/journal">
                Start Journal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
              <ChefHat className="h-12 w-12 mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Recipe Collection</h3>
              <p className="text-muted-foreground">
                Store and organize your favorite recipes in one place
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
              <ClipboardList className="h-12 w-12 mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Share Your Cooks</h3>
              <p className="text-muted-foreground">
                Log your cooks to keep track of your favorite styles, and share with others.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
              <Flame className="h-12 w-12 mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Build a Community</h3>
              <p className="text-muted-foreground">
                Like and comment on recipies, and share your experiences!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}