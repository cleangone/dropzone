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
	import { mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  		return {
				tableDataFilter: '',
				visibleColumns: [ 'name', 'action', 'amount', 'result', 'date'],
 				columns: [
        			{ name: 'name',   label: 'Item',   align: 'left',   field: 'itemName',     sortable: true },
				 	{ name: 'action', label: 'Action', align: 'center', field: 'actionType',   sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'right',  field: 'amount',       sortable: true, format: val => val ? dollars(val) : '' },
					{ name: 'result', label: 'Result', align: 'center', field: 'actionResult', sortable: true },
				 	{ name: 'date',   label: 'Date',   align: 'center', field: 'createdDate',  sortable: true, format: val => date.formatDate(val, 'MMM D, YYYY h:mm a') }
				],
			}
      },
		computed: {
			...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['actionsExist', 'getUserActions']),
			actions() { 
            let actions = this.getUserActions(this.userId) 
            let copies = []
            actions.forEach(action => { copies.push(Object.assign({}, action)) })
            return copies
         },
      },
      methods: {
         ...mapActions('action', ['bindActions']),
      },
      created() {
         // console.log("ActionsPage")
         if (!this.actionsExist) { this.bindActions() }
      }
	}

   function dollars(number) {
      return "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }
</script>