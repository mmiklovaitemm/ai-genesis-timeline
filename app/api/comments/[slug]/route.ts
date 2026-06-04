import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/auth'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/comments/[slug]'>
) {
  const { slug } = await ctx.params

  const { data: epoch } = await supabaseAdmin
    .from('epochs')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!epoch) {
    return Response.json({ error: 'Epoch not found' }, { status: 404 })
  }

  const { data: comments } = await supabaseAdmin
    .from('comments')
    .select('id, author_name, github_username, github_avatar, content, lang, created_at')
    .eq('epoch_id', epoch.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return Response.json(comments ?? [])
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<'/api/comments/[slug]'>
) {
  const { slug } = await ctx.params
  const session = await auth()
  const body = await req.json()
  const { content, author_name, lang } = body

  if (!content?.trim()) {
    return Response.json({ error: 'Content required' }, { status: 400 })
  }

  const { data: epoch } = await supabaseAdmin
    .from('epochs')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!epoch) {
    return Response.json({ error: 'Epoch not found' }, { status: 404 })
  }

  const isAuthed = !!session?.user
  const commentAuthor = isAuthed ? (session!.user!.name ?? 'GitHub User') : author_name?.trim()

  if (!commentAuthor) {
    return Response.json({ error: 'Author name required' }, { status: 400 })
  }

  const { data: comment, error } = await supabaseAdmin
    .from('comments')
    .insert({
      epoch_id: epoch.id,
      author_name: commentAuthor,
      github_username: isAuthed ? session!.user!.name : null,
      github_avatar: isAuthed ? session!.user!.image : null,
      content: content.trim(),
      lang: lang ?? 'en',
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(comment, { status: 201 })
}
