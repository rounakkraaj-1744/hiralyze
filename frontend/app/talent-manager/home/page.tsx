"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Search,
  Bell,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function TalentManagerHome() {
  const todaySchedule = [
    {
      time: "9:00 AM",
      candidate: "Sarah Johnson",
      position: "Frontend Developer",
      type: "Technical Interview",
      status: "upcoming",
    },
    {
      time: "11:30 AM",
      candidate: "Michael Chen",
      position: "Product Manager",
      type: "Final Interview",
      status: "upcoming",
    },
    {
      time: "2:00 PM",
      candidate: "Emily Rodriguez",
      position: "UX Designer",
      type: "Portfolio Review",
      status: "completed",
    },
    {
      time: "4:00 PM",
      candidate: "David Kim",
      position: "Backend Developer",
      type: "Phone Screening",
      status: "upcoming",
    },
  ]

  const hiringPipeline = [
    { stage: "Applied", count: 45, color: "bg-blue-500" },
    { stage: "Screening", count: 23, color: "bg-yellow-500" },
    { stage: "Interview", count: 12, color: "bg-purple-500" },
    { stage: "Offer", count: 5, color: "bg-green-500" },
    { stage: "Hired", count: 3, color: "bg-emerald-500" },
  ]

  const notifications = [
    {
      id: 1,
      type: "application",
      message: "New application for Senior Developer position",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "interview",
      message: "Interview reminder: Sarah Johnson in 30 minutes",
      time: "30 minutes ago",
      unread: true,
    },
    {
      id: 3,
      type: "offer",
      message: "Offer accepted by Emily Rodriguez",
      time: "2 hours ago",
      unread: false,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Building2 className="h-8 w-8 text-amber-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">HR Portal</span>
              </Link>
              <span className="ml-4 text-gray-400">|</span>
              <span className="ml-4 text-gray-600 font-medium">Talent Manager Home</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search candidates, jobs..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>TM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Alex!</h1>
          <p className="text-gray-600">Here's what's happening with your talent pipeline today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Applications</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Users className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <Briefcase className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Offers</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Your upcoming interviews and meetings</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{item.candidate}</h4>
                          <span className="text-sm text-gray-500">{item.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.position}</p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {item.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hiring Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring Pipeline</CardTitle>
                <CardDescription>Current status of all candidates in your pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hiringPipeline.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">{stage.count} candidates</span>
                        <div className="w-24">
                          <Progress value={(stage.count / 45) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notifications</CardTitle>
                  <Button variant="ghost" size="sm">
                    Mark all read
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${notification.unread ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
                    >
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/post-job">
                  <Button className="w-full justify-start bg-amber-600 hover:bg-amber-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </Link>
                <Link href="/talent-manager/candidates">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Review Applications
                  </Button>
                </Link>
                <Link href="/talent-manager/schedule">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Hires */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Hires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Emily Rodriguez</p>
                      <p className="text-xs text-gray-500">UX Designer</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">John Davis</p>
                      <p className="text-xs text-gray-500">Backend Developer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}