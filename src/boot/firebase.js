import * as firebase from "firebase/app"
import { FirebaseConfig } from './firebaseConfig.js';

import "firebase/auth"
import "firebase/database"
import "firebase/storage"

let firebaseApp = firebase.initializeApp(FirebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseDB = firebaseApp.database();
let firebaseStorage = firebaseApp.storage();

export { firebaseAuth, firebaseDB, firebaseStorage }


