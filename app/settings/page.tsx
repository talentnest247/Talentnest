"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Trash2,
  Save,
  Camera,
  Code,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"

export default function SettingsPage() {
  const { user, isAuthenticated, refreshUser } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Refresh user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && !user?.firstName) {
        await refreshUser()
      }
    }
    loadUserData()
  }, [isAuthenticated]) // Remove refreshUser from dependencies to prevent loop

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20">
          <Card className="text-center p-8 bg-white border shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
            <p className="text-gray-600 mb-6">Please log in to access your settings.</p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Log In
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    studentId: user?.studentId || ""
  })

  // Update profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        studentId: user.studentId || ""
      })
    }
  }, [user])

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    skillUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true
  })

  const [apiSettings, setApiSettings] = useState({
    apiKey: "",
    webhookUrl: "",
    enableWebhooks: false,
    enableApiAccess: true,
    rateLimit: 1000
  })

  const [showApiKey, setShowApiKey] = useState(false)

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrivacyUpdate = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Privacy Updated",
        description: "Your privacy settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiSettingsUpdate = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "API Settings Updated",
        description: "Your API settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateApiKey = () => {
    const newApiKey = `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setApiSettings(prev => ({ ...prev, apiKey: newApiKey }))
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated.",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to access your settings.
            </p>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">Account Settings</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-slate-800 border shadow-sm">
              <TabsTrigger value="profile" className="flex items-center space-x-2 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center space-x-2 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Code className="h-4 w-4" />
                <span>API</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20 ring-2 ring-emerald-200">
                      <AvatarImage src={"/default-avatar.png"} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-lg">
                        {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="mt-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        className="mt-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    {user?.role === 'student' && (
                      <div>
                        <Label htmlFor="studentId" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Student ID</Label>
                        <Input
                          id="studentId"
                          value={profileData.studentId}
                          onChange={(e) => setProfileData(prev => ({ ...prev, studentId: e.target.value }))}
                          className="mt-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    )}
                  </div>

                  <Button onClick={handleProfileUpdate} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Notifications</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="text-sm font-semibold text-gray-700 dark:text-gray-300">SMS Notifications</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="skill-updates" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Skill Updates</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Get notified about skill progress and deadlines
                        </p>
                      </div>
                      <Switch
                        id="skill-updates"
                        checked={notifications.skillUpdates}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, skillUpdates: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Marketing Emails</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Receive promotional emails and newsletters
                        </p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="security-alerts" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Security Alerts</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Important security notifications
                        </p>
                      </div>
                      <Switch
                        id="security-alerts"
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, securityAlerts: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handleNotificationUpdate} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-800 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-visibility" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Visibility</Label>
                      <select
                        id="profile-visibility"
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                        aria-label="Profile visibility setting"
                      >
                        <option value="public">Public - Visible to everyone</option>
                        <option value="students">Students Only - Visible to students</option>
                        <option value="private">Private - Only you can see</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Show Email</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Display your email on your public profile
                        </p>
                      </div>
                      <Switch
                        id="show-email"
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, showEmail: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Show Phone</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Display your phone number on your public profile
                        </p>
                      </div>
                      <Switch
                        id="show-phone"
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, showPhone: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allow-messages" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Allow Messages</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Allow other users to send you messages
                        </p>
                      </div>
                      <Switch
                        id="allow-messages"
                        checked={privacy.allowMessages}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, allowMessages: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handlePrivacyUpdate} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Settings Tab */}
            <TabsContent value="api" className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-slate-700 dark:to-slate-800 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">API Settings</CardTitle>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Manage your API keys and integration settings
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* API Key Section */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key" className="text-sm font-semibold text-gray-700 dark:text-gray-300">API Key</Label>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Your personal API key for accessing platform APIs
                      </p>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <Input
                            id="api-key"
                            type={showApiKey ? "text" : "password"}
                            value={apiSettings.apiKey}
                            onChange={(e) => setApiSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                            placeholder="Generate an API key to get started"
                            className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button onClick={generateApiKey} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <Label htmlFor="webhook-url" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Webhook URL</Label>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        URL to receive webhook notifications for events
                      </p>
                      <Input
                        id="webhook-url"
                        type="url"
                        value={apiSettings.webhookUrl}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder="https://your-app.com/webhook"
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    {/* API Access Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-api-access" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable API Access</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Allow API access using your API key
                        </p>
                      </div>
                      <Switch
                        id="enable-api-access"
                        checked={apiSettings.enableApiAccess}
                        onCheckedChange={(checked) =>
                          setApiSettings(prev => ({ ...prev, enableApiAccess: checked }))
                        }
                      />
                    </div>

                    {/* Webhooks Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-webhooks" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable Webhooks</Label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Receive webhook notifications for important events
                        </p>
                      </div>
                      <Switch
                        id="enable-webhooks"
                        checked={apiSettings.enableWebhooks}
                        onCheckedChange={(checked) =>
                          setApiSettings(prev => ({ ...prev, enableWebhooks: checked }))
                        }
                      />
                    </div>

                    {/* Rate Limit */}
                    <div>
                      <Label htmlFor="rate-limit" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rate Limit (requests per hour)</Label>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Maximum number of API requests allowed per hour
                      </p>
                      <select
                        id="rate-limit"
                        value={apiSettings.rateLimit}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                        aria-label="API rate limit setting"
                      >
                        <option value={100}>100 requests/hour</option>
                        <option value={500}>500 requests/hour</option>
                        <option value={1000}>1000 requests/hour</option>
                        <option value={5000}>5000 requests/hour</option>
                        <option value={10000}>10000 requests/hour</option>
                      </select>
                    </div>
                  </div>

                  <Button onClick={handleApiSettingsUpdate} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save API Settings"}
                  </Button>
                </CardContent>
              </Card>

              {/* API Documentation */}
              <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-800 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">API Documentation</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Learn how to use our APIs to integrate with your applications.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Authentication</h4>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                          How to authenticate API requests using your API key.
                        </p>
                        <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                          View Docs
                        </Button>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Webhooks</h4>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                          Set up webhooks to receive real-time notifications.
                        </p>
                        <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                          View Docs
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-slate-700 dark:to-slate-800 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</Label>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                      Choose your preferred theme
                    </p>
                    <div className="flex space-x-4">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setTheme('light')}
                        className={theme === 'light' ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold' : 'border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setTheme('dark')}
                        className={theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold' : 'border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        onClick={() => setTheme('system')}
                        className={theme === 'system' ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold' : 'border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle className="text-white font-bold">⚠️ Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">Delete Account</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
