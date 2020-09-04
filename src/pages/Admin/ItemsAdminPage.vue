<template>
  <q-page>
      <div class="q-pt-sm q-px-sm text-h6 heading">
         Drop: {{ drop.name }}  
      </div>
      <div class="q-px-sm text-subtitle1 heading">
         Default Sale Type: {{ drop.defaultSaleType }}
      </div>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Items" :columns="columns" :visible-columns="visibleColumns" :data="items" 
				row-key="name" :filter="tableDataFilter" 
            selection="multiple" :selected.sync="selectedRowItems" :pagination.sync="pagination"
            :dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
				<q-td slot="body-cell-actions" slot-scope="props" :props="props" auto-width>
					<q-btn icon="edit"   @click="editItem(props.row.id)"                           size="sm" flat dense color="primary" />
    				<q-btn icon="delete" @click="promptToDeleteItem(props.row.id, props.row.name)" size="sm" flat dense color="red" />
  				</q-td>
			</q-table>
         <div class="q-mt-md">
			   <q-btn v-if="!rowsSelected" @click="showAddModal=true" icon="add" unelevated color="primary"/>
            <q-btn v-if="showInvoiceButton" @click="showInvoiceModal=true" label="Create Invoice" unelevated color="primary"/>
         </div>
		</div>

		<!-- 2 modals - don't want a race condition updating type  -->
		<q-dialog v-model="showAddModal">	
			<item-add-edit type="add" :dropId="dropId" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<item-add-edit type="edit" :dropId="dropId" :item="itemToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showInvoiceModal">	
			<invoice-add-edit type="create" :items="selectedRowItems" @close="showInvoiceModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  		return {
				dropId: '',
				showAddModal: false,
            showEditModal: false,
            showInvoiceModal: false,
				itemIdToEdit: '',
            tableDataFilter: '',
            selectedRowItems: [],
				visibleColumns: [ 'name', 'saleType', 'buyerName', 'startPrice', 'buyPrice', 'bids', 'status', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',       label: 'Name',        align: 'left',   field: 'name',       sortable: true },
				 	{ name: 'saleType',   label: 'Sale Type',   align: 'center', field: 'saleType',   sortable: true },
					{ name: 'buyerId',    label: 'BuyerId',     align: 'left',   field: 'buyerId',    sortable: true },
					{ name: 'buyerName',  label: 'Buyer',       align: 'left',   field: 'buyerName',  sortable: true },
					{ name: 'startPrice', label: 'Start Price', align: 'right',  field: 'startPrice', sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'buyPrice',   label: 'Final Price', align: 'right',  field: 'buyPrice',   sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'bids',       label: 'Bids',        align: 'center', field: 'bids',       sortable: true },
					{ name: 'status',     label: 'Status',      align: 'center', field: 'status',     sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
         ...mapGetters('drop', ['getDrop']),
         ...mapGetters('item', ['itemsExist', 'getItemsInDrop']),
			drop() { return this.getDrop(this.dropId) },
         itemToEdit() { return this.itemIdToEdit ? getItem(this.items, this.itemIdToEdit) : null },
         items() { 
            // make copies - vuex not happy with table minipulation of elements
            let items = this.getItemsInDrop(this.dropId) 
            let copies = []
            items.forEach(item => { copies.push(Object.assign({}, item)) })
            return copies
         },
         rowsSelected() { return this.selectedRowItems.length > 0 },
			showInvoiceButton() { 
            if (this.selectedRowItems.length == 0) { return false } 
            
            // selected rows have to have same buyer
            let buyerId = null
            for (var rowItem of this.selectedRowItems) {
               if (!rowItem.buyerId) { return false }
               if (buyerId == null) { buyerId = rowItem.buyerId }
               if (rowItem.buyerId != buyerId) { return false }
            }

            return true
         }
		},
		methods: {
			...mapActions('item', ['bindItems', 'deleteItem']),
			editItem(itemId) {
				// console.log("editItem", itemId)
				this.itemIdToEdit = itemId
				this.showEditModal = true
			},
			promptToDeleteItem(itemId, name) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteItem(itemId) })
			}
		},
		components: {
			'item-add-edit' : require('components/Item/ItemAddEdit.vue').default,
      	'invoice-add-edit' : require('components/Admin/InvoiceAddEdit.vue').default
      },
      created() {
			this.dropId = this.$route.params.dropId
         console.log("ItemsAdminPage: dropId=" + this.dropId)
         
         if (!this.itemsExist) { this.bindItems() } 
      },
   }
   
   function getItem(items, itemId) { 
      for (var item of items) {
         if (item.id == itemId) { return item }
      }

      return null
   }
</script>