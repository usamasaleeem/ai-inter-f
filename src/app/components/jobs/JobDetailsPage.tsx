import { useParams, useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ArrowLeft, Edit, Eye, Trash2 } from 'lucide-react';
import { formatDate, getStatusColor } from '../../../lib/helpers';
import { useEffect } from 'react';

export function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const currentJob = useStore((state) => state.currentJob);
  const fetchJobById = useStore((state) => state.fetchJobById);
  const loading = useStore((state) => state.loading);
  useEffect(() => {
    if (jobId) {
      fetchJobById(jobId);
    }
  }, [jobId]);
  const candidates = useStore((state) => state.candidates);
  const deleteJob = useStore((state) => state.deleteJob);

  const jobCandidates = candidates.filter((c) => c.jobId === jobId);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!currentJob) {
    return (
      <div className="text-center">
        <p>Job not found</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(job._id);
      navigate('/dashboard/jobs');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/jobs')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl tracking-tight">Job Details</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/jobs/${currentJob._id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`/jobs/${currentJob._id}/apply`, '_blank')}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Public Page
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <div className="space-y-4">
              <div>
                <CardTitle className="text-2xl mb-2">{currentJob.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(currentJob.status)}>
                    {currentJob.status}
                  </Badge>
                  <Badge variant="outline">{currentJob.salary}</Badge>
                  <Badge variant="outline">{currentJob.experienceLevel}</Badge>
                  <Badge variant="outline">{currentJob.interviewType}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm mb-2 text-gray-600">Description</h3>
              <p className="text-sm leading-relaxed">{currentJob.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm mb-3 text-gray-600">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentJob.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {currentJob.questions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm mb-3 text-gray-600">Custom Questions</h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    {currentJob.questions.map((question, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {question}
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Created</p>
                <p>{formatDate(currentJob.createdAt)}</p>
              </div>
              {currentJob.publishedAt && (
                <div>
                  <p className="text-gray-600 mb-1">Published</p>
                  <p>{formatDate(currentJob.publishedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
                <p className="text-3xl">{currentJob.applicants}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">In Review</p>
                <p className="text-3xl">
                  {jobCandidates.filter((c) => c.status === 'In Review').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Interviewed</p>
                <p className="text-3xl">
                  {jobCandidates.filter((c) => c.status === 'Interviewed').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shortlisted</p>
                <p className="text-3xl">
                  {jobCandidates.filter((c) => c.status === 'Shortlisted').length}
                </p>
              </div>
            </CardContent>
          </Card>

          {currentJob.status === 'Draft' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <p className="text-sm text-yellow-800 mb-4">
                  This job is in draft mode and not visible to candidates.
                </p>
                <Button
                  onClick={() => {
                    useStore.getState().publishJob(currentJob._id);
                  }}
                  className="w-full"
                >
                  Publish Job
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
