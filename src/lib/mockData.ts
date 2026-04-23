export const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    description: 'We are looking for an experienced frontend engineer to join our growing team. You will be responsible for building scalable web applications using modern frameworks.',
    status: 'Active',
    salary: '$120k - $180k',
    experience: 'Senior (5+ years)',
    interviewType: 'Voice AI',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    applicants: 24,
    customQuestions: [
      'Explain your experience with React hooks and state management',
      'Describe a challenging technical problem you solved recently',
      'How do you approach performance optimization?'
    ],
    createdAt: '2026-03-15',
    publishedAt: '2026-03-16'
  },
  {
    id: 'job-2',
    title: 'Full Stack Developer',
    description: 'Join our team to build innovative solutions. Experience with both frontend and backend technologies required.',
    status: 'Active',
    salary: '$100k - $150k',
    experience: 'Mid-level (3-5 years)',
    interviewType: 'Hybrid',
    skills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    applicants: 18,
    customQuestions: [
      'Describe your experience with microservices architecture',
      'How do you handle database optimization?'
    ],
    createdAt: '2026-03-20',
    publishedAt: '2026-03-21'
  },
  {
    id: 'job-3',
    title: 'DevOps Engineer',
    description: 'Looking for a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.',
    status: 'Draft',
    salary: '$110k - $160k',
    experience: 'Senior (5+ years)',
    interviewType: 'Live',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Python'],
    applicants: 0,
    customQuestions: [
      'Explain your experience with Kubernetes',
      'How do you approach infrastructure as code?'
    ],
    createdAt: '2026-03-28',
    publishedAt: null
  },
  {
    id: 'job-4',
    title: 'Product Designer',
    description: 'Create beautiful and intuitive user experiences. Work closely with engineering and product teams.',
    status: 'Active',
    salary: '$90k - $140k',
    experience: 'Mid-level (3-5 years)',
    interviewType: 'Voice AI',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'User Research'],
    applicants: 31,
    customQuestions: [
      'Walk us through your design process',
      'How do you handle design feedback?'
    ],
    createdAt: '2026-03-10',
    publishedAt: '2026-03-11'
  },
  {
    id: 'job-5',
    title: 'Backend Engineer',
    description: 'Build robust APIs and scalable backend systems. Experience with distributed systems is a plus.',
    status: 'Active',
    salary: '$130k - $190k',
    experience: 'Senior (5+ years)',
    interviewType: 'Hybrid',
    skills: ['Python', 'Django', 'Redis', 'RabbitMQ', 'PostgreSQL'],
    applicants: 15,
    customQuestions: [
      'Describe your experience with distributed systems',
      'How do you approach API design?'
    ],
    createdAt: '2026-03-18',
    publishedAt: '2026-03-19'
  }
];

