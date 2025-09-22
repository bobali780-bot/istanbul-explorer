"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Hotel, UtensilsCrossed, ShoppingBag, Activity, Database } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    {
      name: 'Published Activities',
      value: '10',
      change: '+2 this week',
      changeType: 'positive',
      icon: MapPin
    },
    {
      name: 'Staging Content',
      value: '0',
      change: 'Ready to import',
      changeType: 'neutral',
      icon: Database
    },
    {
      name: 'Hotels',
      value: '0',
      change: 'Coming soon',
      changeType: 'neutral',
      icon: Hotel
    },
    {
      name: 'Restaurants',
      value: '0',
      change: 'Coming soon',
      changeType: 'neutral',
      icon: UtensilsCrossed
    }
  ]

  const quickActions = [
    {
      title: 'Bulk Import Activities',
      description: 'Search and import multiple activities using Firecrawl',
      href: '/admin/activities/import',
      icon: Activity,
      primary: true
    },
    {
      title: 'Manage Staging',
      description: 'Review and approve pending content',
      href: '/admin/activities/staging',
      icon: Database,
      primary: false
    },
    {
      title: 'View Published',
      description: 'See all live activities on the site',
      href: '/admin/activities',
      icon: MapPin,
      primary: false
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your Istanbul Explorer content and review staging imports
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <Badge
                    variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className={`cursor-pointer transition-all hover:shadow-lg ${
                action.primary ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center">
                    <action.icon className={`h-6 w-6 ${
                      action.primary ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <CardTitle className="ml-3 text-lg">
                      {action.title}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No recent activity</h3>
              <p className="mt-2 text-gray-500">
                Start by importing some activities to see your content workflow here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}