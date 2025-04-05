import { Header } from '@/components/Header'

import style from './layout.module.css'

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className={style.outMostContainer}>
          {children}
        </main>
      </body>
    </html>
  )
}
