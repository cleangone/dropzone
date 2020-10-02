<template>
  <q-page>
	  	<!-- todo - long table scrolls off bottom -->

      <div class="q-pt-md q-pl-md text-h6">
         Bids - <a :href="'#/item/' + itemId">{{ item.name }}</a>
	   </div>

		<div class="q-pa-sm absolute full-width full-height">
			<q-table :data="bids"  :columns="columns" :visible-columns="visibleColumns" row-key="name" 
            :filter="tableDataFilter" :pagination.sync="pagination" :dense="$q.screen.lt.md" class="q-mb-sm" flat>
			</q-table>
		</div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters } from 'vuex'
   import { dollars } from 'src/utils/Utils'

	export default {
		data() {
	  		return {
				itemId: '',
				tableDataFilter: '',
				visibleColumns: [ 'name', 'amount', 'result', 'date'],
 				columns: [ 
    				{ name: 'name',   label: 'Bidder', align: 'left',   field: 'userNickname', sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'right',  field: 'amount', sortable: true, format: val => dollars(val) },
					{ name: 'date',   label: 'Date',   align: 'center', field: 'date',   sortable: true, format: val => date.formatDate(val, 'MMM D, h:mm:ss a') }
				],
				pagination: { rowsPerPage: 25} 
			}
		},
		computed: {
			...mapGetters('item', ['getItem']),
			item() { return this.getItem(this.itemId) },
			bids() { 
            const bids = []
            let currBidder = 1
            const userIdToNickname = new Map()
            if (this.item.prevBids) {
               this.item.prevBids.forEach(bid => { 
                  if (!userIdToNickname.has(bid.userId)) {
                     userIdToNickname.set(bid.userId,
                        (bid.userNickname && bid.userNickname.length ? bid.userNickname : "Bidder " + (currBidder++)))
                  }

                  const prevBid = Object.assign({}, bid)
                  prevBid.nickname = userIdToNickname.get(bid.userId)
                  bids.unshift(Object.assign({}, prevBid))
               })
            }

            const highBid = Object.assign({}, this.item.currBid)
            if (!userIdToNickname.has(highBid.userId)) {
               userIdToNickname.set(highBid.userId,
                  (highBid.userNickname && highBid.userNickname.length ? highBid.userNickname : "Bidder " + (currBidder++)))
            }

            highBid.nickname = userIdToNickname.get(highBid.userId)
            highBid.amount = this.item.buyPrice
            bids.unshift(highBid)

            return bids
			}
      },
      created() { this.itemId = this.$route.params.itemId }
   }
</script>