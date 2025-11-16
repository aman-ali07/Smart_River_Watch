/**
 * Reports Service
 * Submit citizen reports to Firebase
 */

import { db, storage, auth } from './firebase';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface CitizenReport {
  id?: string;
  userId: string;
  issueType: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  imageUrl?: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

/**
 * Upload image to Firebase Storage
 */
export async function uploadReportImage(
  imageUri: string,
  reportId: string
): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = ref(storage, `reports/${reportId}/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Submit a citizen report to Firebase
 */
export async function submitReport(
  issueType: string,
  description: string,
  location: { latitude: number; longitude: number },
  imageUri?: string
): Promise<string> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to submit reports');
    }

    // Create report document
    const reportData = {
      userId: user.uid,
      userEmail: user.email,
      issueType,
      description,
      location,
      timestamp: Timestamp.now(),
      status: 'pending',
      imageUrl: '',
    };

    // Add report to Firestore
    const docRef = await addDoc(collection(db, 'reports'), reportData);

    // Upload image if provided
    if (imageUri) {
      try {
        const imageUrl = await uploadReportImage(imageUri, docRef.id);
        // Update report with image URL
        await updateDoc(doc(db, 'reports', docRef.id), {
          imageUrl,
        });
      } catch (imageError) {
        console.error('Error uploading image, but report saved:', imageError);
        // Report is saved even if image upload fails
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

