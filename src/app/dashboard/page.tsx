import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { 
  Palette, 
  Type, 
  Layout, 
  MousePointer, 
  Database, 
  Zap,
  Github,
  ExternalLink,
  Star,
  Heart,
  MapPin,
  Camera,
  Compass
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            shadcn/ui Ecosystem Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete component library demonstration for Istanbul Explorer
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Component Library Panel */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-600" />
                <CardTitle>Component Library</CardTitle>
                <Badge variant="secondary">70+ Components</Badge>
              </div>
              <CardDescription>
                Complete shadcn/ui component ecosystem with TypeScript integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Forms</h4>
                  <div className="space-y-1">
                    <Button size="sm" variant="outline" className="w-full">Button</Button>
                    <Input placeholder="Input field" className="h-8" />
                    <Textarea placeholder="Textarea" className="h-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Navigation</h4>
                  <div className="space-y-1">
                    <Select>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" className="w-full">Ghost Button</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Feedback</h4>
                  <div className="space-y-1">
                    <Badge>Default</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Data Display</h4>
                  <div className="space-y-1">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-xs text-gray-500">Avatar Component</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Documentation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme System Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-green-600" />
                <CardTitle>Theme System</CardTitle>
              </div>
              <CardDescription>
                CSS-first configuration with OKLCH colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Color Palette</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-8 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">Primary</span>
                    </div>
                    <div className="h-8 bg-secondary rounded flex items-center justify-center">
                      <span className="text-secondary-foreground text-xs">Secondary</span>
                    </div>
                    <div className="h-8 bg-accent rounded flex items-center justify-center">
                      <span className="text-accent-foreground text-xs">Accent</span>
                    </div>
                    <div className="h-8 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">Muted</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Interactive Demo</h4>
                  <div className="space-y-2">
                    <Button className="w-full">Primary Button</Button>
                    <Button variant="secondary" className="w-full">Secondary Button</Button>
                    <Button variant="outline" className="w-full">Outline Button</Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://ui.shadcn.com/themes" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Theme Docs
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Typography Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-600" />
                <CardTitle>Typography</CardTitle>
              </div>
              <CardDescription>
                Comprehensive text hierarchy system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h1 className="text-2xl font-bold">Heading 1</h1>
                  <h2 className="text-xl font-semibold">Heading 2</h2>
                  <h3 className="text-lg font-medium">Heading 3</h3>
                  <p className="text-base">Body text with proper contrast</p>
                  <p className="text-sm text-muted-foreground">Small muted text</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Font Features</h4>
                  <div className="text-xs space-y-1">
                    <div>• Inter font family</div>
                    <div>• Optimized for readability</div>
                    <div>• Dark mode support</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Components Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-orange-600" />
                <CardTitle>Interactive Components</CardTitle>
              </div>
              <CardDescription>
                Hover cards, dialogs, and advanced interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="outline">Hover for Details</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@vercel</h4>
                          <p className="text-sm">
                            The React Framework for Production
                          </p>
                          <div className="flex items-center pt-2">
                            <Star className="mr-2 h-4 w-4 opacity-70" />
                            <span className="text-xs text-muted-foreground">
                              Joined December 2021
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Tabs Demo</h4>
                  <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="account">Account</TabsTrigger>
                      <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                    </TabsContent>
                    <TabsContent value="password" className="mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lucide Icons Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <CardTitle>Lucide Icons</CardTitle>
              </div>
              <CardDescription>
                Beautiful & consistent icon library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Istanbul Explorer Icons</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center space-y-1">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <span className="text-xs">MapPin</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Camera className="w-6 h-6 text-green-600" />
                      <span className="text-xs">Camera</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Compass className="w-6 h-6 text-purple-600" />
                      <span className="text-xs">Compass</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Heart className="w-6 h-6 text-red-600" />
                      <span className="text-xs">Heart</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Star className="w-6 h-6 text-yellow-600" />
                      <span className="text-xs">Star</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Github className="w-6 h-6 text-gray-600" />
                      <span className="text-xs">Github</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Usage Example</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono">
                    {`import { MapPin } from "lucide-react"

<MapPin className="w-4 h-4" />`}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://lucide.dev/docs/lucide-react/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Icon Docs
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Integration Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <CardTitle>Database Integration</CardTitle>
              </div>
              <CardDescription>
                Supabase connection ready for Istanbul Explorer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Connection Status</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Supabase Connected</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Available Features</h4>
                  <div className="text-xs space-y-1">
                    <div>• Real-time database</div>
                    <div>• Authentication system</div>
                    <div>• File storage</div>
                    <div>• Edge functions</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Project Context</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                    <div>Project: Istanbul Explorer</div>
                    <div>User: Haidar</div>
                    <div>Environment: Development</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This dashboard demonstrates the complete shadcn/ui ecosystem integration. 
                All components are production-ready and fully typed with TypeScript.
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/application" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    View Starter Kit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
