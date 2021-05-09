<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6 col-9">Held Items to be Invoiced</span>
         <q-select label="Select Buyer" v-model="selectedBuyer" :options="buyerOptions" class="col" dense/>
      </div>
      <q-table :data="displayItems" row-key="name" :columns="columns" :visible-columns="visibleColumns" 
            selection="multiple" :selected.sync="selectedRowItems" 
            :pagination.sync="pagination" :dense="$q.screen.lt.md" flat >
         <q-td slot="body-cell-drop" slot-scope="props" :props="props"> 
            {{ getDropIdToNameDropMap.get(props.row.dropId) }}
         </q-td>
      </q-table>
      <q-btn v-if="showInvoiceButton" @click="showInvoiceModal=true" label="Create Invoice" unelevated color="primary" class="q-mr-xs"/>
      <q-dialog v-model="showInvoiceModal">	
			<invoice-add-edit :items="selectedRowItems" @close="invoiceModalClosed()" />
		</q-dialog>
  </div>     
</template>

<script>
   import { mapGetters } from 'vuex'    
   import { Route, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'

   export default {
      data() {
	  		return {
            returnRoute: Route.TODO,
            visibleColumns: [ 'name', 'date', 'buyer', 'drop', 'price', 'status'],
 				columns: [
        			{ name: 'name',   label: 'Name',   align: 'left',   field: 'name',       sortable: true },
				 	{ name: 'buyer',  label: 'Buyer',  align: 'left',   field: 'buyerId',    sortable: true, format: val => this.userName(val) },
					{ name: 'date',   label: 'Date ' + localTimezone(), 
                                                  align: 'center', field: 'userUpdatedDate', sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'drop',   label: 'Drop',   align: 'center',                      sortable: true },
				 	{ name: 'price',  label: 'Price',  align: 'right',  field: 'startPrice', sortable: true, format: val => dollars(val) }, 
					{ name: 'status', label: 'Status', align: 'center', field: 'status' },
			   ],
            selectedRowItems: [],
            pagination: { rowsPerPage: 20 },
            selectedBuyer: null,
            showInvoiceModal: false,
			}
		},
		computed: {
         ...mapGetters('user', ['getUserIdToName']),
         ...mapGetters('drop', ['getDropIdToNameDropMap']), // only called once even though in table row iteration
         ...mapGetters('item', ['getHoldItems']),
         ...mapGetters('color', Colors),
         userIdToName() { return this.getUserIdToName },
         buyerOptions() {
            // return ["Bill", "Dan", ""]

            const buyerIds = new Set()
            for (var item of this.getHoldItems) {
               buyerIds.add(item.buyerId) 
            }
            const buyers = []
            for (var buyerId of buyerIds) {
               buyers.push({ label: this.userName(buyerId), value: buyerId })
            }
            buyers.sort((a, b) => (a.label < b.label) ? -1 : 1)
            buyers.push({ label: "", value: null })
           
            return buyers
         },
         displayItems() {
            if (!this.selectedBuyer || !this.selectedBuyer.value) { return this.getHoldItems }
            const displayItems = []
            for (var item of this.getHoldItems) {
               if (this.selectedBuyer.value == item.buyerId) { displayItems.push(item) }
            }
            return displayItems
         },
         showInvoiceButton() { 
            if (this.selectedRowItems.length == 0) { return false } 
            
            // selected rows have same buyer
            let buyerId = null
            for (var rowItem of this.selectedRowItems) {
               if (buyerId == null) { buyerId = rowItem.buyerId }
               else if (!rowItem.buyerId) { return false }
               else if (rowItem.buyerId != buyerId) { return false }
            }

            return true
         },
      },
		methods: {
         userName(userId) { return this.userIdToName.get(userId) },
		   invoiceModalClosed() { 
            this.showInvoiceModal = false 
            this.selectedRowItems = []
            this.selectedBuyer = null
         },
		},
      components: {
         'invoice-add-edit' : require('components/Invoice/InvoiceAddEdit.vue').default,
      },
   }
</script>