<template>
  <div>     
      <div class="row q-pl-sm q-pr-xs" :class="purple">
         <span class="col text-subtitle1 heading" :class="yellow" >{{ heading }}</span>
         <span class="col text-grey-10 text-right" color="grey-10" :class="red">
			   <q-checkbox v-if="dropId"     v-model="showCols.category" label="Artist"    @input="showColsChecked()" dense />
            <q-checkbox v-if="categoryId" v-model="showCols.drop"     label="Drop"      @input="showColsChecked()" dense />
            <q-checkbox                   v-model="showCols.tag"      label="Category"  @input="showColsChecked()" dense class="q-ml-sm" />
            <q-checkbox                   v-model="showCols.saleType" label="Sale Type" @input="showColsChecked()" dense class="q-ml-sm" />
            <q-checkbox                   v-model="showCols.buyer"    label="Buyer"     @input="showColsChecked()" dense class="q-ml-sm" />
            <q-checkbox                   v-model="showCols.bids"     label="Bids"      @input="showColsChecked()" dense class="q-ml-sm" />
         </span>
		</div>
		<div class="q-mt-xs absolute full-width full-height" :class="green">
         <q-table title="Items" :data="tableItems" 
            :columns="columns" :visible-columns="visibleColumns" row-key="name" :filter="tableDataFilter" no-data-label="No Items"
            selection="multiple" :selected.sync="selectedRowItems" :pagination.sync="pagination" :dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template> 
            <q-td slot="body-cell-name" slot-scope="props" :props="props"> 
               {{ props.row.name + sortNameText(props.row.sortName) }}
            </q-td>
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
 
      <q-dialog v-model="showAddModal">	
			<item-add-edit :dropId="dropId" :categoryId="categoryId" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<item-add-edit :type="edit" :item="itemToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showBulkAddModal">	
			<item-bulk-add :dropId="dropId" :categoryId="categoryId" @close="showBulkAddModal=false" />
		</q-dialog>
      <q-dialog v-model="showBulkEditModal">	
			<item-bulk-edit :items="selectedRowItems" @close="bulkEditDone" />
		</q-dialog>
      <q-dialog v-model="showQuickEditModal">	
			<item-quick-edit :items="selectedRowItems" @close="quickEditDone" />
		</q-dialog>
      <q-dialog v-model="showSortDatesModal">	
			<item-sort-dates :items="selectedRowItems" @close="showSortDatesModal=false" />
		</q-dialog>
      <q-dialog v-model="showInvoiceModal">	
			<invoice-add-edit :items="selectedRowItems" @close="showInvoiceModal=false" />
		</q-dialog>
  	</div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SessionStorage } from 'quasar'
   import { DropMgr } from 'src/managers/DropMgr'
	import { ItemMgr } from 'src/managers/ItemMgr'
   import { TagMgr } from 'src/managers/TagMgr'
   import { UI, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   import { formatDateTimeOptYear } from 'src/utils/DateUtils'

   const SHOW_COLS = 'ItemsAdminShowColumns'
         
	export default {
      props: ['heading', 'items', 'dropId', 'categoryId'], // one of dropId/categoryId will be set
		data() {
	  		return {
            showCols: {},
            showSortDatesModal: false,
				showAddModal: false,
            showEditModal: false,
            showBulkAddModal: false,
            showBulkEditModal: false,
            showQuickEditModal: false,
            showInvoiceModal: false,
				itemIdToEdit: '',
            tableDataFilter: '',
            selectedRowItems: [],
				displayColumns: [ 'name', 'price', 'status', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',  label: 'Name (Sort Name)', align: 'left',   field: 'tempName',     sortable: true },
				 	{ name: 'category',   label: 'Artist',      align: 'center', field: 'category',     sortable: true, format: val => val ? val.name : "" },
				 	{ name: 'drop',       label: 'Drop',        align: 'center', field: 'tempDrop',     sortable: true },
				 	{ name: 'tag',        label: 'Category',    align: 'center', field: 'tempTag',      sortable: true },
				 	{ name: 'saleType',   label: 'Sale Type',   align: 'center', field: 'saleType',     sortable: true },
					{ name: 'buyerId',    label: 'Buyer',       align: 'left',   field: 'buyerId',      sortable: true, format: val => this.userName(val) },
					{ name: 'price', label:'Start/Final Price', align: 'right',  field: 'startPrice',   sortable: true },
					{ name: 'bids',       label: 'Bids',        align: 'center', field: 'numberOfBids', sortable: true },
					{ name: 'status',     label: 'Status',      align: 'center', field: 'status',       sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 50 },
			}
		},
		computed: {
         ...mapGetters('category', ['getCategory']),
         ...mapGetters('drop', ['getDropIdToNameDropMap']),
         ...mapGetters('item', ['itemsExist', 'getItemsWithCategory']),
         ...mapGetters('user', ['getUserIdToName']),
         ...mapGetters('color', Colors),
			visibleColumns() { 
            const columns = [...this.displayColumns]
            if (this.categoryId && this.showCols.drop)     { columns.push('drop') } 
            if (this.dropId     && this.showCols.category) { columns.push('category') } 
            if (this.showCols.tag)      { columns.push('tag') }
            if (this.showCols.saleType) { columns.push('saleType') }
            if (this.showCols.buyer)    { columns.push('buyerId') }
            if (this.showCols.bids)     { columns.push('bids') }
            return columns 
         },
         tableItems() { 
            let copies = []
            this.items.forEach(item => { 
               const copy = Object.assign({}, item)
               copy.tempName = copy.sortName + " " + copy.name // sort by sortName and be able to filter by name
               copy.tempDrop = copy.dropId ? this.getDropIdToNameDropMap.get(copy.dropId) : ""
               copy.tempTag = TagMgr.primaryName(copy) // can filter by primary category
               copies.push(copy) 
            })
            return copies
         },
         itemToEdit() { return this.itemIdToEdit ? getItem(this.items, this.itemIdToEdit) : null },
         itemsExist() { return this.items.length > 0 },
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
               if (!(ItemMgr.isPrivate(rowItem) || ItemMgr.isSetup(rowItem)) ) { return false }
            }
            return true
         },
         showBulkEditButton() { return (this.selectedRowItems.length > 1) },
         showQuickEditButton() { return (this.selectedRowItems.length > 1) },
		   edit() { return UI.EDIT },
		},
		methods: {
			...mapActions('item', ['bindItems', 'deleteItem']),
			editDrop() { },
         editItem(itemId) {
				this.itemIdToEdit = itemId
				this.showEditModal = true
         },
         sortNameText(sortName) { return sortName && sortName.length ?" (" + sortName + ")" : "" },
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
         showColsChecked() { SessionStorage.set(SHOW_COLS, this.showCols) },
      },
      created() {
         this.showCols = SessionStorage.getItem(SHOW_COLS)    
         if (!this.showCols) { this.showCols = { 
            category: true, drop: true, tag: true, saleType: true, buyer: true, bids: true } }
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
   }

   function getItem(items, itemId) { 
      for (var item of items) {
         if (item.id == itemId) { return item }
      }

      return null
   }
</script>