# DevHire - AI-Powered Recruitment Platform

A comprehensive recruitment platform that connects talent managers with candidates using AI-powered resume analysis and job matching.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Agents     │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (Atlas or local)
- **npm** or **yarn**

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd devhire
```

### 2. Environment Configuration

Create the following environment files:

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=hiralyze
```

#### Backend (`backend/.env`)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devhire?retryWrites=true&w=majority

# Server
PORT=8080
NODE_ENV=development

# Session
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AI Service URL
AI_SERVICE_URL=http://localhost:8000

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth (LinkedIn)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Logging
LOG_LEVEL=info
```

#### AI Agents (`ai-agents/.env`)
```env
# AI Service Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=[".pdf", ".doc", ".docx"]

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8080"]
```

### 3. Install Dependencies

```bash
# Install Frontend dependencies
cd frontend
npm install

# Install Backend dependencies
cd ../backend
npm install

# Install AI Agents dependencies
cd ../ai-agents
pip install -r requirements.txt
```

### 4. Start All Services

#### Option A: Using the startup script (Recommended)
```bash
./start-dev.sh
```

#### Option B: Manual startup
```bash
# Terminal 1: Start AI Agents
cd ai-agents
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Backend
cd backend
npm start

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Agents API**: http://localhost:8000
- **Backend Health Check**: http://localhost:8080/health
- **AI Agents Health Check**: http://localhost:8000/health

## 🔧 API Endpoints

### Backend API (Port 8080)

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

#### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/my/jobs` - Get user's jobs

#### Applications
- `POST /api/applications/jobs/:jobId/apply` - Apply to job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/jobs/:jobId/applications` - Get job applications
- `PATCH /api/applications/:id/status` - Update application status

#### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversations/:id/messages` - Get messages
- `POST /api/messages/conversations/:id/messages` - Send message

### AI Agents API (Port 8000)

- `POST /process-resume` - Process resume with AI analysis
- `POST /upload-resume` - Upload resume file
- `GET /health` - Health check

## 🎯 Features

### For Candidates
- Browse and search jobs
- Apply to jobs with resume upload
- Track application status
- Receive AI-powered feedback
- Chat with recruiters

### For Talent Managers
- Post job listings
- Review applications with AI analysis
- Manage hiring pipeline
- Schedule interviews
- Communicate with candidates

### AI-Powered Features
- Resume parsing and analysis
- Skills extraction and matching
- Experience analysis
- Job-candidate matching scores
- Automated recommendations

## 🔌 Service Connections

### Frontend → Backend
- All API calls go through `frontend/lib/api.ts`
- Configured to use `http://localhost:8080`
- Handles authentication, jobs, applications, messages

### Backend → AI Agents
- AI service calls go through `backend/src/services/ai.service.js`
- Configured to use `http://localhost:8000`
- Processes resumes and provides analysis

### Real-time Communication
- WebSocket connections for real-time messaging
- Socket.IO implementation in backend
- Real-time notifications and updates

## 🛠️ Development

### Project Structure
```
devhire/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
├── ai-agents/         # FastAPI AI service
├── start-dev.sh       # Development startup script
└── README.md          # This file
```

### Key Files
- `frontend/lib/api.ts` - API client configuration
- `backend/src/app.js` - Main Express application
- `backend/src/services/ai.service.js` - AI service integration
- `ai-agents/src/main.py` - FastAPI application entry point

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :8080
   lsof -i :8000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB connection issues**
   - Verify your MongoDB URI in `backend/.env`
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure the database exists

3. **AI service not responding**
   - Check if Python dependencies are installed
   - Verify API keys in `ai-agents/.env`
   - Check the AI service logs

4. **Frontend not connecting to backend**
   - Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
   - Check CORS configuration in backend
   - Ensure backend is running on port 8080

### Logs and Debugging

```bash
# Backend logs
cd backend && npm start

# AI service logs
cd ai-agents && python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend logs
cd frontend && npm run dev
```

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration for cross-origin requests
- Session-based authentication
- Input validation and sanitization
- File upload restrictions

## 📝 Environment Variables Reference

### Required for Production
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - Session encryption key
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `GOOGLE_CLIENT_ID/SECRET` - Google OAuth credentials
- `LINKEDIN_CLIENT_ID/SECRET` - LinkedIn OAuth credentials

### Optional
- `LOG_LEVEL` - Logging verbosity
- `DEBUG` - Debug mode for AI service
- `UPLOAD_DIR` - File upload directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all services
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Hiring! 🚀**