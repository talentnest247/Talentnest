import Image from 'next/image'
import Link from 'next/link'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8 animate-fade-in-delay">
              Discover talented artisans and quality services from the UNILORIN community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-sm font-medium">🎯 Quality Services</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-sm font-medium">⚡ Quick Booking</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-sm font-medium">🛡️ Trusted Artisans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border p-8 mb-12 animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services (e.g., web development, graphic design...)"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 text-lg placeholder-gray-400"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <select title="Filter by category" className="px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-white">
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="tutoring">Tutoring</option>
                <option value="crafts">Crafts</option>
                <option value="services">Services</option>
              </select>
              <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Featured Services Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top-rated services from our most trusted artisans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Service Card 1 */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:border-green-200">
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                <div className="text-4xl">💻</div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Development</h3>
                <p className="text-gray-600 mb-4 text-sm">Professional website creation and web applications</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★★★★★</span>
                        <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₦15,000</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:border-green-200">
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-4xl">🎨</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Graphic Design</h3>
                <p className="text-gray-600 mb-4 text-sm">Logos, branding, and visual design services</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sarah Ahmed</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★★★★★</span>
                        <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₦8,000</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:border-green-200">
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <div className="text-4xl">📚</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Academic Tutoring</h3>
                <p className="text-gray-600 mb-4 text-sm">Mathematics, Physics, and Engineering subjects</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dr. Ibrahim</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★★★★★</span>
                        <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₦3,000/hr</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Service Card 4 */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:border-green-200">
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                <div className="text-4xl">🛠️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Handcraft Services</h3>
                <p className="text-gray-600 mb-4 text-sm">Custom crafts, repairs, and handmade items</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fatima Yusuf</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★★★★★</span>
                        <span className="text-xs text-gray-500 ml-1">(4.7)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₦5,500</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect service for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Technology', icon: '💻', count: '120+' },
              { name: 'Design', icon: '🎨', count: '85+' },
              { name: 'Tutoring', icon: '📚', count: '200+' },
              { name: 'Crafts', icon: '🛠️', count: '45+' },
              { name: 'Services', icon: '🔧', count: '90+' }
            ].map((category, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border hover:border-green-200 cursor-pointer">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} services</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl text-white p-12 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect service match on TalentNest
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/student" className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Post a Request
            </Link>
            <Link href="/register/artisan" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-300">
              Become an Artisan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}