"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function Footer() {
  const adRef = useRef<HTMLModElement>(null)
  const adLoaded = useRef(false)

  useEffect(() => {
    // Only load the ad once
    if (adLoaded.current) return

    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
          adLoaded.current = true
        }
      } catch (error) {
        console.error('AdSense ad failed to load:', error)
      }
    }

    // Load ad after a short delay to ensure AdSense script is ready
    const timer = setTimeout(loadAd, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      {/* AdSense Banner */}
      <div className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ins 
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-4768819231981592"
              data-ad-slot="3173821922"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Istanbul Explorer</h3>
              <p className="text-gray-300 mb-4">
                Your ultimate travel guide to Istanbul. Discover the best activities, 
                restaurants, hotels, and shopping experiences in this magnificent city.
              </p>
              <p className="text-sm text-gray-400">
                Handpicked recommendations from local experts and travelers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/activities" className="hover:text-white transition-colors">Activities</Link></li>
                <li><a href="/food-drink" className="hover:text-white transition-colors">Food & Drink</a></li>
                <li><a href="/hotels" className="hover:text-white transition-colors">Hotels</a></li>
                <li><a href="/shopping" className="hover:text-white transition-colors">Shopping</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/database-schema" className="hover:text-white transition-colors">Database Schema</a></li>
                <li><a href="/map-test" className="hover:text-white transition-colors">Map Test</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
                <li><a href="/application" className="hover:text-white transition-colors">AI Explorer</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Istanbul Explorer. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
