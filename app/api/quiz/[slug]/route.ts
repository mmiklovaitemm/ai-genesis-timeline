import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/quiz/[slug]'>
) {
  const { slug } = await ctx.params

  // Get epoch id by slug
  const { data: epoch } = await supabaseAdmin
    .from('epochs')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!epoch) {
    return Response.json({ error: 'Epoch not found' }, { status: 404 })
  }

  // Get question for this epoch
  const { data: question, error } = await supabaseAdmin
    .from('quiz_questions')
    .select('*')
    .eq('epoch_id', epoch.id)
    .single()

  if (error || !question) {
    return Response.json({ error: 'Question not found' }, { status: 404 })
  }

  // Stats
  const { data: answers } = await supabaseAdmin
    .from('quiz_answers')
    .select('is_correct')
    .eq('question_id', question.id)

  const total = answers?.length ?? 0
  const correct = answers?.filter((r) => r.is_correct).length ?? 0
  const correct_percent = total > 0 ? Math.round((correct / total) * 100) : null

  return Response.json({
    question,
    stats: { total, correct_percent },
  })
}
