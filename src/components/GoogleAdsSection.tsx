'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function GoogleAdsSection() {
  useEffect(() => {
    // Push ad after script loads
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <>
      {/* Load AdSense script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4768819231981592"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <section className="mx-auto max-w-7xl px-5 py-8">
        {/* Google Ads Container */}
        <div className="relative">
          {/* Ad Label */}
          <div className="mb-3 flex items-center justify-center">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Advertisement
            </span>
          </div>

          {/* Ad Space */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 min-h-[100px]">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-4768819231981592"
              data-ad-slot="3173821922"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </section>
    </>
  )
}

