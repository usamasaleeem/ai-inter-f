import { useStore } from '../../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  BriefcaseIcon, Users, CheckCircle, Star, TrendingUp, ArrowUpRight,
  UserCheck, Clock, Zap, Filter, MoreHorizontal, ChevronRight,
  Calendar, Mail, Phone, MapPin, Award, Brain, BarChart3,
  Activity, Sparkles, Eye, ThumbsUp, FileText, Mic, Video
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

// Stripe-inspired color palette
const stripe = {
  bg: '#ffffff',
  border: '#e6e6e6',
  text: {
    primary: '#1a1f36',
    secondary: '#4f5b6e',
    tertiary: '#7f8b9e',
    accent: '#0066ff',
  },
  hover: '#f7f7f9',
};

export function DashboardOverview() {
  const navigate = useNavigate();
  const candidates = useStore((state) => state.candidates);
  const jobs = useStore((state) => state.jobs);
  const fetchJobs = useStore((state) => state.fetchJobs);
  const fetchCandidates = useStore((state) => state.fetchCandidates);

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  // Derived stats
  const activeJobs = jobs.filter((job) => job.status === 'Active' || job.status === 'Published').length;
  const totalCandidates = candidates.length;
  const interviewedCount = candidates.filter((c) => c.status === 'Interviewed').length;
  const shortlistedCount = candidates.filter((c) =>
    c.status === 'Shortlisted' ||
    c.aiAnalysis?.recommendation === 'Hire' ||
    c.aiAnalysis?.recommendation === 'Strong Hire'
  ).length;
  const avgAiScore = candidates.length > 0
    ? Math.round(candidates.reduce((acc, c) => acc + (c.aiAnalysis?.overallScore || 0), 0) / candidates.length)
    : 0;

  const recentCandidates = [...candidates]
    .sort((a, b) => new Date(b.appliedAt || b.createdAt).getTime() - new Date(a.appliedAt || a.createdAt).getTime())
    .slice(0, 4);

  const topPerformers = [...candidates]
    .sort((a, b) => (b.aiAnalysis?.overallScore || 0) - (a.aiAnalysis?.overallScore || 0))
    .slice(0, 3);

  const activeJobsList = jobs.filter((job) => job.status === 'Active' || job.status === 'Published').slice(0, 3);

  // Status badge styles
  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; dot: string }> = {
      Applied: { bg: '#f7f7f9', text: '#4f5b6e', dot: '#8a9bb5' },
      Interviewed: { bg: '#eef2ff', text: '#0066ff', dot: '#0066ff' },
      Shortlisted: { bg: '#e6f7e6', text: '#00a86b', dot: '#00a86b' },
      Hired: { bg: '#1a1f36', text: '#ffffff', dot: '#00a86b' },
      Rejected: { bg: '#fef2f2', text: '#dc2626', dot: '#dc2626' },
    };
    return styles[status] || styles.Applied;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* Header - Stripe style */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ color: stripe.text.primary }}>
              Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: stripe.text.secondary }}>
              Overview of your hiring pipeline and candidate analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md transition-all"
              style={{
                backgroundColor: stripe.bg,
                border: `1px solid ${stripe.border}`,
                color: stripe.text.secondary
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = stripe.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = stripe.bg}
            >
              Export
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-md transition-all"
              style={{
                backgroundColor: stripe.text.primary,
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              New Job Posting
            </button>
          </div>
        </div>

        {/* Stats Grid - 5 key metrics */}
        <div className="grid grid-cols-5 gap-5 mb-10">
          {[
            { label: 'Active jobs', value: activeJobs, icon: BriefcaseIcon, change: '+2', changeText: 'vs last month' },
            { label: 'Total candidates', value: totalCandidates, icon: Users, change: '+12', changeText: 'new this week' },
            { label: 'Avg. AI score', value: avgAiScore, icon: Brain, suffix: '/100', change: '+5', changeText: 'vs average' },
            { label: 'Interviewed', value: interviewedCount, icon: Calendar, change: '+8', changeText: 'completion rate' },
            { label: 'Shortlisted', value: shortlistedCount, icon: ThumbsUp, change: '23%', changeText: 'selection rate' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl p-5"
              style={{ backgroundColor: stripe.bg, border: `1px solid ${stripe.border}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-4 w-4" style={{ color: stripe.text.tertiary }} />
                <span className="text-xs font-medium" style={{ color: '#00a86b' }}>
                  ↑ {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-semibold tracking-tight" style={{ color: stripe.text.primary }}>
                  {stat.value}{stat.suffix || ''}
                </p>
                <p className="text-xs" style={{ color: stripe.text.tertiary }}>{stat.label}</p>
                <p className="text-[11px]" style={{ color: stripe.text.tertiary }}>{stat.changeText}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left column - 2/3 width */}
          <div className="col-span-2 space-y-8">

            {/* Recent Activity Feed */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium" style={{ color: stripe.text.primary }}>Recent activity</h2>
                <button className="text-xs font-medium" style={{ color: stripe.text.accent }}>View all →</button>
              </div>
              <div className="space-y-3">
                {recentCandidates.map((candidate, idx) => {
                  const statusStyle = getStatusStyle(candidate.status);
                  const jobTitle = jobs.find(j => j._id === candidate.jobId)?.title || 'Position';
                  return (
                    <motion.div
                      key={candidate._id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-xl p-4 cursor-pointer transition-all"
                      style={{ backgroundColor: stripe.bg, border: `1px solid ${stripe.border}` }}
                      onClick={() => navigate(`/dashboard/candidates/${candidate._id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = stripe.hover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = stripe.bg}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#f0f0f0', color: stripe.text.secondary }}>
                            {candidate.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{ color: stripe.text.primary }}>{candidate.name}</p>
                              <span className="text-xs" style={{ color: stripe.text.tertiary }}>• {jobTitle}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                                <span className="text-xs" style={{ color: stripe.text.tertiary }}>{candidate.status}</span>
                              </div>
                              {candidate.aiAnalysis?.overallScore && (
                                <>
                                  <span className="text-xs" style={{ color: stripe.text.tertiary }}>•</span>
                                  <span className="text-xs font-mono" style={{ color: stripe.text.secondary }}>Score: {candidate.aiAnalysis.overallScore}</span>
                                </>
                              )}
                              <span className="text-xs" style={{ color: stripe.text.tertiary }}>•</span>
                              <span className="text-xs" style={{ color: stripe.text.tertiary }}>
                                {formatDistanceToNow(new Date(candidate.appliedAt || candidate.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4" style={{ color: stripe.text.tertiary }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* AI Insights Section */}
            <div>
              <h2 className="text-base font-medium mb-4" style={{ color: stripe.text.primary }}>AI intelligence</h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-xl p-5" style={{ backgroundColor: stripe.bg, border: `1px solid ${stripe.border}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <Sparkles className="h-5 w-5" style={{ color: stripe.text.accent }} />
                    <Badge style={{ backgroundColor: '#eef2ff', color: stripe.text.accent, border: 'none' }}>Top insight</Badge>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: stripe.text.secondary }}>
                    Strongest skill cluster among candidates is <span className="font-medium" style={{ color: stripe.text.primary }}>
                      {Object.entries(
                        candidates.flatMap(c => c.skills || []).reduce((acc, skill) => {
                          acc[skill] = (acc[skill] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'React'}
                    </span> with {Math.round((Object.entries(
                      candidates.flatMap(c => c.skills || []).reduce((acc, skill) => {
                        acc[skill] = (acc[skill] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).sort((a, b) => b[1] - a[1])[0]?.[1] / totalCandidates * 100) || 0)}% of candidates.
                  </p>
                  <div className="h-1 w-full rounded-full mt-2" style={{ backgroundColor: '#f0f0f0' }}>
                    <div className="h-1 rounded-full" style={{ width: '68%', backgroundColor: stripe.text.accent }} />
                  </div>
                </div>
                <div className="rounded-xl p-5" style={{ backgroundColor: stripe.bg, border: `1px solid ${stripe.border}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <BarChart3 className="h-5 w-5" style={{ color: stripe.text.accent }} />
                    <Badge style={{ backgroundColor: '#f7f7f9', color: stripe.text.secondary, border: 'none' }}>Pipeline</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: stripe.text.tertiary }}>Applied → Interviewed</span>
                      <span className="font-mono" style={{ color: stripe.text.primary }}>
                        {Math.round((interviewedCount / totalCandidates) * 100) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: stripe.text.tertiary }}>Interviewed → Shortlisted</span>
                      <span className="font-mono" style={{ color: stripe.text.primary }}>
                        {interviewedCount ? Math.round((shortlistedCount / interviewedCount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - 1/3 width */}
          <div className="space-y-8">

            {/* Top performers */}
            <div>
              <h2 className="text-base font-medium mb-4" style={{ color: stripe.text.primary }}>Top performers</h2>
              <div className="space-y-3">
                {topPerformers.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="rounded-xl p-4 cursor-pointer transition-all"
                    style={{ backgroundColor: stripe.bg, border: `1px solid ${stripe.border}` }}
                    onClick={() => navigate(`/dashboard/candidates/${candidate._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ backgroundColor: '#f0f0f0' }}>
                        {candidate.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: stripe.text.primary }}>{candidate.name}</p>
                        <p className="text-xs" style={{ color: stripe.text.tertiary }}>
                          {jobs.find(j => j._id === candidate.jobId)?.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold font-mono" style={{ color: stripe.text.primary }}>
                          {candidate.aiAnalysis?.overallScore || 0}
                        </p>
                        <p className="text-[10px]" style={{ color: stripe.text.tertiary }}>AI score</p>
                      </div>
                    </div>
                    {candidate.aiAnalysis?.recommendation && (
                      <Badge className="text-[10px]" style={{ backgroundColor: '#eef2ff', color: stripe.text.accent, border: 'none' }}>
                        {candidate.aiAnalysis.recommendation}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active jobs */}
            <div>
              <h2 className="text-base font-medium mb-4" style={{ color: stripe.text.primary }}>Active jobs</h2>
              <div className="space-y-3">
                {activeJobsList.map((job) => {
                  const applicantCount = candidates.filter(c => c.jobId === job._id).length;
                  return (
                    <div
                      key={job._id}
                      className="rounded-xl p-4 cursor-pointer transition-all"
                      style={{ backgroundColor: stripe.bg, border: `1px solid ${stripe.border}` }}
                      onClick={() => navigate(`/dashboard/jobs/${job._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium" style={{ color: stripe.text.primary }}>{job.title}</p>
                        <span className="text-xs font-mono" style={{ color: stripe.text.secondary }}>{applicantCount} apps</span>
                      </div>
                      <p className="text-xs mb-3" style={{ color: stripe.text.tertiary }}>{job.experienceLevel}</p>
                      <div className="flex items-center gap-2">
                        <Badge style={{ backgroundColor: '#f7f7f9', color: stripe.text.secondary, border: 'none' }}>{job.interviewType}</Badge>
                        {job.salaryRange && (
                          <Badge style={{ backgroundColor: '#f7f7f9', color: stripe.text.secondary, border: 'none' }}>{job.salaryRange}</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button
                  className="w-full rounded-xl py-3 text-sm font-medium transition-all"
                  style={{ backgroundColor: stripe.hover, color: stripe.text.accent }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = stripe.hover}
                  onClick={() => navigate('/dashboard/jobs/new')}
                >
                  + Create new job posting
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="rounded-xl p-5" style={{ backgroundColor: stripe.bg, border: `1px solid ${stripe.border}` }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4" style={{ color: stripe.text.accent }} />
                <h3 className="text-sm font-medium" style={{ color: stripe.text.primary }}>Pipeline velocity</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: stripe.text.tertiary }}>Avg. time to interview</span>
                    <span className="font-mono" style={{ color: stripe.text.primary }}>4.2 days</span>
                  </div>
                  <div className="h-1 w-full rounded-full" style={{ backgroundColor: '#f0f0f0' }}>
                    <div className="h-1 rounded-full" style={{ width: '42%', backgroundColor: stripe.text.accent }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: stripe.text.tertiary }}>Avg. response time</span>
                    <span className="font-mono" style={{ color: stripe.text.primary }}>1.8 days</span>
                  </div>
                  <div className="h-1 w-full rounded-full" style={{ backgroundColor: '#f0f0f0' }}>
                    <div className="h-1 rounded-full" style={{ width: '18%', backgroundColor: stripe.text.accent }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}