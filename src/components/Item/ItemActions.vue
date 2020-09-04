<template>
	<q-card-actions class="q-my-none q-px-xs q-pb-xs q-pt-none" :class="blue">
		<span v-if="!isHoldSold" class="col">
			<span v-if="loggedIn" class="col">
				<q-btn v-if="isBid"      @click="promptToBid()" :label="itemSaleType" color="primary" small/>
				<q-btn v-else-if="isBuy" @click="promptToBuy()" :label="itemSaleType" color="primary" small/>
			</span>
			<span v-else class="col">
				<q-btn @click="login()" :label="'Login to ' + itemSaleType" color="primary" medium/>
			</span>
		</span>
		<!-- <span v-if="loggedIn" class="col">
				<q-btn v-if="isLiked" icon="favorite" @click="unlike" flat small/>
				<q-btn v-else icon="favorite_border"  @click="like"   flat small/>
		</span> -->
		<span v-if="userIsAdmin" class="col" align="right">
			<q-btn @click="showEditModal = true" icon="edit" color="primary" flat small/>
		</span>
		<q-dialog v-model="showEditModal">
			<item-add-edit type="edit" :item ="item" @close="showEditModal=false" />
		</q-dialog>
	</q-card-actions>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { ItemStatus, SaleType, Colors } from 'src/utils/Constants.js';
	
	var timeouts = {};
	
	export default {
		props: ['item'], 
		data() {
			return {
				showEditModal: false,
				timerSeconds: 0
			}
		},
		computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
			...mapGetters('user', ['getUser']), //'getLikes'
			...mapGetters('drop', ['getDrop']),
			...mapGetters('color', Colors),
         
			drop() { return this.getDrop(this.item.dropId) },
         itemSaleType() { return (this.item.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.item.saleType) },
         user() { return this.getUser(this.userId)},
         userIsAdmin() { return this.user && this.user.isAdmin },
			// likes() { return this.getLikes(this.userId) },
			isHoldSold() { return this.item.status == ItemStatus.HOLD || this.item.status == ItemStatus.SOLD },
			isBid() { return this.itemSaleType == SaleType.BID },
			isBuy() { return this.itemSaleType == SaleType.BUY },	
			isLiked() { 
            return true
            // return this.likes && Object.keys(this.likes).includes(this.dropItemId)
         },		
		},
		methods: {
			...mapActions('action', ['submitBid', 'submitPurchaseRequest']),
			// ...mapActions('user', ['addLike', 'removeLike']),
			promptToBid() {
				let bidAmount = this.item.buyPrice ? this.item.buyPrice + 25 : this.item.startPrice
				this.$q.dialog({title: 'Confirm', message: 'Bid $' + bidAmount + ' on ' + this.item.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.submitBid({ itemId: this.item.id, userId: this.userId, amount: bidAmount }) 
				})
			},
			promptToBuy() {
				this.$q.dialog({title: 'Confirm', message: 'Buy ' + this.item.name + ' for ' + this.item.startPrice + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.submitPurchaseRequest({ itemId: this.item.id, userId: this.userId }) 
				})
			},
			// like() { this.addLike({ userId: this.userId, dropItemId: this.dropItemId, dropItemName: this.dropItem.name,  }) },
			// unlike() { this.removeLike({ userId: this.userId, dropItemId: this.dropItemId, dropItemName: this.dropItem.name,  }) },
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


