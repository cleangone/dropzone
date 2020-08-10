<template>
	<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" :class="textBgColor">
		<drop-item-image :dropItem="dropItem" height="250px" vImageWidth="150px" hImageWidth="300px"/>
		<q-card-section class="q-pa-xs">
			<strong>{{dropItem.name}}</strong>
			<div v-if="dropItem.price">
				<div>{{ priceText }}</div>
				<div v-if="userIsBuyer" class="text-bold">You are the buyer</div> 
				<div v-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 

				<div v-if="isDropping">
					<div v-if="timerSeconds > 0"><div>Dropping ({{ timerSeconds }})</div></div>
					<div v-else>Dropping</div> 
					
					<div v-if="userIsHighBidder"  class="text-bold bg-green q-px-xs">You are High Bidder</div>
					<div v-else-if="userIsOutbid" class="text-bold bg-red   q-px-xs">You have been outbid</div> 
				</div> 
			</div> 
		</q-card-section>	

		<q-card-actions class="q-my-none q-px-xs q-pb-xs q-pt-none" :class="blue">
			<span v-if="isAvailable" class="col">
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
		</q-card-actions>

		<q-dialog v-model="showEditModal">
			<modal-add-edit type="edit" :dropId="dropId" :dropItemId ="dropItemId" :dropItem ="dropItem" @close="showEditModal=false" />
		</q-dialog>
  	</q-card>
</template>

<script>
	import { SaleType, DropItemStatus } from '../../constants/Constants.js';
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	
	var timeouts = {};
	
	export default {
		props: ['dropId', 'drop', 'dropItemId', 'dropItem'], 
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
			...mapGetters('drop', ['getDrop']),
			...mapGetters('color', ['red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]),
			
			hasImageUrl() { return (this.dropItem.imageUrl ? true : false) },
			textBgColor() {
				if (this.isHoldSold) { return (this.userIsBuyer || this.userIsHighBidder ? "bg-green" : "bg-red-5") }
				else if (this.isDropping) { return "bg-yellow" }
			},
			imageUrl() { return this.dropItem.imageUrl ? this.dropItem.imageUrl : 'statics/image-placeholder.png' },
			itemSaleType() { return (this.dropItem.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.dropItem.saleType) },
			style() { return (this.dropItem.isHorizontal ? "width: 300px" : "width: 200px") },			
			userIsAdmin() { return this.isAdmin(this.userId) },
			isAvailable() { return this.dropItem.status != DropItemStatus.HOLD && this.dropItem.status != DropItemStatus.SOLD },
			isHoldSold() { return this.dropItem.status == DropItemStatus.HOLD || this.dropItem.status == DropItemStatus.SOLD },
			isDropping() { return this.dropItem.status == DropItemStatus.DROPPING },
			isBid() { return this.itemSaleType == SaleType.BID },
			isBuy() { return this.itemSaleType == SaleType.BUY },			
			dropDoneDate() { return this.dropItem.dropDoneDate ? this.dropItem.dropDoneDate : 0 },
			showCountdown() { return this.isDropping && this.timerCount > 0 },
			numberOfBids() { return this.dropItem.bids ? Object.keys(this.dropItem.bids).length : 0 },
			priceCurr() { return this.dropItem.currPrice > this.dropItem.price ? this.dropItem.currPrice : this.dropItem.price },
			priceFull() { return "$" + this.priceCurr },	
			priceText() {
				if (this.dropItem.status == DropItemStatus.SOLD) { return DropItemStatus.SOLD }
				else if (this.dropItem.status == DropItemStatus.HOLD) { return DropItemStatus.HOLD + " (" + this.priceFull + ")"}
				else if (this.dropItem.status == DropItemStatus.DROPPING) { 
					return "Price: " + this.priceFull + (this.numberOfBids > 0 ? " (" + this.numberOfBids +" Bids)" : "")
				}
				return "Price: " + this.priceFull
			},
			userIsBuyer() { return this.loggedIn && (this.dropItem.buyerId == this.userId) },
			userIsWinningBidder() { return this.loggedIn && this.isHoldSold && (this.dropItem.currBidderId == this.userId) },
			userIsHighBidder() { return this.loggedIn && (this.dropItem.currBidderId == this.userId) },
			userIsOutbid() { 
				// todo - looks like multiple returns don't work
				let outbid = false 				
				if (this.dropItem.bids && this.loggedIn && !this.userIsHighBidder) {
					Object.keys(this.dropItem.bids).forEach(key => {
						//console.log("userIsOutbid: bid user", this.dropItem.bids[key].userId)
						if (this.dropItem.bids[key].userId == this.userId) { outbid = true } // user bid but is not high bidder	
					})
				}
				return outbid
			},
    	},
		methods: {
			...mapActions('drop', ['updateDropItem', 'deleteDropItem', 'submitBid', 'submitBuy', 'setWinningBid']),
			displayImage() { 
				console.log("displayImage") 
			},
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
			setTimerSeconds() {
				// console.log("setTimerSeconds")
				let nowTime = new Date().getTime()
				let dropDoneTime = this.dropItem.dropDoneDate ? this.dropItem.dropDoneDate : 0
				if (dropDoneTime == 0 || dropDoneTime < nowTime) { 
					this.timerSeconds = -1
					return
				}

				this.timerSeconds = Math.floor((dropDoneTime - nowTime)/1000)
			},
			dropTimerExpired() { 
				console.log("dropTimerExpired")
				if (this.dropItem.status != DropItemStatus.HOLD) {
					this.setWinningBid({ dropId: this.dropId, dropItemId: this.dropItemId })
				}
			}
		},
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
		},	
		watch: {
			dropDoneDate: { handler(value) { this.setTimerSeconds() }}, // data is twitchy - watch will report blips not in db
			timerSeconds: { handler(value) {
				// console.log("watch timerSeconds", value)
				let timeout = timeouts[this.dropItemId]
				if (timeout) { clearTimeout(timeout) }
				
				if (value > 0) {
					// console.log("Timer changed " + value)
					timeouts[this.dropItemId] = setTimeout(() => { this.timerSeconds-- }, 1000) 
				}
				else if (value == 0) {
					// todo - work around for now - firebase function will do this 
					// workaround is high bidder marks item Hold, but it won't be hold if the high bidder is not on the page
					// fallback is to have others mark it after a brief delay which allows for high bidder to do so
					if (this.userIsHighBidder) { this.dropTimerExpired() }
					else { setTimeout(() => { this.setDropItemHold() }, 1000) }
				}
				// else { console.log("Timer cancelled") }
			}}
      },
		components: {
			'drop-item-image' : require('components/DropItem/DropItemImage.vue').default,
			'modal-image' : require('components/DropItem/ModalImage.vue').default,
			'modal-add-edit' : require('components/DropItem/ModalAddEdit.vue').default
		},
		mounted() {
			this.setTimerSeconds() 
		}
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