export const mockCandidates = [
  {
    id: 'cand-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    status: 'Interviewed',
    aiScore: 92,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    experience: '6 years',
    appliedAt: '2026-03-17',
    interviewedAt: '2026-03-22',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    tags: ['Strong Technical', 'Great Communication', 'Culture Fit']
  },
  {
    id: 'cand-2',
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    status: 'Shortlisted',
    aiScore: 88,
    skills: ['React', 'Vue', 'TypeScript', 'CSS'],
    experience: '5 years',
    appliedAt: '2026-03-18',
    interviewedAt: '2026-03-23',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    tags: ['Problem Solver', 'Quick Learner']
  },
  {
    id: 'cand-3',
    name: 'Emily Watson',
    email: 'emily.w@email.com',
    jobId: 'job-2',
    jobTitle: 'Full Stack Developer',
    status: 'In Review',
    aiScore: 85,
    skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
    experience: '4 years',
    appliedAt: '2026-03-21',
    interviewedAt: null,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    tags: ['Full Stack', 'Self Starter']
  },
  {
    id: 'cand-4',
    name: 'James Kim',
    email: 'james.kim@email.com',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    status: 'Applied',
    aiScore: null,
    skills: ['React', 'Angular', 'JavaScript'],
    experience: '7 years',
    appliedAt: '2026-03-25',
    interviewedAt: null,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    tags: []
  },
  {
    id: 'cand-5',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    jobId: 'job-4',
    jobTitle: 'Product Designer',
    status: 'Shortlisted',
    aiScore: 95,
    skills: ['Figma', 'Sketch', 'Design Systems', 'User Research'],
    experience: '4 years',
    appliedAt: '2026-03-12',
    interviewedAt: '2026-03-16',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    tags: ['Creative', 'Detail Oriented', 'Excellent Portfolio']
  },
  {
    id: 'cand-6',
    name: 'David Martinez',
    email: 'david.m@email.com',
    jobId: 'job-2',
    jobTitle: 'Full Stack Developer',
    status: 'Interviewed',
    aiScore: 79,
    skills: ['Python', 'React', 'PostgreSQL'],
    experience: '3 years',
    appliedAt: '2026-03-22',
    interviewedAt: '2026-03-26',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    tags: ['Junior Level', 'Eager']
  },
  {
    id: 'cand-7',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    status: 'Rejected',
    aiScore: 65,
    skills: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
    experience: '8 years',
    appliedAt: '2026-03-19',
    interviewedAt: '2026-03-24',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    tags: ['Outdated Skills']
  },
  {
    id: 'cand-8',
    name: 'Alex Johnson',
    email: 'alex.j@email.com',
    jobId: 'job-5',
    jobTitle: 'Backend Engineer',
    status: 'Shortlisted',
    aiScore: 90,
    skills: ['Python', 'FastAPI', 'Redis', 'PostgreSQL'],
    experience: '6 years',
    appliedAt: '2026-03-20',
    interviewedAt: '2026-03-25',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    tags: ['Distributed Systems Expert', 'Strong Architecture']
  },
  {
    id: 'cand-9',
    name: 'Nina Patel',
    email: 'nina.p@email.com',
    jobId: 'job-4',
    jobTitle: 'Product Designer',
    status: 'In Review',
    aiScore: null,
    skills: ['Figma', 'Adobe XD', 'Illustration'],
    experience: '3 years',
    appliedAt: '2026-03-26',
    interviewedAt: null,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina',
    tags: ['Portfolio Review Pending']
  },
  {
    id: 'cand-10',
    name: 'Tom Wilson',
    email: 'tom.w@email.com',
    jobId: 'job-2',
    jobTitle: 'Full Stack Developer',
    status: 'Applied',
    aiScore: null,
    skills: ['Node.js', 'Express', 'MongoDB', 'React'],
    experience: '4 years',
    appliedAt: '2026-03-27',
    interviewedAt: null,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    tags: []
  }
];

