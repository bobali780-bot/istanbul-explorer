import './globals.css'
import type { Metadata } from 'next'
import { ConditionalHeader } from '@/components/ConditionalHeader'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Istanbul City Guide | Best Things To Do, Eat, Shop & Stay',
  description: 'Plan your perfect Istanbul trip with handpicked activities, hotels, food & drink, and shopping—everything in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-slate-900 antialiased">
        <ConditionalHeader />
        {children}
        <Footer />
      </body>
    </html>
  )
}
