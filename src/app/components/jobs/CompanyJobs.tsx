import { useParams, useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';
import { useEffect, useState } from 'react';

export function CompanyJobs() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const jobs = useStore((state) => state.jobs);
  const profile = useStore((state) => state.organizationProfile);
  const loading = useStore((state) => state.loading);
  const fetchJobsByCompany = useStore((state) => state.fetchJobsByCompany);
  const fetchOrganizationProfile = useStore((state) => state.fetchOrganizationProfile);

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchJobsByCompany(companyId);
      fetchOrganizationProfile();
    }
  }, [companyId, fetchJobsByCompany, fetchOrganizationProfile]);

  // Filter only active jobs for public view
  const activeJobs = jobs

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'Draft': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'Closed': return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const handleApplyNow = (jobId: string) => {
    navigate(`/jobs/${jobId}/apply`);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading opportunities...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait while we fetch the latest jobs</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative pb-20 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-fade-in-up">
            {/* Company Logo */}
            {profile?.logo && !logoError ? (
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <img
                    src={profile.logo}
                    alt={`${profile.name} logo`}
                    className="h-24  object-cover rounded-2xl shadow-2xl border-4 border-white/20 bg-white"
                    onError={() => setLogoError(true)}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            )}
            
         
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              {profile?.name || 'Career Opportunities'}
            </h1>
            
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {profile?.tagline || 'Join our team and be part of something extraordinary. Discover roles that match your skills and ambitions.'}
            </p>
            
     
          </div>
        </div>
        
        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32L48 42.7C96 53.3 192 74.7 288 80C384 85.3 480 74.7 576 64C672 53.3 768 42.7 864 48C960 53.3 1056 74.7 1152 80C1248 85.3 1344 74.7 1392 69.3L1440 64V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V32Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Open Positions</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {activeJobs.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Jobs Posted</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {jobs.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Hiring Speed</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Fast
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {activeJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Open Positions</h3>
            <p className="text-gray-500">We don't have any active positions right now.<br />Please check back later for new opportunities.</p>
          </div>
        ) : (
          <>
            {/* Company Culture Section (Optional) */}
            {profile?.description && (
              <div className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">About {profile.name}</h2>
                <p className="text-gray-700 leading-relaxed">{profile.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeJobs.map((job: any, index: number) => (
                <div
                  key={job._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200"
                  onMouseEnter={() => setHoveredJob(job._id)}
                  onMouseLeave={() => setHoveredJob(null)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {/* Premium Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} style={{ padding: '2px', borderRadius: '1rem' }} />
                  
                  <div className="relative bg-white rounded-2xl p-8">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(job.status)} shadow-sm`}>
                            {job.status}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
                            {job.interviewType || 'Standard'}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                            {job.experienceLevel || 'Any Experience'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Icon Animation */}
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Salary */}
                    <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-800 font-semibold">{job.salaryRange || 'Competitive Salary'}</span>
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.skills.slice(0, 4).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleApplyNow(job._id)}
                        className="group/btn relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Apply Now
                          <svg className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>


      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}