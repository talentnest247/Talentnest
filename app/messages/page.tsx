"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Send, Search, Paperclip, Phone, Video, Info, CheckCircle, Clock, ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  id: string
  participants: string[]
  last_message: Message
  unread_count: number
  created_at: string
  updated_at: string
  service_context?: {
    service_id: string
    service_title: string
    booking_id?: string
  }
  other_participant: {
    id: string
    full_name: string
    avatar_url?: string
    role: string
    verified: boolean
    online_status: 'online' | 'away' | 'offline'
    last_seen?: string
  }
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'system'
  read_by: string[]
  created_at: string
  attachments?: {
    id: string
    name: string
    type: string
    url: string
    size: number
  }[]
  metadata?: {
    booking_update?: {
      status: string
      message: string
    }
    service_info?: {
      service_id: string
      title: string
      price: number
    }
  }
}

export default function MessagesPage() {
  return (
    <AuthGuard>
      <MessagesContent />
    </AuthGuard>
  )
}

function MessagesContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showServiceInfo, setShowServiceInfo] = useState(false)

  useEffect(() => {
    fetchConversations()
    // Set up real-time messaging subscription
    // subscribeToMessages()
    // subscribeToOnlineStatus()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      markConversationAsRead(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockConversations: Conversation[] = [
        {
          id: "conv1",
          participants: ["user1", "user2"],
          last_message: {
            id: "msg1",
            conversation_id: "conv1",
            sender_id: "user2",
            content: "Great! I'll start working on your logo design right away.",
            message_type: "text",
            read_by: ["user2"],
            created_at: "2024-12-18T15:30:00Z"
          },
          unread_count: 1,
          created_at: "2024-12-17T10:00:00Z",
          updated_at: "2024-12-18T15:30:00Z",
          service_context: {
            service_id: "service1",
            service_title: "Professional Logo Design",
            booking_id: "booking1"
          },
          other_participant: {
            id: "user2",
            full_name: "Adebayo Oladele",
            avatar_url: "/placeholder-user.jpg",
            role: "artisan",
            verified: true,
            online_status: "online"
          }
        },
        {
          id: "conv2",
          participants: ["user1", "user3"],
          last_message: {
            id: "msg2",
            conversation_id: "conv2",
            sender_id: "user1",
            content: "Do you have availability for next week?",
            message_type: "text",
            read_by: ["user1", "user3"],
            created_at: "2024-12-18T12:15:00Z"
          },
          unread_count: 0,
          created_at: "2024-12-18T11:00:00Z",
          updated_at: "2024-12-18T12:15:00Z",
          service_context: {
            service_id: "service2",
            service_title: "Traditional Agbada Tailoring"
          },
          other_participant: {
            id: "user3",
            full_name: "Fatima Ibrahim",
            avatar_url: "/placeholder-user.jpg",
            role: "artisan",
            verified: true,
            online_status: "away",
            last_seen: "2024-12-18T14:00:00Z"
          }
        }
      ]
      setConversations(mockConversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      // Mock data for now - replace with actual API call
      const mockMessages: Message[] = [
        {
          id: "msg1",
          conversation_id: conversationId,
          sender_id: "user1",
          content: "Hi! I'm interested in your logo design service. Can you tell me more about your process?",
          message_type: "text",
          read_by: ["user1", "user2"],
          created_at: "2024-12-18T14:00:00Z"
        },
        {
          id: "msg2",
          conversation_id: conversationId,
          sender_id: "user2",
          content: "Hello! I'd be happy to help you with your logo design. I typically start with understanding your brand vision and then create 3 initial concepts for you to choose from.",
          message_type: "text",
          read_by: ["user1", "user2"],
          created_at: "2024-12-18T14:15:00Z"
        },
        {
          id: "msg3",
          conversation_id: conversationId,
          sender_id: "user1",
          content: "That sounds perfect! What information do you need from me to get started?",
          message_type: "text",
          read_by: ["user1", "user2"],
          created_at: "2024-12-18T14:30:00Z"
        },
        {
          id: "msg4",
          conversation_id: conversationId,
          sender_id: "user2",
          content: "Great! I'll start working on your logo design right away.",
          message_type: "text",
          read_by: ["user2"],
          created_at: "2024-12-18T15:30:00Z"
        }
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    try {
      const message: Message = {
        id: Date.now().toString(),
        conversation_id: selectedConversation.id,
        sender_id: user?.id || "",
        content: newMessage,
        message_type: "text",
        read_by: [user?.id || ""],
        created_at: new Date().toISOString()
      }

      setMessages(prev => [...prev, message])
      setNewMessage("")

      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, last_message: message, updated_at: message.created_at }
            : conv
        )
      )

      // TODO: Send message via API
      toast({
        title: "Message sent",
        description: "Your message has been delivered"
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  const markConversationAsRead = async (conversationId: string) => {
    try {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        )
      )
    } catch (error) {
      console.error('Error marking conversation as read:', error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedConversation) return

    // TODO: Implement file upload
    toast({
      title: "File upload",
      description: "File upload feature coming soon"
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatMessageTime = (timestamp: string) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return messageTime.toLocaleDateString()
  }

  const filteredConversations = conversations.filter(conv =>
    conv.other_participant.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.service_context?.service_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex h-[700px]">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 bg-white/50">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900 mb-3">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <ScrollArea className="h-[calc(100%-120px)]">
                {loading ? (
                  <div className="p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.965 8.965 0 01-4.126-1.004L3 21l1.004-5.874A8.965 8.965 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Messages</h3>
                    <p className="text-gray-500 text-sm">Start a conversation by booking a service</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-blue-100 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conversation.other_participant.avatar_url} />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {conversation.other_participant.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {/* Online Status Indicator */}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              conversation.other_participant.online_status === 'online' ? 'bg-green-500' :
                              conversation.other_participant.online_status === 'away' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.other_participant.full_name}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {conversation.other_participant.verified && (
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                )}
                                {conversation.unread_count > 0 && (
                                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {conversation.service_context && (
                              <p className="text-xs text-blue-600 mb-1 truncate">
                                {conversation.service_context.service_title}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.last_message.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatMessageTime(conversation.last_message.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Message Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.other_participant.avatar_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {selectedConversation.other_participant.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-semibold text-gray-900 flex items-center">
                            {selectedConversation.other_participant.full_name}
                            {selectedConversation.other_participant.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                            )}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.other_participant.online_status === 'online' ? 'Online' :
                             selectedConversation.other_participant.online_status === 'away' ? 'Away' :
                             `Last seen ${formatMessageTime(selectedConversation.other_participant.last_seen || '')}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowServiceInfo(true)}>
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {selectedConversation.service_context && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              Service: {selectedConversation.service_context.service_title}
                            </p>
                            {selectedConversation.service_context.booking_id && (
                              <p className="text-xs text-blue-700">
                                Booking ID: {selectedConversation.service_context.booking_id}
                              </p>
                            )}
                          </div>
                          <Link href={`/services/${selectedConversation.service_context.service_id}`}>
                            <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Service
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        const isCurrentUser = message.sender_id === user.id
                        const showTimestamp = index === 0 || 
                          new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 300000 // 5 minutes

                        return (
                          <div key={message.id}>
                            {showTimestamp && (
                              <div className="text-center mb-4">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {new Date(message.created_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                isCurrentUser 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                  isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                                }`}>
                                  <span className="text-xs">
                                    {new Date(message.created_at).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                  {isCurrentUser && (
                                    <div className="text-xs">
                                      {message.read_by.length > 1 ? (
                                        <CheckCircle className="h-3 w-3" />
                                      ) : (
                                        <Clock className="h-3 w-3" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white/50">
                    <div className="flex items-end space-x-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        aria-label="Upload files"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="min-h-[40px] max-h-32 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              sendMessage()
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.965 8.965 0 01-4.126-1.004L3 21l1.004-5.874A8.965 8.965 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Service Info Dialog */}
      <Dialog open={showServiceInfo} onOpenChange={setShowServiceInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Service Information</DialogTitle>
          </DialogHeader>
          {selectedConversation?.service_context && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedConversation.service_context.service_title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Service provider: {selectedConversation.other_participant.full_name}
                </p>
              </div>
              
              {selectedConversation.service_context.booking_id && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Active Booking</p>
                  <p className="text-xs text-blue-700">
                    ID: {selectedConversation.service_context.booking_id}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Link 
                  href={`/services/${selectedConversation.service_context.service_id}`}
                  className="flex-1"
                >
                  <Button className="w-full" variant="outline">
                    View Service
                  </Button>
                </Link>
                {selectedConversation.service_context.booking_id && (
                  <Link 
                    href={`/dashboard?tab=bookings`}
                    className="flex-1"
                  >
                    <Button className="w-full">
                      View Booking
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}