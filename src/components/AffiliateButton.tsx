"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AffiliateButtonProps {
  href: string
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  affiliateType: "booking" | "viator" | "tripadvisor" | "shop" | "getyourguide"
  trackingId?: string
}

export default function AffiliateButton({ 
  href, 
  children, 
  variant = "default", 
  size = "default",
  className = "",
  affiliateType,
  trackingId
}: AffiliateButtonProps) {
  const handleClick = () => {
    // Affiliate click tracking
    console.log("Affiliate Click:", {
      type: affiliateType,
      href,
      trackingId,
      timestamp: new Date().toISOString()
    })
    
    // In production, this would send to analytics
    // analytics.track('affiliate_click', { type: affiliateType, href, trackingId })
  }

  const getAffiliateUrl = () => {
    // Generate affiliate URLs based on type
    switch (affiliateType) {
      case "booking":
        return `https://www.booking.com/affiliate?url=${encodeURIComponent(href)}&aid=${trackingId || "istanbul-explorer"}`
      case "viator":
        return `https://www.viator.com/affiliate?url=${encodeURIComponent(href)}&aid=${trackingId || "istanbul-explorer"}`
      case "tripadvisor":
        return `https://www.tripadvisor.com/affiliate?url=${encodeURIComponent(href)}&aid=${trackingId || "istanbul-explorer"}`
      case "shop":
        return `https://www.amazon.com/affiliate?url=${encodeURIComponent(href)}&aid=${trackingId || "istanbul-explorer"}`
      case "getyourguide":
        return `https://www.getyourguide.com/affiliate?url=${encodeURIComponent(href)}&aid=${trackingId || "istanbul-explorer"}`
      default:
        return href
    }
  }

  return (
    <a 
      href={getAffiliateUrl()} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-block"
    >
      <Button 
        variant={variant}
        size={size}
        className={`inline-flex items-center ${className}`}
      >
        {children}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </a>
  )
}
