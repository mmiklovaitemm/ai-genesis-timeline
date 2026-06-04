import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const secretKey = process.env.SUPABASE_SECRET_KEY!

// Browser-safe client (uses publishable key, respects RLS)
export const supabase = createClient(url, publishableKey)

// Server-only client (uses secret key, bypasses RLS) — never import in client components
export const supabaseAdmin = createClient(url, secretKey)
