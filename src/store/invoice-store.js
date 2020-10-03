import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'
import { InvoiceSendStatus } from 'src/managers/InvoiceMgr.js'
   
/*
   invoice
      id
      userId
      updatedDate
      items[] - id, name, price
      status: created, updated, sent, paid, shipped
      subTotal
      shippingCharge
      priceAdjustment
      total
*/

const state = {   
    invoices: [],
    userInvoices: []
}

const actions = {
   bindInvoices: firestoreAction(({ bindFirestoreRef }) => {
      console.log("bindInvoices")
      return bindFirestoreRef('invoices', collection())
   }),
   bindUserInvoices: firestoreAction(({ bindFirestoreRef }, userId) => {
      console.log("bindUserInvoices", userId)
      return bindFirestoreRef('userInvoices', collection().where('userId', '==', userId)) 
   }),
   createInvoice: firestoreAction((context, invoice) => {
      // console.log("createInvoice", invoice)
      invoice.id = uid()
      collection().doc(invoice.id).set(invoice)
   }),
   setInvoice: firestoreAction((context, invoice) => {
      // console.log("setInvoice", invoice)
      collection().doc(invoice.id).set(invoice)
   }),
   sendInvoice:   firestoreAction((context, id) => { collection().doc(id).update({ sendStatus: InvoiceSendStatus.SENDING }) }),
   updateInvoice: firestoreAction((context, invoice) => { collection().doc(invoice.id).update(invoice) }),
   deleteInvoice: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('invoices') }

const getters = {
   invoicesExist: state => { return state.invoices && state.invoices.length > 0 },
   // userInvoicesExist: state => { return state.userInvoices && state.userInvoices.length > 0 },
   getInvoices: state => { 
      let invoices = []
      for (var invoice of state.invoices) {
         if (invoice.id != "0") { invoices.push((Object.assign({}, invoice))) }
      }

      return invoices
   },
   getUserInvoices: state => userId => {  // pass in userId as double-check
      for (var invoice of state.userInvoices) {
         if (invoice.userId != userId) { throw new Error(
            "Error in getUserInvoices.  Specified userId " + 
               userId + " different than invoice[id:" + invoice.id +  ", userId:" + invoice.userId + "]") 
         }
      }

      return state.userInvoices
   },
   getInvoice: state => invoiceId => {
      for (var invoice of state.invoices) {
         if (invoice.id == invoiceId) { return invoice }
      }

      return null
  },
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}