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
            <template v-slot:bottom-right>
               <q-select
                     v-model="visibleColumns"
                     multiple
                     dense
                     options-dense
                     :display-value="$q.lang.table.columns"
                     emit-value
                     map-options
                     :options="columns"
                     option-value="name"
                     options-cover
                     style="min-width: 150px"
                  />
               </template>
            <!-- cannot get @row-click to work -->
            <q-td slot="body-cell-name" slot-scope="props" :props="props"> 
               <a :href="'#/admin/items/' + props.row.id">{{ props.row.name }}</a>
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
   import { mapState, mapGetters, mapActions } from 'vuex'
   import { localTimezone } from 'src/utils/DateUtils';

	export default {
		data() {
	  		return {
				showAddModal: false,
				showEditModal: false,
				dropIdToEdit: '',
				tableDataFilter: '',
				visibleColumns: [ 'name', 'startDate', 'startTime', 'status', 'defaultSaleType', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',            label: 'Name',              align: 'left',   field: 'name',      sortable: true },
				 	{ name: 'startDate',       label: 'Start Date',        align: 'left',   field: 'startDate', sortable: true, format: val => formatDate(val) },
					{ name: 'startTime', label: 'Time ' + localTimezone(), align: 'left',   field: 'startDate', sortable: true, format: val => formatTime(val) },
					{ name: 'status',          label: 'Status',            align: 'center', field: 'status',    sortable: true },
					{ name: 'defaultSaleType', label: 'Type',              align: 'center', field: 'defaultSaleType', sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
			...mapGetters('drop', ['dropsExist', 'getDrops', 'getDrop']),
			dropToEdit() { return this.getDrop(this.dropIdToEdit) },
		},
		methods: {
         ...mapActions('drop', ['bindDrops', 'deleteDrop']),
         onRowClick(evt, row) {
            console.log("onRowClick", row.id)
            this.$router.push("/admin/items/" + row.id) 
         },
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
   
   function formatDate(startDate) {
      let datetime = new Date(startDate.seconds * 1000)
      return date.formatDate(datetime, 'YYYY-MM-DD')   
   }
         
   function formatTime(startDate) {
      let datetime = new Date(startDate.seconds * 1000)
      return date.formatDate(datetime, 'HH:mm')
   }

</script>