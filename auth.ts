import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub ?? ''
        // GitHub-specific fields passed through JWT
        const t = token as typeof token & { login?: string; avatar_url?: string }
        session.user.name = t.login ?? session.user.name
        session.user.image = t.avatar_url ?? session.user.image
      }
      return session
    },
    async jwt({ token, profile }) {
      if (profile) {
        const p = profile as typeof profile & { login?: string; avatar_url?: string }
        token.login = p.login
        token.avatar_url = p.avatar_url
      }
      return token
    },
  },
})
