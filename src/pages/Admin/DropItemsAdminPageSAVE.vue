<template>
  <q-page>
      <div class="q-pt-sm q-px-sm text-h6 heading">
         Drop: {{ drop.name }}  
         <q-btn icon="edit" @click="showEditDropModal=true" size="sm" flat dense color="primary" />
      </div>
      <div class="q-px-sm">
         <span class="text-subtitle1 heading">{{ dropStatus }}, Default Sale Type: {{ drop.defaultSaleType }}</span>
         <span class="text-grey-10 float-right" color="grey-10">
			   <q-checkbox v-model="showSaleType" label="SaleType" dense />
            <q-checkbox v-model="showBuyer"    label="Buyer"    dense class="q-ml-sm"/>
            <q-checkbox v-model="showBids"     label="Bids"     dense class="q-ml-sm"/>
         </span>
		</div>
		<div class="q-pa-sm absolute full-width full-height">
         <q-table v-if="itemsExist" title="Items" :data="items" 
            :columns="columns" :visible-columns="visibleColumns" row-key="name" :filter="tableDataFilter"
            selection="multiple" :selected.sync="selectedRowItems" :pagination.sync="pagination" :dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template> 
            <q-td slot="body-cell-price" slot-scope="props" :props="props"> 
               {{ priceText(props.row) }}
            </q-td>
            <q-td slot="body-cell-bids" slot-scope="props" :props="props"> 
               <a v-if="props.row.numberOfBids > 0" :href="'#/bids/' + props.row.id">{{ props.row.numberOfBids }}</a>
	         </q-td>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props" auto-width>
               <q-btn icon="edit"   @click="editItem(props.row.id)"   @click.stop size="sm" flat dense color="primary" />
               <q-btn icon="photo"  @click="editImages(props.row.id)" @click.stop size="sm" flat dense color="primary" />
               <q-btn icon="delete" @click="promptToDeleteItem(props.row.id, props.row.name)" @click.stop size="sm" flat dense color="red" />
            </q-td> 
			</q-table>

         <div class="q-mt-md"> 
			   <q-btn v-if="!rowsSelected"       @click="showAddModal=true"       icon="add"                unelevated color="primary"/>
            <q-btn v-if="!rowsSelected"       @click="showBulkAddModal=true"   label="Bulk Add"          unelevated color="primary" class="q-ml-xs"/>
            <q-btn v-if="showSortDatesButton" @click="showSortDatesModal=true" label="Sort Create Dates" unelevated color="primary" class="q-mr-xs"/>
            <q-btn v-if="showInvoiceButton"   @click="showInvoiceModal=true"   label="Create Invoice"    unelevated color="primary" class="q-mr-xs"/>
            <q-btn v-if="showBulkEditButton"  @click="showBulkEditModal=true"  label="Bulk Edit"         unelevated color="primary" class="q-mr-xs"/>
            <q-btn v-if="showQuickEditButton" @click="showQuickEditModal=true" label="Quick Edit"        unelevated color="primary"/>
         </div> 
         <div style="height: 75px"/>
		</div>
 
      <q-dialog v-model="showSortDatesModal">	
			<item-sort-dates :items="selectedRowItems" @close="showSortDatesModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditDropModal">
         <drop-add-edit type="edit" :drop="drop" @close="showEditDropModal=false" />
		</q-dialog>
      <q-dialog v-model="showAddModal">	
			<item-add-edit type="add" :dropId="dropId" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<item-add-edit type="edit" :dropId="dropId" :item="itemToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showBulkAddModal">	
			<item-bulk-add :dropId="dropId" @close="showBulkAddModal=false"/>
		</q-dialog>
      <q-dialog v-model="showBulkEditModal">	
			<item-bulk-edit :items="selectedRowItems" @close="bulkEditDone" />
		</q-dialog>
      <q-dialog v-model="showQuickEditModal">	
			<item-quick-edit :items="selectedRowItems" @close="quickEditDone" />
		</q-dialog>
      <q-dialog v-model="showInvoiceModal">	
			<invoice-add-edit type="Create" :items="selectedRowItems" @close="showInvoiceModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr'
	import { ItemMgr } from 'src/managers/ItemMgr'
	import { TagMgr } from 'src/managers/TagMgr'
   import { dollars } from 'src/utils/Utils'
   import { formatDateTimeOptYear } from 'src/utils/DateUtils'

	export default {
		data() {
	  		return {
            dropId: '',
            showSaleType: true,
            showBuyer: true,
				showBids: true,
				showSortDatesModal: false,
				showEditDropModal: false,
				showAddModal: false,
            showEditModal: false,
            showBulkAddModal: false,
            showBulkEditModal: false,
            showQuickEditModal: false,
            showInvoiceModal: false,
				itemIdToEdit: '',
            tableDataFilter: '',
            selectedRowItems: [],
				displayColumns: [ 'name', 'sort',  'category', 'tag', 'artist', 'price', 'status', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',       label: 'Name',        align: 'left',   field: 'name',         sortable: true },
				 	{ name: 'sort',       label: 'Sort',        align: 'left',   field: 'sortName',     sortable: true },
				 	{ name: 'category',   label: 'Artist',      align: 'center', field: 'category',     sortable: true, format: val => val ? val.name : "" },
				 	{ name: 'tag',        label: 'Category',    align: 'center', field: 'tempTag',      sortable: true },
				 	{ name: 'saleType',   label: 'Sale Type',   align: 'center', field: 'saleType',     sortable: true },
					{ name: 'buyerId',    label: 'Buyer',       align: 'left',   field: 'buyerId',      sortable: true, format: val => this.userName(val) },
					{ name: 'price', label:'Start/Final Price', align: 'right',  field: 'startPrice',   sortable: true },
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
			visibleColumns() { 
            const columns = [...this.displayColumns]
            if (this.showSaleType) { columns.push('saleType') }
            if (this.showBuyer)    { columns.push('buyerId') }
            if (this.showBids)     { columns.push('bids') }
            return columns 
         },
 			drop() { return this.getDrop(this.dropId) },
         dropStatus() { 
            return this.drop.status + 
               (DropMgr.isSetup(this.drop) || DropMgr.isScheduled(this.drop) ? ", " + formatDateTimeOptYear(this.drop.startDate) : "")
         },
         itemToEdit() { return this.itemIdToEdit ? getItem(this.items, this.itemIdToEdit) : null },
         itemsExist() { return this.items.length > 0 },
         items() { 
            let items = this.getItemsInDrop(this.dropId) 
            let copies = []
            items.forEach(item => { 
               const copy = Object.assign({}, item)
               copy.tempTag = TagMgr.primaryName(copy) // add temp fields so they are searchable
               copies.push(copy) 
            })
            return copies
         },
         rowsSelected() { return this.selectedRowItems.length > 0 },
         userIdToName() { return this.getUserIdToName },
			showInvoiceButton() { 
            if (this.selectedRowItems.length == 0) { return false } 
            
            // selected rows have same buyer and are not Sold
            let buyerId = null
            for (var rowItem of this.selectedRowItems) {
               if (ItemMgr.isSold(rowItem)) { return false }
               if (!rowItem.buyerId) { return false }
               if (buyerId == null) { buyerId = rowItem.buyerId }
               if (rowItem.buyerId != buyerId) { return false }
            }

            return true
         },
         showSortDatesButton() { 
            if (this.selectedRowItems.length < 2) { return false } 
            for (var rowItem of this.selectedRowItems) {
               if (!ItemMgr.isPrivate(rowItem)) { return false }
            }
            return true
         },
         showBulkEditButton() { return (this.selectedRowItems.length > 1) },
         showQuickEditButton() { return (this.selectedRowItems.length > 1) },
		},
		methods: {
			...mapActions('item', ['bindItems', 'deleteItem']),
			editDrop() { },
         editItem(itemId) {
				this.itemIdToEdit = itemId
				this.showEditModal = true
         },
         priceText(row) { 
            let text = dollars(row.startPrice) 
            if (row.buyPrice && (row.buyPrice != row.startPrice)) { text += ("/" + dollars(row.buyPrice))}
            return text 
         },
         userName(userId) { return this.userIdToName.get(userId) },
			promptToDeleteItem(itemId, name) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteItem(itemId) })
         },
         bulkEditDone() {
            this.selectedRowItems = []
            this.showBulkEditModal = false
         },
         quickEditDone() {
            this.selectedRowItems = []
            this.showQuickEditModal = false
         },
         editImages(itemId) { this.$router.push("/admin/images/" + itemId) },
		},
		components: {
         'drop-add-edit'    : require('components/Drop/DropAddEdit.vue').default,
         'item-add-edit'    : require('components/Item/ItemAddEdit.vue').default,
      	'item-bulk-add'    : require('components/Item/ItemBulkAdd.vue').default,
      	'item-bulk-edit'   : require('components/Item/ItemBulkEdit.vue').default,
         'item-quick-edit'  : require('components/Item/ItemQuickEdit.vue').default,
         'item-sort-dates'  : require('components/Item/ItemSortDates.vue').default,
         'invoice-add-edit' : require('components/Invoice/InvoiceAddEdit.vue').default,
      },
      created() {
			this.dropId = this.$route.params.id
      },
   }

   function getItem(items, itemId) { 
      for (var item of items) {
         if (item.id == itemId) { return item }
      }

      return null
   }
</script>