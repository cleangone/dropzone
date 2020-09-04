// import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth } from 'boot/firebase'
import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'

// export const LocalStorageConst = Object.freeze({
//     LOGGED_IN: "loggedIn"
// })

const state = {
   // vuex goes crazy if the entire user is stored 
   userId: null,
   // errorMessage: ''
}

const mutations = {
    setUserId(state, id) { state.userId = id },
}

const actions = {
   async reload({}) { return firebaseAuth.currentUser.reload() },
   async registerUser({}, payload) { return firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password) },
   async loginUser({}, payload) { return firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password) },
   async sendPasswordResetEmail({}, email) { return firebaseAuth.sendPasswordResetEmail(email) },
   async updateEmail({}, email) { return firebaseAuth.currentUser.updateEmail(email) },
   logoutUser() { firebaseAuth.signOut() },
   

   //  // authPayload = {email: this.email, password: this.password}
   //  registerUser({commit}, authPayload) { 
   //      console.log('registerUser: ', authPayload) 

   //      firebaseAuth.createUserWithEmailAndPassword(authPayload.email, authPayload.password)
   //          .then(response => {
   //              console.log('registerUser:response', response) 
   //              commit('resetErrorMessage')
   //          })
   //          .catch(error => {
   //              console.log('registerUser:error.message', error.message) 
        
   //              // set error so components can react
   //              commit('setErrorMessage', error.message) 
   //          })
   //  },
   //  loginUser({commit}, authPayload) { 
   //      console.log('loginUser: ' + authPayload)    
   //      Loading.show()
   //      firebaseAuth.signInWithEmailAndPassword(authPayload.email, authPayload.password)
   //          .then(response => {
   //              console.log('loginUser:response', response) 
   //              Loading.hide()
   //              commit('resetErrorMessage')
   //          })
   //          .catch(error => {
   //              console.log('loginUser:error.message', error.message) 
   //              Loading.hide()

   //              // todo - really bad - persistence layer popping up message in ui
   //              //showErrorMessage(error.message)
   //              commit('setErrorMessage', error.message)
   //          }) 
   //  },
   //  logoutUser() { 
   //      console.log('logoutUser')    
   //      firebaseAuth.signOut()
   //  },
   //  handleAuthStateChange({commit, dispatch}) { 
   //      console.log('handleAuthStateChange')
   //      firebaseAuth.onAuthStateChanged(user => {
   //          Loading.hide()
   //          if (user) { 
   //              console.log('handleAuthStateChange: logged in', user)
   //              commit ('setUserId', user.uid) 

   //              // todo - semi-ugly - related data, but should this module care about LocalStorage?
   //              // LocalStorage.set(LocalStorageConst.LOGGED_IN, true)
                
   //              // todo - ugly for the persistance layer to drive the page
   //              this.$router.push('/')//.catch(err => {})

   //              // todo - more uglieness - auth should not know what type of data to populate
   //             //  dispatch ('drop/createFirebaseCallbacks', 
   //             //      null, // payload
   //             //      { root: true}) // options 
   //          }
   //          else { 
   //              console.log('handleAuthStateChange: logged out')
   //              commit ('setUserId', null) 
   //              this.$router.push('/')
   //              // LocalStorage.set(LocalStorageConst.LOGGED_IN, false)
   //              // this.$router.replace('/auth')//.catch(err => {})
   //          }
   //      })
   // },

   handleAuthStateChange({commit, dispatch}) { 
      console.log('handleAuthStateChange')
      firebaseAuth.onAuthStateChanged(user => {
         if (user) { 
            // console.log('handleAuthStateChange: logged in', user)
            commit ('setUserId', user.uid)    
            usersCollection().doc(user.uid).update({ authEmailCopy: firebaseAuth.currentUser.email })
         }
         else { 
            // console.log('handleAuthStateChange: logged out')
            commit ('setUserId', null) 
            this.$router.push("/")
         }
      })
   },
}

function usersCollection() { return firestore.collection('users') }

const getters = {
   loggedIn: (state) => { return state.userId != null },
   userId: (state) => { return state.userId },
   currentUser: (state) => { 
      console.log("auth-store.currentUser")
      return state.userId ? firebaseAuth.currentUser : null 
   },
   userEmail() { return this.currentUser ? this.currentUser.email : null },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
