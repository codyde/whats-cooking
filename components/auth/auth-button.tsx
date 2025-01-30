"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import * as Sentry from '@sentry/nextjs'

export function AuthButton() {
  const router = useRouter()
  const { supabase, session } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      // Check initial session
  supabase.auth.getSession().then((response) => {
    if (response.data.session) {
      Sentry.setUser({
        id: response.data.session.user.id,
        email: response.data.session.user.email,
        username: response.data.session.user.user_metadata?.username
      });
    } else {
      Sentry.setUser(null); // Clear user context when not authenticated
    }
    setIsLoading(false);
  });
  }, [supabase.auth])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (session) {
    const userEmail = session.user?.email
    const avatarUrl = session.user?.user_metadata?.avatar_url

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={userEmail || ''} />
              <AvatarFallback>
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignIn}>
      <LogIn className="h-4 w-4 mr-2" />
      Sign In
    </Button>
  )
}
