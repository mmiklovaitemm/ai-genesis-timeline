'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Lang } from '@/lib/types'

interface Comment {
  id: number
  author_name: string
  github_username: string | null
  github_avatar: string | null
  content: string
  lang: string
  created_at: string
}

interface Props {
  epochSlug: string
  accentColor: string
  lang: Lang
}

function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Avatar({ comment, size = 32 }: { comment: Comment; size?: number }) {
  if (comment.github_avatar) {
    return (
      <img
        src={comment.github_avatar}
        alt={comment.author_name}
        width={size}
        height={size}
        className="rounded-full"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-xs font-bold text-white/60 bg-white/10 shrink-0"
      style={{ width: size, height: size }}
    >
      {comment.author_name[0]?.toUpperCase()}
    </div>
  )
}

export default function CommentsBlock({ epochSlug, accentColor, lang }: Props) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isLt = lang === 'lt'

  useEffect(() => {
    fetch(`/api/comments/${epochSlug}`)
      .then((r) => r.json())
      .then(setComments)
  }, [epochSlug])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!session && !authorName.trim()) {
      setError(isLt ? 'Įvesk vardą' : 'Enter your name')
      return
    }

    setSubmitting(true)
    setError('')

    const res = await fetch(`/api/comments/${epochSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, author_name: authorName, lang }),
    })

    if (res.ok) {
      const newComment = await res.json()
      setComments((prev) => [newComment, ...prev])
      setContent('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    } else {
      setError(isLt ? 'Klaida. Bandyk dar kartą.' : 'Error. Please try again.')
    }

    setSubmitting(false)
  }

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <div
      className="rounded-2xl p-6 mt-4"
      style={{ border: `1px solid ${accentColor}20`, background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span
          className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-full"
          style={{ color: accentColor, background: `${accentColor}15` }}
        >
          {isLt ? 'Komentarai' : 'Comments'}
        </span>
        <span className="text-[11px] text-white/30 font-mono">
          {comments.length} {isLt ? 'komentarų' : 'comments'}
        </span>
      </div>

      {/* Comment form */}
      <form onSubmit={submit} className="mb-6">
        {/* Auth status */}
        <div className="flex items-center gap-3 mb-3">
          {session ? (
            <div className="flex items-center gap-2 flex-1">
              {session.user?.image && (
                <img src={session.user.image} alt="" width={24} height={24} className="rounded-full" />
              )}
              <span className="text-xs text-white/50">{session.user?.name}</span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-[10px] text-white/25 hover:text-white/50 ml-auto transition-colors"
              >
                {isLt ? 'Atsijungti' : 'Sign out'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                placeholder={isLt ? 'Tavo vardas' : 'Your name'}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={40}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => signIn('github')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          )}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={autoResize}
          placeholder={isLt ? 'Tavo mintys apie šią epochą...' : 'Your thoughts on this epoch...'}
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors resize-none"
        />

        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
            style={{ background: accentColor, color: '#0a0a0a' }}
          >
            {submitting
              ? (isLt ? 'Siunčiama...' : 'Posting...')
              : (isLt ? 'Komentuoti' : 'Post')}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-4 font-mono">
          {isLt ? 'Kol kas komentarų nėra. Būk pirmas!' : 'No comments yet. Be the first!'}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar comment={c} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-medium text-white/70">{c.author_name}</span>
                  {c.github_username && (
                    <span className="text-[10px] text-white/25 font-mono">@{c.github_username}</span>
                  )}
                  <span className="text-[10px] text-white/20 ml-auto font-mono">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-white/55 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
