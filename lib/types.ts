export type Lang = 'en' | 'lt'

export interface Epoch {
  id: number
  slug: string
  title_en: string
  title_lt: string
  year_start: number
  year_end: number | null
  description_en: string | null
  description_lt: string | null
  accent_color: string
  order_index: number
}

export interface EpochEvent {
  id: number
  epoch_id: number
  title_en: string
  title_lt: string
  content_en: string | null
  content_lt: string | null
  media_url: string | null
  order_index: number
}

export interface QuizQuestion {
  id: number
  epoch_id: number
  question_en: string
  question_lt: string
  option_a_en: string
  option_a_lt: string
  option_b_en: string
  option_b_lt: string
  option_c_en: string
  option_c_lt: string
  option_d_en: string
  option_d_lt: string
  correct_option: 'a' | 'b' | 'c' | 'd'
}

export interface Comment {
  id: number
  epoch_id: number
  author_name: string
  github_username: string | null
  github_avatar: string | null
  content: string
  lang: Lang
  created_at: string
}

export interface QuizAnswer {
  id: number
  question_id: number
  session_id: string
  answer: 'a' | 'b' | 'c' | 'd'
  is_correct: boolean
  created_at: string
}

// Helpers for rendering with active language
export function t<T extends Record<string, unknown>>(
  obj: T,
  key: string,
  lang: Lang
): string {
  const val = obj[`${key}_${lang}`] ?? obj[`${key}_en`]
  return (val as string) ?? ''
}
