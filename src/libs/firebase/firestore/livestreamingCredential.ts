import {
  LivestreamingCredentialId,
  LivestreamingInfo,
  LivestreamingPassword,
} from '@/libs/models/livestreamingCredential';
import { livestreamingDocument } from './livestreaming';
import {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const livestreamingCredentialCollection = (
  livestreamingId: string,
): CollectionReference =>
  livestreamingDocument(livestreamingId).collection('livestreamingCredentials');

export const livestreamingCredentialDocument = (
  livestreamingId: string,
  livestreamingCredentialId: LivestreamingCredentialId,
): DocumentReference =>
  livestreamingCredentialCollection(livestreamingId).doc(
    livestreamingCredentialId,
  );

export const livestreamingPasswordConverter: FirestoreDataConverter<LivestreamingPassword> = {
  toFirestore(livestreamingPassword: LivestreamingPassword) {
    return livestreamingPassword;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      password: data.password,
      rawPassword: data.rawPassword,
    };
  },
};

export const livestreamingInfoConverter: FirestoreDataConverter<LivestreamingInfo> = {
  toFirestore(livestreamingInfo: LivestreamingInfo) {
    return livestreamingInfo;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return data as LivestreamingInfo;
  },
};
