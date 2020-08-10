import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth } from 'boot/firebase'

export const LocalStorageConst = Object.freeze({
    LOGGED_IN: "loggedIn"
})

const state = {
    userId: null,
    errorMessage: ''
}

const mutations = {
    setUserId(state, value) { state.userId = value },
    setErrorMessage(state, value) { state.errorMessage = value },
    resetErrorMessage(state) { 
        console.log('resetErrorMessage') 
        state.errorMessage = '' }
}

const actions = {
    // authPayload = {email: this.email, password: this.password}
    registerUser({commit}, authPayload) { 
        console.log('registerUser: ', authPayload) 

        firebaseAuth.createUserWithEmailAndPassword(authPayload.email, authPayload.password)
            .then(response => {
                console.log('registerUser:response', response) 
                commit('resetErrorMessage')
            })
            .catch(error => {
                console.log('registerUser:error.message', error.message) 
        
                // set error so components can react
                commit('setErrorMessage', error.message) 
            })
    },
    loginUser({commit}, authPayload) { 
        console.log('loginUser: ' + authPayload)    
        Loading.show()
        firebaseAuth.signInWithEmailAndPassword(authPayload.email, authPayload.password)
            .then(response => {
                console.log('loginUser:response', response) 
                Loading.hide()
                commit('resetErrorMessage')
            })
            .catch(error => {
                console.log('loginUser:error.message', error.message) 
                Loading.hide()

                // todo - really bad - persistence layer popping up message in ui
                //showErrorMessage(error.message)
                commit('setErrorMessage', error.message)
            }) 
    },
    logoutUser() { 
        console.log('logoutUser')    
        firebaseAuth.signOut()
    },
    handleAuthStateChange({commit, dispatch}) { 
        console.log('handleAuthStateChange')
        firebaseAuth.onAuthStateChanged(user => {
            Loading.hide()
            if (user) { 
                console.log('handleAuthStateChange: logged in', user)
                commit ('setUserId', user.uid) 

                // todo - semi-ugly - related data, but should this module care about LocalStorage?
                // LocalStorage.set(LocalStorageConst.LOGGED_IN, true)
                
                // todo - ugly for the persistance layer to drive the page
                this.$router.push('/')//.catch(err => {})

                // todo - more uglieness - auth should not know what type of data to populate
                dispatch ('drop/createFirebaseCallbacks', 
                    null, // payload
                    { root: true}) // options 
            }
            else { 
                console.log('handleAuthStateChange: logged out')
                commit ('setUserId', null) 
                this.$router.push('/')
                // LocalStorage.set(LocalStorageConst.LOGGED_IN, false)
                // this.$router.replace('/auth')//.catch(err => {})
            }
        })
   },
   resetErrorMessage({commit}) { commit('resetErrorMessage') }  // called by components once they have displayed error msg
}

const getters = {
    loggedIn: (state) => { return state.userId != null }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
