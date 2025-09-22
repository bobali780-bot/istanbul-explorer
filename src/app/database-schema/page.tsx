import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Table, Key, Link, Activity, UtensilsCrossed, Bed, ShoppingBag } from "lucide-react"
import { SchemaVisualization } from "@/components/database/schema-visualization"
import { TableExplorer } from "@/components/database/table-explorer"
import { RelationshipDiagram } from "@/components/database/relationship-diagram"

export default function DatabaseSchemaPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Database Schema</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete visualization of Istanbul Explorer&apos;s SEO-optimized database structure
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Database className="w-3 h-3" />
            15 Tables
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Table className="w-3 h-3" />
            4 Categories
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Key className="w-3 h-3" />
            SEO Optimized
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Link className="w-3 h-3" />
            Universal Relations
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activities</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 Tables</div>
                <p className="text-xs text-muted-foreground">activities, activity_schedules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 Tables</div>
                <p className="text-xs text-muted-foreground">restaurants, restaurant_menus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hotels</CardTitle>
                <Bed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 Tables</div>
                <p className="text-xs text-muted-foreground">hotels, hotel_rooms</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shopping</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 Tables</div>
                <p className="text-xs text-muted-foreground">shopping_venues, shopping_products</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Universal Tables</CardTitle>
              <CardDescription>
                Polymorphic tables that work across all categories for maximum efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Content Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• universal_media</li>
                    <li>• universal_reviews</li>
                    <li>• visitor_guides</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Analytics & SEO</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• universal_insights</li>
                    <li>• universal_nearby_recommendations</li>
                    <li>• api_usage_tracking</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Automation</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• automation_logs</li>
                    <li>• categories</li>
                    <li>• SEO schema fields</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <SchemaVisualization />
        </TabsContent>

        <TabsContent value="tables">
          <TableExplorer />
        </TabsContent>

        <TabsContent value="relationships">
          <RelationshipDiagram />
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Features</CardTitle>
              <CardDescription>
                Built-in automation capabilities for content management and SEO optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">SEO Automation</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      Automatic schema.org JSON-LD generation
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      FAQ data management system
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      Meta tags optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      Data source reliability tracking
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Content Automation</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      Wikipedia content integration
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      Free image API collection
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      Automated Top 10 rankings
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-3 h-3 p-0"></Badge>
                      Smart nearby recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}