"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  MapPin,
  Hotel,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  LogOut,
  Activity,
  Search,
  ClipboardList,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ADMIN_PASSWORD = "istanbul2025" // In production, use proper auth

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
    } else {
      alert('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin'
    },
    {
      name: 'Setup Database',
      href: '/admin/setup',
      icon: Settings,
      current: pathname === '/admin/setup',
      badge: 'Phase 1'
    },
    {
      name: 'Content Scraping',
      href: '/admin/hybrid-scraping',
      icon: Sparkles,
      current: pathname === '/admin/hybrid-scraping',
      badge: 'Main'
    },
    {
      name: 'Staging Review',
      href: '/admin/staging',
      icon: ClipboardList,
      current: pathname === '/admin/staging',
      badge: 'Phase 3'
    },
    {
      name: 'Activities',
      href: '/admin/activities',
      icon: MapPin,
      current: pathname.startsWith('/admin/activities')
    },
    {
      name: 'Hotels',
      href: '/admin/hotels',
      icon: Hotel,
      current: pathname.startsWith('/admin/hotels'),
      badge: 'Soon'
    },
    {
      name: 'Food & Drink',
      href: '/admin/restaurants',
      icon: UtensilsCrossed,
      current: pathname.startsWith('/admin/restaurants'),
      badge: 'Soon'
    },
    {
      name: 'Shopping',
      href: '/admin/shopping',
      icon: ShoppingBag,
      current: pathname.startsWith('/admin/shopping'),
      badge: 'Soon'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-xl font-bold text-gray-900">
              Istanbul Admin
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col px-6 py-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors
                      ${item.current
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Logout */}
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="group flex w-full gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}