# AI Interviewer SaaS Dashboard

A complete, production-ready SaaS dashboard for an AI-powered interviewing platform.

## 🚀 Quick Start

The application is ready to use! Simply log in to explore the dashboard.

### Demo Credentials

**Login Page**: `/login`

1. Enter any email (e.g., `demo@company.com`)
2. Enter any password
3. Select **Employer** role
4. Click **Sign in**

## 📱 Key Pages

- **Dashboard** (`/dashboard`) - Overview with stats and recent activity
- **Jobs** (`/dashboard/jobs`) - Manage job postings
- **Pipeline** (`/dashboard/pipeline`) - Kanban board with drag-and-drop
- **Shortlist** (`/dashboard/shortlist`) - Filter and manage candidates
- **Candidates** (`/dashboard/candidates`) - View all applicants

## ✨ Features to Try

### 1. Create a Job
1. Navigate to Jobs
2. Click "Create Job"
3. Fill in the form with job details
4. Add required skills
5. Add custom interview questions
6. Publish or save as draft

### 2. Manage Candidates in Pipeline
1. Go to Pipeline
2. Drag candidates between stages:
   - Applied → In Review → Interviewed → Shortlisted
3. Click a candidate to view detailed profile

### 3. Review AI Interview Analysis
1. Click any candidate with an AI score
2. View the **AI Analysis** tab for:
   - Overall assessment score
   - Skills breakdown
   - Strengths & weaknesses
   - Communication metrics
3. Switch to **Transcript** tab to see the conversation

### 4. Simulate an Interview
1. Open a job's public page: `/jobs/job-1/apply`
2. Fill in name and email
3. Click "Start AI Interview"
4. Click the mic button to speak
5. Watch AI responses appear in real-time

### 5. Shortlist Candidates
1. Go to Shortlist
2. Use filters to find candidates:
   - Search by name
   - Filter by status
   - Adjust AI score range
3. Click approve/reject buttons

## 🎯 Mock Data

The app comes pre-loaded with:
- **5 job postings** (Frontend, Full Stack, DevOps, Designer, Backend)
- **10 candidates** at various stages
- **Full interview transcripts** with AI analysis
- **Realistic AI scores** and assessments

## 🛠️ Tech Stack

- React 18 + TypeScript
- React Router 7
- Zustand (state management)
- Tailwind CSS v4
- Motion (Framer Motion)
- react-dnd (drag & drop)
- Radix UI components
- Lucide icons

## 📂 Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main app + routing
│   └── components/
│       ├── auth/           # Login, signup
│       ├── dashboard/      # Overview page
│       ├── jobs/           # Job management
│       ├── candidates/     # Candidate pages
│       ├── pipeline/       # Kanban board
│       ├── interview/      # Interview session
│       ├── layout/         # Dashboard layout
│       └── ui/             # 50+ UI components
├── store/
│   └── useStore.ts         # Global state
├── lib/
│   ├── mockData.ts         # Sample data
│   └── helpers.ts          # Utilities
```

## 🎨 Design

- Minimal SaaS aesthetic
- Black, white, and gray palette
- Smooth animations
- Fully responsive
- Mobile-friendly sidebar

## 📝 Note

This is a **frontend-only** application. All data is mocked and stored in client-side state. No backend or APIs are required.

## 🔮 Ready for Backend Integration

The architecture is ready to connect to real APIs:
- Zustand store can easily integrate API calls
- Forms are ready for submission
- Authentication can connect to real auth providers
- Interview session can use WebSockets
- AI analysis can call real ML models

---

**See PROJECT_OVERVIEW.md for detailed documentation**