export const mockTranscript = [
  {
    id: 1,
    speaker: 'AI',
    text: 'Hello! Welcome to your interview for the Senior Frontend Engineer position. My name is Alex, and I\'ll be conducting this interview today. How are you doing?',
    timestamp: '00:00:15'
  },
  {
    id: 2,
    speaker: 'Candidate',
    text: 'I\'m doing great, thank you! I\'m excited about this opportunity.',
    timestamp: '00:00:23'
  },
  {
    id: 3,
    speaker: 'AI',
    text: 'That\'s wonderful to hear! Let\'s start with your background. Can you tell me about your experience with React and modern frontend frameworks?',
    timestamp: '00:00:30'
  },
  {
    id: 4,
    speaker: 'Candidate',
    text: 'Absolutely. I\'ve been working with React for about 6 years now. I started with class components and have been following its evolution to hooks and concurrent features. I\'ve built several large-scale applications using React, Next.js, and TypeScript. I\'m particularly experienced with state management using Redux and Zustand, and I\'ve also worked extensively with React Query for server state management.',
    timestamp: '00:00:45'
  },
  {
    id: 5,
    speaker: 'AI',
    text: 'That\'s impressive! Can you describe a challenging technical problem you encountered recently and how you solved it?',
    timestamp: '00:01:15'
  },
  {
    id: 6,
    speaker: 'Candidate',
    text: 'Sure! Recently, we had a performance issue with a dashboard that was rendering thousands of data points. The initial render was taking over 3 seconds. I implemented several optimizations: first, I used React.memo to prevent unnecessary re-renders of child components. Then I implemented virtualization using react-window to only render visible items. I also moved some heavy computations to Web Workers. These changes reduced the initial render time to under 500ms.',
    timestamp: '00:01:35'
  },
  {
    id: 7,
    speaker: 'AI',
    text: 'Excellent problem-solving approach! How do you typically approach performance optimization in React applications?',
    timestamp: '00:02:15'
  },
  {
    id: 8,
    speaker: 'Candidate',
    text: 'I follow a systematic approach. First, I use Chrome DevTools and React DevTools Profiler to identify bottlenecks. Then I look at common issues like unnecessary re-renders, large bundle sizes, and inefficient data fetching. I use techniques like code splitting, lazy loading, memoization, and proper use of keys in lists. I also pay attention to Core Web Vitals metrics like LCP, FID, and CLS.',
    timestamp: '00:02:30'
  },
  {
    id: 9,
    speaker: 'AI',
    text: 'Great! Let\'s talk about collaboration. How do you work with designers and backend engineers?',
    timestamp: '00:03:05'
  },
  {
    id: 10,
    speaker: 'Candidate',
    text: 'I believe in close collaboration. With designers, I regularly review designs in Figma, provide feedback on feasibility, and ensure we have proper design systems and component libraries. With backend engineers, I participate in API design discussions, help define contracts, and ensure we have proper error handling and loading states. I also advocate for GraphQL when it makes sense, as it improves the developer experience.',
    timestamp: '00:03:20'
  },
  {
    id: 11,
    speaker: 'AI',
    text: 'Thank you for sharing that. Do you have any questions for me about the role or the company?',
    timestamp: '00:04:00'
  },
  {
    id: 12,
    speaker: 'Candidate',
    text: 'Yes, I\'d like to know more about the team structure and the tech stack you\'re currently using. Also, what are the biggest technical challenges the team is facing right now?',
    timestamp: '00:04:10'
  },
  {
    id: 13,
    speaker: 'AI',
    text: 'Great questions! We have a team of 8 frontend engineers working across 3 product squads. Our stack includes React, Next.js, TypeScript, and Tailwind CSS, with GraphQL for our API layer. Our biggest challenge is scaling our component library and ensuring consistency across products. Thank you for your time today. We\'ll be in touch soon with next steps!',
    timestamp: '00:04:25'
  }
];

export const mockAIAnalysis = {
  overall_score: 92,
  recommendation: 'Strong Hire',
  summary: 'The candidate demonstrated exceptional technical knowledge and problem-solving abilities. Their experience with React and modern frontend development is extensive and well-articulated. Communication skills are excellent, and they showed strong collaborative mindset.',

  skills_assessment: [
    { skill: 'React', level: 'Expert', score: 95 },
    { skill: 'TypeScript', level: 'Advanced', score: 88 },
    { skill: 'Performance Optimization', level: 'Expert', score: 92 },
    { skill: 'State Management', level: 'Advanced', score: 90 },
    { skill: 'Problem Solving', level: 'Expert', score: 94 }
  ],

  strengths: [
    'Deep understanding of React ecosystem and best practices',
    'Strong performance optimization experience with measurable results',
    'Excellent communication and ability to explain technical concepts clearly',
    'Systematic approach to problem-solving',
    'Collaborative mindset with cross-functional teams',
    'Stays current with modern frontend development practices'
  ],

  weaknesses: [
    'Could provide more specific examples of leadership experience',
    'Limited discussion of testing strategies and practices'
  ],

  communication_score: 94,
  technical_depth_score: 93,
  problem_solving_score: 95,
  cultural_fit_score: 90,

  sentiment_analysis: {
    overall_sentiment: 'Very Positive',
    confidence_level: 'High',
    enthusiasm_score: 88,
    professionalism_score: 95
  },

  red_flags: [],

  key_moments: [
    {
      timestamp: '00:01:35',
      highlight: 'Impressive problem-solving example with specific metrics',
      type: 'positive'
    },
    {
      timestamp: '00:02:30',
      highlight: 'Demonstrated deep knowledge of performance optimization techniques',
      type: 'positive'
    },
    {
      timestamp: '00:03:20',
      highlight: 'Strong collaborative approach with cross-functional teams',
      type: 'positive'
    }
  ],

  next_steps: [
    'Proceed to technical round with senior engineers',
    'Consider for team lead position based on experience level',
    'Schedule culture fit interview with team members'
  ]
};
