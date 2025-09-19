import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Category } from "@/lib/types"
import { 
  Scissors, 
  Laptop, 
  Sparkles, 
  Palette, 
  ChefHat, 
  Hammer, 
  Camera, 
  Wheat, 
  DollarSign, 
  MoreHorizontal,
  Users,
  TrendingUp,
  Star
} from "lucide-react"
import Link from "next/link"

interface CategoryGridProps {
  categories: Category[]
}

const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, any> = {
    "Fashion & Tailoring": Scissors,
    "Electronics & Technology": Laptop,
    "Beauty & Wellness": Sparkles,
    "Arts & Crafts": Palette,
    "Food & Catering": ChefHat,
    "Construction & Repair": Hammer,
    "Photography & Media": Camera,
    "Agriculture & Farming": Wheat,
    "Business & Finance": DollarSign,
    "Other": MoreHorizontal
  }
  return iconMap[name] || MoreHorizontal
}

const getCategoryColor = (name: string) => {
  const colorMap: Record<string, string> = {
    "Fashion & Tailoring": "bg-pink-100 text-pink-700 border-pink-200",
    "Electronics & Technology": "bg-blue-100 text-blue-700 border-blue-200",
    "Beauty & Wellness": "bg-purple-100 text-purple-700 border-purple-200",
    "Arts & Crafts": "bg-orange-100 text-orange-700 border-orange-200",
    "Food & Catering": "bg-green-100 text-green-700 border-green-200",
    "Construction & Repair": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Photography & Media": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Agriculture & Farming": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Business & Finance": "bg-teal-100 text-teal-700 border-teal-200",
    "Other": "bg-gray-100 text-gray-700 border-gray-200"
  }
  return colorMap[name] || "bg-gray-100 text-gray-700 border-gray-200"
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.name)
          const colorClasses = getCategoryColor(category.name)
          
          return (
            <Card 
              key={category.id} 
              className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-md bg-white/95 backdrop-blur-sm overflow-hidden cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses} transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary text-xs px-2 py-1 font-medium"
                  >
                    {category.artisanCount || category.providerCount || 0} artisans
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* Category Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Users className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="text-xs font-semibold text-gray-700">{category.artisanCount || category.providerCount || 0}</div>
                    <div className="text-xs text-gray-500">Artisans</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Star className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="text-xs font-semibold text-gray-700">4.8</div>
                    <div className="text-xs text-gray-500">Avg Rating</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="text-xs font-semibold text-gray-700">85%</div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                </div>

                {/* Skills Preview */}
                {category.skills && category.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">Popular Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {category.skills.slice(0, 3).map((skill: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200 hover:bg-primary/10 hover:border-primary/30 transition-all"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {category.skills.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 border-gray-300"
                        >
                          +{category.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  asChild
                  className="w-full h-9 text-sm font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 hover:scale-[1.02] shadow-sm"
                >
                  <Link href={`/marketplace?category=${encodeURIComponent(category.name)}`}>
                    Explore Category
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Category Overview Cards */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="text-center space-y-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900">Category Overview</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the diverse range of skills and services available in our artisan community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-md overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Artisans</h4>
              <p className="text-sm text-gray-600 mb-4">
                All artisans are verified students and professionals with proven skills
              </p>
              <div className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, cat) => sum + (cat.artisanCount || cat.providerCount || 0), 0)}+
              </div>
              <div className="text-xs text-gray-500">Total Registered</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-md overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h4>
              <p className="text-sm text-gray-600 mb-4">
                High-rated services with customer reviews and quality guarantees
              </p>
              <div className="text-2xl font-bold text-green-600">4.8★</div>
              <div className="text-xs text-gray-500">Average Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-md overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Growing Community</h4>
              <p className="text-sm text-gray-600 mb-4">
                Join a thriving community of learners and skilled professionals
              </p>
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-xs text-gray-500">Categories Available</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}