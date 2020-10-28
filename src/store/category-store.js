import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { CategoryMgr } from 'src/managers/CategoryMgr'
import { dateUid } from 'src/utils/Utils'

const state = {
	categories: [],
}

const actions = {
   bindCategories: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('categories', collection())
   }),
   createCategory: firestoreAction((context, category) => {
      category.id = dateUid()
      collection().doc(category.id).set(category)
   }),
   updateCategory: firestoreAction((context, category) => {
      collection().doc(category.id).update(category)
   }),
   deleteCategory: firestoreAction((context, id) => { 
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('categories') }

const getters = {
   categoriesExist: state => { return state.categories && state.categories.length > 0 },
   getCategories: state => { 
      const categories = [...state.categories];
      categories.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
      return categories
   },
   getPublicCategories: state => { 
      const categories = []
      for (var category of state.categories) {
         if (CategoryMgr.isPublic(category)) { categories.push(category) }
      }

      categories.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
      return categories
   },
   getCategory: state => id => {
      for (var category of state.categories) {
         if (category.id == id) { return category }
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