<template>
	<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" :class="textBgColor">
		<drop-item-image :dropItem="dropItem" vImageWidth="125px" hImageWidth="250px" />
		<q-card-section class="text-caption q-pa-xs">
			<div>{{dropItem.name}}</div>
			<div :class="priceTextClass">{{ priceText }}</div>	
			<div v-if="timerSeconds">Dropping: {{ timerSeconds }}</div>
		</q-card-section>	

  	</q-card>
</template>

<script>
	import { SaleType, DropItemStatus } from '../../constants/Constants.js';
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	
	var timeouts = {};

	export default {
		props: ['dropItemId', 'dropItem'], 
		data() {
			return {
				timerSeconds: 0
			}
		},
		computed: {
			...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('user', ['isAdmin']),
			...mapGetters('drop', ['getDrop']),

			hasImageUrl() { return (this.dropItem.imageUrl ? true : false) },
			textBgColor() {
				if (this.isHoldSold) { return (this.userIsBuyer || this.userIsHighBidder ? "bg-green" : "bg-red-5") }
				else if (this.isDropping) { return "bg-yellow" }
			},
			isHoldSold() { return this.dropItem.status == DropItemStatus.HOLD || this.dropItem.status == DropItemStatus.SOLD },
			isDropping() { return this.dropItem.status == DropItemStatus.DROPPING },
			numberOfBids() { return this.dropItem.bids ? Object.keys(this.dropItem.bids).length : 0 },
			currPrice() { return this.dropItem.currPrice > this.dropItem.price ? this.dropItem.currPrice : this.dropItem.price },
			priceText() {
				if (this.dropItem.status == DropItemStatus.SOLD) { return DropItemStatus.SOLD }
				let price = "$" + this.currPrice
				if (this.dropItem.status == DropItemStatus.HOLD) { price += (" (" + DropItemStatus.HOLD + ")") }
				else if (this.dropItem.status == DropItemStatus.DROPPING) { 
					price += ((this.numberOfBids > 0 ? " (" + this.numberOfBids +" Bids)" : ""))
				}
				return price
			},
			priceTextClass() { 
				if (this.isDropping && this.userIsHighBidder)  { return "bg-green text-bold q-px-xs" }
				else if (this.isDropping && this.userIsOutbid) { return "bg-red   text-bold q-px-xs" }
				else  {return "" }
			},
			userIsBuyer() { return this.loggedIn && (this.dropItem.buyerId == this.userId) },
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
			dropDoneDate() { return this.dropItem.dropDoneDate ? this.dropItem.dropDoneDate : 0 },
			showCountdown() { return this.isDropping && this.timerCount > 0 },	
		 },
		 methods: {
			setTimerSeconds() {
				console.log("setTimerSeconds")
				let nowTime = new Date().getTime()

				if (this.dropDoneDate == 0 || this.dropDoneDate < nowTime) {
					this.timerSeconds = 0
				}
				else {
					this.timerSeconds = Math.floor((this.dropDoneDate - nowTime)/1000)
				}
			}
		},
		watch: {
			dropDoneDate: { handler(value) { 
				// data is twitchy - watch will report blips not in db
				// set timerSeconds based on the db value - not the one reported here
				this.setTimerSeconds() } 
			}, 
			timerSeconds: { handler(value) {
				// console.log("watch timerSeconds", value)
				let timeout = timeouts[this.dropItemId]
				if (timeout) { clearTimeout(timeout) }
				
				if (value > 0) {
					// console.log("Timer changed " + value)
					timeouts[this.dropItemId] = setTimeout(() => { this.timerSeconds-- }, 1000) 
				}
			}}
      },
		components: {
			'modal-image' : require('components/DropItem/ModalImage.vue').default,
			'drop-item-image' : require('components/DropItem/DropItemImage.vue').default,
		},
		mounted() {
			this.setTimerSeconds() 
		}
	}
</script>

<style>
</style>


