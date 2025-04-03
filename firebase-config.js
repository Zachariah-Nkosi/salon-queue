// firebase-config.js
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC6qaJk0Eb8jtSNUynKYGPSjfiPj2Mwf9o",
    authDomain: "queieing.firebaseapp.com",
    databaseURL: "https://queieing-default-rtdb.firebaseio.com",
    projectId: "queieing",
    storageBucket: "queieing.appspot.com",
    messagingSenderId: "257619042814",
    appId: "1:257619042814:web:7fa6bb5324b1c3b47720af"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

export default db;
