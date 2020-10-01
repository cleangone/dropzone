<template>
  <q-page>  
      <div class="q-pt-md q-pl-md text-h5">History</div>
      <div class="q-pl-md text-subtitle1"><q-checkbox v-model="showOnlyWins" label="Show only Wins/Purchases" class="text-grey-7" dense/></div>
	   <div class="q-px-sm absolute full-width full-height">
			<q-table :data="displayActions" :columns="columns" :visible-columns="visibleColumns" 
            row-key="id" :filter="tableDataFilter" :pagination.sync="pagination"
				no-data-label="No Bids or Purchases" 
            no-results-label="No Bids or Purchases matching Search criteria"
				:dense="$q.screen.lt.md" class="q-mb-sm" flat>
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
            </template>

            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td :align="props.cols[0].align">{{ props.cols[0].value}}</q-td>
                  <q-td :align="props.cols[1].align">{{ props.cols[1].value}}</q-td>
                  <q-td :align="props.cols[2].align">{{ props.cols[2].value}}</q-td>
                  
                  <q-td :align="props.cols[3].align">
                     <span v-if="isBid(props.row)">
                        {{ bids(props.row) }}
                        <q-btn v-if="hasPrevBids(props.row)" size="xs" color="primary" round dense flat
                           @click="props.expand = !props.expand" :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" />
                     </span>
                  </q-td>
                  <q-td :align="props.cols[4].align">{{ props.cols[4].value}}</q-td>
               </q-tr>   
               <template v-if="props.expand">
                  <q-tr v-for="action in getExpandActions(props.row.itemId)" :key="action.id">
                     <q-td/>
                     <q-td class="text-right  bg-grey-2">{{ formatDollars(action.amount) }}</q-td>
                     <q-td class="text-center bg-grey-2">{{ action.actionResult }}</q-td>
                     <q-td class="bg-grey-2"/>
                     <q-td class="text-center bg-grey-2">{{ formatDate(action.createdDate) }}</q-td>
                  </q-tr>
               </template>
            </template> 
			</q-table>
		</div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ActionMgr } from 'src/managers/ActionMgr.js'
   import { dollars } from 'src/utils/Utils'
   import { format_MMM_DD_optYYYY_h_mm_ss } from 'src/utils/DateUtils'

	export default {
		data() {
	  		return {
            showOnlyWins: false,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'amount', 'result', 'bids', 'date'],
 				columns: [
               { name: 'name',   label: 'Item',   align: 'left',   field: 'itemName',     sortable: true },
				 	// { name: 'action', label: 'Action', align: 'center', field: 'actionType',   sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'right',  field: 'amount',       sortable: true, format: val => dollars(val) },
					{ name: 'result', label: 'Result', align: 'center', field: 'actionResult', sortable: true },
				 	{ name: 'bids',   label: 'My Bids',   align: 'center' },
				 	{ name: 'date',   label: 'Date',   align: 'center', field: 'createdDate',  sortable: true, format: val => formatDate(val) }
            ],
            pagination: { rowsPerPage: 20 },
            primaryItemIds: null,
            primaryActions: null,
            expandActionMap: null
			}
      },
		computed: {
			...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['actionsExist', 'getUserActions']),
			displayActions() { 
            let displayActions = []
            this.allActions.forEach(action => { 
               if (!this.showOnlyWins || isWinningBid(action) || isPurchased(action)) { 
                  displayActions.push(Object.assign({}, action)) }
            })
            return displayActions
         },
         userActions() { return this.getUserActions(this.userId) },
         allActions() { 
            this.primaryItemIds = new Set()
            this.primaryActions = []
            this.expandActionMap = new Map() // id to array
            this.userActions.forEach(action => { 
               if (this.primaryItemIds.has(action.itemId)) {
                  let expandActions = this.expandActionMap.get(action.itemId)
                  if (!expandActions) {
                     expandActions = []
                     this.expandActionMap.set(action.itemId, expandActions)
                  }
                  expandActions.push(action)
               }
               else {
                  this.primaryItemIds.add(action.itemId)
                  this.primaryActions.push(action)
               }
               
            })
            return this.primaryActions
         }
      },
      methods: {
         ...mapActions('action', ['bindActions']),
         isBid(action) { return (ActionMgr.isBid(action)) },
         bids(action) {
            let bids = 0
            const expandedActions = this.expandActionMap.get(action.itemId)
            if (expandedActions) {
               expandedActions.forEach(prevAction => { 
                  if (ActionMgr.isBid(prevAction)) { bids++ }
               })
            }
            if (ActionMgr.isBid(action) && !ActionMgr.isWinningBid(action)) { bids++ } // do not double count winningBid action
            return bids
         },
         hasPrevBids(action) { 
            for (var action of this.expandActionMap.get(action.itemId)) {
               if (ActionMgr.isBid(action)) { return true }
            }   
            return false 
         },
         getExpandActions(itemId) { return this.expandActionMap.get(itemId) },
         formatDollars(val) { return dollars(val) },
         formatDate(val) { return format_MMM_DD_optYYYY_h_mm_ss(val) } 
      },
      created() {
         if (!this.actionsExist) { this.bindActions() }
      }
	}

   function isPurchased(action)  { return ActionMgr.isPurchased(action) }
   function isWinningBid(action) { return ActionMgr.isWinningBid(action) }
   function formatDate(val) { return format_MMM_DD_optYYYY_h_mm_ss(val) } 
</script>