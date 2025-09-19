"use client"

import { ArrowRight } from "lucide-react"

interface AffiliateButtonProps {
  href: string
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  affiliateType: "booking" | "viator" | "tripadvisor" | "shop" | "getyourguide"
  trackingId?: string
  locationName?: string
}

export default function AffiliateButton({ 
  href, 
  children, 
  variant = "default", 
  size = "default",
  className = "",
  affiliateType,
  trackingId,
  locationName
}: AffiliateButtonProps) {
  // Validate href - if missing or invalid, render nothing
  if (!href || href === "#" || href.trim() === "") {
    console.warn(`AffiliateButton: Invalid href for ${locationName || 'unknown location'}:`, href)
    return null
  }

  const handleClick = () => {
    // Affiliate click tracking
    console.log("Affiliate Click:", {
      locationName: locationName || 'unknown',
      type: affiliateType,
      originalHref: href,
      finalHref: getAffiliateUrl(),
      trackingId,
      timestamp: new Date().toISOString()
    })
    
    // In production, this would send to analytics
    // analytics.track('affiliate_click', { type: affiliateType, href, trackingId })
  }

  const getAffiliateUrl = () => {
    // For now, use the direct href instead of affiliate wrapping
    // This ensures the links work immediately
    return href
  }

  // Get button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }
    
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    }
    
    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`
  }

  const finalHref = getAffiliateUrl()
  
  // Log the location name and final href for verification
  console.log(`AffiliateButton: ${locationName || 'Unknown location'} -> ${finalHref}`)

  return (
    <a 
      href={finalHref} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${getButtonStyles()} ${className}`}
    >
      {children}
      <ArrowRight className="w-4 h-4 ml-2" />
    </a>
  )
}
