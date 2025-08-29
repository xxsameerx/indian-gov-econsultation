import { useState, useEffect } from 'react';
import { consultationService, commentService, userService } from '../services/firestore';
import { Consultation, Comment, User } from '../types';

// Hook for real-time consultations
export const useConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = consultationService.onSnapshot((data) => {
      setConsultations(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addConsultation = async (consultation: Omit<Consultation, 'id'>) => {
    try {
      await consultationService.create(consultation);
    } catch (error) {
      setError('Failed to create consultation');
      console.error(error);
    }
  };

  return { consultations, loading, error, addConsultation };
};

// Hook for real-time comments
export const useComments = (consultationId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!consultationId) return;

    const unsubscribe = commentService.onSnapshot(consultationId, (data) => {
      setComments(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [consultationId]);

  const addComment = async (content: string, userId: string, userInfo: any) => {
    try {
      await commentService.add({
        consultationId,
        userId,
        userInfo,
        content,
        sentiment: 'neutral',
        status: 'pending',
        likes: 0,
        dislikes: 0,
        isEdited: false
      });
    } catch (error) {
      setError('Failed to add comment');
      console.error(error);
    }
  };

  const likeComment = async (commentId: string, currentLikes: number) => {
    try {
      await commentService.update(commentId, {
        likes: currentLikes + 1
      });
    } catch (error) {
      setError('Failed to like comment');
      console.error(error);
    }
  };

  return { comments, loading, error, addComment, likeComment };
};

// Hook for users (admin)
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        setError('Failed to fetch users');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
