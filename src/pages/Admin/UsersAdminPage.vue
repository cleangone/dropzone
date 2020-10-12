<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Users" :columns="columns" :visible-columns="visibleColumns" :data="getUsers" row-key="name" :filter="tableDataFilter">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <q-td slot="body-cell-phone" slot-scope="props" :props="props">
               {{ formatPhone(props.row.phone) }}
    				<q-btn v-if="acceptTexts(props.row)" icon="textsms" @click="promptForText(props.row)" size="sm" flat dense/>
  				</q-td>
				<q-td slot="body-cell-edit" slot-scope="props" :props="props">
    				<q-btn icon="edit" @click="edit(props.row.id)" size="sm" flat dense/>
  				</q-td>
			</q-table>
		</div>
		<q-dialog v-model="showEditModal">
			<user-edit :user="userToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showTextModal">
         <q-card style="min-width: 350px">
         <q-card-section><div class="text-h6">Send Text</div></q-card-section>
         <q-card-section class="q-pt-none"><q-input v-model="textMsg" autofocus dense /></q-card-section>
         <q-card-actions align="right" class="text-primary">
            <q-btn label="Cancel" v-close-popup     flat />
            <q-btn label="Send" @click="sendText()" flat />
         </q-card-actions>
         </q-card>
      </q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { SmsMgr } from 'src/managers/SmsMgr'
   import { formatTightPhone, unformatPhone } from 'src/utils/Utils'

	export default {
		data() {
	  		return {
				showEditModal: false,
				showTextModal: false,
				textUser: null,
            textMsg: '',
            userText: '',
				tableDataFilter: '',
				visibleColumns: [ 'email', 'firstName', 'lastName', 'nickname', 'phone', 'sendEmail', 'admin', 'errorEmail', 'edit'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'email',      label: 'Email',       align: 'left',   field: 'authEmailCopy', sortable: true },
				 	{ name: 'firstName',  label: 'First Name',  align: 'left',   field: 'firstName',     sortable: true },
				 	{ name: 'lastName',   label: 'Last Name',   align: 'left',   field: 'lastName',      sortable: true },
					{ name: 'nickname',   label: 'Nickname',    align: 'left',   field: 'nickname',      sortable: true },
					{ name: 'phone',      label: 'Phone',       align: 'center', field: 'phone' },     
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
         ...mapActions('sms', ['createOutboundSms']),
			edit(userId) {
				this.userIdToEdit = userId
				this.showEditModal = true
         },
         formatPhone(phone) { return formatTightPhone(phone) }, 
         acceptTexts(user) { return user.phone && user.acceptTexts }, 
         promptForText(user) { 
            this.textUser = user
            this.textMsg = ""
            this.showTextModal = true
         },
         sendText() { 
            this.createOutboundSms(SmsMgr.createOutboundSms(this.textMsg, this.textUser))
            this.showTextModal = false
         }
		},
		components: {
			'user-edit' : require('components/Admin/UserEdit.vue').default
		},
	}

</script>