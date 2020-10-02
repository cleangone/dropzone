
const state = {
   itemIds: [], 
   itemActivity: false, 
}

const mutations = {
   setItemActivity(state, value) { state.itemActivity = value },
   setItemId(state, itemId) { 
      state.itemActivity = true 
      if (!state.itemIds.includes(itemId)) { state.itemIds.push(itemId)}
   },
}

const actions = {
   setImmediateItemActivity({ commit }, value) { commit ('setItemActivity', value) },
   addActiveItemId({ commit }, itemId) { commit ('setItemId', itemId) },
}

const getters = {
   activeItemsExist: state => { return state.itemIds.length > 0 },
   getActiveItemIds: state => { return state.itemIds },
   immediateItemActivityExists: state => { return state.itemActivity },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
