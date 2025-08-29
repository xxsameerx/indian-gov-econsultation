import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Consultation, Comment, User } from '../types';

// Consultations Service
export const consultationService = {
  // Create consultation
  create: async (consultationData: Omit<Consultation, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'consultations'), {
        ...consultationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        commentsCount: 0,
        bookmarksCount: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  },

  // Get all consultations
  getAll: async () => {
    try {
      const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        deadline: doc.data().deadline?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Consultation[];
    } catch (error) {
      console.error('Error getting consultations:', error);
      throw error;
    }
  },

  // Get consultation by ID
  getById: async (id: string) => {
    try {
      const docRef = doc(db, 'consultations', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          deadline: docSnap.data().deadline?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Consultation;
      }
      return null;
    } catch (error) {
      console.error('Error getting consultation:', error);
      throw error;
    }
  },

  // Update consultation
  update: async (id: string, data: Partial<Consultation>) => {
    try {
      const docRef = doc(db, 'consultations', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating consultation:', error);
      throw error;
    }
  },

  // Delete consultation
  delete: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'consultations', id));
    } catch (error) {
      console.error('Error deleting consultation:', error);
      throw error;
    }
  },

  // Real-time listener for consultations
  onSnapshot: (callback: (consultations: Consultation[]) => void) => {
    const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const consultations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        deadline: doc.data().deadline?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Consultation[];
      callback(consultations);
    });
  }
};

// Comments Service
export const commentService = {
  // Add comment
  add: async (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    try {
      const batch = writeBatch(db);
      
      // Add comment
      const commentRef = doc(collection(db, 'comments'));
      batch.set(commentRef, {
        ...commentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Increment consultation comment count
      const consultationRef = doc(db, 'consultations', commentData.consultationId);
      batch.update(consultationRef, {
        commentsCount: (await getDoc(consultationRef)).data()?.commentsCount + 1 || 1
      });
      
      await batch.commit();
      return commentRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get comments for consultation
  getByConsultation: async (consultationId: string) => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('consultationId', '==', consultationId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Comment[];
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  // Real-time listener for comments
  onSnapshot: (consultationId: string, callback: (comments: Comment[]) => void) => {
    const q = query(
      collection(db, 'comments'),
      where('consultationId', '==', consultationId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Comment[];
      callback(comments);
    });
  },

  // Update comment (like/dislike)
  update: async (id: string, data: Partial<Comment>) => {
    try {
      const docRef = doc(db, 'comments', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Moderate comment (approve/reject)
  moderate: async (id: string, status: 'approved' | 'rejected') => {
    try {
      const docRef = doc(db, 'comments', id);
      await updateDoc(docRef, {
        status,
        moderatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error moderating comment:', error);
      throw error;
    }
  }
};

// Users Service
export const userService = {
  // Get all users (admin only)
  getAll: async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as User[];
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Update user
  update: async (id: string, data: Partial<User>) => {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};
