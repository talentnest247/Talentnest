"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  Star,
  Clock,
  Users,
  Award,
  BookOpen,
  Plus,
  Eye,
  MessageSquare,
  Filter,
  Settings
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  whatsapp_number: string;
  faculty?: string;
  department?: string;
  level?: string;
  matric_number?: string;
  bio: string;
  skills: string[];
  account_type: string;
  is_verified: boolean;
  total_rating: number;
  total_reviews: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: string;
  status: string;
  user_id: string;
  created_at: string;
  category?: string;
}

interface Booking {
  id: string;
  title: string;
  description: string;
  status: string;
  agreed_price: number;
  created_at: string;
  client_id: string;
  provider_id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [artisans, setArtisans] = useState<UserProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/login");
          return;
        }

        setUser(user);

        // Fetch user profile
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, supabase]);

  // Fetch marketplace data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !userProfile) return;

      try {
        // Fetch all active services
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (servicesData) setServices(servicesData);

        // Fetch verified artisans
        const { data: artisansData } = await supabase
          .from("users")
          .select("*")
          .eq("account_type", "artisan")
          .eq("is_verified", true)
          .order("total_rating", { ascending: false });

        if (artisansData) setArtisans(artisansData);

        // Fetch user's bookings
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*")
          .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (bookingsData) setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user, userProfile, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Please try logging out and back in.</p>
            <Button onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}>
              Sign Out & Retry
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredServices = services.filter(service => 
    !searchTerm || 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArtisans = artisans.filter(artisan =>
    !searchTerm || 
    artisan.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const myServices = services.filter(s => s.user_id === user.id);
  const myBookingsAsClient = bookings.filter(b => b.client_id === user.id);
  const myBookingsAsProvider = bookings.filter(b => b.provider_id === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Welcome back, {userProfile.full_name.split(" ")[0]}!
              </h1>
              <p className="text-xl text-gray-600">
                {userProfile.account_type === "student" 
                  ? "Discover skills and connect with talented artisans" 
                  : "Showcase your skills and connect with students"}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={userProfile.is_verified ? "default" : "secondary"} className="mb-2">
                {userProfile.is_verified ? "✓ Verified" : "Pending Verification"}
              </Badge>
              <div className="text-sm text-gray-500 capitalize">
                {userProfile.account_type} Account
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-blue-100">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-green-100">Rating</p>
                  <p className="text-2xl font-bold">{userProfile.total_rating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-purple-100">Reviews</p>
                  <p className="text-2xl font-bold">{userProfile.total_reviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-orange-100">Skills</p>
                  <p className="text-2xl font-bold">{userProfile.skills.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  {userProfile.account_type === "student" ? "Discover Services & Artisans" : "Marketplace Overview"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search for services, skills, or artisans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                {/* Popular Skills */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Popular Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Web Design", "Graphics Design", "Content Writing", "Photography", "Tutoring", "Programming"].map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setSearchTerm(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Services ({filteredServices.length})</CardTitle>
                  <CardDescription>Browse services from talented artisans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredServices.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">No services found</div>
                        <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                      </div>
                    ) : (
                      filteredServices.slice(0, 6).map((service) => (
                        <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{service.title}</h4>
                            <Badge variant="secondary">₦{service.price}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.delivery_time}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {userProfile.account_type === "student" && (
                                <Button size="sm">
                                  Book Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {filteredServices.length > 6 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" className="w-full">
                        View All Services ({filteredServices.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Featured Artisans */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Artisans ({filteredArtisans.length})</CardTitle>
                  <CardDescription>Connect with verified talented artisans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredArtisans.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">No artisans found</div>
                        <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                      </div>
                    ) : (
                      filteredArtisans.slice(0, 6).map((artisan) => (
                        <div key={artisan.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-orange-500 text-white">
                              {artisan.full_name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{artisan.full_name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{artisan.bio || "No bio available"}</p>
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-sm">{artisan.total_rating.toFixed(1)} ({artisan.total_reviews} reviews)</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {artisan.skills.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                              ))}
                              {artisan.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">+{artisan.skills.length - 3} more</Badge>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  {filteredArtisans.length > 6 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" className="w-full">
                        View All Artisans ({filteredArtisans.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Services ({myServices.length})</CardTitle>
                    <CardDescription>Manage your service offerings</CardDescription>
                  </div>
                  <Link href="/dashboard/services/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {myServices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No services yet</h4>
                    <p className="text-gray-500 mb-4">Start showcasing your skills by adding your first service!</p>
                    <Link href="/dashboard/services/new">
                      <Button className="bg-gradient-to-r from-emerald-600 to-orange-600 hover:from-emerald-700 hover:to-orange-700 text-white">
                        Create Your First Service
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myServices.map((service) => (
                      <Card key={service.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{service.title}</h4>
                            <Badge variant={service.status === "active" ? "default" : "secondary"}>
                              {service.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-emerald-600">₦{service.price}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>My Orders ({myBookingsAsClient.length})</CardTitle>
                  <CardDescription>Services you have booked</CardDescription>
                </CardHeader>
                <CardContent>
                  {myBookingsAsClient.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                      <Button className="mt-4" onClick={() => {
                        const marketplaceTab = document.querySelector('[value="marketplace"]') as HTMLElement;
                        marketplaceTab?.click();
                      }}>
                        Browse Services
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myBookingsAsClient.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{booking.title}</h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{booking.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                            <span className="font-semibold">₦{booking.agreed_price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Received Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Received Orders ({myBookingsAsProvider.length})</CardTitle>
                  <CardDescription>Orders for your services</CardDescription>
                </CardHeader>
                <CardContent>
                  {myBookingsAsProvider.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders received yet</p>
                      <Button className="mt-4" onClick={() => {
                        const servicesTab = document.querySelector('[value="services"]') as HTMLElement;
                        servicesTab?.click();
                      }}>
                        Add Services
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myBookingsAsProvider.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{booking.title}</h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{booking.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                            <span className="font-semibold">₦{booking.agreed_price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Manage your TalentNest profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {userProfile.full_name}</p>
                      <p><strong>Email:</strong> {userProfile.email}</p>
                      <p><strong>Phone:</strong> {userProfile.phone_number}</p>
                      {userProfile.matric_number && (
                        <p><strong>Matric Number:</strong> {userProfile.matric_number}</p>
                      )}
                      {userProfile.faculty && (
                        <p><strong>Faculty:</strong> {userProfile.faculty}</p>
                      )}
                      {userProfile.department && (
                        <p><strong>Department:</strong> {userProfile.department}</p>
                      )}
                      {userProfile.level && (
                        <p><strong>Level:</strong> {userProfile.level}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Skills & Bio</h4>
                    <div className="space-y-2">
                      <p className="text-sm">{userProfile.bio || "No bio added yet"}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userProfile.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline">{skill}</Badge>
                        ))}
                        {userProfile.skills.length === 0 && (
                          <span className="text-sm text-gray-500">No skills added yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/profile">
                    <Button>
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
