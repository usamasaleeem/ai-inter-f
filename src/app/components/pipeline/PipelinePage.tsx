import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Clock, GripVertical, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router';
import { getAvatarColor, getScoreColor } from '../../../lib/helpers';
import { useStore } from '../../../store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const STAGES = ['Applied', 'In Review', 'Interviewed', 'Shortlisted', 'Rejected'];

// Premium color palette for stages
const stageConfig: Record<string, { color: string; bgLight: string; borderAccent: string; icon: any }> = {
  Applied: {
    color: 'text-slate-700',
    bgLight: 'bg-slate-50/80',
    borderAccent: 'border-l-slate-400',
    icon: Clock
  },
  'In Review': {
    color: 'text-blue-700',
    bgLight: 'bg-blue-50/80',
    borderAccent: 'border-l-blue-400',
    icon: TrendingUp
  },
  Interviewed: {
    color: 'text-purple-700',
    bgLight: 'bg-purple-50/80',
    borderAccent: 'border-l-purple-400',
    icon: Users
  },
  Shortlisted: {
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50/80',
    borderAccent: 'border-l-emerald-400',
    icon: Sparkles
  },
  Rejected: {
    color: 'text-rose-700',
    bgLight: 'bg-rose-50/80',
    borderAccent: 'border-l-rose-400',
    icon: Briefcase
  },
};

interface CandidateCardProps {
  candidate: any;
  onClick: () => void;
  index: number;
}

function CandidateCard({ candidate, onClick, index }: CandidateCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'candidate',
    item: { id: candidate._id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      ref={drag}
      onClick={onClick}
      className={`
        group relative bg-white rounded-xl border border-gray-100 cursor-pointer 
        transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        hover:border-gray-200 hover:-translate-y-0.5
        ${isDragging ? 'opacity-40 shadow-lg rotate-1 scale-[0.98]' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-gray-300" />
          </div>

          <Avatar className="ring-2 ring-white shadow-sm">
            <AvatarImage src={candidate.avatar} alt={candidate.name} />
            <AvatarFallback className={`${getAvatarColor(candidate.name)} text-sm font-medium`}>
              {candidate.name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{candidate.name}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{candidate.role}</p>
            <p className="text-xs text-gray-400 truncate">React Developer</p>
          </div>
        </div>

        {candidate?.aiAnalysis?.overallScore && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">AI Match</span>
              <span className={`${getScoreColor(candidate?.aiAnalysis?.overallScore)} font-semibold`}>
                {candidate?.aiAnalysis?.overallScore}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${candidate?.aiAnalysis?.overallScore}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`
                  h-full rounded-full transition-all
                  ${candidate?.aiAnalysis?.overallScore >= 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                    candidate?.aiAnalysis?.overallScore >= 75 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                      'bg-gradient-to-r from-amber-400 to-amber-500'}
                `}
              />
            </div>
          </div>
        )}

        {candidate?.skillsAssessment?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {candidate.skillsAssessment.slice(0, 2).map((tag: any) => (
              <Badge
                key={tag.skillName}
                variant="secondary"
                className="text-xs font-normal bg-gray-50 text-gray-600 border-none hover:bg-gray-100"
              >
                {tag.skillName}
              </Badge>
            ))}
            {candidate?.skillsAssessment?.length > 2 && (
              <Badge variant="secondary" className="text-xs font-normal bg-gray-50 text-gray-500 border-none">
                +{candidate?.skillsAssessment?.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface StageColumnProps {
  stage: string;
  candidates: any[];
  onDrop: (candidateId: string, newStage: string) => void;
  onCandidateClick: (candidateId: string) => void;
}

function StageColumn({ stage, candidates, onDrop, onCandidateClick }: StageColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'candidate',
    drop: (item: { id: string }) => onDrop(item.id, stage),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <div
      ref={drop}
      className={`
        flex-1 min-w-[300px] transition-all duration-200 rounded-2xl
        ${isOver ? 'bg-gray-50/80 shadow-inner scale-[1.01]' : ''}
      `}
    >
      <Card className={`
        border-0 shadow-sm rounded-2xl overflow-hidden h-full 
        transition-all duration-200 ${config.bgLight}
        ${isOver ? 'ring-2 ring-gray-200 shadow-md' : ''}
      `}>
        <CardHeader className="pb-2 pt-4 px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-white/60 backdrop-blur-sm`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <CardTitle className={`text-sm font-semibold tracking-tight ${config.color}`}>
                {stage}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="bg-white/70 text-gray-600 font-medium border-none shadow-sm">
              {candidates?.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {candidates.map((candidate, idx) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                index={idx}
                onClick={() => onCandidateClick(candidate._id)}
              />
            ))}
          </AnimatePresence>

          {candidates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/50 mb-3">
                <Users className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">No candidates</p>
              <p className="text-xs text-gray-300 mt-1">Drag & drop to add</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function PipelinePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidates = useStore((state) => state.fetchCandidates);
  const candidates = useStore((state) => state.candidates);
  const updateCandidateStatus = useStore((state) => state.updateCandidateStatus);
  const moveCandidateToStage = useStore((state) => state.moveCandidateToStage);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchCandidates();
      setIsLoading(false);
    };
    load();
  }, [fetchCandidates]);

  const handleDrop = async (candidateId: string, newStage: string) => {
    // Optimistic update
    moveCandidateToStage(candidateId, newStage);

    try {
      await updateCandidateStatus(candidateId, newStage);
    } catch (err) {
      console.error('Failed to update candidate status:', err);
      // Optional: show toast notification and rollback
    }
  };

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/dashboard/candidates/${candidateId}`);
  };

  // Calculate pipeline stats
  const totalCandidates = candidates.length;
  const stageCounts = STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter(c => c.status === stage).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-8 p-1">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
              <Briefcase className="h-4 w-4" />
              <span>Talent Pipeline</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-800">Candidate Pipeline</h1>
            <p className="text-gray-400 text-sm mt-1">Drag and drop to move candidates through hiring stages</p>
          </div>

          {/* Mini Stats */}
          <div className="flex gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-50">
            <div className="px-4 py-2 rounded-xl text-center">
              <p className="text-2xl font-semibold text-gray-700">{totalCandidates}</p>
              <p className="text-xs text-gray-400 font-medium">Total</p>
            </div>
            {STAGES.map(stage => (
              <div key={stage} className="px-3 py-2 rounded-xl text-center">
                <p className="text-lg font-semibold" style={{ color: stageConfig[stage].color.replace('text-', '') }}>
                  {stageCounts[stage] || 0}
                </p>
                <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                  {stage === 'In Review' ? 'Review' : stage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Columns */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading pipeline...</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar">
            {STAGES.map((stage) => (
              <StageColumn
                key={stage}
                stage={stage}
                candidates={candidates.filter((c) => c.status === stage)}
                onDrop={handleDrop}
                onCandidateClick={handleCandidateClick}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </DndProvider>
  );
}