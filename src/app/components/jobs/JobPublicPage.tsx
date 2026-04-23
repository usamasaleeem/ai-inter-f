import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { BriefcaseIcon, DollarSign, Clock, Sparkles, CheckCircle, Mail, User, FileText } from 'lucide-react';
import logo from '../../../images/logo.svg';
import axios from "axios";

export function JobPublicPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const currentJob = useStore((state) => state.currentJob);
  const fetchPublicJobById = useStore((state) => state.fetchPublicJobById);
  const uploadResume = useStore((s) => s.uploadResume);
  const resumeUrl = useStore((s) => s.resumeUrl);
  const resumeContent = useStore((s) => s.resumeContent);
  
  const [resume, setResume] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<{name: string, email: string} | null>(null);
  
  const loading = useStore((state) => state.loading);
  const startInterview = useStore((state) => state.startInterview);
  const autoAiInterview = currentJob?.autoAiInterview;

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      if (jobId) {
        try {
          setError(null);
          await fetchPublicJobById(jobId);
        } catch (err) {
          console.error("Error fetching job:", err);
          setError("Failed to load job details. Please try again.");
        }
      }
    };
    
    fetchJob();
  }, [jobId, fetchPublicJobById]);

  // Handle resume upload
  const handleResumeUpload = async () => {
    if (!resume) {
      setError("Please select a resume file first");
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      await uploadResume(resume);
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle apply/submit
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!name || !email) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (!resume && !resumeUrl) {
      setError("Please upload your resume");
      return;
    }
    
    try {
      await startInterview(name, email, currentJob._id);
      
      if (autoAiInterview) {
        // Direct AI Interview
        navigate(`/interview/${currentJob._id}`);
      } else {
        // Store application details for thank you page
        setSubmittedApplication({ name, email });
        setSuccess(true);
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Failed to submit application. Please try again.");
    }
  };

  // Show thank you page after successful application
  if (success && !autoAiInterview && submittedApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Intervo AI"
              className="mx-auto h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          <Card className="border-gray-200 shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Application Submitted!</CardTitle>
                <p className="text-gray-600">
                  Thank you for applying to {currentJob?.title}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{submittedApplication.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">{submittedApplication.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Resume Status</p>
                      <p className="font-medium text-green-600">✓ Uploaded Successfully</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Our team will review your application within 3-5 business days
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    You'll receive an email at {submittedApplication.email} with the next steps
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Check your inbox (and spam folder) for updates
                  </li>
                </ul>
              </div>

      
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Job not found
  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Job not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Intervo AI"
            className="mx-auto h-10 w-auto object-contain transition-all duration-300"
            onError={(e) => {
              console.error("Logo failed to load");
              e.currentTarget.style.display = 'none';
            }}
          />
          <p className="text-gray-600">Powered by AI</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{currentJob.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1">
                    <DollarSign className="h-3 w-3" />
                    {currentJob.salaryRange || "Not specified"}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {currentJob.experienceLevel || "Not specified"}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    {currentJob.interviewType || "Standard"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm mb-2 text-gray-600">About the Role</h3>
              <p className="text-sm leading-relaxed">{currentJob.description || "No description provided"}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm mb-3 text-gray-600">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentJob.skills && currentJob.skills.length > 0 ? (
                  currentJob.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No specific skills listed</p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm mb-3 text-gray-600">Interview Process</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm">
                      {autoAiInterview
                        ? "This position uses AI-powered interviews. You'll start immediately after applying."
                        : "After applying, our team will review your application and contact you if shortlisted."}
                    </p>
                    <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                      <li>Answer questions at your own pace</li>
                      <li>Take your time to think before responding</li>
                      <li>Be yourself and speak naturally</li>
                      <li>Your interview will be analyzed by AI for fair evaluation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <form onSubmit={handleApply} className="space-y-4">
              <h3 className="text-sm text-gray-600">Apply Now</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume">Upload Resume (PDF) *</Label>
                <Input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setResume(e.target.files?.[0] || null);
                    setError(null);
                  }}
                  required={!resumeUrl}
                />

                {resume && !resumeUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResumeUpload}
                    disabled={uploading}
                    className="mt-2"
                  >
                    {uploading ? "Uploading..." : "Upload Resume"}
                  </Button>
                )}

                {resumeUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">
                      ✅ Resume uploaded successfully
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full gap-2" 
                size="lg"
                disabled={loading || uploading}
              >
                <Sparkles className="h-4 w-4" />
                {autoAiInterview ? "Start AI Interview" : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}