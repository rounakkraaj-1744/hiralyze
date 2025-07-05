import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Search, Bell } from "lucide-react"
import Link from "next/link"

export default function CandidatePortal() {
  const featuredCompanies = [
    { name: "Tech Innovators Inc.", logo: "TI", color: "bg-green-800" },
    { name: "Global Solutions Ltd.", logo: "GS", color: "bg-yellow-600" },
    { name: "Creative Minds Co.", logo: "CM", color: "bg-green-700" },
    { name: "Future Forward Corp.", logo: "FF", color: "bg-green-600" },
    { name: "Dynamic Systems LLC", logo: "DS", color: "bg-green-900" },
  ]

  const recommendedJobs = [
    {
      company: "Tech Innovators Inc.",
      position: "Software Engineer",
      location: "San Francisco, CA",
      type: "Full-time",
      logo: "TI",
      color: "bg-yellow-200",
    },
    {
      company: "Global Solutions Ltd.",
      position: "Marketing Manager",
      location: "New York, NY",
      type: "Full-time",
      logo: "GS",
      color: "bg-yellow-100",
    },
    {
      company: "Creative Minds Co.",
      position: "Graphic Designer",
      location: "Los Angeles, CA",
      type: "Full-time",
      logo: "CM",
      color: "bg-yellow-200",
    },
    {
      company: "Future Forward Corp.",
      position: "Data Analyst",
      location: "Chicago, IL",
      type: "Full-time",
      logo: "FF",
      color: "bg-green-700",
    },
    {
      company: "Dynamic Systems LLC",
      position: "Product Manager",
      location: "Austin, TX",
      type: "Full-time",
      logo: "DS",
      color: "bg-green-800",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-gray-900" />
            <span className="text-lg font-semibold text-gray-900">Talent Hub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/applications" className="text-gray-700 hover:text-gray-900">
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
              <Input placeholder="Search" className="pl-12 py-4 text-lg bg-green-50 border-green-200 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mb-8">
            <Badge variant="outline" className="px-4 py-2 bg-green-50 text-green-700 border-green-200">
              Remote
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Entry-Level
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Mid Level
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Senior Level
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
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

        {/* Recommended Jobs */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${job.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-gray-800 font-semibold">{job.logo}</span>
                    </div>
                    <div>
                      <p className="text-sm text-green-600 mb-1">{job.company}</p>
                      <h3 className="font-semibold text-gray-900">{job.position}</h3>
                      <p className="text-sm text-gray-600">
                        {job.location} • {job.type}
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Apply</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  )
}