import './globals.css'
import type { Metadata } from 'next'
import { ConditionalHeader } from '@/components/ConditionalHeader'
import { Footer } from '@/components/Footer'
import { AdSenseScript } from '@/components/AdSenseScript'

export const metadata: Metadata = {
  title: 'Istanbul City Guide | Best Things To Do, Eat, Shop & Stay',
  description: 'Plan your perfect Istanbul trip with handpicked activities, hotels, food & drink, and shopping—everything in one place.',
  // ⚡ Performance Optimization: Add favicon for browser optimization
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-0vUhySOuZDDnWI7kL0nTA.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
          `
        }} />
      </head>
      <body className="text-slate-900 antialiased">
        <AdSenseScript />
        <ConditionalHeader />
        {children}
        <Footer />
      </body>
    </html>
  )
}
