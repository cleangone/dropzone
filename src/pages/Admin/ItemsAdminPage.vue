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
            <q-td slot="body-cell-artist" slot-scope="props" :props="props"> 
              {{ artist(props.row) }}
            </q-td>
            <q-td slot="body-cell-price" slot-scope="props" :props="props"> 
              {{ priceText(props.row) }}
            </q-td>
            <q-td slot="body-cell-bids" slot-scope="props" :props="props"> 
               <a v-if="props.row.numberOfBids > 0" :href="'#/admin/bids/' + props.row.id">{{ props.row.numberOfBids }}</a>
	         </q-td>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props" auto-width>
               <q-btn icon="edit"   @click="editItem(props.row.id)"                           size="sm" flat dense color="primary" />
               <q-btn icon="delete" @click="promptToDeleteItem(props.row.id, props.row.name)" size="sm" flat dense color="red" />
            </q-td> 
			</q-table>
         <div class="q-mt-md"> 
			   <q-btn v-if="!rowsSelected"      @click="showAddModal=true"      icon="add"             unelevated color="primary"/>
            <q-btn v-if="!rowsSelected"      @click="showBulkAddModal=true"  label="Bulk Add"       unelevated color="primary" class="q-ml-xs"/>
            <q-btn v-if="showInvoiceButton"  @click="showInvoiceModal=true"  label="Create Invoice" unelevated color="primary" class="q-mr-xs"/>
            <q-btn v-if="showBulkEditButton" @click="showBulkEditModal=true" label="Bulk Edit"      unelevated color="primary"/>
         </div> 
         <div style="height: 75px"/>
		</div>
 
		<!-- 2 modals - don't want a race condition updating type  -->
		<q-dialog v-model="showAddModal">	
			<item-add-edit type="add" :dropId="dropId" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<item-add-edit type="edit" :dropId="dropId" :item="itemToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showBulkAddModal">	
			<item-bulk-add :dropId="dropId" />
		</q-dialog>
      <q-dialog v-model="showBulkEditModal">	
			<item-bulk-edit :items="selectedRowItems" @close="showBulkEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showInvoiceModal">	
			<invoice-add-edit type="create" :items="selectedRowItems" @close="showInvoiceModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ItemStatus } from 'src/utils/Constants.js'
   import { Tag } from 'src/models/Tag.js'
   import { dollars } from 'src/utils/Utils'
	
	export default {
		data() {
	  		return {
				dropId: '',
				showAddModal: false,
            showEditModal: false,
            showBulkAddModal: false,
            showBulkEditModal: false,
            showInvoiceModal: false,
				itemIdToEdit: '',
            tableDataFilter: '',
            selectedRowItems: [],
				visibleColumns: [ 'name', 'artist', 'saleType', 'buyerId', 'price', 'bids', 'status', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',       label: 'Name',        align: 'left',   field: 'name',         sortable: true },
				 	{ name: 'artist',     label: 'Artist',      align: 'left',   field: 'artist',       sortable: true },
				 	{ name: 'saleType',   label: 'Sale Type',   align: 'center', field: 'saleType',     sortable: true },
					{ name: 'buyerId',    label: 'Buyer',       align: 'left',   field: 'buyerId',      sortable: true, format: val => this.userName(val) },
					{ name: 'price', label: 'Start/Final Price',align: 'right',  field: 'startPrice',   sortable: true },
					{ name: 'bids',       label: 'Bids',        align: 'center', field: 'numberOfBids', sortable: true },
					{ name: 'status',     label: 'Status',      align: 'center', field: 'status',       sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
         ...mapGetters('drop', ['getDrop']),
         ...mapGetters('item', ['itemsExist', 'getItemsInDrop']),
			...mapGetters('user', ['getUserIdToName']),
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
         userIdToName() { return this.getUserIdToName },
			showInvoiceButton() { 
            if (this.selectedRowItems.length == 0) { return false } 
            
            // selected rows have same buyer and are not Sold
            let buyerId = null
            for (var rowItem of this.selectedRowItems) {
               if (rowItem.status == ItemStatus.SOLD) { return false }
               if (!rowItem.buyerId) { return false }
               if (buyerId == null) { buyerId = rowItem.buyerId }
               if (rowItem.buyerId != buyerId) { return false }
            }

            return true
         },
         showBulkEditButton() { 
            if (this.selectedRowItems.length < 2) { return false } 
            for (var rowItem of this.selectedRowItems) {
               if (!(rowItem.status == ItemStatus.SETUP || rowItem.status == ItemStatus.AVAILABLE || rowItem.status == ItemStatus.HOLD)) { return false }
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
         priceText(row) { 
            let text = dollars(row.startPrice) 
            if (row.buyPrice && (row.buyPrice != row.startPrice)) { text += ("/" + dollars(row.buyPrice))}
            return text 
         },
         artist(row) { return Tag.artist(row) },
         userName(userId) { return this.userIdToName.get(userId) },
			promptToDeleteItem(itemId, name) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteItem(itemId) })
			}
		},
		components: {
			'item-add-edit'    : require('components/Item/ItemAddEdit.vue').default,
      	'item-bulk-add'    : require('components/Item/ItemBulkAdd.vue').default,
      	'item-bulk-edit'   : require('components/Item/ItemBulkEdit.vue').default,
      	'invoice-add-edit' : require('components/Invoice/InvoiceAddEdit.vue').default
      },
      created() {
			this.dropId = this.$route.params.dropId
         // console.log("ItemsAdminPage: dropId=" + this.dropId)
         
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