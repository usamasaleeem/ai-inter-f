import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Plus } from 'lucide-react';
import axios from 'axios';
import { api } from '../../../services/api';

export function CreateJobPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const jobs = useStore((state) => state.jobs);
  const addJob = useStore((state) => state.addJob);
  const updateJob = useStore((state) => state.updateJob);
  const publishJob = useStore((state) => state.publishJob);

  const existingJob = jobId ? jobs.find((j) => j._id === jobId) : null;
  const isEditing = !!existingJob;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [questions, setquestions] = useState<string[]>(['']);

  useEffect(() => {
    if (existingJob) {
      console.log(existingJob)
      setTitle(existingJob.title);
      setDescription(existingJob.description);
      setSalary(existingJob.salaryRange);
      setExperience(existingJob.experienceLevel);
      setInterviewType(existingJob.interviewType);
      setSkills(existingJob.skills);
      setquestions(existingJob.questions.length > 0 ? existingJob.questions : ['']);
    }
  }, [existingJob]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addQuestion = () => {
    setquestions([...questions, '']);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setquestions(updated);
  };

  const removeQuestion = (index: number) => {
    setquestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e, shouldPublish = false) => {
    e.preventDefault();

    const filteredQuestions = questions.filter((q) => q.trim() !== '');

    const mapExperience = () => {
      return experience;
    };

    const mapInterviewType = () => {
      return interviewType;
    };

    const payload = {
      title,
      description,
      salaryRange: salary,
      experienceLevel: mapExperience(),
      interviewType: mapInterviewType(),
      skills,
      questions: filteredQuestions,
      status: 'Published',
      // status: shouldPublish ? 'Published' : 'Draft',
    };

    try {
      if (isEditing && jobId) {
        // ✅ UPDATE FLOW
        await updateJob(jobId, payload);
        console.log('Job Updated');
      } else {
        // ✅ CREATE FLOW
        const token = localStorage.getItem('token');

        const joba = await api.post('/jobs', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(joba)

        console.log('Job Created');
      }

      navigate('/dashboard/jobs');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl tracking-tight mb-2">
          {isEditing ? 'Edit Job Posting' : 'Create Job Posting'}
        </h1>
        <p className="text-gray-600">Define the role and requirements</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g. $120k - $180k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level (0-2 years)">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="Mid-level (3-5 years)">Mid-level (3-5 years)</SelectItem>
                    <SelectItem value="Senior (5+ years)">Senior (5+ years)</SelectItem>
                    <SelectItem value="Lead/Principal (8+ years)">Lead/Principal (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type</Label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Voice AI">Voice AI</SelectItem>
                  <SelectItem value="Live">Live Interview</SelectItem>
                  <SelectItem value="Hybrid">Hybrid (AI + Live)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g. React, TypeScript)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Custom Interview Questions</Label>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Question ${index + 1}`}
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                    />
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={addQuestion} className="gap-2 mt-2">
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </div>

            <div className="flex gap-3 pt-4">
              {!isEditing && (
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  variant="outline"
                >
                  Save as Draft
                </Button>
              )}
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, isEditing ? false : true)}
              >
                {isEditing ? 'Save Changes' : 'Publish Job'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/dashboard/jobs')}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
