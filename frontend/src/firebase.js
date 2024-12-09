import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth();

const makeDataUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1, // 최대 파일 크기 (MB)
    maxWidthOrHeight: 1920, // 최대 너비 또는 높이
    useWebWorker: true, // 웹 워커 사용
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing file:', error);
    throw error;
  }
};

const singleFileUpload = async (file) => {
  const compressedFile = await compressImage(file);
  const imageFile = await makeDataUrl(compressedFile);
  const uuid = uuidv4();
  const filename = `${uuid}`;
  const storageRef = ref(storage, `image/${filename}`);
  try {
    const snapshot = await uploadString(storageRef, imageFile, 'data_url');
    const url = await getDownloadURL(snapshot.ref);
    return { url, filename };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const multipleFileUpload = async (files) => {
  const promises = files.map((file) => singleFileUpload(file));
  return Promise.all(promises);
};

const deleteFile = async (filename) => {
  const storageRef = ref(storage, `image/${filename}`);
  try {
    await getDownloadURL(storageRef);
    await deleteObject(storageRef);
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      console.error('File not found');
      return;
    } else {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

const deleteFiles = async (files) => {
  const promises = files.map((file) => deleteFile(file.filename));
  return Promise.all(promises);
}

export { storage, auth, app as default, singleFileUpload, deleteFile,  RecaptchaVerifier, signInWithPhoneNumber, compressImage , multipleFileUpload };
