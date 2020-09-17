<template>
   <span>
      <span v-if="col.name == 'items'">
         {{ itemsText }} 
         <q-btn @click="showInvoice()" label="View" size="xs" color="primary" dense/>         
      </span>
      <span v-else-if="col.name == 'tracking'"> 
         {{ row.carrier }}
         <a v-if="hasTrackingLink" :href="trackingLink" target=”_blank”>{{ row.tracking }}</a>
         <span v-else>{{ row.tracking }}</span>
      </span>
      <span v-else-if="col.name == 'sentDate'">{{ sentDate }}</span>
      <span v-else>{{ col.value }}</span>   
      <q-dialog v-model="showModal">
			<invoice-display :invoice="row" @close="showModal=false" />
		</q-dialog>
   </span>
</template>

<script>
   import { date } from 'quasar'
   import { InvoiceMgr } from 'src/managers/InvoiceMgr.js'

	export default {
      props: ['row', 'col'],
      data() {
	  	   return {
			   showModal: false,
			}
		},
      computed: {
         itemsText() {  
            if (!this.row.items) { return "" }
            
            let itemsText = ""
            for (var item of this.row.items) {
               if (itemsText.length) { itemsText += ", " }
               itemsText += item.name
            }
            return (itemsText.length > 30 ? itemsText.substring(0, 30) + "..." : itemsText)
         },
         sentDate() { return formatDate(this.row.sentDate) },
         hasTrackingLink() { return InvoiceMgr.hasTrackingLink(this.row) },  
         trackingLink() { return InvoiceMgr.getTrackingLink(this.row) }, 
      },
		methods: {
         showInvoice() { this.showModal = true },
      },
      components: {
			'invoice-display' : require('components/Invoice/InvoiceDisplay.vue').default,
      }
   }
   
   function formatDate(dateToFormat) {
      if (!dateToFormat) { return "" }

      let now = new Date()
      let datetime = new Date(dateToFormat)
      return (now.getYear() == datetime.getYear() ? 
         date.formatDate(datetime, 'MMM D') :
         date.formatDate(datetime, 'MMM D, YYYY'))
   }

</script>