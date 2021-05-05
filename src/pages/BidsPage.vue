<template>
  <q-page>
      <div class="q-pt-md q-pl-md text-h6">{{ item.name }}</div>
		<div class="row">
         <div class="q-pa-sm" :class="'width: ' + itemDivWidth">
            <item :item="item" :displayType="displayType" class="q-pa-sm col-2"/>
         </div>
         <div class="q-pa-sm col">
         <!-- todo - long table scrolls off bottom -->
            <q-table :data="bids"  :columns="columns" :visible-columns="visibleColumns" row-key="name" 
               :filter="tableDataFilter" :pagination.sync="pagination" :hide-pagination="hidePagination"
               :dense="$q.screen.lt.md" class="q-mb-sm" flat>
            </q-table>
         </div>
      </div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters } from 'vuex'
   import { Colors, ItemDisplayType } from 'src/utils/Constants.js'
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
            pagination: { rowsPerPage: 25 },
            hidePagination: true
         }
		},
		computed: {
			...mapGetters('item', ['getItem']),
         item() { return this.getItem(this.itemId) },
         imageW() { return "width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         
         itemDivWidth() { return this.item.isHorizontal ? 200 : 350 },
         displayType() { return ItemDisplayType.BID },
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

            this.hidePagination = (bids.length <25)
            return bids
			}
      },
      components: {
	  	   'item' : require('components/Item/Item.vue').default,
	  	},
      created() { this.itemId = this.$route.params.itemId }
   }
</script>