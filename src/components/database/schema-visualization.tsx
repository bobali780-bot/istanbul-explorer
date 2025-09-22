"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Key, FileText, BarChart3, Link2 } from "lucide-react"

const schemaStructure = {
  core_categories: [
    {
      name: "activities",
      description: "Tourist attractions and experiences",
      fields: 32,
      key_features: ["SEO schema", "Wikipedia integration", "Multi-language", "Accessibility info"],
      icon: "🏛️"
    },
    {
      name: "restaurants",
      description: "Dining establishments and cuisine",
      fields: 28,
      key_features: ["Menu management", "Dietary options", "Price ranges", "Booking integration"],
      icon: "🍽️"
    },
    {
      name: "hotels",
      description: "Accommodation options",
      fields: 30,
      key_features: ["Room types", "Amenities", "Star ratings", "View categories"],
      icon: "🏨"
    },
    {
      name: "shopping_venues",
      description: "Markets, bazaars, and stores",
      fields: 25,
      key_features: ["Bargaining tips", "Authenticity tracking", "Product categories", "Payment methods"],
      icon: "🛍️"
    }
  ],
  universal_tables: [
    {
      name: "universal_media",
      description: "Images, videos, and social content for all entities",
      fields: 18,
      supports: ["All categories"],
      icon: "📸"
    },
    {
      name: "universal_reviews",
      description: "Reviews and ratings from all platforms",
      fields: 22,
      supports: ["All categories"],
      icon: "⭐"
    },
    {
      name: "universal_insights",
      description: "Analytics and automation data",
      fields: 20,
      supports: ["All categories"],
      icon: "📊"
    },
    {
      name: "universal_nearby_recommendations",
      description: "Smart cross-category suggestions",
      fields: 19,
      supports: ["All categories"],
      icon: "🎯"
    }
  ],
  automation_tables: [
    {
      name: "visitor_guides",
      description: "Top 10 lists and curated content",
      fields: 25,
      features: ["Auto-generation", "SEO optimization", "Multi-audience"],
      icon: "📋"
    },
    {
      name: "api_usage_tracking",
      description: "Monitor free API usage and limits",
      fields: 12,
      features: ["Rate limiting", "Cost tracking", "Error monitoring"],
      icon: "📡"
    },
    {
      name: "automation_logs",
      description: "Track all automated processes",
      fields: 16,
      features: ["Performance metrics", "Error tracking", "Quality scoring"],
      icon: "⚙️"
    }
  ]
}

export function SchemaVisualization() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Architecture Overview
          </CardTitle>
          <CardDescription>
            Complete schema structure with SEO optimization and automation capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Core Category Tables */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Key className="w-4 h-4" />
              Core Category Tables
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemaStructure.core_categories.map((table) => (
                <Card key={table.name} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-lg">{table.icon}</span>
                        {table.name}
                      </CardTitle>
                      <Badge variant="secondary">{table.fields} fields</Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {table.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {table.key_features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Universal Tables */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Universal Tables (Polymorphic)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemaStructure.universal_tables.map((table) => (
                <Card key={table.name} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-lg">{table.icon}</span>
                        {table.name}
                      </CardTitle>
                      <Badge variant="secondary">{table.fields} fields</Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {table.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Badge variant="outline" className="text-xs">
                      Works with: {table.supports.join(", ")}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Automation Tables */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Automation & Management Tables
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schemaStructure.automation_tables.map((table) => (
                <Card key={table.name} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span>{table.icon}</span>
                        {table.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">{table.fields}</Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {table.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {table.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Features Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Key Architecture Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">SEO Optimization</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• JSON-LD schema fields</li>
                    <li>• Meta tags management</li>
                    <li>• FAQ data storage</li>
                    <li>• Keyword tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Automation Ready</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Data source tracking</li>
                    <li>• Confidence scoring</li>
                    <li>• API usage monitoring</li>
                    <li>• Quality validation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Scalable Design</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Universal relationships</li>
                    <li>• Polymorphic tables</li>
                    <li>• Indexed for performance</li>
                    <li>• RLS security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}