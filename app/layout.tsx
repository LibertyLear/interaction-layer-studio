import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interaction Layer Studio',
  description: 'Prototype the architecture between LLMs and products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">{children}</body>
    </html>
  )
}
