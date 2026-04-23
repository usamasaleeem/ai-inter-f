import { create } from 'zustand';
import { mockJobs, mockCandidates } from '../lib/mockData';
import {api,publicApi} from '../services/api';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: 'employer' | 'candidate' | null;
  name?: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  salary: string;
  experience: string;
  interviewType: string;
  skills: string[];
  applicants: number;
  customQuestions: string[];
  createdAt: string;
  publishedAt: string | null;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  status: string;
  aiScore: number | null;
  skills: string[];
  experience: string;
  appliedAt: string;
  interviewedAt: string | null;
  avatar: string;
  tags: string[];
}

interface InterviewSession {
  candidateId: string | null;
  jobId: string | null;
  isActive: boolean;
  startTime: number | null;
  messages: Array<{
    id: number;
    speaker: 'AI' | 'Candidate';
    text: string;
    timestamp: string;
  }>;
  isSpeaking: boolean;
  speakerType: 'AI' | 'Candidate' | null;
}

interface Store {
  user: User;
  currentCandidate: Object;
  callId: string | null;
  isAuthenticated: boolean;
  retellAccessToken: string | null;
  callLoading: boolean;
  createRetellCall: (cid: string, jobId: string) => Promise<string | null>;
  endRetellCall: () => Promise<string | null>;
  fetchCandidateById: (id: string) => Promise<string | null>;

  fetchCandidates: () => Promise<void>;
  initAuth: () => void;
  authLoading: boolean;
  jobs: Job[];
  templates: {
    Applied: any[];
    Shortlisted: any[];
    Interviewed: any[];
    Hired: any[];
    Rejected: any[];
  };
  templatesLoading: boolean;
  fetchTemplates: () => Promise<void>;
  saveTemplate: (data: Object) => Promise<void>;
  candidates: any[];
  interviewSession: InterviewSession;
  setUser: (user: User) => void;
  logout: () => void;
  currentJob: Job | null;
  fetchJobById: (id: string) => Promise<void>;
   fetchPublicJobById: (id: string) => Promise<void>;

  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'publishedAt' | 'applicants'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => void;

  publishJob: (id: string) => void;
  fetchJobs: () => Promise<void>;
  loading: boolean;
  resumeUrl: null,
  resumeContent: null,
  organizationProfile: any;
  profileLoading: boolean;
  fetchOrganizationProfile: () => Promise<void>;
  uploadResume: (file: File) => Promise<string | null>;

  updateCandidateStatus: (id: string, status: string) => void;
  updateCandidateScore: (id: string, score: number) => void;
  addCandidateTags: (id: string, tags: string[]) => void;

  startInterview: (name: string, email: string, jobId: string) => void;
  endInterview: () => void;
  addInterviewMessage: (message: { speaker: 'AI' | 'Candidate'; text: string }) => void;
  setIsSpeaking: (isSpeaking: boolean, speakerType: 'AI' | 'Candidate' | null) => void;

