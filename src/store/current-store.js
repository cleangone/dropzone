const state = {
   activity: false, 
}

const mutations = {
   setActivity(state, value) { state.activity = value },
}

const actions = {
   setCurrentActivity({ commit }, value) { commit ('setActivity', value) },
}

const getters = {
   currentActivityExists: state => { return state.activity },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
