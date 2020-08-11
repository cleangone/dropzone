<template>
	<q-card-actions class="q-my-none q-px-xs q-pb-xs q-pt-none" :class="blue">
		<span v-if="!isHoldSold" class="col">
			<span v-if="loggedIn" class="col">
				<q-btn v-if="isBid" @click="promptToBid()" :label="itemSaleType" color="primary" small/>
				<q-btn v-else-if="isBuy" @click="promptToBuy()" :label="itemSaleType" color="primary" small/>
			</span>
			<span v-else class="col">
				<q-btn @click="login()" :label="'Login to ' + itemSaleType" color="primary" medium/>
			</span>
		</span>
		<span v-if="userIsAdmin" class="col" align="right">
			<q-btn @click="showEditModal = true" icon="edit" color="primary" flat small/>
		</span>
		<q-dialog v-model="showEditModal">
			<modal-add-edit type="edit" :dropId="dropId" :dropItemId ="dropItemId" :dropItem ="dropItem" @close="showEditModal=false" />
		</q-dialog>
	</q-card-actions>
</template>

<script>
	import { DropItemDisplayType, SaleType, DropItemStatus } from '../../constants/Constants.js';
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	
	var timeouts = {};
	
	export default {
		props: ['dropItemId', 'dropItem'], 
		data() {
			return {
				showEditModal: false,
				timerSeconds: 0
			}
		},
		computed: {
			...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('user', ['isAdmin']),
			...mapGetters('drop', ['getDropId', 'getDrop']),
			...mapGetters('color', ['red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]),
			
			dropId() { return this.getDropId(this.dropItemId) },
			drop() { return this.getDrop(this.dropId) },
			itemSaleType() { return (this.dropItem.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.dropItem.saleType) },
			userIsAdmin() { return this.isAdmin(this.userId) },
			isHoldSold() { return this.dropItem.status == DropItemStatus.HOLD || this.dropItem.status == DropItemStatus.SOLD },
			isBid() { return this.itemSaleType == SaleType.BID },
			isBuy() { return this.itemSaleType == SaleType.BUY },			
		},
		methods: {
			...mapActions('drop', ['submitBid', 'submitBuy', 'setWinningBid']),
			promptToBid() {
				let bidAmount = this.dropItem.currPrice ? this.dropItem.currPrice + 25 : this.dropItem.price
				
				this.$q.dialog({title: 'Confirm', message: 'Bid $' + bidAmount + ' on ' + this.dropItem.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.submitBid({ dropId: this.dropId, dropItemId: this.dropItemId, userId: this.userId, bidAmount: bidAmount }) 
				})
			},
			promptToBuy() {
				this.$q.dialog({title: 'Confirm', message: 'Buy ' + this.dropItem.name + ' for ' + this.dropItem.price + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.submitBuy({ dropId: this.dropId, dropItemId: this.dropItemId, userId: this.userId  }) 
				})
			},
		},
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
		},	
		components: {
			'modal-add-edit' : require('components/DropItem/ModalAddEdit.vue').default
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


