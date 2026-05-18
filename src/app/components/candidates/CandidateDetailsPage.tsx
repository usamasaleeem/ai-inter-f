import { useParams, useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ArrowLeft, Mail, Calendar, CheckCircle, XCircle, Star, Briefcase, MapPin, Clock, Loader2 } from 'lucide-react';
import { formatDate, getScoreColor, getScoreBgColor, getAvatarColor } from '../../../lib/helpers';
import { mockTranscript, mockAIAnalysis } from '../../../lib/mockData';
import { useEffect, useState } from 'react';
import { InterviewVideoPlayer } from './InterviewVideoPlayer';

export function CandidateDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWorkExpIndex, setSelectedWorkExpIndex] = useState(0);
const [isInviting, setIsInviting] = useState(false);
const [isShortlisting, setIsShortlisting] = useState(false);
const [isRejecting, setIsRejecting] = useState(false);

  const updateCandidateStatus = useStore((state) => state.updateCandidateStatus);
  const fetchCandidateById = useStore((state) => state.fetchCandidateById);
const transformInterviewsToChunks = (interviews: any[]) => {
  console.log(interviews)
  if (!interviews || interviews.length === 0) return [];
  
  return interviews.map((interview, index) => ({
    url: interview.url,
    duration: 40, // 40 seconds per chunk as specified
    index: index,
  }));
};
  const getInterview = useStore((state) => state.getInterview);

  const interviews = useStore((state) => state.interviews);
  const candidate = useStore((state) => state.currentCandidate);

  function parseTranscript(raw: string | undefined) {
    if (!raw) return [];

    const lines = raw.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
      const [speaker, ...rest] = line.split(':');
      const text = rest.join(':').trim();

      return {
        id: index.toString(),
        speaker: speaker.trim() === 'Agent' ? 'AI' : 'User',
        text,
        timestamp: formatTime(index * 5),
      };
    });
  }

  function formatTime(seconds: number) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  const transcriptData = parseTranscript(candidate?.transcript);
useEffect(() => {
   getInterview(candidate)

  return () => {
    
  }
}, [candidate])

  useEffect(() => {
    if (id) {
      fetchCandidateById(id);
      


    }
  }, [id, fetchCandidateById]);

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">Candidate not found</p>
          <Button onClick={() => navigate('/dashboard/shortlist')} className="mt-4">
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

const handleStatusChange = async (newStatus: string) => {
  // Set loading state based on status
  if (newStatus === 'Invited-For-Interview') {
    setIsInviting(true);
  } else if (newStatus === 'Shortlisted') {
    setIsShortlisting(true);
  } else if (newStatus === 'Rejected') {
    setIsRejecting(true);
  }
  
  try {
    await updateCandidateStatus(candidate._id, newStatus);
    // Optionally show success message or refresh data
  } catch (error) {
    console.error('Failed to update status:', error);
  } finally {
    // Clear loading states
    setIsInviting(false);
    setIsShortlisting(false);
    setIsRejecting(false);
  }
};


  // Format date safely
  const formatDateSafe = (date: any) => {
    if (!date) return 'N/A';
    return formatDate(date);
  };

  // Get work experience dates
  const getWorkDateRange = (work: any) => {
    const start = work.startDate ? formatDate(work.startDate) : 'Start Date';
    const end = work.endDate ? formatDate(work.endDate) : 'Present';
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/shortlist')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl tracking-tight">Candidate Profile</h1>
        </div>
    
<div className="flex gap-2">
  <Button
    variant="outline"
    onClick={() => handleStatusChange('Invited-For-Interview')}
    disabled={isInviting || isShortlisting || isRejecting}
    className="gap-2"
  >
    {isInviting ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Inviting...</span>
      </>
    ) : (
      <>
        <Calendar className="h-4 w-4" />
        <span>Invite For Interview</span>
      </>
    )}
  </Button>
  
  <Button
    variant="outline"
    onClick={() => handleStatusChange('Shortlisted')}
    disabled={isInviting || isShortlisting || isRejecting}
    className="gap-2"
  >
    {isShortlisting ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Shortlisting...</span>
      </>
    ) : (
      <>
        <CheckCircle className="h-4 w-4" />
        <span>Shortlist</span>
      </>
    )}
  </Button>
  
  <Button
    variant="outline"
    onClick={() => handleStatusChange('Rejected')}
    disabled={isInviting || isShortlisting || isRejecting}
    className="gap-2 text-red-600 hover:text-red-700"
  >
    {isRejecting ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Rejecting...</span>
      </>
    ) : (
      <>
        <XCircle className="h-4 w-4" />
        <span>Reject</span>
      </>
    )}
  </Button>
