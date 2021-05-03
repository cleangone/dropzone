<template>
  <q-page>
      <div class="q-pt-md q-pl-md text-h6">{{ item.name }} - Purchase Requests</div>
		<div class="row">
         <div class="q-pa-sm" :class="'width: ' + itemDivWidth">
            <item :item="item" :displayType="displayType" class="q-pa-sm col-2"/>
         </div>
         <div class="q-pa-sm col">
         <!-- todo - long table scrolls off bottom -->
            <q-table :data="reqs"  :columns="columns" :visible-columns="visibleColumns" row-key="name" 
               :filter="tableDataFilter" :pagination.sync="pagination" :hide-pagination="hidePagination"
               :dense="$q.screen.lt.md" class="q-mb-sm" flat>
               <q-td slot="body-cell-status" slot-scope="props" :props="props"> 
                  <q-btn v-if="itemIsRequested" @click="acceptReq(props.row)" label="Accept" size="sm" color="primary" dense/>   
                  <span v-else-if="requestedIsAccepted(props.row.actionId)">Accepted</span>   
               </q-td>
            </q-table>
         </div>
      </div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { Colors, ItemDisplayType } from 'src/utils/Constants.js'
   
	export default {
		data() {
	  		return {
				itemId: '',
            returnRoute: null,
            requestAccepted: false,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'date', 'status'],
 				columns: [ 
    				{ name: 'name', label: 'Requester', align: 'left',   field: 'userNickname', sortable: true },
				 	{ name: 'date', label: 'Date',      align: 'center', field: 'date',         sortable: true, format: val => date.formatDate(val, 'MMM D, h:mm:ss.SSS a') },
               { name: 'status' }
				],
            pagination: { rowsPerPage: 25 },
            hidePagination: true,
         }
		},
		computed: {
			...mapGetters('item', ['getItem']),
         item() { return this.getItem(this.itemId) },
         itemIsRequested() {             
            const requested =  ItemMgr.isRequested(this.item)
            if (!requested && this.returnRoute && this.requestAccepted) { 
               this.$router.push({ name: this.returnRoute }) 
            }

            return requested 
         },
         imageW() { return "width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         itemDivWidth() { return this.item.isHorizontal ? 200 : 350 },
         displayType() { return ItemDisplayType.MINI },
         reqs() { 
            this.hidePagination = (this.item.numberOfPurchaseReqs < 25)
            return this.item.purchaseReqs
			}
      },
      methods: {
         ...mapActions('action', ['acceptPurchaseRequest']),
         requestedIsAccepted(actionId) { return this.item.acceptedPurchaseReqId == actionId },
         acceptReq(purchaseReq) { 
            this.requestAccepted = true
            this.acceptPurchaseRequest( {
               itemId: this.item.id, itemName: this.item.name, amount: purchaseReq.amount, refActionId: purchaseReq.actionId, 
               userId: purchaseReq.userId, userNickname: purchaseReq.userNickname 
            }) 
         },
      },
      components: {
	  	   'item' : require('components/Item/Item.vue').default,
	  	},
      created() { 
         this.itemId = this.$route.params.itemId 
         if (this.$route.params.route && this.$route.params.route != '.') { this.returnRoute = this.$route.params.route }
      }
   }
</script>