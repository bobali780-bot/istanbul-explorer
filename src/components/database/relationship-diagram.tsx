"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Database, Link } from "lucide-react"

const relationships = [
  {
    type: "One-to-Many",
    relationships: [
      {
        from: "categories",
        to: "activities",
        description: "Each category contains multiple activities",
        field: "category_id"
      },
      {
        from: "categories",
        to: "restaurants",
        description: "Each category contains multiple restaurants",
        field: "category_id"
      },
      {
        from: "activities",
        to: "activity_schedules",
        description: "Each activity has multiple daily schedules",
        field: "activity_id"
      },
      {
        from: "restaurants",
        to: "restaurant_menus",
        description: "Each restaurant has multiple menu items",
        field: "restaurant_id"
      },
      {
        from: "hotels",
        to: "hotel_rooms",
        description: "Each hotel has multiple room types",
        field: "hotel_id"
      },
      {
        from: "shopping_venues",
        to: "shopping_products",
        description: "Each venue sells multiple product categories",
        field: "venue_id"
      }
    ]
  },
  {
    type: "Polymorphic (Universal)",
    relationships: [
      {
        from: "All Entities",
        to: "universal_media",
        description: "Any entity can have multiple images/videos",
        field: "entity_type + entity_id"
      },
      {
        from: "All Entities",
        to: "universal_reviews",
        description: "Any entity can have multiple reviews",
        field: "entity_type + entity_id"
      },
      {
        from: "All Entities",
        to: "universal_insights",
        description: "Any entity can have analytics data",
        field: "entity_type + entity_id"
      }
    ]
  },
  {
    type: "Many-to-Many (Smart Recommendations)",
    relationships: [
      {
        from: "Any Entity",
        to: "universal_nearby_recommendations",
        description: "Cross-category recommendations between any entities",
        field: "source_entity_type/id + target_entity_type/id"
      }
    ]
  }
]

const entityTypes = [
  { name: "activities", color: "bg-blue-100 text-blue-800", icon: "🏛️" },
  { name: "restaurants", color: "bg-green-100 text-green-800", icon: "🍽️" },
  { name: "hotels", color: "bg-purple-100 text-purple-800", icon: "🏨" },
  { name: "shopping_venues", color: "bg-orange-100 text-orange-800", icon: "🛍️" },
  { name: "universal_media", color: "bg-gray-100 text-gray-800", icon: "📸" },
  { name: "universal_reviews", color: "bg-yellow-100 text-yellow-800", icon: "⭐" },
  { name: "universal_insights", color: "bg-indigo-100 text-indigo-800", icon: "📊" }
]

function RelationshipCard({ relationship, type }: { relationship: any, type: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Badge variant="outline" className="font-mono text-xs">
          {relationship.from}
        </Badge>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <Badge variant="outline" className="font-mono text-xs">
          {relationship.to}
        </Badge>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm">{relationship.description}</p>
        <p className="text-xs text-muted-foreground font-mono">
          via: {relationship.field}
        </p>
      </div>

      <Badge variant="secondary" className="text-xs">
        {type}
      </Badge>
    </div>
  )
}

export function RelationshipDiagram() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Database Relationships
          </CardTitle>
          <CardDescription>
            How tables connect and relate to each other in the schema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">

            {/* Entity Type Legend */}
            <div className="space-y-3">
              <h4 className="font-semibold">Entity Types</h4>
              <div className="flex flex-wrap gap-2">
                {entityTypes.map((entity) => (
                  <Badge key={entity.name} className={`${entity.color} gap-1`}>
                    <span>{entity.icon}</span>
                    {entity.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Relationship Types */}
            {relationships.map((relationshipGroup) => (
              <div key={relationshipGroup.type} className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  {relationshipGroup.type} Relationships
                </h4>
                <div className="space-y-3">
                  {relationshipGroup.relationships.map((relationship, index) => (
                    <RelationshipCard
                      key={index}
                      relationship={relationship}
                      type={relationshipGroup.type}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Schema Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Schema Flow Diagram</CardTitle>
          <CardDescription>
            Visual representation of how data flows through the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">

            {/* Core Categories Flow */}
            <div className="space-y-4">
              <h4 className="font-semibold">Core Category Flow</h4>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-gray-100 text-gray-800">categories</Badge>
                <ArrowRight className="w-4 h-4" />
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-blue-100 text-blue-800">activities</Badge>
                  <Badge className="bg-green-100 text-green-800">restaurants</Badge>
                  <Badge className="bg-purple-100 text-purple-800">hotels</Badge>
                  <Badge className="bg-orange-100 text-orange-800">shopping_venues</Badge>
                </div>
              </div>
            </div>

            {/* Universal Tables Flow */}
            <div className="space-y-4">
              <h4 className="font-semibold">Universal Tables Flow</h4>
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge className="bg-blue-100 text-blue-800">activities</Badge>
                  <Badge className="bg-green-100 text-green-800">restaurants</Badge>
                  <Badge className="bg-purple-100 text-purple-800">hotels</Badge>
                  <Badge className="bg-orange-100 text-orange-800">shopping_venues</Badge>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge className="bg-gray-100 text-gray-800">universal_media</Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">universal_reviews</Badge>
                  <Badge className="bg-indigo-100 text-indigo-800">universal_insights</Badge>
                  <Badge className="bg-pink-100 text-pink-800">universal_nearby_recommendations</Badge>
                </div>
              </div>
            </div>

            {/* Automation Flow */}
            <div className="space-y-4">
              <h4 className="font-semibold">Automation Flow</h4>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-indigo-100 text-indigo-800">universal_insights</Badge>
                <ArrowRight className="w-4 h-4" />
                <Badge className="bg-purple-100 text-purple-800">visitor_guides</Badge>
                <ArrowRight className="w-4 h-4" />
                <Badge className="bg-red-100 text-red-800">automation_logs</Badge>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}