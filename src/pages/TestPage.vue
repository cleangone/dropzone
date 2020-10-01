<template>
  <q-page>  
     
     <!-- access all table rows directly  -->

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
			
  	</q-page>
</template>

<script>
	
	export default {
		data() {
	  		return {
            showOnlyWins: false,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'amount', 'result', 'bids', 'date'],
 				columns: [
               { name: 'name',   label: 'Item',   align: 'left',   field: 'itemName',     sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'right',  field: 'amount',       sortable: true, format: val => dollars(val) },
					{ name: 'result', label: 'Result', align: 'center', field: 'actionResult', sortable: true },
				 	{ name: 'bids',   label: 'Bids',   align: 'center' },
				 	{ name: 'date',   label: 'Date',   align: 'center', field: 'createdDate',  sortable: true, format: val => formatDate(val) }
            ],
            pagination: { rowsPerPage: 20 },
            primaryItemIds: null,
            primaryActions: null,
         }
      },
		computed: {
			...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['actionsExist', 'getUserActions']),
         ...mapGetters('item', ['getItems']),			
         userActions() { return this.getUserActions(this.userId) },
         itemIds() { 
            let itemIds = new Set()
            this.userActions.forEach(action => { itemIds.add(action.itemId) })
            return Arrays.from(itemIds)
         },
         items() { return this.getItems(this.itemIds) },
         itemActions() { 
            let itemIds = new Set()
            let actions = []
            this.userActions.forEach(action => { 
               if (!itemIds.has(action.itemId)) {
                  itemIds.add(action.itemId)
                  actions.push(action)
               }
            })
            return actions
         },
         displayActions() { 
            let displayActions = []
            this.itemActions.forEach(action => { 
               if (!this.showOnlyWins || isWinningBid(action) || isPurchased(action)) { 
                  displayActions.push(Object.assign({}, action)) }
            })
            return displayActions
         },
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
   
	}

</script>