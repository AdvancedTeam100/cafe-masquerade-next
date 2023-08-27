import * as admin from 'firebase-admin';
import { getServiceAccountKey } from './serviceAccountKey';

const serviceAccount = getServiceAccountKey();

const firebaseAdmin =
  admin.apps.length === 0
    ? admin.initializeApp({
        credential: serviceAccount
          ? admin.credential.cert(serviceAccount)
          : undefined,
      })
    : (admin.apps[0] as admin.app.App);

export const adminFirestore = firebaseAdmin.firestore();
export const adminAuth = firebaseAdmin.auth();
export default firebaseAdmin;
