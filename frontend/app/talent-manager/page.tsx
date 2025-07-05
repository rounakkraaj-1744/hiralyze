import { Button } from "@/components/ui/button"
import { Home, Briefcase, Users, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"

export default function TalentManagerDashboard() {
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

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back, Sarah</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 rounded-lg p-6">
            <div className="text-sm text-green-700 mb-1">Active Jobs</div>
            <div className="text-3xl font-bold text-gray-900">12</div>
          </div>
          <div className="bg-green-100 rounded-lg p-6">
            <div className="text-sm text-green-700 mb-1">Candidates</div>
            <div className="text-3xl font-bold text-gray-900">345</div>
          </div>
          <div className="bg-green-100 rounded-lg p-6">
            <div className="text-sm text-green-700 mb-1">Applications</div>
            <div className="text-3xl font-bold text-gray-900">78</div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Senior Software Engineer
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">San Francisco, CA</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">25</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Product Manager</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">New York, NY</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">UX Designer</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Remote</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <Link href="/post-job">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2">Post a Job</Button>
            </Link>
            <Link href="/talent-manager/jobs">
              <Button variant="outline" className="px-6 py-2 bg-transparent">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}