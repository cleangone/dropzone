import { firestoreAction } from 'vuexfire'
import { firestore, firebaseStorage } from 'boot/firebase'
import { uid } from 'quasar'
import { ItemMgr } from 'src/managers/ItemMgr.js'   
import { TagMgr } from 'src/managers/TagMgr.js'   

const state = { 
   items: [] 
}

const actions = {
   bindItems: firestoreAction(({ bindFirestoreRef }) => { return bindFirestoreRef('items', collection()) }),
   setItem: firestoreAction((context, item) => { 
      // console.log("setItem", item)
      if (!item.id) {
         // console.log("creating item")
         item.id = uid()
         item.createdDate = Date.now()
      }
      
      item.thumbFilePath

      if (item.thumbUrl || !item.thumbFilePath) { 
         // image not set/changed
         collection().doc(item.id).set(item) 
      }
      else {
         console.log("getting thumbUrl", item.thumbFilePath)
         var storageRef = firebaseStorage.ref()
         storageRef.child(item.thumbFilePath).getDownloadURL().then(function(url) {
            // console.log("getDownloadURL", url)
            item.thumbUrl = url
            collection().doc(item.id).set(item) 
         })
         .catch(function(error) {
            console.log("Cannot get downloadURL from thumbnail " + thumbFilePath, error)
         })
      }
   }),
   updateItems: firestoreAction((context, itemUpdates) => { 
      
      // todo - research vuexfire batching - no big deal right now - will only be 5-25 items
      // https://mesqueeb.github.io/vuex-easy-firestore/setup.html#installation

      itemUpdates.forEach(update => {
         collection().doc(update.id).update(update)
      })
   }),
   updateItem: firestoreAction((context, item) => { collection().doc(item.id).update(item) }),
   deleteItem: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('items') }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

const getters = {
   itemsExist: state => { return state.items && state.items.length > 0 },
   getItems: state => itemIds => {   
      // console.log("getItems", itemIds)
      let items = []
      state.items.forEach(item => {
         if (itemIds.includes(item.id) ) { items.push(item) }
      })
      return items
   },
   getItemsInDrop: state => dropId => { 
      // console.log("getItemsInDrop", state.items)
      let items = []
      state.items.forEach(item => {
         if (item.dropId == dropId) { items.push(item) }
      })

      items.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)
      return items
   },
   getItemsInDrops: state => dropIds => {   
      // console.log("getItemsInDrops", dropIds)
      let items = []
      state.items.forEach(item => {
         if (dropIds.includes(item.dropId)) { items.push(item) }
      })
      return items
   },
   getActiveItemsWithTag: state => tag => { 
      // console.log("getItemsWithTag", tag)
      let items = []
      state.items.forEach(item => {
         if (ItemMgr.isActive(item) && TagMgr.hasTag(item, tag)) { items.push(item) }
      })

      items.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)
      return items
   },
   getItem: state => itemId => { 
      for (var item of state.items) {
         if (item.id == itemId) { return item }
      }
      return null
   },
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}