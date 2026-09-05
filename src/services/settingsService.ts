import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { SiteSettings } from '../types';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_ID = 'general';

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_ID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as SiteSettings;
  }
  return null;
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_ID);
  await setDoc(docRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