</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidate Info */}
 {/* Left Column - Candidate Info */}
<Card className="border-gray-200 lg:col-span-1 overflow-hidden">
  {/* Header Gradient */}
  <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
  </div>

  <CardContent className="pt-0 pb-6 relative">
    {/* Avatar - Overlapping the gradient */}
    <div className="flex justify-center -mt-10 mb-4">
      <div className="relative">
        <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
          <AvatarImage src={candidate.avatar} alt={candidate.name} />
          <AvatarFallback className={getAvatarColor(candidate.name)}>
            {candidate.name?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
        {/* Online Status Dot */}
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
      </div>
    </div>

    {/* Name & Role */}
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {candidate.name || 'Unknown Candidate'}
      </h2>
      <div className="flex items-center justify-center gap-2">
        <Briefcase className="h-3.5 w-3.5 text-gray-400" />
        <p className="text-sm text-gray-600 font-medium">
          {candidate.role || candidate.jobTitle || 'No role specified'}
        </p>
      </div>
    </div>

    {/* AI Score - Premium Card */}
    {candidate.aiAnalysis?.overallScore && (
      <div className="relative mb-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/60">
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 text-xs font-medium text-amber-600 border border-amber-200">
            <Star className="h-3 w-3 fill-amber-500" />
            AI Rated
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Overall Score</div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${getScoreColor(candidate.aiAnalysis.overallScore)}`}>
            {candidate.aiAnalysis.overallScore}
          </span>
          <span className="text-sm text-gray-500 mb-1">/100</span>
        </div>
        <Progress 
          value={candidate.aiAnalysis.overallScore} 
          className="mt-2 h-1.5" 
          indicatorClassName={getScoreBgColor(candidate.aiAnalysis.overallScore)}
        />
      </div>
    )}

    {/* Status Badge */}
    <div className="mb-6">
      <Badge 
        className="w-full justify-center py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
        variant="outline"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            candidate.status === 'Accepted' ? 'bg-green-500' :
            candidate.status === 'Rejected' ? 'bg-red-500' :
            candidate.status === 'Shortlisted' ? 'bg-amber-500' :
            candidate.status === 'Invited-For-Interview' ? 'bg-blue-500' :
            'bg-gray-500'
          }`} />
          {candidate.status || 'Applied'}
        </div>
      </Badge>
    </div>

    {/* Contact Info - Premium Cards */}
    <div className="space-y-2 mb-6">
      {candidate.email && (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
          <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Email</p>
            <p className="text-sm text-gray-700 font-medium truncate">{candidate.email}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
        <div className="p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
          <Calendar className="h-4 w-4 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">Applied Date</p>
          <p className="text-sm text-gray-700 font-medium">{formatDateSafe(candidate.appliedAt)}</p>
        </div>
      </div>

      {candidate.experienceYears && (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
          <div className="p-2 rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Experience</p>
            <p className="text-sm text-gray-700 font-medium">{candidate.experienceYears} years</p>
          </div>
        </div>
      )}
    </div>

    {/* Skills Section - Enhanced */}
    {candidate.skillsAssessment && candidate.skillsAssessment.length > 0 && (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</p>
          <span className="text-xs text-gray-400">{candidate.skillsAssessment.length} skills</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {candidate.skillsAssessment.map((skill: any, index: number) => (
            <Badge 
              key={skill.skillName || index} 
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-default"
            >
              {skill.skillName}
              {skill.score && (
                <span className="ml-1.5 text-xs text-gray-500">• {skill.score}%</span>
              )}
            </Badge>
          ))}
        </div>
      </div>
    )}

    {/* Tags Section - Enhanced */}
    {candidate.tags && candidate.tags.length > 0 && (
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {candidate.tags.map((tag: string) => (
            <Badge 
              key={tag} 
              variant="outline"
              className="bg-gradient-to-r from-gray-50 to-white text-gray-600 border-gray-200 hover:border-gray-300 cursor-default"
            >
              # {tag}
            </Badge>
          ))}
        </div>
      </div>
    )}

    {/* Quick Actions */}
  
  </CardContent>
</Card>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="experience">Work Experience</TabsTrigger>
      {/*  <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="recording">Recording</TabsTrigger>
               
      */
      }
      
           <TabsTrigger value="resume">Resume</TabsTrigger>
           <TabsTrigger value="interview-video">Interview Video</TabsTrigger> {/* New tab */}
           

            </TabsList>

            {/* AI Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              {/* Overall Assessment */}
              {candidate.aiAnalysis && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Overall Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      {candidate.aiAnalysis.overallScore && (
                        <div className={`text-4xl ${getScoreColor(candidate.aiAnalysis.overallScore)}`}>
                          {candidate.aiAnalysis.overallScore}
                        </div>
                      )}
                      <div className="flex-1">
                        {candidate.aiAnalysis.recommendation && (
                          <Badge className="bg-green-600 mb-2">{candidate.aiAnalysis.recommendation}</Badge>
                        )}
                        <p className="text-sm text-gray-600">{candidate.aiAnalysis.summary || 'No summary available'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Assessment */}
              {candidate.skillsAssessment && candidate.skillsAssessment.length > 0 && (
                <Card className="relative overflow-hidden border border-gray-200/60 bg-white/70 backdrop-blur-xl shadow-sm rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-60 pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      Skills Assessment
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      AI-evaluated technical and domain expertise
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-6">
                    {candidate.skillsAssessment.map((skill: any, i: number) => {
                      const value = skill.score || 0;
                      return (
                        <div key={skill.skillName || i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700">
                                {skill.skillName || 'Unknown Skill'}
                              </span>
                              {skill.level && (
                                <Badge variant="outline" className="text-xs">
                                  {skill.level}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {value}%
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${value > 80
                                ? "bg-green-100 text-green-700"
                                : value > 60
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                                }`}>
                                {value > 80 ? "Expert" : value > 60 ? "Intermediate" : "Beginner"}
                              </span>
                            </div>
                          </div>
                          <div className="relative h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${value > 80
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : value > 60
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  : "bg-gradient-to-r from-red-500 to-pink-500"
                                }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Skill Score</span>
                      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {Math.round(
                          candidate.skillsAssessment.reduce((acc: number, s: any) => acc + (s.score || 0), 0) /
                          candidate.skillsAssessment.length
                        )}
                        %
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strengths & Weaknesses */}
              {(candidate.aiAnalysis?.strengths?.length > 0 || candidate.aiAnalysis?.weaknesses?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidate.aiAnalysis.strengths && candidate.aiAnalysis.strengths.length > 0 && (
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle>Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {candidate.aiAnalysis.strengths.map((strength: string, index: number) => (
                            <li key={index} className="flex gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {candidate.aiAnalysis.weaknesses && candidate.aiAnalysis.weaknesses.length > 0 && (
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle>Areas for Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {candidate.aiAnalysis.weaknesses.map((weakness: string, index: number) => (
                            <li key={index} className="flex gap-2 text-sm">
                              <div className="h-4 w-4 rounded-full bg-yellow-200 shrink-0 mt-0.5" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Performance Metrics */}
              {candidate.performanceMetrics && (
                <Card className="relative overflow-hidden border border-gray-200/60 bg-white/70 backdrop-blur-xl shadow-sm rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-60 pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      Performance Metrics
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      AI-evaluated candidate strengths across key dimensions
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-6">
                    {[
                      {
                        label: "Communication",
                        value: candidate.performanceMetrics.communication || 0,
                        color: "from-blue-500 to-indigo-500",
                      },
                      {
                        label: "Technical Depth",
                        value: candidate.performanceMetrics.technicalDepth || 0,
                        color: "from-purple-500 to-pink-500",
                      },
                      {
                        label: "Problem Solving",
                        value: candidate.performanceMetrics.problemSolving || 0,
                        color: "from-emerald-500 to-teal-500",
                      },
                      {
                        label: "Cultural Fit",
                        value: candidate.performanceMetrics.culturalFit || 0,
                        color: "from-orange-500 to-red-500",
                      },
                    ].map((metric, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {metric.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {metric.value}%
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${metric.value > 80
                              ? "bg-green-100 text-green-700"
                              : metric.value > 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                              }`}>
                              {metric.value > 80 ? "Excellent" : metric.value > 60 ? "Good" : "Needs Work"}
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-700 ease-out`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Score</span>
                      <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {Math.round(
                          ((candidate.performanceMetrics.communication || 0) +
                            (candidate.performanceMetrics.technicalDepth || 0) +
                            (candidate.performanceMetrics.problemSolving || 0) +
                            (candidate.performanceMetrics.culturalFit || 0)) / 4
                        )}
                        %
                      </div>
                    </div>
                  </CardContent>

                </Card>
              )}

              {/* Fallback message if no analysis data */}
              {!candidate.aiAnalysis && !candidate.skillsAssessment?.length && !candidate.performanceMetrics && (
                <Card className="border-gray-200">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No AI analysis data available for this candidate.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Work Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <p className="text-sm text-gray-500">
                    Professional history and employment details
                  </p>
                </CardHeader>
                <CardContent>
                  {candidate.workExperience && candidate.workExperience.length > 0 ? (
                    <div className="space-y-6">
                      {/* Experience Timeline */}
                      <div className="relative">
                        {candidate.workExperience.map((work: any, index: number) => (
                          <div key={index} className="relative pl-8 pb-8 last:pb-0">
                            {/* Timeline line */}
                            {index < candidate.workExperience.length - 1 && (
                              <div className="absolute left-2 top-8 bottom-0 w-px bg-gray-200" />
                            )}
                            {/* Timeline dot */}
                            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100" />

                            {/* Experience Content */}
                            <div className="space-y-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {work.jobTitle || 'Position not specified'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {work.companyName || 'Company not specified'}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                {work.startDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{getWorkDateRange(work)}</span>
                                  </div>
                                )}
                                {work.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{work.location}</span>
                                  </div>
                                )}
                                {work.employmentType && (
                                  <div className="flex items-center gap-1">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    <span>{work.employmentType}</span>
                                  </div>
                                )}
                              </div>

                              {work.description && (
                                <p className="text-sm text-gray-600 mt-2">{work.description}</p>
                              )}

                              {work.technologies && work.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {work.technologies.map((tech: string, techIndex: number) => (
                                    <Badge key={techIndex} variant="secondary" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No work experience listed</p>
                      <p className="text-sm text-gray-400 mt-1">This candidate hasn't added any work history</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transcript Tab */}
            <TabsContent value="transcript">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Interview Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  {transcriptData.length > 0 ? (
                    <div className="space-y-4">
                      {transcriptData.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.speaker === 'AI' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-lg ${message.speaker === 'AI'
                              ? 'bg-gray-100'
                              : 'bg-blue-50 border border-blue-200'
                              }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {message.speaker}
                              </span>
                              <span className="text-xs text-gray-400">{message.timestamp}</span>
                            </div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No transcript available for this interview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recording Tab */}
            <TabsContent value="recording">
              <Card className="border-gray-200 overflow-hidden">
                <CardHeader className="border-b border-gray-100 bg-white">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    Interview Recording
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {candidate?.recordingUrl ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="mb-6">
                          <div className="flex items-center justify-center gap-1 h-20">
                            {[...Array(40)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-gradient-to-t from-blue-400 to-blue-500 rounded-full"
                                style={{
                                  height: `${Math.sin(i * 0.5) * 25 + 15}px`,
                                  opacity: 0.7
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <audio controls className="w-full" src={candidate.recordingUrl}>
                            Your browser does not support the audio element.
                          </audio>
                          <div className="flex items-center justify-between text-sm pt-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-green-600 font-medium">Recording available</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {['1x', '1.25x', '1.5x', '2x'].map((speed) => (
                                <button
                                  key={speed}
                                  className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
                                  onClick={() => {
                                    const audio = document.querySelector('audio');
                                    if (audio) audio.playbackRate = parseFloat(speed);
                                  }}
                                >
                                  {speed}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="bg-gray-50 rounded-full p-6 mb-4 border border-gray-200">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium mt-4">No Recording Available</p>
                      <p className="text-sm text-gray-400 mt-1">This interview wasn't recorded or the recording is unavailable</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

{/* Interview Video Tab */}
{/* Interview Video Tab */}
<TabsContent value="interview-video" className="space-y-6">
  {interviews?.length > 0 ? (
    <InterviewVideoPlayer
      chunks={transformInterviewsToChunks(interviews)}
            transcript={transcriptData}
      onError={(error) => console.error('Video player error:', error)}
    />
  ) : (
    <Card className="border-gray-200">
      <CardContent className="py-12 text-center">
        <p className="text-gray-500">No interview video available</p>
      </CardContent>
    </Card>
  )}
  
</TabsContent>
            {/* Resume Tab */}
            <TabsContent value="resume">
              <Card className="border-gray-200 overflow-hidden">
                <CardHeader>
                  <CardTitle>Candidate Resume</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {candidate?.resumeUrl ? (
                    <div className="space-y-4">
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(candidate.resumeUrl)}&embedded=true`}
                        width="100%"
                        height="600px"
                        className="rounded-lg border"
                        title="Resume Viewer"
                      />
                
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="bg-gray-50 rounded-full p-6 mb-4 border border-gray-200">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 12h6m-6 4h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No Resume Available</p>
                      <p className="text-sm text-gray-400 mt-1">
                        This candidate has not uploaded a resume
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}