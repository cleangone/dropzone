import Vue from 'vue'
import { Notify, uid } from 'quasar'
import { firebaseDB, firebaseAuth } from 'boot/firebase'
import { SaleType, DropStatus, DropItemStatus } from '../constants/Constants.js';
	
/*
    drop:
        name
        startDate
        startTime
        status: hidden, live, complete
        defaultSaleType: bid, buy 
        items:
            name 
            description
            imageUrl
            lastBidBuyActivityDate
            startPrice
            currPrice
            currBidderId
            buyerId
            status: available, dropping, hold, sold
            saleType: default, bid, buy
            dropDoneDate
            bids:
                userId
                time
                amount
*/  

const state = {
	drops: { },
    dropsDownloaded: false,
}

const mutations = {
	addDrop(state, payload) { Vue.set(state.drops, payload.id, payload.value) },
	updateDrop(state, payload) {

        // if it's a bid, update status if necessary

        console.log("mutations.updateDrop", payload) 

        // full  
		Vue.set(state.drops, payload.id, payload.value)
		//Object.assign(state.drops[payload.id], payload.value)
    },
    deleteDrop(state, id) { Vue.delete(state.drops, id) },
	setDropsDownloaded(state, value) { state.dropsDownloaded = value },
}

const actions = {
	createDrop({}, drop) { 
        // console.log("actions.createDrop", drop) 
        drop.state = "setup"
        let ref = getDropRef(uid())
        ref.set(drop, error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify(drop.name + " created") }
        })
    },
	updateDrop({}, payload) { 
        // console.log("actions.updateDrop", payload) 
        let ref = getDropRef(payload.id)
        ref.update(payload.value, error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify(payload.value.name + " updated") } 
        })
    },
	deleteDrop({ state }, id) { 
        console.log("actions.deleteDrop!!!", id) 
        let name = state.drops[id].name
        let ref = getDropRef(id)
        ref.remove(error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify("Drop " + name + " deleted") } 
        })
	},

    createDropItem({}, payload) { 
        console.log("actions.createDropItem", payload) 
        let ref = getDropItemRef(payload.dropId, uid())
        ref.set(payload.dropItem, error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify(payload.dropItem.name + " created") }
        })
    },
	updateDropItem({state}, payload) { 
        console.log("actions.updateDropItem", payload) 
        let name = state.drops[payload.dropId].items[payload.dropItemId].name

        let ref = getDropItemRef(payload.dropId, payload.dropItemId)
        ref.update(payload.dropItem, error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify(payload.dropItem.name + " updated") } 
        })
    },
    setWinningBid({state}, payload) { 
        console.log("actions.setWinningBid", payload) 
        let dropItem = state.drops[payload.dropId].items[payload.dropItemId]


        let ref = getDropItemRef(payload.dropId, payload.dropItemId)
        let bidWinDate = Date.now()
        ref.update({ status: DropItemStatus.HOLD, lastBidBuyActivityDate: bidWinDate }, error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify("You are the winning bidder for " + dropItem.name) } 
        })

        // todo - fix action type
        let action = { itemName: dropItem.name, action: "Winning Bid", amount: dropItem.currPrice, date: bidWinDate }
        console.log("actions.setWinningBid: creating user.action", action)
        let actionRef = getActionRef(dropItem.currBidderId, uid())
        actionRef.set(action, error => {
            if (error) { 
                console.log("actionRef.set error", error)
                showNegativeNotify("Error: " + error.message) 
            }})
    },
    deleteDropItem({}, payload) { 
        console.log("actions.deleteDropItem", payload) 
        let name = state.drops[payload.dropId].items[payload.dropItemId].name
        let ref = getDropItemRef(payload.dropId, payload.dropItemId)
        ref.remove(error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify(name + " deleted") } 
        })
    },
    submitBid({ state }, payload) { 
        // { dropId, dropItemId, userId, bidAmount }
        console.log("actions.submitBid", payload) 

        let drop = state.drops[payload.dropId]
        let dropItem = drop.items[payload.dropItemId]
        if (dropItem.status == DropItemStatus.HOLD || dropItem.status == DropItemStatus.SOLD ) {
            showNegativeNotify(dropItem.name + " not available")
            return
        }

        if (dropItem.currPrice >= payload.bidAmount) {
            showNegativeNotify(dropItem.name + " already a higher price")
            return
        }

        let bidDate = Date.now()
        let bid = { userId: payload.userId, amount: payload.bidAmount, bidDate: bidDate }
        let bidId = uid()			
        let bidRef = getBidRef(payload.dropId, payload.dropItemId, bidId)
        bidRef.set(bid, error => {
            if (error) { showNegativeNotify("Error: " + error.message) }
            else { showPositiveNotify(dropItem.name + " bid submitted") }
        })

        // todo - replace with firebase function
        let future = new Date()
        let extension = drop.bidAdditionalTime ? drop.bidAdditionalTime : 60
        future.setSeconds(future.getSeconds() + extension)

        let itemRef = getDropItemRef(payload.dropId, payload.dropItemId)
        let itemUpdate = { currPrice: payload.bidAmount, currBidderId: payload.userId, 
            status: DropItemStatus.DROPPING, 
            lastBidBuyActivityDate: bidDate,
            dropDoneDate: future.getTime() }
        itemRef.update(itemUpdate, error => {
            if (error) { showNegativeNotify("Error updating status: " + error.message) }
        })

        // todo - add to user.actions - also to be replaced by firebase function
        let action = { itemName: dropItem.name, action: SaleType.BID, amount: payload.bidAmount, date: bidDate }
        console.log("actions.submitBid: creating user.action", action)
        let actionRef = getActionRef(payload.userId, bidId)
        actionRef.set(action, error => {
            if (error) { 
                console.log("actionRef.set error", error)
                showNegativeNotify("Error: " + error.message) 
            }})
    },
    submitBuy({ state }, payload) { 
        console.log("actions.submitBuy", payload) 

        let dropItem = state.drops[payload.dropId].items[payload.dropItemId]
        if (dropItem.status == DropItemStatus.HOLD || dropItem.status == DropItemStatus.SOLD ) {
            showNegativeNotify(dropItem.name + " not available")
            return
        }

        let buyDate = Date.now()
        if (dropItem.status == DropItemStatus.AVAILABLE) {
            console.log("actions.submitBid: updating dropItem.status") 
            let itemRef = getDropItemRef(payload.dropId, payload.dropItemId)
            let item = { status: DropItemStatus.HOLD, buyerId: payload.userId, lastBidBuyActivityDate: buyDate }
            itemRef.update(item, error => {
                if (error) { showNegativeNotify("Error updating status: " + error.message) }
            })
        }

        let action = { itemName: dropItem.name, action: SaleType.BUY, amount: dropItem.price, date: buyDate }
        console.log("actions.submitBuy: creating user.action", action)
        let actionRef = getActionRef(payload.userId, uid())
        actionRef.set(action, error => {
            if (error) { 
                console.log("actionRef.set error", error)
                showNegativeNotify("Error: " + error.message) 
            }})
    },

	createFirebaseCallbacks({commit}) { 
        console.log("createFirebaseCallbacks") 
		let dropRef = firebaseDB.ref("drops/") 
        // let update = { thumbsUp: snapshot.val() }
        dropRef.once('value', 
            snapshot => { commit('setDropsDownloaded', true) },
			error => { console.log("ref.once error", error.message) }
		)
        
        dropRef.on('child_added', snapshot => { commit('addDrop', createPayload(snapshot)) })
        
        // todo - if a dropItem changes, the entire drop is updated
        dropRef.on('child_changed', snapshot => { commit('updateDrop', createPayload(snapshot)) }) 

        dropRef.on('child_removed', snapshot => { commit('deleteDrop', snapshot.key) })
    }

}

