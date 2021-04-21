import { Notify } from 'quasar'

const state = {
   itemIds: [] // Set() does not drive push updates from getters
}

const mutations = {
   addItemId(state, itemId) { 
      if (!state.itemIds.includes(itemId)) { state.itemIds.push(itemId) } 
   },
   removeItemId(state, itemId) {    
      const index = state.itemIds.indexOf(itemId)
      if (index > -1) { state.itemIds.splice(index, 1) }
   },
   clear(state) { state.itemIds = [] },
}

const actions = {
   addItemIdToCart({ commit }, itemId) { 
      commit('addItemId', itemId) 
      showPositiveNotify("Item added to cart")
   },
   removeItemFromCart({ commit }, itemId) { 
      commit('removeItemId', itemId) 
   },
   clearCart({ commit }) { 
      commit('clear') 
   },
}

const getters = {
   cartSize: state  => { return state.itemIds.length },
   getCartItemIds: state => { return state.itemIds },
}

function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

