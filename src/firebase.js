import {
    initializeApp
} from "firebase/app";
import {
    getFirestore
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA1i_B9RRrbvrlYxUocW7-c9EnVRQFAxvo",
    authDomain: "clientes-app-nueva.firebaseapp.com",
    projectId: "clientes-app-nueva",
    storageBucket: "clientes-app-nueva.firebasestorage.app",
    messagingSenderId: "427027701306",
    appId: "1:427027701306:web:113444d397ffeecfbadf03"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);