"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ApplyJobPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const jobId = params.jobid as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (jobId) {
      loadJob()
    }
  }, [jobId])

  const loadJob = async () => {
    try {
      const response = await apiClient.getJob(jobId)
      setJob(response.data.job)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      })
      router.push("/jobs")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Add form fields
      const form = e.target as HTMLFormElement
      const formElements = form.elements
      
      formData.append("firstName", (formElements.namedItem("firstName") as HTMLInputElement).value)
      formData.append("lastName", (formElements.namedItem("lastName") as HTMLInputElement).value)
      formData.append("email", (formElements.namedItem("email") as HTMLInputElement).value)
      formData.append("phone", (formElements.namedItem("phone") as HTMLInputElement).value)
      
      const linkedin = (formElements.namedItem("linkedin") as HTMLInputElement).value
      if (linkedin) formData.append("linkedin", linkedin)
      
      const portfolio = (formElements.namedItem("portfolio") as HTMLInputElement).value
      if (portfolio) formData.append("portfolio", portfolio)
      
      const coverLetter = (formElements.namedItem("coverLetter") as HTMLTextAreaElement).value
      if (coverLetter) formData.append("coverLetter", coverLetter)

      // Add resume file
      if (resumeFile) {
        formData.append("resume", resumeFile)
      }

      // Submit application
      await apiClient.applyToJob(jobId, formData)

      setIsSubmitted(true)
      toast({
        title: "Success",
        description: "Application submitted successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
              <p className="text-gray-600">
                Your application has been successfully submitted. Our AI is now processing your resume and will notify
                the recruiter.
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/candidate-portal">
                <Button className="w-full bg-green-500 hover:bg-green-600">View My Applications</Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" className="w-full bg-transparent">
                  Browse More Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href="/jobs" className="flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for {job?.title || "Job"}
          </h1>
          <p className="text-gray-600">
            {job?.company} • {job?.location} • {job?.remote ? "Remote" : "On-site"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input id="portfolio" name="portfolio" placeholder="https://yourportfolio.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={6}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                />
              </div>

              <div className="space-y-2">
                <Label>Resume *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    {resumeFile ? resumeFile.name : "Upload your resume (PDF, DOC, DOCX)"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    required
                  />
                  <Label htmlFor="resume-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" className="bg-transparent">
                      Choose File
                    </Button>
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/jobs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600 min-w-32">
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}