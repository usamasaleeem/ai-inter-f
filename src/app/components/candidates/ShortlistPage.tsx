import { useEffect, useState } from 'react';
import { useStore } from '../../../store/useStore';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { getAvatarColor, getScoreColor } from '../../../lib/helpers';
import { Slider } from '../ui/slider';

export function ShortlistPage() {
  const navigate = useNavigate();
  const updateCandidateStatus = useStore((state) => state.updateCandidateStatus);
  const fetchCandidates = useStore((state) => state.fetchCandidates);
  const candidates = useStore((state) => state.candidates);

  useEffect(() => {

    fetchCandidates();

  }, []);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    const matchesScore = !candidate?.aiAnalysis?.overallScore || (
      candidate?.aiAnalysis?.overallScore >= scoreRange[0] && candidate?.aiAnalysis?.overallScore <= scoreRange[1]
    );
    const matchesSearch =
      candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesScore && matchesSearch;
  });

  const handleApprove = (candidateId: string) => {
    updateCandidateStatus(candidateId, 'Shortlisted');
  };

  const handleReject = (candidateId: string) => {
    updateCandidateStatus(candidateId, 'Rejected');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight mb-2">Shortlist & Review</h1>
        <p className="text-gray-600">Review and manage candidate applications</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Search</label>
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Interviewed">Interviewed</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Score Range: {scoreRange[0]} - {scoreRange[1]}</label>
              <Slider
                value={scoreRange}
                onValueChange={setScoreRange}
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Candidates ({filteredCandidates.length})</CardTitle>
            <Badge variant="outline">
              {filteredCandidates.filter((c) => c.status === 'Shortlisted').length} Shortlisted
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback className={getAvatarColor(candidate.name)}>
                          {candidate.name?.[0]}
                        </AvatarFallback>                      </Avatar>
                      <div>
                        <p className="text-sm">{candidate.name}</p>
                        <p className="text-xs text-gray-600">{candidate.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{candidate.jobTitle}</TableCell>
                  <TableCell>
                    {candidate?.aiAnalysis?.overallScore ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${getScoreColor(candidate?.aiAnalysis?.overallScore)}`}>
                          {candidate?.aiAnalysis?.overallScore}
                        </span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${candidate?.aiAnalysis?.overallScore >= 90
                                ? 'bg-green-500'
                                : candidate?.aiAnalysis?.overallScore >= 75
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                              }`}
                            style={{ width: `${candidate?.aiAnalysis?.overallScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not scored</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate?.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {candidate?.tags?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{candidate?.tags?.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/dashboard/candidates/${candidate.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {candidate.status !== 'Shortlisted' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(candidate._id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {candidate.status !== 'Rejected' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(candidate._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No candidates match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
