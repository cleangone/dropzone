<template>
  <q-page>
	  	<!-- todo - long table scrolls off bottom -->
		<div class="q-pa-sm absolute full-width full-height">
			<q-table :title="'Bids - ' + itemName" 
				:columns="columns" :visible-columns="visibleColumns" :data="bids" 
				row-key="name" :filter="tableDataFilter" 
				:pagination.sync="pagination"
            :dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
			</q-table>
		</div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapState, mapGetters, mapActions } from 'vuex'
   import { dollars } from 'src/utils/Utils'

	export default {
		data() {
	  		return {
				itemId: '',
				tableDataFilter: '',
				visibleColumns: [ 'name', 'amount', 'result', 'date'],
 				columns: [ 
    				{ name: 'name',   label: 'User',   align: 'left',   field: 'userId',       sortable: true, format: val => this.userName(val) },
				 	{ name: 'amount', label: 'Amount', align: 'right',  field: 'amount',       sortable: true, format: val => dollars(val) },
					{ name: 'result', label: 'Result', align: 'left',   field: 'actionResult', sortable: true },
				 	{ name: 'date',   label: 'Date',   align: 'center', field: 'createdDate',  sortable: true, format: val => date.formatDate(val, 'MMM D, h:mm:ss a') }
				],
				pagination: { sortBy: 'date', descending: true, page: 1, rowsPerPage: 25} 
			}
		},
		computed: {
			...mapGetters('action', ['getItemActions']),
			...mapGetters('user', ['getUsers']),
			bids() { return this.getItemActions(this.itemId) },
			itemName() { return this.bids[0].itemName },
			users() { return this.getUsers },
			userIdToName() { 
            let idToName = {}
            this.users.forEach(user => { 
               let userName = (user.firstName || user.lastName) ?
                  (user.firstName ? user.firstName : "") + (user.firstName && user.lastName ? " " : "") + (user.lastName ? user.lastName : "") :
                  user.authEmailCopy
               idToName[user.id] = userName
            })
            // console.log("userIdToName", idToName)
            return idToName
			}
      },
      methods: {
			userName(userId) { return this.userIdToName[userId] }
      },
      created() { this.itemId = this.$route.params.itemId }
   }
</script>