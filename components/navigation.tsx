"use client"

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { Flame } from 'lucide-react'
import { AuthButton } from './auth/auth-button'

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Flame className="h-6 w-6 text-red-500 flame-icon" />
          <span className="font-bold text-xl">What's Cooking</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/recipes" className="text-sm font-medium transition-colors hover:text-primary">
            Recipes
          </Link>
          <Link href="/journal" className="text-sm font-medium transition-colors hover:text-primary">
            Logs
          </Link>
          <div className="flex items-center">
            <ThemeToggle />
            <div className="ml-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
