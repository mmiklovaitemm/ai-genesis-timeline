import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI Genesis — The History of Artificial Intelligence',
  description:
    'An interactive scrollytelling timeline tracing the evolution of AI from 1950 to the present.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#0a0a0a] text-[#ededed] overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
