<template>
  <q-page>  
	  <div class="q-pa-sm absolute full-width full-height">
			<q-table title="Bids/Purchases" :columns="columns" :visible-columns="visibleColumns" :data="actions" 
				row-key="name" :filter="tableDataFilter" 
				no-data-label="No Bids or Purchases"
      		no-results-label="No Bids or Purchases matching Search criteria"
				class="q-mb-sm">
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
				tableDataFilter: '',
				visibleColumns: [ 'name', 'action', 'amount', 'date'],
 				columns: [
        			{ name: 'name',   label: 'Item Name', align: 'left',   field: 'itemName', sortable: true },
				 	{ name: 'action', label: 'Action',    align: 'center', field: 'action', sortable: true },
				 	{ name: 'amount', label: 'Amount',    align: 'right',  field: 'amount', sortable: true, format: val => "$" + val },
					{ name: 'date',   label: 'Date',      align: 'center', field: 'date',   sortable: true, format: val => date.formatDate(val, 'MMM D, YYYY h:mm a') }
				],
			}
		},
		
		computed: {
			...mapState('auth', ['userId']),
			...mapGetters('user', ['getUser']),
			user() { return this.getUser(this.userId)},
			actions() { 
				return this.user.actions ? Object.values(this.user.actions) : [] 
			}
		}
	}

</script>