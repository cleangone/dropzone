import Vue from 'vue'
import { Notify, uid } from 'quasar'
import { firebaseDB, firebaseAuth } from 'boot/firebase'
import { SaleType, DropItemStatus } from '../constants/Constants.js';
	
/*
    user: <Key: auth userId>
        firstName
        lastName
        isAdmin   
        actions
            itemName
            action
            amount
            date
*/  

const state = {
	users: { },
    usersDownloaded: false,
}

const mutations = {
	addUser(state, payload) { Vue.set(state.users, payload.id, payload.value) },
	updateUser(state, payload) {

        // if it's a bid, update status if necessary

        console.log("mutations.updateUser", payload) 

        // full  
		Vue.set(state.users, payload.id, payload.value)
		//Object.assign(state.drops[payload.id], payload.value)
    },
    deleteUser(state, id) { Vue.delete(state.users, id) },
	setUsersDownloaded(state, value) { state.usersDownloaded = value },
}

const actions = {
	// create/update
	updateUser({ state }, payload) { 
        console.log("actions.updateUser", payload) 
        let ref = getUserRef(payload.id)

        if (state.users[payload.id]) {
            console.log("actions.updateUser: update") 
            ref.update(payload.user, error => {
                if (error) { showNegativeNotify("Error: " + error.message) }
                else { showPositiveNotify("Account updated") } 
            }) 
        }
        else {
            console.log("actions.updateUser: create") 
            ref.set(payload.user, error => {
                if (error) { showNegativeNotify("Error creating user: " + error.message) }
                else { showPositiveNotify("Account updated") } 
            })
        }
    },

	createUserFirebaseCallbacks({commit}) { 
        console.log("createUserFirebaseCallbacks") 
		let usersRef = firebaseDB.ref("users/") 
        usersRef.once('value', 
            snapshot => { commit('setUsersDownloaded', true) },
			error => { console.log("ref.once error", error.message) }
		)
        
        usersRef.on('child_added', snapshot => { commit('addUser', createPayload(snapshot)) })
        usersRef.on('child_changed', snapshot => { commit('updateUser', createPayload(snapshot)) }) 
        usersRef.on('child_removed', snapshot => { commit('deleteUser', snapshot.key) })
    }

}

const getters = {
    hasUsers: state => { 
        console.log("hasUsers") 
        return Object.keys(state.users).length > 0 
    },
    getUsers: state => {
        console.log("getUsers") 
        return state.users
    },
    getUser: state => userId => {
        let user = Object.assign({}, state.users[userId])

        if (!user) { return { firstName: '', lastName: '', isAdmin: false } }       
        if(!user.actions) { return user }

        // todo - breaks
        
        // console.log("getUser: user.actions", user.actions) 
        // let sortedKeys = Object.keys(user.actions)
        // sortedKeys.sort((key1, key2) => {
        //     // sort by date descending
        //     let date1 = user.items[key1].date
        //     let date2 = user.items[key2].date
    
        //     // -1: key1 first, 1 key2 first 
        //     if (date1 > date2 ) return -1
        //     else if (date2 > date1) return 1
        //     else return 0
        // })

        // let sortedActions = {}
        // sortedKeys.forEach(key => {
        //     sortedActions[key] = user.actions[key]
        // })
        // user.actions = sortedActions

        return user
    },
    isAdmin: state => userId => {
        return ( userId && state.users[userId] && state.users[userId].isAdmin )
    }
}

function getUserRef(userId) { return firebaseDB.ref("users/" + userId) }
function createPayload(snapshot) { return {id: snapshot.key, value: snapshot.val() } }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}


export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}