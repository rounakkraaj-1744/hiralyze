import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Briefcase, Users, MessageSquare, Settings, Search } from "lucide-react"
import Link from "next/link"

export default function CandidatesPage() {
  const candidates = [
    {
      name: "Ethan Carter",
      job: "Software Engineer",
      status: "Applied",
      lastActivity: "2 days ago",
    },
    {
      name: "Olivia Bennett",
      job: "Product Manager",
      status: "Interviewing",
      lastActivity: "1 week ago",
    },
    {
      name: "Noah Thompson",
      job: "Data Scientist",
      status: "Offered",
      lastActivity: "3 weeks ago",
    },
    {
      name: "Ava Harper",
      job: "UX Designer",
      status: "Rejected",
      lastActivity: "1 month ago",
    },
    {
      name: "Liam Foster",
      job: "Marketing Specialist",
      status: "Applied",
      lastActivity: "2 months ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-gray-100 text-gray-800"
      case "Interviewing":
        return "bg-blue-100 text-blue-800"
      case "Offered":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              className="flex items-center space-x-3 px-3 py-2 bg-green-100 text-green-700 rounded-md"
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
              href="/talent-manager/messages"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/talent-manager/settings"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/post-job">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full">Post a job</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidates</h1>
          <p className="text-gray-600">Manage your candidates</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search Candidates" className="pl-10 bg-green-50 border-green-200" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto">
            <TabsTrigger
              value="all"
              className="border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none px-4 py-2"
            >
              All candidates
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-green-600"
            >
              Active candidates
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-green-600"
            >
              Archived candidates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Candidates Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((candidate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {candidate.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{candidate.job}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${getStatusColor(candidate.status)} hover:${getStatusColor(candidate.status)}`}
                          >
                            {candidate.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.lastActivity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="link" className="text-green-600 hover:text-green-700 p-0">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
