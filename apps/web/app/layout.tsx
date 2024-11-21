import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

import './globals.css'
import Background from '@/components/background'
import Navbar from '@/components/navbar'

export const metadata = {
  title: 'Stardust'
} satisfies Metadata

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={GeistSans.className}>
        <Background />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
