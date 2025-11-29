import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import constants from "expo-constants";

const firebaseConfig = {
  apiKey: constants.expoConfig.extra.apiKey,
  authDomain: constants.expoConfig.extra.authDomain,
  projectId: constants.expoConfig.extra.projectId,
  storageBucket: constants.expoConfig.extra.storageBucket,
  messagingSenderId: constants.expoConfig.extra.messagingSenderId,
  appId: constants.expoConfig.extra.appId,
  measurementId: constants.expoConfig.extra.measurementId
};


const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
