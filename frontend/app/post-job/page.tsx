"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Menu } from "lucide-react"
import Link from "next/link"

export default function PostJobPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
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
            <Input id="jobTitle" placeholder="" className="w-full" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType" className="text-sm font-medium text-gray-700">
              Employment type
            </Label>
            <Select required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">
              Experience level
            </Label>
            <Select required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
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
              On-site/Remote
            </Label>
            <Select required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
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
            <Input id="location" placeholder="" className="w-full" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
              Job description
            </Label>
            <Textarea id="jobDescription" placeholder="" rows={6} className="w-full" required />
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