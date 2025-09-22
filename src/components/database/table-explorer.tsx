"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Key, Database, Hash, Calendar, CheckCircle, XCircle } from "lucide-react"

const tableStructures = {
  activities: {
    description: "Tourist attractions and experiences in Istanbul",
    category: "Core Category",
    fields: [
      { name: "id", type: "bigint", key: "PRIMARY", required: true, description: "Unique identifier" },
      { name: "name", type: "text", required: true, description: "Activity name" },
      { name: "slug", type: "text", key: "UNIQUE", required: true, description: "URL-friendly identifier" },
      { name: "seo_schema", type: "jsonb", required: false, description: "JSON-LD structured data for Google" },
      { name: "faq_data", type: "jsonb", required: false, description: "FAQ schema data" },
      { name: "meta_title", type: "text", required: false, description: "SEO page title" },
      { name: "meta_description", type: "text", required: false, description: "SEO meta description" },
      { name: "rating", type: "numeric(2,1)", required: false, description: "Average rating (1-5)" },
      { name: "popularity_score", type: "integer", required: false, description: "Algorithmic popularity ranking" },
      { name: "data_sources", type: "jsonb", required: false, description: "Source reliability tracking" },
      { name: "confidence_score", type: "integer", required: false, description: "Data confidence (1-100)" },
      { name: "district", type: "text", required: false, description: "Istanbul district location" },
      { name: "is_featured", type: "boolean", required: false, description: "Featured on homepage" },
      { name: "created_at", type: "timestamp", required: false, description: "Record creation time" }
    ]
  },
  restaurants: {
    description: "Dining establishments and cuisine options",
    category: "Core Category",
    fields: [
      { name: "id", type: "bigint", key: "PRIMARY", required: true, description: "Unique identifier" },
      { name: "name", type: "text", required: true, description: "Restaurant name" },
      { name: "cuisine_type", type: "text", required: false, description: "Type of cuisine (Turkish, Ottoman, etc.)" },
      { name: "price_range", type: "text", required: false, description: "Price category ($, $$, $$$, $$$$)" },
      { name: "seo_schema", type: "jsonb", required: false, description: "Restaurant schema markup" },
      { name: "dietary_options", type: "text[]", required: false, description: "Available dietary accommodations" },
      { name: "outdoor_seating", type: "boolean", required: false, description: "Has outdoor dining area" },
      { name: "reservations_required", type: "boolean", required: false, description: "Requires advance booking" }
    ]
  },
  universal_media: {
    description: "Images, videos, and social content for all entities",
    category: "Universal",
    fields: [
      { name: "id", type: "bigint", key: "PRIMARY", required: true, description: "Unique identifier" },
      { name: "entity_type", type: "text", required: true, description: "Type: activity, restaurant, hotel, shopping_venue" },
      { name: "entity_id", type: "bigint", required: true, description: "ID of the related entity" },
      { name: "media_type", type: "text", required: true, description: "Type: image, video, instagram_post, tiktok_video" },
      { name: "media_url", type: "text", required: true, description: "URL to the media file" },
      { name: "quality_score", type: "integer", required: false, description: "AI-assessed quality (1-100)" },
      { name: "is_primary", type: "boolean", required: false, description: "Main hero image for entity" },
      { name: "attribution", type: "text", required: false, description: "Photo credit and source" },
      { name: "source", type: "text", required: false, description: "unsplash, pexels, pixabay, user_upload" }
    ]
  },
  universal_reviews: {
    description: "Reviews and ratings from all platforms",
    category: "Universal",
    fields: [
      { name: "id", type: "bigint", key: "PRIMARY", required: true, description: "Unique identifier" },
      { name: "entity_type", type: "text", required: true, description: "Type of entity being reviewed" },
      { name: "entity_id", type: "bigint", required: true, description: "ID of the reviewed entity" },
      { name: "source", type: "text", required: true, description: "tripadvisor, google, yelp, booking" },
      { name: "rating", type: "integer", required: true, description: "Rating score (1-5)" },
      { name: "sentiment_score", type: "numeric(3,2)", required: false, description: "AI sentiment analysis (-1 to 1)" },
      { name: "is_verified_stay", type: "boolean", required: false, description: "Confirmed visitor" }
    ]
  },
  visitor_guides: {
    description: "Top 10 lists and curated travel content",
    category: "Automation",
    fields: [
      { name: "id", type: "bigint", key: "PRIMARY", required: true, description: "Unique identifier" },
      { name: "title", type: "text", required: true, description: "Guide title" },
      { name: "guide_type", type: "text", required: true, description: "top_10, district_guide, themed_itinerary" },
      { name: "included_entities", type: "jsonb", required: false, description: "Array of entities in this guide" },
      { name: "auto_generated", type: "boolean", required: false, description: "Created by automation" },
      { name: "content_freshness_score", type: "integer", required: false, description: "How up-to-date (1-100)" }
    ]
  },
  automation_logs: {
    description: "Track all automated processes and their results",
    category: "Automation",
    fields: [
      { name: "id", type: "bigint", key: "PRIMARY", required: true, description: "Unique identifier" },
      { name: "job_type", type: "text", required: true, description: "content_update, ranking_calculation, image_fetch" },
      { name: "status", type: "text", required: true, description: "running, completed, failed" },
      { name: "items_processed", type: "integer", required: false, description: "Number of items handled" },
      { name: "data_quality_score", type: "integer", required: false, description: "Overall quality of results" },
      { name: "api_calls_made", type: "integer", required: false, description: "API requests used" }
    ]
  }
}

export function TableExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Core Category", "Universal", "Automation"]

  const filteredTables = Object.entries(tableStructures).filter(([tableName, tableData]) => {
    const matchesSearch = tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tableData.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tableData.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Table Explorer
          </CardTitle>
          <CardDescription>
            Explore the structure and fields of all database tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tables and fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category === "all" ? "All" : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {filteredTables.map(([tableName, tableData]) => (
          <Card key={tableName}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="font-mono text-blue-600">{tableName}</span>
                  </CardTitle>
                  <CardDescription>{tableData.description}</CardDescription>
                </div>
                <Badge variant="outline">{tableData.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-4">
                  {tableData.fields.length} fields
                </div>

                <div className="space-y-2">
                  {tableData.fields.map((field) => (
                    <div key={field.name} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{field.name}</span>
                          {field.key && (
                            <Badge variant="secondary" className="text-xs">
                              <Key className="w-3 h-3 mr-1" />
                              {field.key}
                            </Badge>
                          )}
                          {field.required ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className="font-mono">
                          {field.type}
                        </Badge>
                        <span className="text-muted-foreground max-w-xs truncate">
                          {field.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tables found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}