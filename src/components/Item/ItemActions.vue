<template>
	<q-card-actions class="q-my-none q-px-xs q-pb-xs q-pt-none" :class="blue">
		<span v-if="isAvailable" class="col">
			<span v-if="loggedIn" class="col">
				<q-btn v-if="isBid"      @click="promptToBid()" :label="itemSaleType" color="primary" small/>
				<q-btn v-else-if="isBuy" @click="promptToBuy()" :label="itemSaleType" color="primary" small/>
			</span>
			<span v-else class="col">
				<q-btn @click="login()" :label="'Login to ' + itemSaleType" color="primary" medium/>
			</span>
		</span>
		<span v-if="showIcons" class="col" align="right">
			<q-btn v-if="isLiked" icon="favorite" @click="unlike" flat small dense/>
			<q-btn v-else  icon="favorite_border" @click="like"   flat small dense/>

			<q-btn v-if="userIsAdmin" @click="showEditModal=true" icon="edit" flat small dense/>
		</span>
		<q-dialog v-model="showEditModal">
			<item-add-edit type="edit" :item ="item" @close="showEditModal=false" />
		</q-dialog>
	</q-card-actions>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters, mapActions } from 'vuex'
   import { ItemDisplayType, ItemStatus, SaleType, Colors } from 'src/utils/Constants.js';
   import { dollars } from 'src/utils/Utils'
	
	var timeouts = {};
	
	export default {
		props: ['item', 'displayType'], 
		data() {
			return {
				showEditModal: false,
				timerSeconds: 0
			}
		},
		computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
			...mapGetters('user', ['getUser']),
			...mapGetters('drop', ['getDrop']),
			...mapGetters('color', Colors),
         
			drop() { return this.getDrop(this.item.dropId) },
         itemSaleType() { return (this.item.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.item.saleType) },
         user() { return this.getUser(this.userId)},
         userIsAdmin() { return this.user && this.user.isAdmin },
			isAvailable() { return this.item.status == ItemStatus.AVAILABLE || this.item.status == ItemStatus.DROPPING },
			isBid() { return this.itemSaleType == SaleType.BID && this.item.startPrice },
			isBuy() { return this.itemSaleType == SaleType.BUY && this.item.startPrice },	
      	showIcons() { return this.loggedIn &&  this.displayType == ItemDisplayType.FULL },		
         isLiked() { return this.user.likedItemIds  &&  this.user.likedItemIds.includes(this.item.id) },		
		},
		methods: {
			...mapActions('action', ['submitBid', 'submitPurchaseRequest']),
			...mapActions('user', ['setLikes']),
         login() { this.$router.push("/auth/login") },
         promptToBid() {
				let bidAmount = this.item.buyPrice ? this.item.buyPrice + 25 : this.item.startPrice
				this.$q.dialog({title: 'Confirm', message: 'Bid ' + dollars(bidAmount) + ' on ' + this.item.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.submitBid(
                  { itemId: this.item.id, itemName: this.item.name, userId: this.userId, amount: bidAmount }) 
				})
			},
			promptToBuy() {
				this.$q.dialog({title: 'Confirm', message: 'Buy ' + this.item.name + ' for ' + dollars(this.item.startPrice) + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.submitPurchaseRequest(
                  { itemId: this.item.id, itemName: this.item.name, userId: this.userId, amount: this.item.startPrice }) 
				})
			},
			like() { 
            let likedItemIds = this.user.likedItemIds ? [...this.user.likedItemIds] : []
            likedItemIds.push(this.item.id) 
            this.setLikes({ id: this.user.id, likedItemIds: likedItemIds }) 
         },
			unlike() { 
            // todo - ugly
            let likedItemIds = []
            this.user.likedItemIds.forEach(likedItemId => { if (likedItemId != this.item.id) { likedItemIds.push(likedItemId)} })
            this.setLikes({ id: this.user.id, likedItemIds: likedItemIds }) 
         },
		},
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
		},	
		components: {
			'item-add-edit' : require('components/Item/ItemAddEdit.vue').default
		},
	}

	// todo - this is how you make a global function
	function zeroPadded(num) {
		// 4 --> 04
		return num < 10 ? `0${num}` : num;
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


