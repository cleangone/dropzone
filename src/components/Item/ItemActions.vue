<template>
	<q-card-actions class="q-my-none q-px-xs q-pb-xs q-pt-none" :class="blue">
		<span v-if="isAvailable" class="col">
			<span v-if="loggedIn" class="col">
            <q-btn v-if="isBid"  @click="showBidModal=true" :label="itemSaleType" color="primary" :size="buttonSize" dense/>
            <q-btn v-else-if="isBuy" @click="promptToBuy()" :label="itemSaleType" color="primary" :size="buttonSize" dense/>
			</span>
			<span v-else class="col">
				<q-btn @click="login()" :label="'Login to ' + itemSaleType" color="primary" :size="buttonSize" dense/>
			</span>
		</span>
      <span v-else-if="isAdminSetup" class="col">
         <span class="col">
            <q-btn v-if="isBid"      :label="itemSaleType" disable color="primary" :size="buttonSize" dense/>
            <q-btn v-else-if="isBuy" :label="itemSaleType" disable color="primary" :size="buttonSize" dense/>
         </span>
      </span>
      <q-dialog v-model="showBidModal">
			<item-bid :item ="item" @close="showBidModal=false" />
		</q-dialog>
	</q-card-actions>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr.js';
	import { DropMgr } from 'src/managers/DropMgr.js';
   import { ItemDisplayType, SaleType, Colors } from 'src/utils/Constants.js';
   import { dollars } from 'src/utils/Utils'
   
	var timeouts = {};
	
	export default {
		props: ['item', 'displayType'], 
		data() {
			return {
            showBidModal: false,
			}
		},
		computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
			...mapGetters('user', ['getUser']),
			...mapGetters('drop', ['getDrop']),
			...mapGetters('color', Colors),
         isAvailable() { return ItemMgr.isAvailable(this.item) || ItemMgr.isDropping(this.item) },
			isAdminSetup() { return this.userIsAdmin && ItemMgr.isSetup(this.item) },         
			drop() { return this.getDrop(this.item.dropId) },
         itemSaleType() {    
            let itemSaleType = (this.item.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.item.saleType)
            if (DropMgr.isDropped(this.drop)) { itemSaleType = SaleType.BUY }
            return itemSaleType
         },
         buttonSize() { return this.displayType == ItemDisplayType.FULL ? "md" : "sm"  },        
         user() { return this.getUser(this.userId)},
         userIsAdmin() { return this.user && this.user.isAdmin },
			isBid() { return this.itemSaleType == SaleType.BID && this.item.startPrice },
			isBuy() { return this.itemSaleType == SaleType.BUY && this.item.startPrice },	
      },
		methods: {
         ...mapActions('action', ['submitBid', 'submitPurchaseRequest']),
         ...mapActions('user', ['setLikes']),
			login() { this.$router.push("/auth/login") },
			promptToBuy() {
				this.$q.dialog({title: 'Confirm Purchase', message: 'Buy ' + this.item.name + ' for ' + dollars(this.item.startPrice) + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.submitPurchaseRequest(
                  { itemId: this.item.id, itemName: this.item.name, amount: this.item.startPrice, userId: this.userId, userNickname: this.user.nickname,  }) 
            
               let likedItemIds = this.user.likedItemIds ? [...this.user.likedItemIds] : []
               if (!likedItemIds.includes(this.item.id)) {
                  likedItemIds.push(this.item.id) 
                  this.setLikes({ id: this.user.id, likedItemIds: likedItemIds }) 
               }   
				})
			},			
		},
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
		},	
		components: {
			'item-bid' : require('components/Item/ItemBid.vue').default
		},
	}
</script>

<style>
	.card {
		max-width: 500px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	}
</style>


