<template>
  <div>     
		<div class="q-mt-xs absolute full-width full-height" :class="green">
         <q-table title="ToDo Items" :data="tableItems" 
            :columns="columns" :visible-columns="visibleColumns" row-key="name" :filter="tableDataFilter" no-data-label="No ToDo Items"
            :selected.sync="selectedRowItems" :pagination.sync="pagination" :dense="$q.screen.lt.md" flat class="q-mb-sm">
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
            <q-td slot="body-cell-bidreq" slot-scope="props" :props="props"> 
               <a :href="'#/admin/reqs/' + props.row.id + '/' + returnRoute">{{ requestText(props.row) }}</a>
	         </q-td>
			</q-table>
         <div style="height: 75px"/> <!-- so page controls not under footer -->
		</div>

  	</div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SessionStorage } from 'quasar'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { Route, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'

   const SHOW_COLS = 'ItemsAdminShowColumns'
         
	export default {
      props: ['items'], 
		data() {
	  		return {
            returnRoute: Route.TODO,
            showCols: {},
            showSortDatesModal: false,
				
            tableDataFilter: '',
            selectedRowItems: [],
				displayColumns: [ 'name', 'drop', 'category', 'price', 'reqDate', 'status'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',     label: 'Name (Sort Name)', align: 'left',                 sortable: true },
				 	{ name: 'reqDate', label: 'Req Date ' + localTimezone(), 
                                                align: 'center', field: 'userUpdatedDate',   sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'drop',     label: 'Drop',      align: 'center', field: 'tempDrop',   sortable: true },
				 	{ name: 'category', label: 'Artist',    align: 'center', field: 'category',   sortable: true, format: val => val ? val.name : "" },
				 	{ name: 'price',    label: 'Price',     align: 'right',                       sortable: true },
					{ name: 'bidreq',   label: 'Bid/Req',   align: 'center',                      sortable: true },
					{ name: 'status',   label: 'Status',    align: 'center', field: 'status',     sortable: true },
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
            if (this.showCols.bidreq)   { columns.push('bidreq') }
            return columns 
         },
         tableItems() { 
            let copies = []
            this.items.forEach(item => { 
               const copy = Object.assign({}, item)
               copy.tempName = copy.sortName + " " + copy.name // sort by sortName and be able to filter by name
               copy.tempDrop = copy.dropId ? this.getDropIdToNameDropMap.get(copy.dropId) : ""
               copies.push(copy) 
            })
            return copies
         },
         itemToEdit() { return this.itemIdToEdit ? getItem(this.items, this.itemIdToEdit) : null },
         itemsExist() { return this.items.length > 0 },
         rowsSelected() { return this.selectedRowItems.length > 0 },
         userIdToName() { return this.getUserIdToName },
			
         showSortDatesButton() { 
            if (this.selectedRowItems.length < 2) { return false } 
            for (var rowItem of this.selectedRowItems) {
               if (!(ItemMgr.isPrivate(rowItem) || ItemMgr.isSetup(rowItem)) ) { return false }
            }
            return true
         },
         
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
         requestUrl(row) { return '#/admin/reqs/' + row.id + '/' + Route.TODO },
         requestText(row) { return row.numberOfPurchaseReqs + (row.numberOfPurchaseReqs == 1 ? " Request" : " Requests") },
         userName(userId) { return this.userIdToName.get(userId) },
         editImages(itemId) { this.$router.push("/admin/images/" + itemId) },
         showColsChecked() { SessionStorage.set(SHOW_COLS, this.showCols) },
      },
      created() {
         this.showCols = SessionStorage.getItem(SHOW_COLS)    
         if (!this.showCols) { this.showCols = { 
            category: true, drop: true, tag: true, saleType: true, buyer: true, bidreq: true } }
      },
		components: {
      },
   }

   function getItem(items, itemId) { 
      for (var item of items) {
         if (item.id == itemId) { return item }
      }

      return null
   }
</script>