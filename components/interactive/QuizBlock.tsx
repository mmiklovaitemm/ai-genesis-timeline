'use client'

import { useEffect, useState } from 'react'
import { useSessionId } from '@/hooks/useSessionId'
import { Lang } from '@/lib/types'

interface Question {
  id: number
  question_en: string
  question_lt: string
  option_a_en: string; option_a_lt: string
  option_b_en: string; option_b_lt: string
  option_c_en: string; option_c_lt: string
  option_d_en: string; option_d_lt: string
  correct_option: string
}

interface Stats {
  total: number
  correct_percent: number | null
}

interface Props {
  epochSlug: string
  accentColor: string
  lang: Lang
}

const OPTIONS = ['a', 'b', 'c', 'd'] as const

function optionText(q: Question, opt: typeof OPTIONS[number], lang: Lang) {
  return lang === 'lt' ? q[`option_${opt}_lt`] : q[`option_${opt}_en`]
}

export default function QuizBlock({ epochSlug, accentColor, lang }: Props) {
  const sessionId = useSessionId()
  const [question, setQuestion] = useState<Question | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<{ is_correct: boolean; correct_option: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/quiz/${epochSlug}`)
      .then((r) => r.json())
      .then(({ question, stats }) => {
        setQuestion(question)
        setStats(stats)

        // Restore previous answer from localStorage
        const saved = localStorage.getItem(`quiz_${epochSlug}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          setSelected(parsed.answer)
          setResult({ is_correct: parsed.is_correct, correct_option: parsed.correct_option })
        }
      })
  }, [epochSlug])

  const submit = async (answer: string) => {
    if (!question || !sessionId || result) return
    setSelected(answer)
    setLoading(true)

    const res = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: question.id, session_id: sessionId, answer }),
    })

    const data = await res.json()
    if (res.status === 409) {
      // Already answered from another tab — just mark visually
      setResult({ is_correct: answer === question.correct_option, correct_option: question.correct_option })
    } else {
      setResult({ is_correct: data.is_correct, correct_option: data.correct_option })
      setStats(data.stats)
    }

    localStorage.setItem(
      `quiz_${epochSlug}`,
      JSON.stringify({ answer, is_correct: data.is_correct ?? answer === question.correct_option, correct_option: data.correct_option ?? question.correct_option })
    )
    setLoading(false)
  }

  if (!question) return null

  const questionText = lang === 'lt' ? question.question_lt : question.question_en
  const answered = result !== null

  const optionStyle = (opt: string) => {
    if (!answered) {
      return selected === opt
        ? { border: `1px solid ${accentColor}`, background: `${accentColor}15` }
        : { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }
    }
    if (opt === result!.correct_option) {
      return { border: '1px solid #10B981', background: '#10B98115' }
    }
    if (opt === selected && !result!.is_correct) {
      return { border: '1px solid #EF4444', background: '#EF444415' }
    }
    return { border: '1px solid rgba(255,255,255,0.05)', background: 'transparent', opacity: 0.4 }
  }

  return (
    <div
      className="rounded-2xl p-6 mt-8"
      style={{ border: `1px solid ${accentColor}20`, background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-full"
          style={{ color: accentColor, background: `${accentColor}15` }}
        >
          {lang === 'lt' ? 'Viktorina' : 'Quiz'}
        </span>
        {answered && stats?.total && (
          <span className="text-[11px] text-white/30 font-mono ml-auto">
            {stats.total} {lang === 'lt' ? 'atsakė' : 'answered'}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-sm md:text-base text-white/80 leading-relaxed mb-5">
        {questionText}
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            disabled={answered || loading}
            onClick={() => submit(opt)}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 disabled:cursor-default"
            style={optionStyle(opt)}
          >
            <span
              className="text-[11px] font-mono w-5 h-5 flex items-center justify-center rounded-full shrink-0"
              style={{
                background: answered && opt === result!.correct_option
                  ? '#10B981'
                  : answered && opt === selected && !result!.is_correct
                  ? '#EF4444'
                  : `${accentColor}20`,
                color: answered && (opt === result!.correct_option || (opt === selected && !result!.is_correct))
                  ? '#fff'
                  : accentColor,
              }}
            >
              {opt.toUpperCase()}
            </span>
            <span className="text-white/70">{optionText(question, opt, lang)}</span>
          </button>
        ))}
      </div>

      {/* Result feedback */}
      {answered && (
        <div className="mt-5 flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{ color: result!.is_correct ? '#10B981' : '#EF4444' }}
          >
            {result!.is_correct
              ? lang === 'lt' ? '✓ Teisingai!' : '✓ Correct!'
              : lang === 'lt' ? '✗ Neteisingai' : '✗ Incorrect'}
          </span>
          {stats?.correct_percent !== null && (
            <span className="text-[11px] text-white/30 font-mono">
              {stats!.correct_percent}% {lang === 'lt' ? 'atsakė teisingai' : 'answered correctly'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
