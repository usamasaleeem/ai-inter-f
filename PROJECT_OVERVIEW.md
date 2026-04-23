# AI Interviewer SaaS Dashboard

A production-ready, frontend-only AI Interviewer SaaS Dashboard built with React, TypeScript, Tailwind CSS, and modern UI libraries.

## 🎯 Project Overview

This is a complete SaaS dashboard UI for an AI-powered interviewing platform. The application allows employers to post jobs, manage candidates through an interview pipeline, and review AI-generated interview analyses.

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router 7** - Client-side routing
- **Zustand** - State management
- **Motion (Framer Motion)** - Animations
- **react-dnd** - Drag and drop functionality
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons
- **Recharts** - Data visualization (available)

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx                          # Main app with routing
│   └── components/
│       ├── auth/
│       │   ├── LoginPage.tsx           # Login UI
│       │   └── SignupPage.tsx          # Signup UI
│       ├── dashboard/
│       │   └── DashboardOverview.tsx   # Dashboard with stats
│       ├── jobs/
│       │   ├── JobsPage.tsx           # Job listings table
│       │   ├── CreateJobPage.tsx      # Create/Edit job form
│       │   ├── JobDetailsPage.tsx     # Job details view
│       │   └── JobPublicPage.tsx      # Public job application page
│       ├── candidates/
│       │   ├── AllCandidatesPage.tsx  # All candidates table
│       │   ├── CandidateDetailsPage.tsx # Candidate profile with AI analysis
│       │   └── ShortlistPage.tsx      # Candidate shortlisting with filters
│       ├── pipeline/
│       │   └── PipelinePage.tsx       # Kanban board with drag-and-drop
│       ├── interview/
│       │   └── InterviewSessionPage.tsx # Simulated interview UI
│       ├── layout/
│       │   └── DashboardLayout.tsx    # Dashboard layout with sidebar
│       ├── common/
│       │   └── EmptyState.tsx         # Reusable empty state component
│       └── ui/                        # UI component library (50+ components)
├── store/
│   └── useStore.ts                    # Zustand global state
├── lib/
│   ├── mockData.ts                    # Comprehensive mock data
│   └── helpers.ts                     # Utility functions
└── styles/                            # Global styles
```

## ✨ Features Implemented

### 1. Authentication (Mock)
- ✅ Login page with role selection (Employer/Candidate)
- ✅ Signup page
- ✅ Protected routes
- ✅ User state management

### 2. Employer Dashboard
- ✅ Overview with stats cards (animated)
  - Total Jobs
  - Active Candidates
  - Interviews Completed
  - Shortlisted Candidates
- ✅ Recent candidates list
- ✅ Active job postings

### 3. Job Management
- ✅ Job listings table with actions
- ✅ Create job form with:
  - Title, description, salary
  - Experience level selector
  - Interview type (Voice AI, Live, Hybrid)
  - Multi-skill tags
  - Dynamic custom questions
- ✅ Edit existing jobs
- ✅ Job details page
- ✅ Publish/Draft status
- ✅ Delete jobs with confirmation
- ✅ Empty state when no jobs

### 4. Candidate Pipeline (Kanban)
- ✅ Drag-and-drop between stages:
  - Applied
  - In Review
  - Interviewed
  - Shortlisted
  - Rejected
- ✅ Candidate cards with:
  - Avatar, name, role
  - AI score with progress bar
  - Tags
- ✅ Visual stage indicators

### 5. Candidate Details
- ✅ Profile sidebar with:
  - Avatar, contact info
  - Skills and tags
  - Status badge
  - AI score
- ✅ Tabs interface:
  - **AI Analysis**: Detailed assessment
    - Overall score & recommendation
    - Skills assessment with progress bars
    - Strengths & weaknesses
    - Performance metrics (communication, technical depth, problem-solving, cultural fit)
    - Sentiment analysis
  - **Transcript**: Full interview conversation
  - **Recording**: Placeholder for video/audio
- ✅ Quick actions (Shortlist/Reject)

### 6. Interview Session (Simulated)
- ✅ Full-screen interview interface
- ✅ Timer with progress bar
- ✅ Chat-style transcript view
- ✅ Speaking indicators (AI/Candidate)
- ✅ Animated messages
- ✅ Mic toggle button (simulated)
- ✅ Mock AI responses
- ✅ End interview functionality

### 7. Job Public Page
- ✅ Clean job details view
- ✅ Skills display
- ✅ Interview process explanation
- ✅ Application form:
  - Name and email inputs
  - "Start AI Interview" button

### 8. Shortlisting & Filtering
- ✅ Candidate table with:
  - Avatar, name, email
  - AI scores with visual indicators
  - Status badges
  - Tags
- ✅ Advanced filters:
  - Search by name/email/role
  - Status dropdown
  - Score range slider
- ✅ Quick actions (View/Approve/Reject)

### 9. All Candidates Page
- ✅ Comprehensive candidate list
- ✅ Sortable table
- ✅ Click to view details

### 10. Design System
- ✅ Minimal, clean SaaS aesthetic
- ✅ Black, white, gray palette
- ✅ Smooth animations (Motion/Framer Motion)
- ✅ Hover effects
- ✅ Loading states
- ✅ Empty states
- ✅ Responsive design
- ✅ Mobile-friendly sidebar

## 🎨 UI Components Used

The application uses 50+ pre-built UI components including:
- Cards, Buttons, Badges
- Tables, Tabs, Forms
- Dialogs, Alerts, Toasts
- Progress bars, Sliders
- Avatars, Selects, Inputs
- Dropdown menus, Popovers
- Skeleton loaders (available)

## 📊 State Management

Zustand store manages:
- User authentication state
- Jobs (CRUD operations)
- Candidates (status updates, scoring)
- Interview session state
- Pipeline management (drag-and-drop)

## 🎭 Mock Data

Comprehensive mock data includes:
- 5 sample jobs (various roles and statuses)
- 10 sample candidates (different stages)
- Full interview transcript (13 messages)
- Detailed AI analysis with scores
- Skills assessments
- Sentiment data

## 🚀 Getting Started

The application is already set up and ready to run. It uses:
- React Router for navigation
- Vite for development
- All dependencies are installed

### Key Routes

- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Dashboard overview
- `/dashboard/jobs` - Job management
- `/dashboard/pipeline` - Candidate pipeline
- `/dashboard/shortlist` - Shortlisting
- `/dashboard/candidates` - All candidates
- `/dashboard/candidates/:id` - Candidate details
- `/jobs/:jobId/apply` - Public job application
- `/interview/:jobId` - Interview session

## 🔑 Key Features

### Authentication Flow
1. User selects role (Employer/Candidate)
2. Credentials stored in Zustand
3. Protected routes redirect to login if not authenticated

### Employer Workflow
1. Login as employer
2. Create job postings
3. View applications in pipeline
4. Drag candidates between stages
5. Review AI interview analysis
6. Shortlist or reject candidates

### Candidate Workflow (Public)
1. Browse public job posting
2. Submit application
3. Start AI interview
4. Answer questions via simulated mic

## 🎯 Production-Ready Features

- ✅ Clean, reusable component architecture
- ✅ TypeScript for type safety
- ✅ Proper state management
- ✅ Client-side routing
- ✅ Responsive design
- ✅ Accessible UI components
- ✅ Smooth animations
- ✅ Error boundaries ready
- ✅ Empty states
- ✅ Loading states
- ✅ Confirmation dialogs

## 🔮 Future Enhancement Ideas

While this is frontend-only, the architecture is ready for:
- Backend API integration
- Real WebSocket connections for live interviews
- Real AI model integration
- File uploads (resumes, portfolios)
- Email notifications
- Advanced analytics dashboard
- Video interview recording
- Multi-language support
- Dark mode
- Team collaboration features

## 📝 Notes

- All data is mock/static - no backend required
- Interview session is simulated with random responses
- AI scores and analysis are pre-generated mock data
- Drag-and-drop uses react-dnd with HTML5 backend
- Animations use Motion (Framer Motion fork)
- Forms are controlled components with React state
- No API calls - everything is client-side only

## 🎨 Design Philosophy

The design follows modern SaaS principles:
- **Minimal**: Clean, uncluttered interface
- **Professional**: Black and white with subtle grays
- **Responsive**: Works on all screen sizes
- **Accessible**: Uses Radix UI primitives
- **Smooth**: Motion animations for premium feel
- **Consistent**: Unified design language throughout

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
