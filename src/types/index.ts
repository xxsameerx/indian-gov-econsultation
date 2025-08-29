export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
  location: string;
  organization?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Consultation {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  status: 'draft' | 'active' | 'closed';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  bookmarksCount: number;
  ministry: string;
}

export interface Comment {
  id: string;
  consultationId: string;
  userId: string;
  content: string;
  section?: string;
  parentId?: string;
  likes: number;
  dislikes: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SentimentAnalysis {
  consultationId: string;
  totalComments: number;
  positive: number;
  negative: number;
  neutral: number;
  commonWords: { text: string; value: number }[];
  trends: { date: string; positive: number; negative: number; neutral: number }[];
}
