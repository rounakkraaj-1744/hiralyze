"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Menu } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function PostJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: [],
    location: "",
    type: "",
    experience: "",
    remote: false,
    salary: {
      min: "",
      max: "",
      currency: "USD",
      period: "yearly"
    },
    skills: []
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Convert form data to job format
      const jobData = {
        ...formData,
        remote: formData.remote,
        salary: {
          min: formData.salary.min ? parseInt(formData.salary.min) : undefined,
          max: formData.salary.max ? parseInt(formData.salary.max) : undefined,
          currency: formData.salary.currency,
          period: formData.salary.period
        }
      }

      await apiClient.createJob(jobData)

      toast({
        title: "Success",
        description: "Job posted successfully!",
      })

      router.push("/talent-manager/jobs")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
            <Link href="/search" className="text-gray-700 hover:text-gray-900">
              Search
            </Link>
            <Link href="/network" className="text-gray-700 hover:text-gray-900">
              My Network
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-gray-900">
              Jobs
            </Link>
            <Link href="/messaging" className="text-gray-700 hover:text-gray-900">
              Messaging
            </Link>
            <Link href="/notifications" className="text-gray-700 hover:text-gray-900">
              Notifications
            </Link>
            <Menu className="h-5 w-5 text-gray-700" />
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Post a job</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
              Job title
            </Label>
            <Input 
              id="jobTitle" 
              placeholder="e.g., Senior Software Engineer" 
              className="w-full" 
              required 
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-gray-700">
              Company
            </Label>
            <Input 
              id="company" 
              placeholder="e.g., TechCorp Inc." 
              className="w-full" 
              required 
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType" className="text-sm font-medium text-gray-700">
              Employment type
            </Label>
            <Select 
              required 
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">
              Experience level
            </Label>
            <Select 
              required 
              value={formData.experience}
              onValueChange={(value) => handleInputChange("experience", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workType" className="text-sm font-medium text-gray-700">
              Work arrangement
            </Label>
            <Select 
              required 
              value={formData.remote ? "remote" : "onsite"}
              onValueChange={(value) => handleInputChange("remote", value === "remote")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select work arrangement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location
            </Label>
            <Input 
              id="location" 
              placeholder="e.g., San Francisco, CA" 
              className="w-full" 
              required 
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin" className="text-sm font-medium text-gray-700">
                Min Salary
              </Label>
              <Input 
                id="salaryMin" 
                type="number" 
                placeholder="e.g., 80000" 
                className="w-full"
                value={formData.salary.min}
                onChange={(e) => handleInputChange("salary", { ...formData.salary, min: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax" className="text-sm font-medium text-gray-700">
                Max Salary
              </Label>
              <Input 
                id="salaryMax" 
                type="number" 
                placeholder="e.g., 120000" 
                className="w-full"
                value={formData.salary.max}
                onChange={(e) => handleInputChange("salary", { ...formData.salary, max: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
              Job description
            </Label>
            <Textarea 
              id="jobDescription" 
              placeholder="Describe the role, responsibilities, and requirements..." 
              rows={6} 
              className="w-full" 
              required 
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}