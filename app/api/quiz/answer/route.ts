import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { question_id, session_id, answer } = body

  if (!question_id || !session_id || !answer) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Prevent double submission from same session
  const { data: existing } = await supabaseAdmin
    .from('quiz_answers')
    .select('id, is_correct')
    .eq('question_id', question_id)
    .eq('session_id', session_id)
    .single()

  if (existing) {
    return Response.json({ error: 'Already answered' }, { status: 409 })
  }

  // Get correct answer
  const { data: question } = await supabaseAdmin
    .from('quiz_questions')
    .select('correct_option')
    .eq('id', question_id)
    .single()

  if (!question) {
    return Response.json({ error: 'Question not found' }, { status: 404 })
  }

  const is_correct = answer === question.correct_option

  await supabaseAdmin.from('quiz_answers').insert({
    question_id,
    session_id,
    answer,
    is_correct,
  })

  // Updated stats
  const { data: stats } = await supabaseAdmin
    .from('quiz_answers')
    .select('is_correct')
    .eq('question_id', question_id)

  const total = stats?.length ?? 0
  const correct = stats?.filter((r) => r.is_correct).length ?? 0
  const correct_percent = Math.round((correct / total) * 100)

  return Response.json({
    is_correct,
    correct_option: question.correct_option,
    stats: { total, correct_percent },
  })
}