  moveCandidateToStage: (candidateId: string, newStatus: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  updateOrganization: async (data: any) => {
    try {
      const res = await api.put('/auth/updateprofile', data);

      const updated = res.data.data || res.data;

      set({
        organizationProfile: updated,
      });

    } catch (error: any) {
      console.error(
        'Update org error:',
        error.response?.data || error.message
      );
    }
  },
  organizationProfile: null,
  profileLoading: false,
  fetchOrganizationProfile: async () => {
    try {
      set({ profileLoading: true });

      const res = await api.get('/auth/getprofile'); // 🔥 your backend endpoint

      const profile = res.data.data || res.data;

      set({
        organizationProfile: profile,

        // Optional: auto sync user basic info


        // Optional: if you want templates also synced

      });

    } catch (error: any) {
      console.error(
        'Fetch profile error:',
        error.response?.data || error.message
      );
    } finally {
      set({ profileLoading: false });
    }
  },

  retellAccessToken: null,
  callId: null,
  callLoading: false,
  createRetellCall: async (cid, jobId) => {
    try {
      set({ callLoading: true });

      const res = await api.post('/interview/start', {
        jobId,
        candidateId: cid
      });
      // 🔥 your backend endpoint

      const token = res.data?.connectionDetails.accessToken;
      const callId = res.data?.connectionDetails.callId;

      set({ retellAccessToken: token });
      set({ callId: callId });

      return token;
    } catch (error: any) {
      console.error('Retell call error:', error.response?.data || error.message);
      return null;
    } finally {
      set({ callLoading: false });

    }
  },
  fetchTemplates: async () => {
    try {
      set({ templatesLoading: true });

      const res = await api.get('auth/gettemp');

      set({
        templates: res.data.templates || res.data,
      });

    } catch (error: any) {
      console.error(
        'Fetch templates error:',
        error.response?.data || error.message
      );
    } finally {
      set({ templatesLoading: false });
    }
  },
  saveTemplate: async (data: any) => {
    try {
      set({ templatesLoading: true });

      const res = await api.post('auth/updatetemp', data);

      const updatedTemplates = res.data.templates;

      // regroup by status
      const grouped = {
        Applied: [],
        Shortlisted: [],
        Interviewed: [],
        Hired: [],
        Rejected: [],
      };

      updatedTemplates.forEach((tpl: any) => {
        if (!grouped[tpl.status]) {
          grouped[tpl.status] = [];
        }
        grouped[tpl.status].push(tpl);
      });

      set({ templates: grouped });

    } catch (error: any) {
      console.error(
        'Save template error:',
        error.response?.data || error.message
      );
    } finally {
      set({ templatesLoading: false });
    }
  },

  uploadResume: async (file: File) => {
    try {
      set({ loading: true });

      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/candidates/resume-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data)
      const url = res.data.url;
      const text = res.data.text;

      set({ resumeUrl: url, resumeContent: text });

      return url;
    } catch (error: any) {
      console.error(
        "Resume upload error:",
        error.response?.data || error.message
      );
      return null;
    } finally {
      set({ loading: false });
    }
  },
  fetchCandidates: async () => {

    try {
      set({ loading: true });

      const res = await api.get('/candidates/getall'); // 🔥 your backend endpoint

      console.log(res);


      set({
        candidates: res.data.candidates || res.data, // adjust based on backend
      });

    } catch (error: any) {
      console.error(
        'Fetch candidates error:',
        error.response?.data || error.message
      );
    } finally {
      set({ loading: false });
    }
  },
  currentCandidate: null,
  fetchCandidateById: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/candidates/${id}`); // 🔥 your backend endpoint

      console.log(res);

      set({
        currentCandidate: res.data.candidate || res.data, // adjust based on backend
      });

    } catch (error: any) {
      console.error(
        'Fetch candidates error:',
        error.response?.data || error.message
      );
    } finally {
      set({ loading: false });
    }
  },
  endRetellCall: async () => {
    try {
      const { callId } = get(); // ✅ get from store

      set({ callLoading: true });

      const res = await api.post('/interview/end', {
        callId: callId,
      });
      // 🔥 your backend endpoint



      return 'ended';
    } catch (error: any) {
      console.error('Retell call error:', error.response?.data || error.message);
      return null;
    } finally {
      set({ callLoading: false });

    }
  },
  user: {
    id: '',
    email: '',
    role: null,
  },
  jobs: [],
  candidates: [],
  interviewSession: {
    candidateId: null,
    jobId: null,
    isActive: false,
    startTime: null,
    messages: [],
    isSpeaking: false,

    speakerType: null,
  },

  setUser: (user) => set({ user }),

  logout: () => set({
    user: { id: '', email: '', role: null }
  }),
  currentJob: null,

  fetchJobById: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/jobs/${id}`);
      console.log(res)

      set({ currentJob: res.data.job || res.data });

    } catch (error: any) {
      console.error('Fetch job error:', error.response?.data || error.message);
    } finally {
      set({ loading: false });
    }
  },


  fetchPublicJobById: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/jobs/public/${id}`);
      console.log(res)

      set({ currentJob: res.data.job || res.data });

    } catch (error: any) {
      console.error('Fetch job error:', error.response?.data || error.message);
    } finally {
      set({ loading: false });
    }
  },

  addJob: (job) => set((state) => ({
    jobs: [
      ...state.jobs,
      {
        ...job,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        publishedAt: null,
        applicants: 0,
      },
    ],
  })),
  isAuthenticated: false,
  authLoading: true,

  initAuth: () => {
    const token = localStorage.getItem('token');

    set({
      isAuthenticated: !!token,
      authLoading: false,
    });
  },
  updateJob: async (id, updates) => {
    try {
      const res = await api.put(`/jobs/${id}`, updates);

      const updatedJob = res.data.job || res.data;

      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === id ? { ...job, ...updatedJob } : job
        ),
        currentJob:
          state.currentJob?.id === id
            ? { ...state.currentJob, ...updatedJob }
            : state.currentJob,
      }));
    } catch (error: any) {
      console.error('Update job error:', error.response?.data || error.message);
    }
  },
  loading: false,

  fetchJobs: async () => {
    try {
      set({ loading: true });

      const res = await api.get('/jobs');

      // adjust depending on backend response
      console.log(res)
      set({ jobs: res.data.jobs || res.data });

    } catch (error: any) {
      console.error('Fetch jobs error:', error.response?.data || error.message);
    } finally {
      set({ loading: false });
    }
  },

  deleteJob: async (id) => {
    try {
      set({ loading: true });

      await api.delete(`/jobs/${id}`); // 🔥 backend delete endpoint

      // remove from state after successful delete
      set((state) => ({
        jobs: state.jobs.filter((job) => job._id !== id),
        currentJob: state.currentJob?._id === id ? null : state.currentJob,
      }));

    } catch (error: any) {
      console.error(
        'Delete job error:',
        error.response?.data || error.message
      );
    } finally {
      set({ loading: false });
    }
  },

  publishJob: (id) => set((state) => ({
    jobs: state.jobs.map((job) =>
      job.id === id
        ? { ...job, status: 'Active', publishedAt: new Date().toISOString().split('T')[0] }
        : job
    ),
  })),

  updateCandidateStatus: async (id: string, status: string) => {
    try {
      set({ loading: true });

      // 🔥 Call backend API
      const res = await api.patch(`/candidates/${id}/status`, {
        status,
      });

      const updatedCandidate = res.data.candidate || res.data;

      // ✅ Update Zustand state
      set((state) => ({
        candidates: state.candidates.map((candidate: any) =>
          candidate._id === id
            ? { ...candidate, ...updatedCandidate }
            : candidate
        ),
        currentCandidate:
          state.currentCandidate?._id === id
            ? { ...state.currentCandidate, ...updatedCandidate }
            : state.currentCandidate,
      }));

    } catch (error: any) {
      console.error(
        'Update candidate status error:',
        error.response?.data || error.message
      );
    } finally {
      set({ loading: false });
    }
  },

  updateCandidateScore: (id, score) => set((state) => ({
    candidates: state.candidates.map((candidate) =>
      candidate.id === id ? { ...candidate, aiScore: score } : candidate
    ),
  })),

  addCandidateTags: (id, tags) => set((state) => ({
    candidates: state.candidates.map((candidate) =>
      candidate.id === id ? { ...candidate, tags: [...candidate.tags, ...tags] } : candidate
    ),
  })),

  startInterview: async (name, email, jobId) => {
    try {
      set({ loading: true });

      const { resumeUrl, resumeContent } = get(); // ✅ get uploaded resume

      if (!resumeUrl) {
        throw new Error("Resume not uploaded");
      }

      const res = await api.post("/candidates/apply", {
        jobId,
        name,
        email,
        resumeContent,
        resumeUrl, // ✅ added
      });

      localStorage.setItem("c_id", res.data._id);

    } catch (error: any) {
      console.error(
        "Start interview error:",
        error.response?.data || error.message
      );
    } finally {
      set({ loading: false });
    }
  },

  endInterview: () => set((state) => ({
    interviewSession: {
      ...state.interviewSession,
      isActive: false,
    },
  })),

  addInterviewMessage: (message) => set((state) => ({
    interviewSession: {
      ...state.interviewSession,
      messages: [
        ...state.interviewSession.messages,
        {
          ...message,
          id: state.interviewSession.messages.length + 1,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    },
  })),

  setIsSpeaking: (isSpeaking, speakerType) => set((state) => ({
    interviewSession: {
      ...state.interviewSession,
      isSpeaking,
      speakerType,
    },
  })),

  moveCandidateToStage: (candidateId, newStatus) => set((state) => ({
    candidates: state.candidates.map((candidate) =>
      candidate._id === candidateId ? { ...candidate, status: newStatus } : candidate
    ),
  })),
}));
