import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'
import { Drop } from 'src/models/Drop.js';
   
/*
   drop:
      id
      name
      startDate
      bidAdditionalSeconds
*/

const state = {
	drops: [],
   // dropsDownloaded: false,
}

const actions = {
   bindDrops: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('drops', collection())
   }),
   createDrop: firestoreAction((context, drop) => {
      console.log("createDrop", drop)
      drop.id = uid()
      collection().doc(drop.id).set(drop)
   }),
   setDrop: firestoreAction((context, drop) => {
      console.log("setDrop", drop)
      collection().doc(drop.id).set(drop)
   }),
   deleteDrop: firestoreAction((context, id) => { 
      console.log("deleteDrop", id)
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('drops') }

// function getDropRef(dropId) { return getRef("drops/" + dropId) }
// function getDropItemRef(dropId, dropItemId) { return getRef("drops/" + dropId + "/items/" + dropItemId) }
// function getBidRef(dropId, dropItemId, bidId) { return getRef("drops/" + dropId + "/items/" + dropItemId + "/bids/" + bidId) }
// function getActionRef(userId, actionId) { return getRef("users/" + userId + "/actions/" + actionId) }
// function getRef(path) { return firebaseDB.ref(path) }

// function createPayload(snapshot) { return {id: snapshot.key, value: snapshot.val() } }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

const getters = {
   dropsExist: state => { return state.drops && state.drops.length > 0 },
   activeDropsExist: state => { 
      if (!state.drops) { return false } 
      
      for (var drop of state.drops) {
         if (Drop.isLive(drop) || Drop.isDropped(drop)) { return true }
      }

      return false
   },
   getDrops: state => { 
      // return state.drops
      // console.log("getDrops")
      const drops = [...state.drops];
      // console.log("drops", drops)
      drops.sort((a, b) => (a.startDate < b.startDate) ? -1 : 1)
      // console.log("sorted drops", drops)
      return drops
   },
   getDrop: state => dropId => {
      for (var drop of state.drops) {
         if (drop.id == dropId) { return drop }
      }

      return null
   },
   getActiveDropIds: state => { 
      let dropIds = []
      if (!state.drops) { return dropIds } 
   
      for (var drop of state.drops) {
         if (Drop.isLive(drop) || Drop.isDropped(drop)) { dropIds.push(drop.id) }
      }

      return dropIds
   },
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}