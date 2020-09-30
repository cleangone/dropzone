<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Users" :columns="columns" :visible-columns="visibleColumns" :data="getUsers" row-key="name" :filter="tableDataFilter">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
				<q-td slot="body-cell-edit" slot-scope="props" :props="props">
    				<q-btn icon="edit" @click="edit(props.row.id)" size="sm" flat dense/>
  				</q-td>
			</q-table>
		</div>
		<q-dialog v-model="showEditModal">
			<user-edit :user="userToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters } from 'vuex'

	export default {
		data() {
	  		return {
				showEditModal: false,
				userIdToEdit: '',
				tableDataFilter: '',
				visibleColumns: [ 'email', 'firstName', 'lastName', 'sendEmail', 'admin', 'errorEmail', 'edit'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'email',      label: 'Email',       align: 'left',   field: 'authEmailCopy', sortable: true },
				 	{ name: 'firstName',  label: 'First Name',  align: 'left',   field: 'firstName',     sortable: true },
				 	{ name: 'lastName',   label: 'Last Name',   align: 'left',   field: 'lastName',      sortable: true },
					{ name: 'sendEmail',  label: 'Email',       align: 'center', field: 'email',         format: val => val ? 'Yes' : '' }, 
					{ name: 'admin',      label: 'Permissions', align: 'center', field: 'isAdmin',       sortable: true, sort: (a, b) => a - b, format: val => val ? 'Admin' : '' }, 
					{ name: 'errorEmail', label: 'Error Email', align: 'center', field: 'errorEmail',    format: val => val ? 'Yes' : '' }, 
					{ name: 'edit' },
				],
			}
		},
		computed: {
			...mapGetters('user', ['getUsers', 'getUser']),
			userToEdit() { return this.getUser(this.userIdToEdit) },
		},
		methods: {
			edit(userId) {
				// console.log("edit", userId)
				this.userIdToEdit = userId
				this.showEditModal = true
			}
		},
		components: {
			'user-edit' : require('components/Admin/UserEdit.vue').default
		},
	}

</script>