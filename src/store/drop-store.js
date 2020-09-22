import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'
import { DropMgr } from 'src/managers/DropMgr.js';
   
/*
   drop:
      id
      name
      startDate
      bidAdditionalSeconds
*/

const state = {
	drops: [],
}

const actions = {
   bindDrops: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('drops', collection())
   }),
   createDrop: firestoreAction((context, drop) => {
      // console.log("createDrop", drop)
      drop.id = uid()
      collection().doc(drop.id).set(drop)
   }),
   setDrop: firestoreAction((context, drop) => {
      // console.log("setDrop", drop)
      collection().doc(drop.id).set(drop)
   }),
   deleteDrop: firestoreAction((context, id) => { 
      // console.log("deleteDrop", id)
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('drops') }

// function getDropRef(dropId) { return getRef("drops/" + dropId) }
// function getDropItemRef(dropId, dropItemId) { return getRef("drops/" + dropId + "/items/" + dropItemId) }
// function getBidRef(dropId, dropItemId, bidId) { return getRef("drops/" + dropId + "/items/" + dropItemId + "/bids/" + bidId) }
// function getActionRef(userId, actionId) { return getRef("users/" + userId + "/actions/" + actionId) }
// function getRef(path) { return firebaseDB.ref(path) }

function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

const getters = {
   dropsExist: state => { return state.drops && state.drops.length > 0 },
   activeDropsExist: state => { 
      if (!state.drops) { return false } 
      for (var drop of state.drops) { if (DropMgr.isLive(drop) || DropMgr.isDropped(drop)) { return true } }
      return false
   },
   getDrops: state => { 
      const drops = [...state.drops];
      drops.sort((a, b) => (a.startDate < b.startDate) ? -1 : 1)
      return drops
   },
   getDrop: state => dropId => {
      for (var drop of state.drops) {
         if (drop.id == dropId) { return drop }
      }
      return null
   },
   getDropIds: state => status => { 
      if (!state.drops) { return [] } 
   
      let dropIds = []
      for (var drop of state.drops) {
         if (DropMgr.isStatus(drop, status)) { dropIds.push(drop.id) }
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