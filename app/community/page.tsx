"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  MessageCircle,
  Users,
  TrendingUp,
  Search,
  Plus,
  ThumbsUp,
  MessageSquare,
  Calendar,
  User
} from "lucide-react"

// Mock community data
const mockPosts = [
  {
    id: 1,
    title: "Tips for learning Tailoring as a beginner",
    content: "I've just started learning tailoring and I'm looking for some tips from experienced artisans...",
    author: "John Doe",
    authorRole: "Student",
    timestamp: "2 hours ago",
    likes: 12,
    replies: 8,
    category: "Learning",
    tags: ["tailoring", "beginner", "tips"]
  },
  {
    id: 2,
    title: "Best practices for artisan verification",
    content: "What documents should I prepare for the verification process? Any tips to speed up the process?",
    author: "Jane Smith",
    authorRole: "Artisan",
    timestamp: "5 hours ago",
    likes: 24,
    replies: 15,
    category: "Verification",
    tags: ["verification", "documents", "tips"]
  },
  {
    id: 3,
    title: "Showcase: My first completed project",
    content: "Just finished my first commissioned piece! Here's what I learned...",
    author: "Mike Johnson",
    authorRole: "Artisan",
    timestamp: "1 day ago",
    likes: 45,
    replies: 22,
    category: "Showcase",
    tags: ["project", "commission", "achievement"]
  }
]

const categories = [
  { name: "All", count: 156 },
  { name: "Learning", count: 89 },
  { name: "Verification", count: 23 },
  { name: "Showcase", count: 34 },
  { name: "General", count: 10 }
]

export default function CommunityPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("discussions")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General"
  })

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Post Created",
      description: "Your post has been published to the community.",
    })

    setNewPost({ title: "", content: "", category: "General" })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Community Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Connect with fellow students and artisans. Share knowledge, get help,
              and build lasting relationships in our vibrant community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Plus className="h-5 w-5 mr-2" />
                Start a Discussion
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Users className="h-5 w-5 mr-2" />
                Browse Members
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              {/* Discussions Tab */}
              <TabsContent value="discussions" className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Content */}
                  <div className="flex-1 space-y-6">
                    {/* Search and Filters */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Search discussions..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                            aria-label="Filter discussions by category"
                          >
                            {categories.map(category => (
                              <option key={category.name} value={category.name}>
                                {category.name} ({category.count})
                              </option>
                            ))}
                          </select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Create Post */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Start a Discussion</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input
                          placeholder="Discussion title..."
                          value={newPost.title}
                          onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <Textarea
                          placeholder="Share your thoughts, ask questions, or start a conversation..."
                          value={newPost.content}
                          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                          rows={4}
                        />
                        <div className="flex justify-between items-center">
                          <select
                            value={newPost.category}
                            onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                            aria-label="Select discussion category"
                          >
                            <option value="General">General</option>
                            <option value="Learning">Learning</option>
                            <option value="Verification">Verification</option>
                            <option value="Showcase">Showcase</option>
                          </select>
                          <Button onClick={handleCreatePost}>
                            <Plus className="h-4 w-4 mr-2" />
                            Post Discussion
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Posts List */}
                    <div className="space-y-4">
                      {filteredPosts.map(post => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarFallback>
                                  {post.author.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{post.title}</h3>
                                  <Badge variant="outline">{post.category}</Badge>
                                </div>
                                <p className="text-muted-foreground mb-3 line-clamp-2">
                                  {post.content}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>{post.author} ({post.authorRole})</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{post.timestamp}</span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 mt-3">
                                  <Button variant="ghost" size="sm">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    {post.likes}
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    {post.replies} replies
                                  </Button>
                                  <div className="flex flex-wrap gap-1">
                                    {post.tags.map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:w-80 space-y-6">
                    {/* Community Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5" />
                          <span>Community Stats</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Members</span>
                          <span className="font-semibold">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Today</span>
                          <span className="font-semibold">89</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Discussions</span>
                          <span className="font-semibold">156</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">New This Week</span>
                          <span className="font-semibold">23</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Contributors */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Contributors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { name: "Sarah Johnson", role: "Artisan", posts: 45 },
                            { name: "Ahmed Hassan", role: "Student", posts: 38 },
                            { name: "Grace Okafor", role: "Artisan", posts: 32 }
                          ].map((user, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.role} • {user.posts} posts</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Connect with fellow students and artisans in our community.
                    </p>
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Members Directory</h3>
                      <p className="text-muted-foreground">
                        Browse and connect with community members. Feature coming soon!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Join workshops, meetups, and special events organized by our community.
                    </p>
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                      <p className="text-muted-foreground">
                        Stay tuned for exciting community events and workshops!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
