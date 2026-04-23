import { useStore } from '../../../store/useStore';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
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
import { Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { getScoreColor, formatDate, getAvatarColor } from '../../../lib/helpers';
import { useEffect } from 'react';

export function AllCandidatesPage() {
  const navigate = useNavigate();
  const fetchCandidates = useStore((state) => state.fetchCandidates);
  const candidates = useStore((state) => state.candidates);

  useEffect(() => {

    fetchCandidates();

  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight mb-2">All Candidates</h1>
        <p className="text-gray-600">View all applicants across all job postings</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Candidates ({candidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow
                  key={candidate._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/dashboard/candidates/${candidate._id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback className={getAvatarColor(candidate.name)}>
                          {candidate.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{candidate.name}</p>
                        <p className="text-xs text-gray-600">{candidate.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{candidate.role}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(candidate.appliedAt)}
                  </TableCell>
                  <TableCell>
                    {candidate.aiScore ? (
                      <span className={`text-sm ${getScoreColor(candidate.aiScore)}`}>
                        {candidate.aiScore}
                      </span>
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
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/candidates/${candidate._id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
