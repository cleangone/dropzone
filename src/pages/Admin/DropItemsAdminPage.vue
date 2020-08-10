<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table :title="'Drop Items - ' + drop.name + ' (' + drop.defaultSaleType  + ')'" 
				:columns="columns" :visible-columns="visibleColumns" :data="flatDropItems" 
				row-key="name" :filter="tableDataFilter" :dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
				<q-td slot="body-cell-actions" slot-scope="props" :props="props">
					<a v-if="props.row.bids" :href="'#/bids/' + dropId + '/' + props.row.id">Bids</a>
	            <q-btn icon="edit"   @click="editDropItem(props.row.id)"           flat color="blue" />
    				<q-btn icon="delete" @click="promptToDeleteDropItem(props.row.id)" flat color="red" />
  				</q-td>
			</q-table>
			<q-btn @click="showAddModal=true" icon="add" unelevated color="blue"/>
		</div>

		<!-- 2 modals - don't want a race condition updating type  -->
		<q-dialog v-model="showAddModal">	
			<modal-add-edit type="add" :dropId="dropId" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<modal-add-edit type="edit" :dropId="dropId" :dropItemId="dropItemIdToEdit" :dropItem="dropItemToEdit" @close="showEditModal=false" />
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
				dropItemIdToEdit: '',
				tableDataFilter: '',
				visibleColumns: [ 'name', 'saleType', 'price', 'currPrice', 'bids', 'status', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',      label: 'Name',        align: 'left',   field: 'name',      sortable: true },
				 	{ name: 'saleType',  label: 'Type',        align: 'center', field: 'saleType',  sortable: true },
					{ name: 'price',     label: 'Start Price', align: 'right',  field: 'price',     sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'currPrice', label: 'Curr Price',  align: 'right',  field: 'currPrice', sortable: true, format: val => val ? "$" + val : '' },
					{ name: 'bids',      label: 'Bids',        align: 'center', field: 'bids',      sortable: true },
					{ name: 'status',    label: 'Status',      align: 'center', field: 'status',    sortable: true },
					{ name: 'actions' }
				],
			}
		},
		created() {
			this.dropId = this.$route.params.dropId
			console.log("DropItemsAdminPage: dropId=" + this.dropId)
      },
		computed: {
			...mapState('drop', ['dropsDownloaded']),
			...mapGetters('drop', ['getDrop']),
			drop() { return this.getDrop(this.dropId) },
			dropItemToEdit() { return this.drop.items[this.dropItemIdToEdit] },
			flatDropItems() { 
				let flats = []
				let keys = Object.keys(this.drop.items)
				keys.forEach(key => {
					let item = this.drop.items[key]
					let bids = item.bids ? Object.keys(item.bids).length : ''
					flats.push({ id: key, name: item.name, price: item.price, currPrice: item.currPrice, bids: bids, 
						status: item.status, saleType: item.saleType })
				})
				return flats
			}
		},
		methods: {
			...mapActions('drop', ['deleteDropItem']),
			editDropItem(dropItemId) {
				// console.log("editDropItem", dropItemId)
				this.dropItemIdToEdit = dropItemId
				this.showEditModal = true
			},
			promptToDeleteDropItem(dropItemId) {
				// console.log("promptToDeleteDropItem", dropItemId)
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.drop.items[dropItemId].name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteDropItem({ dropId: this.dropId, dropItemId: dropItemId }) })
			}
		},
		components: {
			'modal-add-edit' : require('components/DropItem/ModalAddEdit.vue').default
		},
	}

</script>