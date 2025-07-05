"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, Briefcase, Users, MessageSquare, Settings, Send, Search, Phone, Video, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(0)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "recruiter",
      content:
        "Hi John! I reviewed your application for the Senior Software Engineer position. Very impressive background!",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "candidate",
      content: "Thank you! I'm very excited about this opportunity. Could you tell me more about the team structure?",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "recruiter",
      content:
        "Of course! We have a team of 8 engineers working on our core platform. You'd be working closely with our frontend and backend teams.",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      sender: "candidate",
      content: "That sounds great! What technologies does the team primarily use?",
      timestamp: "10:37 AM",
    },
    {
      id: 5,
      sender: "recruiter",
      content:
        "We primarily use React, Node.js, and PostgreSQL. I see from your resume that you have experience with all of these!",
      timestamp: "10:40 AM",
    },
  ])

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Recruiter at TechCorp",
      lastMessage: "We primarily use React, Node.js, and PostgreSQL...",
      timestamp: "10:40 AM",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Hiring Manager at StartupXYZ",
      lastMessage: "Thanks for your interest in the Product Manager role",
      timestamp: "Yesterday",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "HR Director at Design Studio",
      lastMessage: "I'd like to schedule a call to discuss the UX Designer position",
      timestamp: "2 days ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
  ]

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "candidate",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">HR</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">HR Portal</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/talent-manager"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/talent-manager/jobs"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Briefcase className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/talent-manager/candidates"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Users className="h-5 w-5" />
              <span>Candidates</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center space-x-3 px-3 py-2 bg-green-100 text-green-700 rounded-md"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>


      </div>

      {/* Messages Layout */}
      <div className="flex-1 flex">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>

          <div className="overflow-y-auto">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(index)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === index ? "bg-green-50 border-r-2 border-r-green-500" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{conversation.role}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="bg-green-500 text-white text-xs">{conversation.unread}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversations[selectedChat]?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {conversations[selectedChat]?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conversations[selectedChat]?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{conversations[selectedChat]?.name}</h3>
                  <p className="text-sm text-gray-600">{conversations[selectedChat]?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "candidate" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "candidate"
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "candidate" ? "text-green-100" : "text-gray-500"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={sendMessage} className="bg-green-500 hover:bg-green-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
