import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'
import { InvoiceStatus } from 'src/utils/Constants.js'
   

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
    invoices: []
}

const actions = {
   bindInvoices: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('invoices', collection())
   }),
   createInvoice: firestoreAction((context, invoice) => {
      console.log("createInvoice", invoice)
      invoice.id = uid()
      invoice.createdDate = Date.now()
      invoice.total = invoice.subTotal + invoice.shippingCharge - invoice.priceAdjustment 
   
      collection().doc(invoice.id).set(invoice)
   }),
   setInvoice: firestoreAction((context, invoice) => {
      console.log("setInvoice", invoice)
      if (invoice.status == InvoiceStatus.SENT) { invoice.status = InvoiceStatus.UPDATED }
      invoice.total = invoice.subTotal + invoice.shippingCharge - invoice.priceAdjustment 
   
      collection().doc(invoice.id).set(invoice)
   }),
   deleteInvoice: firestoreAction((context, id) => { 
      console.log("deleteInvoice", id)
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('invoices') }

const getters = {
   invoicesExist: state => { return state.invoices && state.invoices.length > 0 },
   getInvoices: state => { return state.invoices },
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