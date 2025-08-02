"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, X, Save, Edit, MapPin, Mail, Calendar, ExternalLink, Linkedin, Github,
  Globe, FileText, Award, GraduationCap, Briefcase, User, Code} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  name: string
  email: string
  profilePhoto?: string
  role: string
  profile: {
    phone?: string
    location?: string
    title?: string
    bio?: string
    experience?: string
    education?: string
    skills?: string[]
    linkedin?: string
    github?: string
    website?: string
    resume?: string
    company?: string
    department?: string
  }
  createdAt: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [links, setLinks] = useState<Array<{ name: string; url: string; icon: string }>>([])
  const [newLink, setNewLink] = useState({ name: "", url: "" })
  const [showAddLink, setShowAddLink] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const { toast } = useToast()

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
        credentials: "include"
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      
      const data = await response.json()
      setUser(data.data.user)
      setSkills(data.data.user.profile?.skills || [])
      
      // Set up links from user profile
      const userLinks = []
      if (data.data.user.profile?.linkedin) {
        userLinks.push({ name: "LinkedIn", url: data.data.user.profile.linkedin, icon: "linkedin" })
      }
      if (data.data.user.profile?.github) {
        userLinks.push({ name: "GitHub", url: data.data.user.profile.github, icon: "github" })
      }
      if (data.data.user.profile?.website) {
        userLinks.push({ name: "Website", url: data.data.user.profile.website, icon: "globe" })
      }
      setLinks(userLinks)
      
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResumeUpload = async (file: File) => {
    if (!file) return
    
    setIsUploadingResume(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/resume`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload resume')
      }
      
      const data = await response.json()
      
      // Update user profile with resume data
      const updateData = {
        profile: {
          resume: data.data.resumeUrl,
          // AI agents will parse and update these fields
          skills: data.data.extractedSkills || skills,
          experience: data.data.extractedExperience || user?.profile?.experience,
          education: data.data.extractedEducation || user?.profile?.education,
        }
      }
      
      // Update profile with parsed data
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      })
      
      if (!profileResponse.ok) {
        throw new Error('Failed to update profile with resume data')
      }
      
      const profileData = await profileResponse.json()
      setUser(profileData.data.user)
      setSkills(profileData.data.user.profile?.skills || [])
      
      toast({
        title: "Success",
        description: "Resume uploaded and parsed successfully",
      })
      
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive"
      })
    } finally {
      setIsUploadingResume(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please upload a PDF or Word document",
          variant: "destructive"
        })
        return
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive"
        })
        return
      }
      
      handleResumeUpload(file)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      // Prepare update data
      const updateData = {
        name: user.name,
        profile: {
          ...user.profile,
          skills: skills,
          linkedin: links.find(l => l.icon === "linkedin")?.url || "",
          github: links.find(l => l.icon === "github")?.url || "",
          website: links.find(l => l.icon === "globe")?.url || "",
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setUser(data.data.user)
      setIsEditing(false)
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const addLink = () => {
    if (newLink.name.trim() && newLink.url.trim()) {
      setLinks([...links, { ...newLink, icon: "globe" }])
      setNewLink({ name: "", url: "" })
      setShowAddLink(false)
    }
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "linkedin": return <Linkedin className="h-4 w-4" />
      case "github": return <Github className="h-4 w-4" />
      case "code": return <Code className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const updateUserField = (field: string, value: string) => {
    if (!user) return
    setUser({
      ...user,
      [field]: value
    })
  }

  const updateProfileField = (field: string, value: string) => {
    if (!user) return
    setUser({
      ...user,
      profile: {
        ...user.profile,
        [field]: value
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
          <Button onClick={fetchUserProfile} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header with Profile Picture and Basic Info */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-400 to-green-600"></div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 relative">
              <div className="flex items-end space-x-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.profilePhoto || "/placeholder.svg?height=128&width=128"} />
                  <AvatarFallback className="text-3xl bg-gray-100">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                )}
              </div>
              
              <div className="flex-1 mt-4 md:mt-0 md:mb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={user.name}
                          onChange={(e) => updateUserField("name", e.target.value)}
                          className="font-bold text-2xl"
                          placeholder="Full Name"
                        />
                        {user.profile?.title && (
                          <Input
                            value={user.profile.title}
                            onChange={(e) => updateProfileField("title", e.target.value)}
                            className="font-medium text-lg"
                            placeholder="Title"
                          />
                        )}
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        {user.profile?.title && (
                          <p className="text-lg font-medium text-gray-600">{user.profile.title}</p>
                        )}
                      </>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </div>
                      {user.profile?.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {user.profile.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    className={isEditing ? "bg-green-500 hover:bg-green-600" : "bg-gray-900 hover:bg-gray-800"}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : isEditing ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Edit className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={user.profile?.bio || ""}
                onChange={(e) => updateProfileField("bio", e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {user.profile?.bio || "No bio added yet."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Links Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-green-600" />
                Links
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddLink(true)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  {getIcon(link.icon)}
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {link.name}
                  </a>
                  {isEditing && (
                    <button 
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {showAddLink && isEditing && (
              <div className="mt-4 space-y-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Link name (e.g., Portfolio)"
                    value={newLink.name}
                    onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  />
                  <Input
                    placeholder="URL"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={addLink}>Add</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddLink(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 text-sm py-1 px-3">
                  <span>{skill}</span>
                  {isEditing && (
                    <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-green-600" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.profile?.experience ? (
              <div className="space-y-4">
                {isEditing ? (
                  <Textarea
                    value={user.profile.experience}
                    onChange={(e) => updateProfileField("experience", e.target.value)}
                    rows={6}
                    placeholder="Describe your work experience..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {user.profile.experience}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No experience information added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.profile?.education ? (
              <div className="space-y-4">
                {isEditing ? (
                  <Textarea
                    value={user.profile.education}
                    onChange={(e) => updateProfileField("education", e.target.value)}
                    rows={4}
                    placeholder="Describe your education..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {user.profile.education}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No education information added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Resume Upload Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
                <p className="text-gray-600 mb-4">Drag and drop your resume or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                
                {isUploadingResume ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    <span className="text-green-600">Uploading and parsing resume...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="resume-upload">
                      <Button className="bg-green-500 hover:bg-green-600 cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Current Resume */}
              {user.profile?.resume && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Resume</p>
                        <p className="text-sm text-gray-500">Uploaded resume</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(user.profile?.resume, '_blank')}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = user.profile?.resume || ''
                          link.download = 'resume.pdf'
                          link.click()
                        }}
                      >
                        Download
                      </Button>
                      {isEditing && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={async () => {
                            try {
                              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                  profile: {
                                    ...user.profile,
                                    resume: ""
                                  }
                                }),
                              })
                              
                              if (response.ok) {
                                const data = await response.json()
                                setUser(data.data.user)
                                toast({
                                  title: "Success",
                                  description: "Resume removed successfully",
                                })
                              }
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to remove resume",
                                variant: "destructive"
                              })
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}