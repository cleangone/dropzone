<template>
  <q-page>
	  	<!-- todo - long table scrolls off bottom -->
		<div class="q-pa-sm absolute full-width full-height">
			<q-table :title="'Bids - ' + dropItem.name" 
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

	export default {
		data() {
	  		return {
				dropId: '',
				dropItemId: '',
				tableDataFilter: '',
				visibleColumns: [ 'name', 'amount', 'date'],
 				columns: [
    				{ name: 'name',   label: 'User Name', align: 'left',   field: 'userName', sortable: true },
				 	{ name: 'amount', label: 'Amount',    align: 'right',  field: 'amount',   sortable: true, format: val => "$" + val },
					{ name: 'date',   label: 'Date',      align: 'center', field: 'date',     sortable: true, format: val => date.formatDate(val, 'MMM D, h:mm:ss a') }
				],
				pagination: { sortBy: 'date', descending: true, page: 1, rowsPerPage: 100} 
			}
		},
		created() {
			this.dropId = this.$route.params.dropId
			this.dropItemId = this.$route.params.itemId
			console.log("BidsAdminPage: dropId=" + this.dropId + ", dropItemId=" + this.dropItemId)
      },
		computed: {
			...mapGetters('drop', ['getDropItem']),
			...mapGetters('user', ['getUsers']),
			dropItem() { return this.getDropItem(this.dropId, this.dropItemId) },
			bids() { 
				let dispBids = []
				Object.values(this.dropItem.bids).forEach(bid => {
					dispBids.push({ userId: bid.userId, userName: this.userNames[bid.userId], amount: bid.amount, date: bid.bidDate })
				})
				return dispBids
			},
			userNames() { 
				let names = {}
				Object.keys(this.getUsers).forEach(key => { 
					let user = this.getUsers[key]
					let name = user.lastName + (user.lastName && user.firstName ? ", " : "")  + user.firstName 
					names[key] = name
				})
				return names
			}
		}
	}
</script>