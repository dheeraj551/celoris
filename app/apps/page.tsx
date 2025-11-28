import { Metadata } from "next"
import { Wrench, Calculator, Palette, Zap, TrendingUp, Star, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Apps - Celoris Platform",
  description: "Boost productivity with our collection of useful tools and utilities. Calculators, generators, converters, and more.",
  openGraph: {
    title: "Apps - Celoris Platform",
    description: "Boost productivity with our collection of useful tools and utilities.",
    url: "https://celoris.com/apps",
  },
}

const tools = [
  {
    id: 1,
    name: "Code Formatter",
    description: "Format and beautify your code in multiple programming languages with customizable options.",
    category: "Development",
    icon: "⚡",
    rating: 4.9,
    usageCount: 15640,
    isFeatured: true,
    features: ["Multiple languages", "Custom formatting", "Minification", "Syntax highlighting"]
  },
  {
    id: 2,
    name: "Color Palette Generator",
    description: "Create beautiful color palettes for your design projects. Generate harmonious colors and export in various formats.",
    category: "Design",
    icon: "🎨",
    rating: 4.8,
    usageCount: 12890,
    isFeatured: true,
    features: ["Harmony generation", "Export formats", "Color theory", "Accessibility check"]
  },
  {
    id: 3,
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON data. Pretty print JSON with syntax highlighting and error detection.",
    category: "Development",
    icon: "📋",
    rating: 4.7,
    usageCount: 18920,
    isFeatured: false,
    features: ["Format & validate", "Minification", "Error detection", "Syntax highlighting"]
  },
  {
    id: 4,
    name: "Markdown Editor",
    description: "Live markdown editor with real-time preview. Perfect for writing documentation, blogs, and README files.",
    category: "Writing",
    icon: "📝",
    rating: 4.6,
    usageCount: 9830,
    isFeatured: false,
    features: ["Live preview", "Export options", "Templates", "Themes"]
  },
  {
    id: 5,
    name: "Password Generator",
    description: "Generate secure passwords with customizable options. Create strong passwords for better security.",
    category: "Security",
    icon: "🔒",
    rating: 4.9,
    usageCount: 22150,
    isFeatured: true,
    features: ["Custom length", "Character sets", "Password strength", "Copy to clipboard"]
  },
  {
    id: 6,
    name: "QR Code Generator",
    description: "Create QR codes for text, URLs, contact info, and more. Download in various formats and sizes.",
    category: "Utilities",
    icon: "📱",
    rating: 4.5,
    usageCount: 7450,
    isFeatured: false,
    features: ["Multiple formats", "Custom sizing", "Logo integration", "Download options"]
  },
  {
    id: 7,
    name: "Image Resizer",
    description: "Resize images for web, social media, or print. Maintain quality while optimizing file size.",
    category: "Media",
    icon: "🖼️",
    rating: 4.7,
    usageCount: 11230,
    isFeatured: false,
    features: ["Bulk resizing", "Quality control", "Format conversion", "Batch processing"]
  },
  {
    id: 8,
    name: "URL Shortener",
    description: "Shorten long URLs for easy sharing. Track click statistics and manage your shortened links.",
    category: "Productivity",
    icon: "🔗",
    rating: 4.4,
    usageCount: 6780,
    isFeatured: false,
    features: ["Custom aliases", "Click tracking", "QR codes", "Link management"]
  },
  {
    id: 9,
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 text and files. Perfect for data transformation and API integrations.",
    category: "Development",
    icon: "🔄",
    rating: 4.6,
    usageCount: 8970,
    isFeatured: false,
    features: ["Text encoding", "File conversion", "Batch processing", "Error detection"]
  }
]

const categories = [
  { name: "Development", count: 12, icon: "⚡" },
  { name: "Design", count: 8, icon: "🎨" },
  { name: "Productivity", count: 15, icon: "📈" },
  { name: "Security", count: 6, icon: "🔒" },
  { name: "Media", count: 10, icon: "🖼️" },
  { name: "Utilities", count: 9, icon: "🔧" },
  { name: "Writing", count: 7, icon: "📝" },
  { name: "Calculators", count: 14, icon: "🧮" }
]

const featuredTools = tools.filter(tool => tool.isFeatured)

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Boost Your Productivity
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-50">
            Discover powerful tools and utilities to streamline your workflow. 
            From code formatters to design generators, we have everything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100" asChild>
              <Link href="/apps/tools">
                Explore Tools
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-500" asChild>
              <Link href="/apps/categories">
                Browse Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">80+</div>
              <div className="text-text-secondary">Useful Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">1M+</div>
              <div className="text-text-secondary">Tools Used</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">500K+</div>
              <div className="text-text-secondary">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">99%</div>
              <div className="text-text-secondary">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-text-secondary">
              Find the right tools for your needs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-text-primary mb-2">{category.name}</h3>
                  <p className="text-sm text-text-secondary">{category.count} tools</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Featured Tools
            </h2>
            <p className="text-lg text-text-secondary">
              Most popular tools loved by our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool) => (
              <Card key={tool.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-2xl">
                      {tool.icon}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-text-secondary">{tool.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{tool.usageCount.toLocaleString()} uses</span>
                      </div>
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                        {tool.category}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-text-primary">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="bg-gray-100 text-text-secondary px-2 py-1 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {tool.features.length > 3 && (
                          <span className="text-xs text-text-secondary">
                            +{tool.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/apps/tools/${tool.id}`}>
                        <Wrench className="mr-2 h-4 w-4" />
                        Use Tool
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/apps/tools">
                View All Tools
                <Wrench className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* All Tools Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                All Tools
              </h2>
              <p className="text-lg text-text-secondary">
                Complete collection of productivity tools
              </p>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-input rounded-md bg-background">
                <option>All Categories</option>
                <option>Development</option>
                <option>Design</option>
                <option>Productivity</option>
                <option>Security</option>
              </select>
              <select className="px-3 py-2 border border-input rounded-md bg-background">
                <option>Most Popular</option>
                <option>Recently Added</option>
                <option>Highest Rated</option>
                <option>Most Used</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-lg">
                      {tool.icon}
                    </div>
                    {tool.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2 line-clamp-1">{tool.name}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{tool.description}</p>
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{tool.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{tool.usageCount.toLocaleString()} uses</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                    <Button size="sm" asChild>
                      <Link href={`/apps/tools/${tool.id}`}>
                        Use
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Tools
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tool Collections */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Popular Collections
            </h2>
            <p className="text-lg text-text-secondary">
              Curated sets of tools for specific workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Developer Toolkit</CardTitle>
                <CardDescription>
                  Essential tools for developers including formatters, validators, and converters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4 text-sm text-text-secondary">
                  <div>• Code Formatter</div>
                  <div>• JSON Tools</div>
                  <div>• Base64 Encoder</div>
                  <div>• Hash Generator</div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/apps/collections/developer">
                    View Collection
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Designer Suite</CardTitle>
                <CardDescription>
                  Creative tools for designers including color generators, image resizers, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4 text-sm text-text-secondary">
                  <div>• Color Palette Generator</div>
                  <div>• Image Resizer</div>
                  <div>• Gradient Generator</div>
                  <div>• Font Combiner</div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/apps/collections/designer">
                    View Collection
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Productivity Hub</CardTitle>
                <CardDescription>
                  Boost your productivity with these essential business and personal tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4 text-sm text-text-secondary">
                  <div>• Password Generator</div>
                  <div>• QR Code Generator</div>
                  <div>• URL Shortener</div>
                  <div>• Invoice Generator</div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/apps/collections/productivity">
                    View Collection
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}