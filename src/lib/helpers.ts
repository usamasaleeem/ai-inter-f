import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-100 text-red-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-teal-100 text-teal-700',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-50 border-green-200';
  if (score >= 75) return 'bg-blue-50 border-blue-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Applied': 'bg-gray-100 text-gray-700 border-gray-300',
    'In Review': 'bg-blue-100 text-blue-700 border-blue-300',
    'Interviewed': 'bg-purple-100 text-purple-700 border-purple-300',
    'Shortlisted': 'bg-green-100 text-green-700 border-green-300',
    'Rejected': 'bg-red-100 text-red-700 border-red-300',
    'Active': 'bg-green-100 text-green-700 border-green-300',
    'Draft': 'bg-gray-100 text-gray-700 border-gray-300',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
