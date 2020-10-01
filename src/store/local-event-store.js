
const state = {
   favoritesUpdated: false, 
}

const mutations = {
    setFavoritesUpdated(state, value) { state.favoritesUpdated = value },
}

const actions = {
   setFavorites({ commit }, updated) { commit ('setFavoritesUpdated', updated) },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
