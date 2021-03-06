import firebase from "firebase/app"
import 'firebase/firestore'
import { FirebaseConfig } from './firebaseConfig.js'

import "firebase/auth"
import "firebase/database"
import "firebase/storage"

let firebaseApp = firebase.initializeApp(FirebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firestore = firebaseApp.firestore()
let firebaseStorage = firebaseApp.storage()
const { TimeStamp, GeoPoint } = firebase.firestore

export { firebaseAuth, firestore, firebaseStorage }