function getDropRef(dropId) { return getRef("drops/" + dropId) }
function getDropItemRef(dropId, dropItemId) { return getRef("drops/" + dropId + "/items/" + dropItemId) }
function getBidRef(dropId, dropItemId, bidId) { return getRef("drops/" + dropId + "/items/" + dropItemId + "/bids/" + bidId) }
function getActionRef(userId, actionId) { return getRef("users/" + userId + "/actions/" + actionId) }
function getRef(path) { return firebaseDB.ref(path) }

function createPayload(snapshot) { return {id: snapshot.key, value: snapshot.val() } }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

const getters = {
    hasDrops: state => { return Object.keys(state.drops).length > 0 },
    hasLiveDrops: state => { 
        // todo - looks like multiple returns doesn't work - can that be true?

        let liveDrops = false
        if (Object.keys(state.drops).length > 0) { 
            Object.values(state.drops).forEach(drop => {
                console.log("hasLiveDrops", drop)
                if (drop.status == DropStatus.LIVE) { 
                    console.log("hasLiveDrops - live drop")
                    liveDrops = true 
                }
            })
        }
        return liveDrops
    },
    getDrops: state => { return state.drops },
    getDrop: state => dropId => {
        // console.log("getDrop: dropId", dropId) 
        // console.log("getDrop:state.drops[dropId]", state.drops[dropId]) 

        if(!state.drops[dropId]) {
            console.log("Cannot find state.drops[dropId] - dropId " + dropId)
            return {}
        }

        let drop = Object.assign({}, state.drops[dropId])
        if(!drop.items) { return drop }

        // console.log("getDrop: drop.items", drop.items) 
        let sortedKeys = Object.keys(drop.items)
        sortedKeys.sort((key1, key2) => {
            let name1 = drop.items[key1].name
            let name2 = drop.items[key2].name
    
            // -1: key1 first, 1 key2 first 
            if (name1 < name2 ) return -1
            else if (name2 > name1) return 1
            else return 0
        })
    
        let sortedItems = {}
        sortedKeys.forEach(key => {
            sortedItems[key] = drop.items[key]
        })
        drop.items = sortedItems

        return drop
    },
    getDropItem: state => (dropId, dropItemId) => {
        // console.log("getDropItem: dropId", dropId) 
        // console.log("getDropItem: dropItemId", dropItemId) 

        return state.drops[dropId].items[dropItemId]
    },
    getDropId: state => dropItemId => {
        // bad idea - replace with map in mutations
        // console.log("getDropId: dropItemId", dropItemId) 
        let returnDropId = ""
        if (Object.keys(state.drops).length > 0) { 
            Object.keys(state.drops).forEach(dropId => {
                let drop = state.drops[dropId]
                // console.log("getDropId: checking drop", drop) 
                if (drop.items && Object.keys(drop.items) && Object.keys(drop.items).length > 0) { 
                    Object.keys(drop.items).forEach(itemId => { 
                        if (itemId == dropItemId) { returnDropId = dropId }
                    })
                }
            })
        }

        return returnDropId
    },
    getLiveDropItems: state => {
        console.log("getLiveDropItems") 
        
        let liveItems = {}
        if (Object.keys(state.drops).length > 0) { 
            Object.values(state.drops).forEach(drop => {
                if (drop.status == DropStatus.LIVE) { 
                    Object.keys(drop.items).forEach(key => { liveItems[key] = drop.items[key] })
                }
            })
        }

        let sortedKeys = Object.keys(liveItems)
        sortedKeys.sort((key1, key2) => {
            let date1 = liveItems[key1].lastBidBuyActivityDate
            let date2 = liveItems[key2].lastBidBuyActivityDate
    
            // -1: key1 first, 1: key2 first 
            if (date1 > date2 ) return -1
            else if (date2 > date1) return 1
            else return 0
        })

        let sortedItems = {}
        sortedKeys.forEach(key => {
            sortedItems[key] = liveItems[key]
        })
        
        return sortedItems
    }

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}