import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'

/*
   item
      id
      dropId
      name
      createdDate
      startPrice
      bidderIds
      currBidderId
      buyerId
      buyPrice
      lastUserActivityDate
      status: Available, Dropping, Hold
      dropDoneDate
*/

const state = { 
   items: [] 
}

const actions = {
   bindItems: firestoreAction(({ bindFirestoreRef }) => { return bindFirestoreRef('items', collection()) }),
   createItem: firestoreAction((context, item) => {
      item.id = uid()
      item.createdDate = Date.now()
      collection().doc(item.id).set(item)
   }),
   setItem: firestoreAction((context, item) => { collection().doc(item.id).set(item) }),
   updateItems: firestoreAction((context, itemUpdates) => { 
      // todo - research batching - no big deal right now - will only be 5-25 items
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
   getItemsInDrop: state => dropId => { 
      // console.log("getItemsInDrop", state.items)
      let dropItems = []
      let sortNamesExist = false
      state.items.forEach(item => {
         if (item.dropId == dropId) {
            dropItems.push(item)
            if (item.sortName) { sortNamesExist = true}
         }
      })

      if (sortNamesExist) { dropItems.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)}
      else { dropItems.sort((a, b) => (a.name > b.name) ? 1 : -1) } 
      return dropItems
   },
   getItemsInDrops: state => dropIds => {   
      // console.log("getItemsInDrops", dropIds)
      let dropsItems = []
      state.items.forEach(item => {
         if (dropIds.includes(item.dropId) ) {
            dropsItems.push(item)
         }
      })

      dropsItems.sort((a, b) => (a.lastUserActivityDate > b.lastUserActivityDate) ? -1 : 1)
      return dropsItems
   },
   getSpecifiedItems: state => itemIds => {   
      // console.log("getDropsItems", dropIds)
      let items = []
      state.items.forEach(item => {
         if (itemIds.includes(item.id) ) {
            items.push(item)
         }
      })

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