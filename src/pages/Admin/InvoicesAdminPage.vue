<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Invoices" :data="invoices" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="id" :filter="tableDataFilter"  :pagination.sync="pagination"
            no-data-label="No invoices" flat :dense="$q.screen.lt.md" class="q-mb-sm">
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
            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td auto-width>
                     <q-btn v-if="hasTracking(props.row)" size="xs" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                     <invoice-td :invoice="props.row" :col="col" isAdmin="true"/>
                  </q-td>
                  <q-td auto-width>
                     <q-btn icon="edit" @click="editInvoice(props.row.id)" size="sm" color="primary" flat dense/>
                  </q-td>
               </q-tr>   
               <template v-if="props.expand">
                  <q-tr>
                     <q-td colspan="2"/>
                     <q-td class="text-left bg-grey-2" colspan="2">
                        <a v-if="hasTrackingLink(props.row)" :href="trackingLink(props.row)" target=”_blank”>
                           {{ props.row.carrier }} - {{ props.row.tracking }}
                        </a>
                        <span v-else>Tracking: {{ props.row.carrier }} - {{ props.row.tracking }}</span> 
                     </q-td>
                  </q-tr>
               </template>
            </template>
         </q-table>
		</div>

		<q-dialog v-model="showEditModal">
			<invoice-add-edit :type="edit" :invoice="invoiceToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { InvoiceMgr, InvoiceSendStatus } from 'src/managers/InvoiceMgr'
   import { UI } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   
	export default {
		data() {
	  	   return {
			   showEditModal: false,
				tableDataFilter: '',
            visibleColumns: ['userName', 'name', 'total', 'status', 'sentDate'],
 				columns: [
               { name: 'userName', label: 'User',      align: 'left',   field: 'userFullName', sortable: true },
					{ name: 'name',     label: 'Name',      align: 'left',   field: 'name',         sortable: true },
					{ name: 'total',    label: 'Total',     align: 'right',  field: 'total',        sortable: true, format: val => dollars(val) },
					{ name: 'status',   label: 'Status',    align: 'center', field: 'status',       sortable: true },
               { name: 'sentDate', label: 'Sent Date', align: 'left',   field: 'sentDate',     sortable: true },
            ],
            pagination: { rowsPerPage: 30 },
            invoiceIdToEdit: '',
			}
		},
		computed: {
         ...mapGetters('invoice', ['getInvoices', 'getInvoice']),
         invoiceToEdit() { return this.getInvoice(this.invoiceIdToEdit) },
         invoices() { return this.getInvoices },
         edit() { return UI.EDIT },
      },
		methods: {
         ...mapActions('invoice', ['deleteInvoice']),
         getInvoiceDetails(invoiceId) { return InvoiceMgr.getDetails(this.getInvoice(invoiceId)) },
         editInvoice(invoiceId) {
            this.invoiceIdToEdit = invoiceId
				this.showEditModal = true
         },
         hasTracking(invoice) { return InvoiceMgr.hasTracking(invoice) },
		   hasTrackingLink(invoice) { return InvoiceMgr.hasTrackingLink(invoice) },
		   trackingLink(invoice) { return InvoiceMgr.getTrackingLink(invoice) }
		},
		components: {
			'invoice-add-edit' : require('components/Invoice/InvoiceAddEdit.vue').default,
      	'invoice-td' : require('components/Invoice/InvoiceTd.vue').default
      }
   }
   
</script>