import { VideoCredentialId, VideoInfo } from '@/libs/models/videoCredential';
import { videoDocument } from './video';
import {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const videoCredentialCollection = (
  videoId: string,
): CollectionReference => videoDocument(videoId).collection('videoCredentials');

export const videoCredentialDocument = (
  videoId: string,
  videoCredentialId: VideoCredentialId,
): DocumentReference =>
  videoCredentialCollection(videoId).doc(videoCredentialId);

export const videoInfoConverter: FirestoreDataConverter<VideoInfo> = {
  toFirestore(videoInfo: VideoInfo) {
    return videoInfo;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return data as VideoInfo;
  },
};
