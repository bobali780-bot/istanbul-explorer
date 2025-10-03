import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { ConditionalHeader } from '@/components/ConditionalHeader'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Istanbul City Guide | Best Things To Do, Eat, Shop & Stay',
  description: 'Plan your perfect Istanbul trip with handpicked activities, hotels, food & drink, and shopping—everything in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4768819231981592"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="text-slate-900 antialiased">
        <ConditionalHeader />
        {children}
        <Footer />
      </body>
    </html>
  )
}
