import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Property, PropertyStatus, PropertyType, PropertyPurpose } from '../types';

const PROPERTIES_COLLECTION = 'properties';

export const getProperties = async (filters?: {
  purpose?: PropertyPurpose;
  type?: PropertyType;
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  featured?: boolean;
  status?: PropertyStatus;
  lastDoc?: any;
  pageSize?: number;
}) => {
  const constraints: QueryConstraint[] = [];

  if (filters?.purpose) constraints.push(where('purpose', '==', filters.purpose));
  if (filters?.type) constraints.push(where('propertyType', '==', filters.type));
  if (filters?.city) constraints.push(where('city', '==', filters.city));
  if (filters?.neighborhood) constraints.push(where('neighborhood', '==', filters.neighborhood));
  if (filters?.minPrice) constraints.push(where('price', '>=', filters.minPrice));
  if (filters?.maxPrice) constraints.push(where('price', '<=', filters.maxPrice));
  if (filters?.bedrooms) constraints.push(where('bedrooms', '>=', filters.bedrooms));
  if (filters?.bathrooms) constraints.push(where('bathrooms', '>=', filters.bathrooms));
  if (filters?.parkingSpaces) constraints.push(where('parkingSpaces', '>=', filters.parkingSpaces));
  if (filters?.featured !== undefined) constraints.push(where('featured', '==', filters.featured));
  
  // Default status filter if not provided
  const status = filters?.status || 'AVAILABLE';
  constraints.push(where('status', '==', status));
  
  // Published filter
  constraints.push(where('publishedAt', '!=', null));

  constraints.push(orderBy('publishedAt', 'desc'));

  if (filters?.lastDoc) {
    constraints.push(startAfter(filters.lastDoc));
  }

  const pageSize = filters?.pageSize || 12;
  constraints.push(limit(pageSize));

  const q = query(collection(db, PROPERTIES_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);
  
  const properties: Property[] = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() } as Property);
  });

  return {
    properties,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
  };
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Property;
  }
  return null;
};

export const getPropertyByCode = async (code: string): Promise<Property | null> => {
  const q = query(collection(db, PROPERTIES_COLLECTION), where('code', '==', code.toUpperCase()), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Property;
  }
  return null;
};

export const createProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
  const data = {
    ...propertyData,
    code: propertyData.code.toUpperCase(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), data);
  return docRef.id;
};

export const updateProperty = async (id: string, propertyData: Partial<Property>) => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await updateDoc(docRef, {
    ...propertyData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProperty = async (id: string) => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await deleteDoc(docRef);
};
