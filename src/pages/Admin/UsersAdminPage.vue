<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Users" :columns="columns" :visible-columns="visibleColumns" :data="flatUsers" row-key="name" :filter="tableDataFilter">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
				<q-td slot="body-cell-edit" slot-scope="props" :props="props">
    				<q-btn flat icon="edit" @click="edit(props.row.id)" />
  				</q-td>
			</q-table>
		</div>
		<q-dialog v-model="showEditModal">
			<modal-edit-user :userId="userIdToEdit" :user="userToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  		return {
				showEditModal: false,
				userIdToEdit: '',
				tableDataFilter: '',
				visibleColumns: [ 'firstName', 'lastName', 'admin', 'edit'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'firstName', label: 'First Name', align: 'left', field: 'firstName', sortable: true },
				 	{ name: 'lastName',  label: 'Last Name',  align: 'left', field: 'lastName',  sortable: true },
					{ name: 'admin', label: 'Permissions', align: 'center', field: 'isAdmin', sortable: true, sort: (a, b) => a - b, format: val => val ? 'Admin' : '' }, 
					{ name: 'edit' },
				],
			}
		},
		computed: {
			...mapState('user', ['usersDownloaded']),
			...mapGetters('user', ['getUsers']),
			userToEdit() { return this.getUsers[this.userIdToEdit] },
			flatUsers() { 
				let flats = []
				let keys = Object.keys(this.getUsers)
				keys.forEach(key => {
					let user = this.getUsers[key]
					flats.push({ id: key, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin })
				})
				return flats
			}
		},
		methods: {
			edit(userId) {
				console.log("edit", userId)
				this.userIdToEdit = userId
				this.showEditModal = true
			}
		},
		components: {
			'modal-edit-user' : require('components/Admin/ModalEditUser.vue').default
		},
	}

</script>