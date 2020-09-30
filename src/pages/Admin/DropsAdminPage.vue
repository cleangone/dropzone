<template>
   <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Drops" :data="getDrops" 
				:columns="columns" :visible-columns="visibleColumns" row-key="name" :filter="tableDataFilter" 
            @row-click="onRowClick"
            no-data-label="No Drops" :pagination.sync="pagination"
				:dense="$q.screen.lt.md" class="q-mb-sm"> -->
				<template v-slot:top-right>
				   <q-space />
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <q-td slot="body-cell-name" slot-scope="props" :props="props"> 
               <a :href="'#/admin/items/' + props.row.id">{{ props.row.name }}</a>
	         </q-td>
            <q-td slot="body-cell-status" slot-scope="props" :props="props"> 
               {{ props.row.status }}
               <q-btn v-if="canSchedule(props.row)" @click="schedule(props.row)" label="Schedule" size="xs" color="primary" dense/>         
	         </q-td>
            <q-td slot="body-cell-items" slot-scope="props" :props="props"> 
               {{ itemText(props.row.id) }}
            </q-td>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props">
	            <q-btn icon="edit"   @click="editDrop(props.row.id)"           @click.stop size="sm" flat dense color="primary" />
    				<q-btn icon="delete" @click="promptToDeleteDrop(props.row.id)" @click.stop size="sm" flat dense color="red" />
  				</q-td> 
			</q-table>
		 	<q-btn @click="showAddModal=true" icon="add" unelevated color="primary"/>
		 </div>

		 <!-- 2 modals - don't want a race condition updating type   -->
		<q-dialog v-model="showAddModal">	
			<drop-add-edit type="add" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<drop-add-edit type="edit" :drop="dropToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { DropMgr, DropStatus } from 'src/managers/DropMgr.js';
   import { ItemMgr } from 'src/managers/ItemMgr.js';
   import { formatDateTimeOptYear, isFutureDate, localTimezone } from 'src/utils/DateUtils'

	export default {
		data() {
	  		return {
				showAddModal: false,
				showEditModal: false,
				dropIdToEdit: '',
				tableDataFilter: '',
				visibleColumns: [ 'name', 'startDate', 'status', 'items', 'saleType', 'actions'],
 				columns: [
               //  todo - headerStyle doesn't seem to work - use it to center header
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',      label: 'Name',   align: 'left',   field: 'name',      sortable: true },
               { name: 'startDate', label: 'Start Date ' + localTimezone(), 
                                                     align: 'center', field: 'startDate', sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'status',    label: 'Status', align: 'center', field: 'status',    sortable: true },
					{ name: 'items',     label: 'Items',  align: 'center' },
					{ name: 'saleType',  label: 'Type',   align: 'center', field: 'defaultSaleType', sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
			...mapGetters('drop', ['dropsExist', 'getDrops', 'getDrop']),
         ...mapGetters('item', ['getItemsInDrop']),
         dropToEdit() { return this.getDrop(this.dropIdToEdit) }
		},
		methods: {
         ...mapActions('drop', ['bindDrops', 'updateDrop', 'deleteDrop']),
         canSchedule(drop) { return DropMgr.isSetup(drop) && isFutureDate(drop.startDate) },
         schedule(drop) { return this.updateDrop({ id: drop.id, status: DropStatus.SCHEDULING }) },
         onRowClick(evt, row) {
            console.log("onRowClick", row.id)
            this.$router.push("/admin/items/" + row.id) 
         },
         itemText(dropId) { return ItemMgr.itemText(this.getItemsInDrop(dropId)) },
         editDrop(dropId) {
				// console.log("editDrop", dropId)
				this.dropIdToEdit = dropId
				this.showEditModal = true
         },
			promptToDeleteDrop(dropId) {
				console.log("promptToDeleteDrop", dropId)
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.getDrop(dropId).name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					console.log("promptToDeleteDrop: calling deleteDrop", dropId)
					this.deleteDrop(dropId)
				})
			}
		},
		components: {
			'drop-add-edit' : require('components/Drop/DropAddEdit.vue').default
      },
      created() {
         // console.log("DropsAdminPage")
         if (!this.dropsExist) { this.bindDrops() }
      }
   }

</script>