import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  UserProfile,
  BusinessProfile,
  BusinessAnalysisReport,
  GbpAuditReport,
  SocialPostItem,
  ReviewReplyItem,
  PromotionItem,
  MarketingPlanItem,
  CompetitorInsightItem,
} from '../types';

// Helper to prevent Firestore network requests from hanging indefinitely
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore request timeout')), timeoutMs)
    ),
  ]);
}

// Generic safe wrapper for Firestore queries
export async function saveDocument<T extends { userId: string }>(
  collectionName: string,
  data: T
): Promise<string> {
  try {
    const docRef = await withTimeout(
      addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
      })
    );
    return docRef.id;
  } catch (error) {
    console.warn(`Firestore save to ${collectionName} warning:`, error);
    // Local fallback for offline/demo operation
    const fallbackId = 'local_' + Date.now();
    const existing = JSON.parse(localStorage.getItem(`local_${collectionName}`) || '[]');
    existing.unshift({ ...data, id: fallbackId, createdAt: new Date().toISOString() });
    localStorage.setItem(`local_${collectionName}`, JSON.stringify(existing));
    return fallbackId;
  }
}

export async function getUserDocuments<T>(
  collectionName: string,
  userId: string
): Promise<(T & { id: string })[]> {
  try {
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId)
    );
    const querySnapshot = await withTimeout(getDocs(q));
    const results: (T & { id: string })[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...(docSnap.data() as T) });
    });

    // Merge with any offline saved items for seamless user experience
    const local = JSON.parse(localStorage.getItem(`local_${collectionName}`) || '[]');
    const localUserItems = local.filter((item: any) => item.userId === userId);
    return [...results, ...localUserItems];
  } catch (error) {
    console.warn(`Firestore fetch from ${collectionName} warning:`, error);
    const local = JSON.parse(localStorage.getItem(`local_${collectionName}`) || '[]');
    return local.filter((item: any) => item.userId === userId);
  }
}

export async function deleteUserDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    if (docId.startsWith('local_')) {
      const local = JSON.parse(localStorage.getItem(`local_${collectionName}`) || '[]');
      const filtered = local.filter((item: any) => item.id !== docId);
      localStorage.setItem(`local_${collectionName}`, JSON.stringify(filtered));
      return;
    }
    await withTimeout(deleteDoc(doc(db, collectionName, docId)));
  } catch (error) {
    console.warn(`Firestore delete error:`, error);
    const local = JSON.parse(localStorage.getItem(`local_${collectionName}`) || '[]');
    const filtered = local.filter((item: any) => item.id !== docId);
    localStorage.setItem(`local_${collectionName}`, JSON.stringify(filtered));
  }
}

// User Profile Operations
export async function saveUserProfile(user: UserProfile): Promise<void> {
  try {
    await withTimeout(
      setDoc(
        doc(db, 'users', user.uid),
        {
          ...user,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )
    );
  } catch (err) {
    localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(user));
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docSnap = await withTimeout(getDoc(doc(db, 'users', uid)));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    const local = localStorage.getItem(`user_profile_${uid}`);
    return local ? JSON.parse(local) : null;
  } catch (err) {
    const local = localStorage.getItem(`user_profile_${uid}`);
    return local ? JSON.parse(local) : null;
  }
}
