export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
  location: string;
  organization?: string;
  isVerified: boolean;
  createdAt: string;
  avatar?: string;
  phone?: string;
  preferences: {
    language: 'en' | 'hi';
    notifications: boolean;
    emailUpdates: boolean;
  };
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
  attachments?: AttachmentFile[];
  tags?: string[];
  language: 'en' | 'hi';
  priority: 'low' | 'medium' | 'high';
}

export interface Comment {
  id: string;
  consultationId: string;
  userId: string;
  userInfo: {
    name: string;
    avatar?: string;
    organization?: string;
  };
  content: string;
  section?: string;
  parentId?: string | null;  // Fixed: Allow null
  replies?: Comment[];
  likes: number;
  dislikes: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  attachments?: AttachmentFile[];
  isEdited: boolean;
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface SentimentAnalysis {
  consultationId: string;
  totalComments: number;
  positive: number;
  negative: number;
  neutral: number;
  commonWords: { text: string; value: number }[];
  trends: { date: string; positive: number; negative: number; neutral: number }[];
  summary: string;
}

export interface AdminStats {
  totalUsers: number;
  totalConsultations: number;
  totalComments: number;
  activeConsultations: number;
  pendingComments: number;
  userGrowth: number;
  engagementRate: number;
}

export interface FilterOptions {
  category?: string;
  status?: string;
  ministry?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}
