import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/analytics';
import { config } from './config';

try {
  firebase.initializeApp(config);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

export const auth = firebase.auth();
export const storage = firebase.app().storage();
const functions = firebase.app().functions('asia-northeast1');
// process.env.NODE_ENV === 'development' &&
//   functions.useEmulator('localhost', 5000);
export { functions };

export default firebase;
