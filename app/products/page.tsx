'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Heart } from 'lucide-react'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  rating?: number
  reviews_count?: number
}

const categoryData = {
  vault: {
    name: 'The Vault',
    description: 'International streaming subscriptions',
    gradient: 'from-[#0066CC] to-[#4A90E2]',
    items: [
      { id: 'netflix', name: 'Netflix Premium', price: 15.99, description: '4K Ultra HD streaming' },
      { id: 'disney', name: 'Disney+ Subscription', price: 10.99, description: 'Disney, Pixar, Marvel & Star Wars' },
      { id: 'spotify', name: 'Spotify Premium', price: 12.99, description: 'Ad-free music streaming' },
      { id: 'appletv', name: 'Apple TV+', price: 9.99, description: 'Original series and films' },
      { id: 'prime', name: 'Amazon Prime Video', price: 11.99, description: 'Movies, shows & Prime shipping' },
      { id: 'hbo', name: 'Max (HBO)', price: 13.99, description: 'HBO, DC, and Max Originals' },
    ]
  },
  telecom: {
    name: 'Telecom Hub',
    description: 'Internet bundles and mobile top-ups',
    gradient: 'from-[#2ECC71] to-[#27AE60]',
    items: [
      { id: 'ooredoo-internet', name: 'Ooredoo 10GB', price: 19.99, description: '10GB internet + calls' },
      { id: 'orange-internet', name: 'Orange 10GB', price: 19.99, description: '10GB internet + unlimited SMS' },
      { id: 'tt-internet', name: 'TT 10GB', price: 17.99, description: '10GB + free hotspot' },
      { id: 'ooredoo-topup', name: 'Ooredoo 20 TND', price: 20, description: 'Mobile credit top-up' },
      { id: 'orange-topup', name: 'Orange 20 TND', price: 20, description: 'Mobile credit top-up' },
      { id: 'tt-topup', name: 'TT 20 TND', price: 20, description: 'Mobile credit top-up' },
    ]
  },
  gaming: {
    name: 'Gaming Corner',
    description: 'Gaming credits and subscriptions',
    gradient: 'from-[#FF6B35] to-[#FF4500]',
    items: [
      { id: 'freefire-diamonds', name: 'Free Fire 520 Diamonds', price: 9.99, description: 'In-game currency' },
      { id: 'pubg-uc', name: 'PUBG 1200 UC', price: 29.99, description: 'PlayerUnknown Battlegrounds currency' },
      { id: 'steam-50', name: 'Steam Gift Card 50€', price: 55, description: 'Steam store credit' },
      { id: 'playstation-20', name: 'PlayStation 20€', price: 22, description: 'PSN store credit' },
      { id: 'xbox-20', name: 'Xbox 20€', price: 22, description: 'Xbox store credit' },
      { id: 'gamepass', name: 'Xbox Game Pass', price: 16.99, description: '1 month unlimited games' },
    ]
  },
  business: {
    name: 'Business Suite',
    description: 'Professional tools and services',
    gradient: 'from-[#5B4A9F] to-[#0066CC]',
    items: [
      { id: 'canva-pro', name: 'Canva Pro', price: 14.99, description: 'Design tool subscription' },
      { id: 'chatgpt-plus', name: 'ChatGPT Plus', price: 19.99, description: 'AI assistant premium' },
      { id: 'hostinger-monthly', name: 'Hostinger Hosting', price: 3.99, description: 'Web hosting plan' },
      { id: 'domain-annual', name: 'Domain Registration', price: 9.99, description: '1 year domain' },
      { id: 'adobe-creative', name: 'Adobe Creative Cloud', price: 59.99, description: 'All Adobe apps' },
      { id: 'notion-plus', name: 'Notion Plus', price: 11.99, description: 'Workspace management' },
    ]
  }
}

export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [services, setServices] = useState<Service[]>([])
  const [cart, setCart] = useState<string[]>([])

  useEffect(() => {
    const category = searchParams?.get('category') || 'vault'
    setSelectedCategory(category)

    // Load mock data based on category
    const categoryItems = categoryData[category as keyof typeof categoryData]?.items || []
    const formattedServices = categoryItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: category,
      image_url: '',
      rating: Math.random() * 2 + 3.5,
      reviews_count: Math.floor(Math.random() * 500) + 50,
    }))
    setServices(formattedServices)
  }, [searchParams])

  const addToCart = (serviceId: string) => {
    setCart(prev => [...prev, serviceId])
    toast.success('Added to cart')
  }

  const currentCategory = categoryData[selectedCategory as keyof typeof categoryData]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066CC] to-[#4A90E2] rounded-lg flex items-center justify-center text-white font-bold">
              AV
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">AtlasVault</span>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="border-b border-border sticky top-16 z-30 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 py-4">
          {Object.entries(categoryData).map(([key, data]) => (
            <Link key={key} href={`/products?category=${key}`}>
              <button
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === key
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {data.name}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentCategory && (
          <>
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${currentCategory.gradient} rounded-xl p-8 sm:p-12 text-white mb-12`}>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {currentCategory.name}
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                {currentCategory.description}
              </p>
            </div>

            {/* Services Grid */}
            {services.length === 0 ? (
              <div className="flex justify-center items-center min-h-96">
                <p className="text-muted-foreground">No services available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col">
                    <div className={`bg-gradient-to-br ${currentCategory.gradient} h-32 flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2 text-lg">
                            {service.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        </div>
                        <button className="text-muted-foreground hover:text-destructive flex-shrink-0">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {service.price.toFixed(2)} TND
                          </p>
                          {service.rating && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ⭐ {service.rating.toFixed(1)} ({service.reviews_count} reviews)
                            </p>
                          )}
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => addToCart(service.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
