import { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Eye, Edit, Trash2, BriefcaseIcon } from 'lucide-react';
import { formatDate, getStatusColor } from '../../../lib/helpers';
import { useNavigate } from 'react-router';
import { EmptyState } from '../common/EmptyState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export function JobsPage() {
  const navigate = useNavigate();
  const jobs = useStore((state) => state.jobs); // ✅ ADD THIS
  const fetchJobs = useStore((state) => state.fetchJobs);

  useEffect(() => {
    fetchJobs();
  }, []);
  const deleteJob = useStore((state) => state.deleteJob);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const handleDelete = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight mb-2">Job Postings</h1>
          <p className="text-gray-600">Manage your job listings and requirements</p>
        </div>
        <Button onClick={() => navigate('/dashboard/jobs/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Job
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>All Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <EmptyState
              icon={BriefcaseIcon}
              title="No jobs yet"
              description="Create your first job posting to start receiving applications"
              action={{
                label: 'Create Job',
                onClick: () => navigate('/dashboard/jobs/new')
              }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="text-sm">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.salary}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {job.experienceLevel}
                    </TableCell>
                    <TableCell className="text-sm">{job.applicants}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(job.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dashboard/jobs/${job._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dashboard/jobs/${job._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(job._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
