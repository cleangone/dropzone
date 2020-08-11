<template>
	<div v-if="timerSeconds > 0">Dropping ({{ timerSeconds }})</div>
	<div v-else>Dropping</div> 
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
			...mapGetters('drop', ['getDropId']),
			...mapGetters('color', ['red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]),
			dropId() { return this.getDropId(this.dropItemId) },
			dropDoneDate() { return this.dropItem.dropDoneDate ? this.dropItem.dropDoneDate : 0 },
			userIsHighBidder() { return this.loggedIn && (this.dropItem.currBidderId == this.userId) },
   	},
		methods: {
			...mapActions('drop', ['setWinningBid']),
			setTimerSeconds() {
				console.log("setTimerSeconds")
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
					console.log("timerSeconds = " + value)
					// todo - work around for now - firebase function will do this 
					// workaround is high bidder marks item Hold, but it won't be hold if the high bidder is not on the page
					if (this.userIsHighBidder) { this.dropTimerExpired() }
				}
				// else { console.log("Timer cancelled") }
			}}
      },
		mounted() {
			this.setTimerSeconds() 
		}
	}
</script>



