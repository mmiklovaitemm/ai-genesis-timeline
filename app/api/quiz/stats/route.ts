import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  // Get all answers grouped by session
  const { data: answers } = await supabaseAdmin
    .from('quiz_answers')
    .select('session_id, is_correct')

  if (!answers || answers.length === 0) {
    return Response.json({ avg_score: null, total_players: 0, distribution: [] })
  }

  // Group by session_id and count correct answers
  const sessionMap = new Map<string, number>()
  for (const row of answers) {
    const prev = sessionMap.get(row.session_id) ?? 0
    sessionMap.set(row.session_id, prev + (row.is_correct ? 1 : 0))
  }

  const scores = Array.from(sessionMap.values())
  const total_players = scores.length
  const avg_score = scores.reduce((a, b) => a + b, 0) / total_players

  // Distribution: how many players got each score 0-7
  const distribution = Array(8).fill(0)
  for (const s of scores) distribution[Math.min(s, 7)]++

  return Response.json({ avg_score: Math.round(avg_score * 10) / 10, total_players, distribution })
}
