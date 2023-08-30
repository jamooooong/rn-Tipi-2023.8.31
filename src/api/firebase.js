// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { firebaseConfig } from '../../env';

export const initFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);

    return app;
  } catch (e) {
    // console.log(e);
  }
};
