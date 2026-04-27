import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { DollarSign, Clock, Sparkles, CheckCircle, Mail, User, FileText, Building2, ArrowLeft, Loader2 } from 'lucide-react';

export function JobPublicPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const currentJob = useStore((state) => state.currentJob);
  const fetchPublicJobById = useStore((state) => state.fetchPublicJobById);
  const uploadResume = useStore((s) => s.uploadResume);
  const organizationProfile = useStore((s) => s.organizationProfile);
  const fetchOrganizationProfile = useStore((s) => s.fetchOrganizationProfile);
  
  const [resume, setResume] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<{name: string, email: string} | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loading = useStore((state) => state.loading);
  const startInterview = useStore((state) => state.startInterview);
  const autoAiInterview = currentJob?.autoAiInterview;

  // Fetch job and company data
  useEffect(() => {
    const fetchData = async () => {
      if (jobId) {
        try {
          setError(null);
          await fetchPublicJobById(jobId);
          await fetchOrganizationProfile();
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load job details. Please try again.");
        }
      }
    };
    
    fetchData();
  }, [jobId, fetchPublicJobById, fetchOrganizationProfile]);

  // Handle apply/submit with single-step resume upload
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!name || !email) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (!resume) {
      setError("Please upload your resume");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, upload the resume
      const uploadSuccess = await uploadResume(resume);
      
      if (!uploadSuccess) {
        throw new Error("Failed to upload resume");
      }
      
      // Then, submit the application
      await startInterview(name, email, currentJob._id);
      
      if (autoAiInterview) {
        navigate(`/interview/${currentJob._id}`);
      } else {
        setSubmittedApplication({ name, email });
        setSuccess(true);
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show thank you page after successful application
  if (success && !autoAiInterview && submittedApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Company Logo */}
          <div className="text-center mb-8">
            {organizationProfile?.logo && !logoError ? (
              <img
                src={organizationProfile.logo}
                alt={organizationProfile.name}
                className="h-16 w-auto object-contain mx-auto"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <p className="text-gray-600 mt-2">Powered by {organizationProfile?.name || 'Intervo AI'}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
                <p className="text-gray-600">
                  Thank you for applying to <span className="font-semibold">{currentJob?.title}</span> at {organizationProfile?.name}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
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

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
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

              <Button onClick={() => navigate('/')} className="w-full">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !currentJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {/* Job Details Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Job Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{currentJob.title}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <DollarSign className="h-3 w-3" />
                  {currentJob.salaryRange || "Competitive"}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Clock className="h-3 w-3" />
                  {currentJob.experienceLevel || "Any Experience"}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  <Sparkles className="h-3 w-3" />
                  {currentJob.interviewType || "Standard"}
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h3>
              <div className="text-gray-600 leading-relaxed">
                {currentJob.description ? (
                  <div className="space-y-3">
                    {currentJob.description.split('\n').map((paragraph: string, index: number) => (
                      paragraph.trim() && (
                        <p key={index} className="whitespace-pre-wrap">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                ) : (
                  <p>No description provided</p>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentJob.skills && currentJob.skills.length > 0 ? (
                  currentJob.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No specific skills listed</p>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Interview Process */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Interview Process</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                <div className="flex gap-3">
                  <Sparkles className="h-6 w-6 text-blue-600 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      {autoAiInterview
                        ? "✨ AI-Powered Interview - Start Immediately"
                        : "📝 Traditional Review Process"}
                    </p>
                    <ul className="text-sm space-y-1.5 text-gray-700">
                      {autoAiInterview ? (
                        <>
                          <li>• Answer questions at your own pace</li>
                          <li>• Take your time to think before responding</li>
                          <li>• Be yourself and speak naturally</li>
                          <li>• Get instant feedback after completion</li>
                        </>
                      ) : (
                        <>
                          <li>• Our team reviews your application within 3-5 days</li>
                          <li>• Shortlisted candidates will be contacted via email</li>
                          <li>• Interview process includes technical and cultural fit assessments</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Application Form - Single Step */}
            <form onSubmit={handleApply} className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this Position</h3>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume" className="text-gray-700">Upload Resume (PDF) *</Label>
                <div className="relative">
                  <Input
                    id="resume"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          setError("File size should be less than 5MB");
                          e.target.value = '';
                          return;
                        }
                        // Validate file type
                        if (file.type !== 'application/pdf') {
                          setError("Please upload a PDF file");
                          e.target.value = '';
                          return;
                        }
                        setResume(file);
                        setError(null);
                      }
                    }}
                    className="rounded-xl"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {resume && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Selected: {resume.name}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Accepted format: PDF (Max 5MB)
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full rounded-xl py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                size="lg"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    {autoAiInterview ? "Start AI Interview" : "Submit Application"}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {organizationProfile?.name || 'Company'}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}