"use client"

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface RecipeBreadcrumbsProps {
  recipeName: string
}

export function RecipeBreadcrumbs({ recipeName }: RecipeBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-3 text-base">
      <Link 
        href="/recipes" 
        className="hover:text-foreground transition-colors text-muted-foreground font-medium"
      >
        Recipes
      </Link>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
      <span className="text-foreground font-medium">{recipeName}</span>
    </div>
  )
}
