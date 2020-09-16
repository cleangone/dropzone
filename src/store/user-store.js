import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
	
/*
    user: 
      id (auth userId)    
      authEmailCopy
      firstName
      lastName
      isAdmin   
      likedItemIds []
*/  

// import Vue from 'vue'
// import { Notify, uid } from 'quasar'
// import { firebaseDB, firebaseAuth } from 'boot/firebase'
// import { SaleType, DropItemStatus } from '../constants/Constants.js';
	
/*
   user: <Key: auth userId>
      authEmailCopy
      firstName
      lastName
      isAdmin   
      actions
         itemName
         action
         amount
         date
      likes (id is dropItemId)
         dropItemId
*/  

const state = {
	users: [],
   // usersDownloaded: false,
}

const actions = {
   bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      // console.log("bindUsers")
      return bindFirestoreRef('users', collection())
   }),
   setUser: firestoreAction((context, user) => {
      // console.log("setUser", user)
      collection().doc(user.id).set(user)
   }),
   setLikes: firestoreAction((context, user) => {
      // console.log("setLikes", user.likedItemIds) 
      collection().doc(user.id).update({ likedItemIds: user.likedItemIds })
   }),
}

function collection() { return firestore.collection('users') }

const getters = {
   getUsers: state => { return state.users },
   getUser: state => userId => {
      // console.log("getUser - " + state.users.length + " users")
      for (var user of state.users) {
          if (user.id == userId) { return user }
      }
      return { id: userId }
   }, 
   isAdmin: state => userId => { 
      let user = getters.getUser(userId)
      return user ? user.isAdmin : false
   },
   getUserIdToName() {
      let userIdToName = new Map()
      state.users.forEach(user => { 
         let userName = (user.firstName || user.lastName) ?
            (user.firstName ? user.firstName : "") + (user.firstName && user.lastName ? " " : "") + (user.lastName ? user.lastName : "") :
            user.authEmailCopy
         userIdToName.set(user.id, userName)
      })
      return userIdToName
   },
}

// function getUserRef(userId)  { return firebaseDB.ref("users/" + userId) }
// function getLikeRef(userId, dropItemId) { return firebaseDB.ref("users/" + userId + "/likes/" + dropItemId) }
// function createPayload(snapshot) { return {id: snapshot.key, value: snapshot.val() } }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

export default {
	namespaced: true,
	state,
	actions,
	getters
}