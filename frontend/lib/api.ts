const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include" as RequestCredentials,
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async getCurrentUser() {
    return this.request("/auth/me")
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: any) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" })
  }

  // Profile methods
  async updateProfile(profileData: any) {
    return this.request("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async updateSettings(settings: any) {
    return this.request("/api/users/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }

  // Job methods
  async getJobs(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/api/jobs${queryString}`)
  }

  async getJob(id: string) {
    return this.request(`/api/jobs/${id}`)
  }

  async createJob(jobData: any) {
    return this.request("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    })
  }

  async updateJob(id: string, jobData: any) {
    return this.request(`/api/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    })
  }

  async deleteJob(id: string) {
    return this.request(`/api/jobs/${id}`, {
      method: "DELETE",
    })
  }

  async getMyJobs(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/api/jobs/my/jobs${queryString}`)
  }

  // Application methods
  async applyToJob(jobId: string, formData: FormData) {
    return this.request(`/api/applications/jobs/${jobId}/apply`, {
      method: "POST",
      headers: {},
      body: formData,
    })
  }

  async getMyApplications(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/api/applications/my-applications${queryString}`)
  }

  async getJobApplications(jobId: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/api/applications/jobs/${jobId}/applications${queryString}`)
  }

  async updateApplicationStatus(applicationId: string, status: string, note?: string) {
    return this.request(`/api/applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    })
  }

  async withdrawApplication(applicationId: string, reason?: string) {
    return this.request(`/api/applications/${applicationId}/withdraw`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    })
  }

  // Message methods
  async getConversations(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/api/messages/conversations${queryString}`)
  }

  async getMessages(conversationId: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/api/messages/conversations/${conversationId}/messages${queryString}`)
  }

  async sendMessage(conversationId: string, content: string) {
    return this.request(`/api/messages/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  async createConversation(participantId: string, jobId?: string, applicationId?: string) {
    return this.request("/api/messages/conversations", {
      method: "POST",
      body: JSON.stringify({ participantId, jobId, applicationId }),
    })
  }

  async markMessagesAsRead(conversationId: string) {
    return this.request(`/api/messages/conversations/${conversationId}/read`, {
      method: "PATCH",
    })
  }

  // Upload methods
  async uploadFile(file: File, type: "resume" | "photo" | "document") {
    const formData = new FormData()
    formData.append(type, file)

    return this.request(`/api/upload/${type}`, {
      method: "POST",
      headers: {},
      body: formData,
    })
  }

  // Stats methods
  async getUserStats() {
    return this.request("/api/users/stats")
  }

  async getJobStats(jobId: string) {
    return this.request(`/api/jobs/${jobId}/stats`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
