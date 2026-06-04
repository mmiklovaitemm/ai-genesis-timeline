# AI Genesis — The History of Artificial Intelligence

**Live site:** [ai-genesis-timeline.vercel.app](https://ai-genesis-timeline.vercel.app)

---

An interactive scrollytelling timeline that takes you through the full history of artificial intelligence — from Alan Turing's first ideas in 1950 all the way to today's AI explosion. As you scroll, the story unfolds through animations, and you can test your knowledge and leave your thoughts along the way.

## What it does

The experience is divided into 7 chapters, each representing a major era in AI history:

1. **The Dream** (1950–1969) — symbolic AI, the Turing Test, the beginning
2. **The Winter** (1970–1986) — broken promises, funding cuts, the first collapse
3. **Awakening** (1987–2005) — neural networks stir back to life
4. **Revolution** (2006–2016) — deep learning, ImageNet, AlphaGo
5. **Transformers** (2017–2021) — "Attention is all you need", GPT, BERT
6. **The Explosion** (2022–2024) — ChatGPT, 100M users in 2 months
7. **The Present** (2025–) — where are we going?

Each chapter has a quiz question and a comments section where you can share your thoughts. At the end, you get a score and see how you compare to other visitors.

## Features

- Scroll-driven animations with pinned sections and scrub effects
- Animated neural network on the hero screen (Canvas API)
- Per-chapter quiz with live statistics
- Comments — post anonymously or sign in with GitHub
- Final score screen with player percentile comparison
- Full English and Lithuanian language support
- Dark minimalist design with per-epoch accent colors
- Navigation dots with epoch names on hover

## Built with

- **Next.js 16** — App Router, TypeScript, server components
- **GSAP + ScrollTrigger** — all animations and scroll effects
- **Supabase** — PostgreSQL database with row-level security
- **NextAuth v5** — GitHub OAuth authentication
- **Tailwind CSS v4** — styling

## Running locally

```bash
git clone https://github.com/mmiklovaitemm/ai-genesis-timeline.git
cd ai-genesis-timeline
npm install
```

Create a `.env.local` file with your own Supabase and GitHub OAuth credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
