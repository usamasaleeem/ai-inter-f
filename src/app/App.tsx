import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useStore } from '../store/useStore';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { JobsPage } from './components/jobs/JobsPage';
import { CreateJobPage } from './components/jobs/CreateJobPage';
import { JobDetailsPage } from './components/jobs/JobDetailsPage';
import { JobPublicPage } from './components/jobs/JobPublicPage';
import { PipelinePage } from './components/pipeline/PipelinePage';
import { CandidateDetailsPage } from './components/candidates/CandidateDetailsPage';
import { AllCandidatesPage } from './components/candidates/AllCandidatesPage';
import { ShortlistPage } from './components/candidates/ShortlistPage';
import { InterviewSessionPage } from './components/interview/InterviewSessionPage';
import { Toaster } from './components/ui/sonner';
import MessageTemplates from './components/setting/MessageTemplate';
import { SettingsLayout } from './components/SettingsLayout/SettingsLayout';
import GeneralSettings from './components/setting/GeneralSettings';
import SuccessPage from './components/auth/SuccessPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className="size-full">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/jobs/:jobId/apply" element={<JobPublicPage />} />
          <Route path="/interview/:jobId/:candidateId" element={<InterviewSessionPage />} />
                       <Route path="success" element={<SuccessPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard/settings" element={<SettingsLayout />}>
              <Route path="templates" element={<MessageTemplates />} />
              {

                <Route index element={<GeneralSettings />} />
                /*
                 <Route path="ai" element={<AISettings />} />
                 <Route path="team" element={<TeamSettings />} />
                     */
              }
            </Route>

            <Route index element={<DashboardOverview />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/new" element={<CreateJobPage />} />
            <Route path="jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="jobs/:jobId/edit" element={<CreateJobPage />} />
            <Route path="pipeline" element={<PipelinePage />} />
            <Route path="candidates" element={<AllCandidatesPage />} />
            <Route path="candidates/:id" element={<CandidateDetailsPage />} />
            <Route path="shortlist" element={<ShortlistPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}
