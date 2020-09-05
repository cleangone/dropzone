import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify, uid } from 'quasar'
import { ActionStatus, ActionType } from 'src/utils/Constants.js'
   
/*
   action:
      id
      actionType: bid, purchaseRequest
      itemId
      itemName
      userId
      createdDate
      amount
      status: Submitted, Processed 
      processedDate
      actionResult: bid, outbid, purchased, alreadySold
*/

const state = {
	actions: [],
   // dropsDownloaded: false,
}

const actions = {
   bindActions: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('actions', collection())
   }),
   submitBid: firestoreAction((context, action) => {
      console.log("submitBid", action)

      init(action, ActionType.BID)
      collection().doc(action.id).set(action)
   
      showPositiveNotify("Bid submitted")
   }),
   submitPurchaseRequest: firestoreAction((context, action) => {
      console.log("submitPurchaseRequest", action)
      
      init(action, ActionType.PURCHASE_REQ)
      collection().doc(action.id).set(action)
   
      showPositiveNotify("Purchase Request submitted")
   }),
}

function collection() { return firestore.collection('actions') }
function init(action, actionType) { 
   action.id = uid()
   action.actionType = actionType
   action.createdDate = Date.now()
   action.status = ActionStatus.CREATED
}

function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}

const getters = {
   actionsExist: state => { return state.actions && state.actions.length > 0 },
   getUserActions: state => userId => {
      let userActions = []
      for (var action of state.actions) {
         if (action.userId == userId) { userActions.push(action) }
      }

      return userActions
   },
}

export default {
	namespaced: true,
   state,
   getters,
   actions
}