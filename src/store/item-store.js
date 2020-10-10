import { firestoreAction } from 'vuexfire'
import { firestore, firebaseStorage } from 'boot/firebase'
import { ItemMgr } from 'src/managers/ItemMgr.js'   
import { TagMgr } from 'src/managers/TagMgr.js'  
import { dateUid } from 'src/utils/Utils'

const state = { 
   items: [] 
}

const actions = {
   bindItems: firestoreAction(({ bindFirestoreRef }) => { return bindFirestoreRef('items', collection()) }),
   setItem: firestoreAction((context, item) => { 
      // console.log("setItem", item)
      if (!item.id) {
         item.id = dateUid()
         item.createdDate = Date.now()
      }

      collection().doc(item.id).set(item) 
      setThumbUrls(item)
   }),
   updateItems: firestoreAction((context, itemUpdates) => { 
      // todo - research vuexfire batching - no big deal right now - will only be 5-25 items
      // https://mesqueeb.github.io/vuex-easy-firestore/setup.html#installation
      itemUpdates.forEach(update => {
         collection().doc(update.id).update(update)
      })
   }),
   updateItem: firestoreAction((context, item) => { 
      collection().doc(item.id).update(item) 
      setThumbUrls(item)
   }),
   deleteItem: firestoreAction((context, id) => { collection().doc(id).delete() }),
}
   
function collection() { return firestore.collection('items') }

// not done by functions because they do not have access to downloadURL
function setThumbUrls(item) { setTimeout(() => { setThumbUrl(item, 0) }, 5000) }
function setThumbUrl(item, retry) { 
   const itemDesc = "item[id: " + item.id + "]"   
   const retryDesc =  retry ? ", "  + retry + " retries" : ""
   // console.log("setThumbUrl: " + itemDesc + retryDesc)
      
   if (retry > 5) { 
      console.log("setThumbUrl:" + itemDesc + " retries exceeded")
      return
   }

   let imageToUpdate = null
   let isPrimaryImage = false
   if (item.primaryImage && !item.primaryImage.thumbUrl) { 
      imageToUpdate = item.primaryImage 
      isPrimaryImage = true
   } 

   if (!imageToUpdate && item.images) {
      for (var image of item.images) {
         if (!image.thumbUrl) { imageToUpdate = image }
      }
   }

   if (imageToUpdate) { 
      const imageDesc = "image " + imageToUpdate.baseName + " of " + itemDesc
      console.log("setThumbUrl: updating " + imageDesc)
      var storageRef = firebaseStorage.ref()
      storageRef.child(imageToUpdate.thumbFilePath).getDownloadURL().then(function(url) {
         imageToUpdate.thumbUrl = url
         const itemUpdate = isPrimaryImage ? { primaryImage: item.primaryImage } : { images: item.images }
         collection().doc(item.id).update(itemUpdate) 
         
         // recursive call to set next thumb that needs it
         setThumbUrl(item, retry)
      })
      .catch(function(error) {
         console.log("setThumbUrl: error updating " + imageDesc, error)
         // recursive call to try check for thumb again after a delay
         // todo - if one in particular is having a problem, put it on a bypass list
         setTimeout(() => { setThumbUrl(item, ++retry) }, 1000)
      })
   }
}

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