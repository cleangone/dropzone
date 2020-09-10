<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Invoices" :data="invoices" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="id" :filter="tableDataFilter"  :pagination.sync="pagination"
            no-data-label="No invoices"
				:dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-space />					
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>            
            <template v-slot:header="props">
               <q-tr :props="props">
                  <q-th auto-width /> <!-- expand col -->
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                  <q-th auto-width /> <!-- actions col -->
               </q-tr>
            </template>

            <q-td slot="body-cell-tracking" slot-scope="props" :props="props"> 
               blah
	         </q-td>

            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td auto-width>
                     <q-btn size="xs" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
                  <q-td auto-width>
                     <q-btn icon="edit" @click="editInvoice(props.row.id)" size="sm" color="primary" flat dense/>
                  </q-td>
               </q-tr>
               
               <template v-if="props.expand">
                  <q-tr v-for="detail in getInvoiceDetails(props.row.id)" :key="detail.name" :props="props">
                     <q-td />
                     <q-td />
                     <q-td class="text-left bg-grey-2">{{ detail.name }}</q-td>
                     <q-td class="text-right bg-grey-2">{{ detail.price }}</q-td>
                  </q-tr>
               </template>
            </template>
         </q-table>
		</div>

		<q-dialog v-model="showEditModal">
			<invoice-add-edit type="edit" :invoice="invoiceToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { InvoiceStatus } from 'src/utils/Constants.js'
   import { dollars } from 'src/utils/Utils'
   

	export default {
		data() {
	  	   return {
			   showEditModal: false,
				tableDataFilter: '',
            visibleColumns: ['userName', 'items', 'total', 'status', 'tracking', 'sentDate'],
 				columns: [
               { name: 'id', field: 'id' },                 
               { name: 'userName', label: 'User',     align: 'left',   field: 'userName', sortable: true },
					{ name: 'items',    label: 'Items',    align: 'left',   field: 'items',    sortable: true, format: val => this.itemsText(val) },
					{ name: 'total',    label: 'Total',    align: 'right',  field: 'total',    sortable: true, format: val => dollars(val) },
					{ name: 'status',   label: 'Status',   align: 'center', field: 'status',   sortable: true },
               { name: 'tracking', label: 'Tracking', align: 'center', field: 'tracking', sortable: true },
               { name: 'sentDate', label: 'Date',     align: 'left',   field: 'sentDate', sortable: true, format: val => formatDate(val) },
            ],
            pagination: { rowsPerPage: 30 },
            invoiceIdToEdit: '',
			}
		},
		computed: {
         ...mapGetters('invoice', ['invoicesExist', 'getInvoices', 'getInvoice']),
         invoiceToEdit() { return this.getInvoice(this.invoiceIdToEdit) },
         invoices() {
            let invs = this.getInvoices
            return invs
         },
      },
		methods: {
         ...mapActions('invoice', ['bindInvoices', 'deleteInvoice']),
         isDataCol(colName) { return (colName !== 'expand' && colName !== 'actions') },
         getInvoiceDetails(invoiceId) { 
            let details = []
            let invoice = this.getInvoice(invoiceId)
            for (var item of invoice.items) {
               details.push({ name: item.name, price: dollars(item.price) })
            }

            details.push({ name: "Shipping", price: dollars(invoice.shippingCharge) })
            if (invoice.priceAdjustment) { details.push({ name: "Adjustment", price: "(" + dollars(invoice.priceAdjustment) + ")" }) }

            return details 
         },
         itemsText(invoiceItems) {  
            let itemsText = ""
            if (!invoiceItems || invoiceItems.length == 0) { return itemsText }
            for (var item of invoiceItems) {
               if (itemsText.length) { itemsText += ", " }
               itemsText += item.name
            }

            return (itemsText.length > 30 ? itemsText.substring(0, 30) + "..." : itemsText)
         },
         editInvoice(invoiceId) {
				this.invoiceIdToEdit = invoiceId
				this.showEditModal = true
         },
         
			// promptToDeleteInvoice(dropId) {
         //    console.log("promptToDeleteDrop", dropId)
            
         //    this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.getDrop(dropId).name + '?', persistent: true,			
	      //   		ok: { push: true }, cancel: { push: true, color: 'grey' }
			// 	}).onOk(() => {
			// 		console.log("promptToDeleteDrop: calling deleteDrop", dropId)
			// 		this.deleteDrop(dropId)
			// 	})
         // }
		},
		components: {
			'invoice-add-edit' : require('components/Admin/InvoiceAddEdit.vue').default
      }
	}

   function formatDate(dateToFormat) {
      if (!dateToFormat) { return "" }

      let now = new Date()
      let datetime = new Date(dateToFormat)
      return (now.getYear() == datetime.getYear() ? 
         date.formatDate(datetime, 'MMM D, h:mm a') :
         date.formatDate(datetime, 'MMM D, YYYY h:mm a'))
   }
</script>