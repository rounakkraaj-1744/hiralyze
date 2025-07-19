"use client"

import { useState, useEffect } from "react"
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
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function TalentManagerHome() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todayInterviews: 0,
    newApplications: 0,
    activeJobs: 0,
    pendingOffers: 0
  })
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [myJobs, setMyJobs] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user stats
      const statsResponse = await apiClient.getUserStats()
      setStats(statsResponse.data.stats || {
        todayInterviews: 0,
        newApplications: 0,
        activeJobs: 0,
        pendingOffers: 0
      })

      // Load recent applications
      const applicationsResponse = await apiClient.getMyApplications({ limit: 5 })
      setRecentApplications(applicationsResponse.data.applications || [])

      // Load my jobs
      const jobsResponse = await apiClient.getMyJobs({ limit: 5 })
      setMyJobs(jobsResponse.data.jobs || [])

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
    { stage: "Applied", count: stats.newApplications, color: "bg-blue-500" },
    { stage: "Screening", count: Math.floor(stats.newApplications * 0.5), color: "bg-yellow-500" },
    { stage: "Interview", count: Math.floor(stats.newApplications * 0.25), color: "bg-purple-500" },
    { stage: "Offer", count: stats.pendingOffers, color: "bg-green-500" },
    { stage: "Hired", count: Math.floor(stats.pendingOffers * 0.6), color: "bg-emerald-500" },
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
                <span className="ml-2 text-xl font-bold text-gray-900">Hiralyze</span>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.todayInterviews}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.newApplications}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.activeJobs}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.pendingOffers}
                  </p>
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
                          <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.time}</p>
                        <p className="text-sm text-gray-600">{item.candidate}</p>
                        <p className="text-xs text-gray-500">{item.position}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Latest job applications from candidates</CardDescription>
                  </div>
                  <Link href="/talent-manager/candidates">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent applications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.slice(0, 5).map((application) => (
                      <div key={application._id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={application.candidate?.avatar} />
                          <AvatarFallback>
                            {application.candidate?.firstName?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {application.candidate?.firstName} {application.candidate?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{application.job?.title}</p>
                          <p className="text-xs text-gray-500">
                            Applied {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'approved' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Hiring Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring Pipeline</CardTitle>
                <CardDescription>Current stage distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hiringPipeline.map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{stage.stage}</span>
                        <span className="text-gray-600">{stage.count}</span>
                      </div>
                      <Progress value={(stage.count / Math.max(...hiringPipeline.map(s => s.count))) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Jobs</CardTitle>
                  <Link href="/talent-manager/jobs">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 border rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : myJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active jobs</p>
                    <Link href="/post-job">
                      <Button size="sm" className="mt-2">
                        Post a Job
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myJobs.slice(0, 5).map((job) => (
                      <div key={job._id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-600">{job.company}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{job.location}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            job.status === 'active' ? 'bg-green-100 text-green-800' :
                            job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}