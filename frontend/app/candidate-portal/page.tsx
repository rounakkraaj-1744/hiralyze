"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Search, Bell, MapPin, Briefcase, Clock } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function CandidatePortal() {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    remote: false,
    experience: "",
    type: ""
  })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await apiClient.getJobs()
      setJobs(response.data.jobs || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchTerm) params.search = searchTerm
      if (filters.remote) params.remote = true
      if (filters.experience) params.experience = filters.experience
      if (filters.type) params.type = filters.type

      const response = await apiClient.getJobs(params)
      setJobs(response.data.jobs || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to search jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const featuredCompanies = [
    { name: "Tech Innovators Inc.", logo: "TI", color: "bg-green-800" },
    { name: "Global Solutions Ltd.", logo: "GS", color: "bg-yellow-600" },
    { name: "Creative Minds Co.", logo: "CM", color: "bg-green-700" },
    { name: "Future Forward Corp.", logo: "FF", color: "bg-green-600" },
    { name: "Dynamic Systems LLC", logo: "DS", color: "bg-green-900" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-gray-900" />
              <span className="text-lg font-semibold text-gray-900">Hiralyze</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/candidate-portal" className="text-gray-700 hover:text-gray-900">
              My Applications
            </Link>
            <Link href="/saved-jobs" className="text-gray-700 hover:text-gray-900">
              Saved Jobs
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-gray-900">
              Resources
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search" className="pl-10 bg-green-50 border-green-200 w-48" />
              </div>
              <Bell className="h-5 w-5 text-gray-700" />
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find your dream job</h1>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                className="pl-12 py-4 text-lg bg-green-50 border-green-200 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mb-8">
            <Badge
              variant="outline"
              className={`px-4 py-2 cursor-pointer ${filters.remote ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
              onClick={() => handleFilterChange('remote', !filters.remote)}
            >
              Remote
            </Badge>
            <Badge
              variant="outline"
              className={`px-4 py-2 cursor-pointer ${filters.experience === 'entry' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
              onClick={() => handleFilterChange('experience', filters.experience === 'entry' ? '' : 'entry')}
            >
              Entry-Level
            </Badge>
            <Badge
              variant="outline"
              className={`px-4 py-2 cursor-pointer ${filters.experience === 'mid' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
              onClick={() => handleFilterChange('experience', filters.experience === 'mid' ? '' : 'mid')}
            >
              Mid Level
            </Badge>
            <Badge
              variant="outline"
              className={`px-4 py-2 cursor-pointer ${filters.experience === 'senior' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
              onClick={() => handleFilterChange('experience', filters.experience === 'senior' ? '' : 'senior')}
            >
              Senior Level
            </Badge>
            <Badge
              variant="outline"
              className={`px-4 py-2 cursor-pointer ${filters.type === 'internship' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
              onClick={() => handleFilterChange('type', filters.type === 'internship' ? '' : 'internship')}
            >
              Internship
            </Badge>
          </div>
        </div>

        {/* Featured Companies */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Companies</h2>
          <div className="grid grid-cols-5 gap-6">
            {featuredCompanies.map((company, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${company.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-semibold text-lg">{company.logo}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{company.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? "Loading jobs..." : `${jobs.length} jobs found`}
            </h2>
            <Button onClick={handleSearch} className="bg-green-500 hover:bg-green-600">
              Search
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-28"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
              <Button onClick={loadJobs} className="mt-4 bg-green-500 hover:bg-green-600">
                View All Jobs
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-semibold text-sm">
                          {job.company?.charAt(0) || "C"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 mb-1">{job.company}</p>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {job.type}
                          </div>
                          {job.remote && (
                            <Badge variant="outline" className="text-xs">
                              Remote
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {job.salary && (
                    <div className="mb-4 text-sm text-gray-600">
                      <span className="font-medium">
                        ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                      </span>
                      <span className="text-gray-500"> / {job.salary.period}</span>
                    </div>
                  )}

                  <Link href={`/apply/${job._id}`}>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                &lt;
              </Button>
              <Button variant="ghost" size="sm" className="bg-green-100 text-green-700">
                1
              </Button>
              <Button variant="ghost" size="sm">
                2
              </Button>
              <Button variant="ghost" size="sm">
                3
              </Button>
              <Button variant="ghost" size="sm">
                4
              </Button>
              <Button variant="ghost" size="sm">
                5
              </Button>
              <Button variant="ghost" size="sm">
                &gt;
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}