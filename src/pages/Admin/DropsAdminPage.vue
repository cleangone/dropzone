<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Drops" :data="flatDrops" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="name" :filter="tableDataFilter" 
				:dense="$q.screen.lt.md" class="q-mb-sm">
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


				<q-td slot="body-cell-actions" slot-scope="props" :props="props">
	            <a :href="'#/dropitems/' + props.row.id">Drop Items</a>
					<!-- <q-btn icon="collections" type="a" href="/#/dropitems/" flat color="blue"/> -->
					<q-btn icon="edit"   @click="editDrop(props.row.id)"      flat color="blue" />
    				<q-btn icon="delete" @click="promptToDeleteDrop(props.row.id)" flat color="red" />
  				</q-td>
			</q-table>
			<q-btn @click="showAddModal=true" icon="add" unelevated color="blue"/>
			
		</div>

		<!-- 2 modals - don't want a race condition updating type  -->
		<q-dialog v-model="showAddModal">	
			<modal-add-edit type="add" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<modal-add-edit type="edit" :id="dropIdToEdit" :drop="dropToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'

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
				 	{ name: 'name',      label: 'Name',       align: 'left',   field: 'name',      sortable: true },
				 	{ name: 'startDate', label: 'Start Date', align: 'left',   field: 'startDate', sortable: true },
					{ name: 'startTime', label: 'Time',       align: 'left',   field: 'startTime', sortable: true },
					{ name: 'status',    label: 'Status',     align: 'center', field: 'status',    sortable: true },
					{ name: 'defaultSaleType', label: 'Type', align: 'center', field: 'defaultSaleType', sortable: true },
					{ name: 'actions' }
				],
			}
		},
		computed: {
			...mapState('drop', ['dropsDownloaded']),
			...mapGetters('drop', ['getDrops']),
			dropToEdit() { return this.getDrops[this.dropIdToEdit] },
			flatDrops() { 
				let flats = []
				let keys = Object.keys(this.getDrops)
				keys.forEach(key => {
					let drop = this.getDrops[key]
					// console.log("flatDrops:drop", drop)
					flats.push({ id: key, name: drop.name, startDate: drop.startDate, startTime: drop.startTime, 
						status: drop.status, defaultSaleType: drop.defaultSaleType })
				})
				return flats
			}
		},
		methods: {
			...mapActions('drop', ['deleteDrop']),
			editDrop(dropId) {
				console.log("editDrop", dropId)
				this.dropIdToEdit = dropId
				this.showEditModal = true
			},
			promptToDeleteDrop(dropId) {
				console.log("promptToDeleteDrop", dropId)
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.getDrops[dropId].name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					console.log("promptToDeleteDrop: calling deleteDrop", dropId)
					this.deleteDrop(dropId)
				})
			}
		},
		components: {
			'modal-add-edit' : require('components/Drop/ModalAddEdit.vue').default
		},
	}

</script>