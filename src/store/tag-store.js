import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'

/*
   tag
      id - tag value
      category
*/

const state = { 
   tags: [] 
}

const actions = {
   bindTags: firestoreAction(({ bindFirestoreRef }) => { return bindFirestoreRef('tags', collection()) }),
   // createItem: firestoreAction((context, item) => {
   //    item.id = uid()
   //    item.createdDate = Date.now()
   //    collection().doc(item.id).set(item)
   // }),
   // setItem: firestoreAction((context, item) => { collection().doc(item.id).set(item) }),
   // updateItems: firestoreAction((context, itemUpdates) => { 
   //    // todo - research batching - no big deal right now - will only be 5-25 items
   //    itemUpdates.forEach(update => {
   //       collection().doc(update.id).update(update)
   //    })
   // }),
   // updateItem: firestoreAction((context, item) => { collection().doc(item.id).update(item) }),
   // deleteItem: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('tags') }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

const getters = {
   // tagsExist: state => category => { return state.items && state.items.length > 0 },
   getTags: state => category => { 
      let tags = []
      state.tags.forEach(tag => {
         if (tag.category == category) {
            console.log("getTags - tag", tag)
            tags.push(tag)
         }
      })

      tags.sort((a, b) => (a.id > b.id) ? 1 : -1)
      return tags
   },
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}