import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Search } from "lucide-react"
import Link from "next/link"

export default function JobDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-gray-900" />
            <span className="text-lg font-semibold text-gray-900">TalentPool</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-gray-900">
              Jobs
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-gray-900">
              Companies
            </Link>
            <Link href="/salaries" className="text-gray-700 hover:text-gray-900">
              Salaries
            </Link>
            <Link href="/career-paths" className="text-gray-700 hover:text-gray-900">
              Career paths
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-green-50 border border-green-200 rounded-md text-sm"
                />
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">Post a job</Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <Link href="/jobs" className="hover:underline">
            Jobs
          </Link>
          <span>/</span>
          <span>Software Engineer</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Senior Software Engineer</h1>
            <div className="flex items-center space-x-4 text-sm text-green-600">
              <span>Acme Co.</span>
              <span>•</span>
              <span>Remote</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto">
              <TabsTrigger
                value="overview"
                className="border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none px-4 py-2"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-green-600"
              >
                About the company
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-green-600"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="space-y-8">
                {/* About the job */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About the job</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We are looking for a Senior Software Engineer to join our team. You will be responsible for
                    developing and maintaining our web applications. You should have a strong understanding of software
                    engineering principles and be able to work independently and as part of a team. You should also be
                    able to communicate effectively with both technical and non-technical stakeholders.
                  </p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Responsibilities</h2>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Develop and maintain web applications</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Write clean, well-tested code</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Collaborate with other engineers</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Participate in code reviews</span>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Bachelor's degree in Computer Science or related field</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">5+ years of experience in software engineering</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Strong understanding of software engineering principles</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Experience with web development frameworks</span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h2>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Competitive salary</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Health insurance</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Paid time off</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">401(k) matching</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Apply Button */}
          <div className="flex justify-end">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full">Apply now</Button>
          </div>
        </div>
      </div>
    </div>
  )
}