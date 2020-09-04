import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify, uid } from 'quasar'
import { ActionStatus, ActionType } from 'src/utils/Constants.js'
   
/*
   action:
      id
      actionType: bid, purchaseRequest
      itemId
      userId
      createdDate
      amount
      status: Submitted, Processed 
      processedDate
      actionResult: bid, outbid, purchased, alreadySold
*/

const actions = {
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

export default {
	namespaced: true,
	actions,
}