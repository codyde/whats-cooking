import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Error fetching recipe')
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.email !== 'codydearkland@gmail.com') {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const updates = await request.json()

    const { data: recipe, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.email !== 'codydearkland@gmail.com') {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .match({ id: params.id })

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
