<template>
   <span>
      <!-- userName, name, total (formatted), status, tracking, sentDate -->
      <span v-if="col.name == 'name'">
         {{ col.value }} 
         <!-- todo - tooltip not showing -->
         <q-btn @click="showInvoice()" icon="pageview" size="sm" color="primary" flat dense /> 
            <!-- <q-tooltip>View Invoice</q-tooltip> -->
         <!-- </q-btn>       -->
      </span>
      <span v-else-if="col.name == 'tracking'"> 
         {{ invoice.carrier }}
         <a v-if="hasTrackingLink" :href="trackingLink" target=”_blank”>{{ invoice.tracking }}</a>
         <span v-else>{{ invoice.tracking }}</span>
      </span>
      <span v-else-if="col.name == 'sentDate'">
         {{ sentDate }}
         <span v-if="isAdmin">
            <q-btn v-if="needToSend" @click="send()" label="Send" size="xs" color="primary" dense/>   
            <q-btn v-else-if="needToResend" @click="send()" icon="replay" size="sm" color="primary" flat dense/>            
         </span>
      </span>
      <span v-else>{{ col.value  }}</span>

      <q-dialog v-model="showModal">
			<invoice-display :invoice="invoice" @close="showModal=false" />
		</q-dialog>
   </span>
</template>

<script>
   import { mapActions } from 'vuex'
   import { date } from 'quasar'
   import { InvoiceMgr } from 'src/managers/InvoiceMgr.js'
   import { formatDateOptYear } from 'src/utils/DateUtils'

	export default {
      props: ['invoice', 'col', 'isAdmin'],
      data() {
	  	   return {
			   showModal: false,
			}
		},
      computed: {
         sentDate() { return InvoiceMgr.isSending(this.invoice) ? "Sending" : formatDateOptYear(this.invoice.sentDate) },         
         hasTrackingLink() { return InvoiceMgr.hasTrackingLink(this.invoice) },  
         trackingLink() { return InvoiceMgr.getTrackingLink(this.invoice) }, 
         needToSend() { return !this.invoice.sentDate },
         needToResend() { return InvoiceMgr.needToResend(this.invoice) },
      },
		methods: {
         ...mapActions('invoice', ['sendInvoice']),         
         showInvoice() { this.showModal = true },
         send() { this.sendInvoice(this.invoice.id) },
      },
      components: {
			'invoice-display' : require('components/Invoice/InvoiceDisplay.vue').default,
      }
   }

</script>