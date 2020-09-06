<template>
  <q-page>  
	  <div class="q-pa-sm absolute full-width full-height">
			<q-table title="Bids/Purchases" :data="actions" :columns="columns" :visible-columns="visibleColumns" 
            row-key="name" :filter="tableDataFilter" :pagination.sync="pagination"
				no-data-label="No Bids or Purchases" no-results-label="No Bids or Purchases matching Search criteria"
				:dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
               <q-checkbox v-model="showOutbid" label="Show Outbid" class="text-grey-7"/>
            </template>
            <q-td slot="body-cell-name" slot-scope="props" :props="props"> 
               <a :href="'/#/item/' + props.row.itemId">{{ props.row.itemName }}</a>
	         </q-td>
			</q-table>
		</div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ActionResultType } from 'src/utils/Constants.js'
	

	export default {
		data() {
	  		return {
            showOutbid: true,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'action', 'amount', 'result', 'date'],
 				columns: [
               { name: 'name',   label: 'Item',   align: 'left',   field: 'itemName',     sortable: true },
				 	{ name: 'action', label: 'Action', align: 'center', field: 'actionType',   sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'right',  field: 'amount',       sortable: true, format: val => dollars(val) },
					{ name: 'result', label: 'Result', align: 'center', field: 'actionResult', sortable: true },
				 	{ name: 'date',   label: 'Date',   align: 'center', field: 'createdDate',  sortable: true, format: val => formatDate(val) }
            ],
            pagination: { rowsPerPage: 20 },
			}
      },
		computed: {
			...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['actionsExist', 'getUserActions']),
			userActions() { return this.getUserActions(this.userId) },
         actions() { 
            let displayActions = []
            this.userActions.forEach(action => { 
               if (this.showOutbid || action.actionResult != ActionResultType.OUTBID ) { displayActions.push(Object.assign({}, action)) }
            })
            return displayActions
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
      if (!number) { return "" }
      return "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }

   function formatDate(dateToFormat) {
      if (!dateToFormat) { return "" }

      let now = new Date()
      let datetime = new Date(dateToFormat)
      return (now.getYear() == datetime.getYear() ? 
         date.formatDate(datetime, 'MMM D, h:mm a') :
         date.formatDate(datetime, 'MMM D, YYYY h:mm a'))
   }
</script>