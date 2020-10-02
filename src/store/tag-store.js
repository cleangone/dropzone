import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { dateUid } from 'src/utils/Utils'

/*
   tag
      id 
      name
      category
      sortName
*/

const state = { 
   tags: [] 
}

const actions = {
   bindTags: firestoreAction(({ bindFirestoreRef }) => { return bindFirestoreRef('tags', collection()) }),
   createTag: firestoreAction((context, tag) => {
      tag.id = dateUid()
      collection().doc(tag.id).set(tag)
   }),
   setTag: firestoreAction((context, tag) => { collection().doc(tag.id).set(tag) }),
   deleteTag: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('tags') }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

const getters = {
   tagsExist: state => category => { 
      for (var tag of state.tags) {
         if (tag.category == category) { return item }
      }
      return false   
   },
   getTags: state => category => { 
      let tags = []
      state.tags.forEach(tag => {
         if (tag.category == category) { tags.push(tag) }
      })

      tags.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)
      return tags
   },
   getTag: state => id => { 
      for (var tag of state.tags) {
         if (tag.id == id) { return tag }
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