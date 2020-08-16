<template>
	<div>
		<div v-if="isMini">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 250px;" :class="textBgColor">				
				<drop-item-thumb :dropItemId="dropItemId" :dropItem="dropItem" vImageWidth="125px" hImageWidth="250px"/>
				<q-card-section class="text-caption q-pa-xs">
					<div>{{dropItem.name}}</div>
					<div v-if="priceTextBgColor" :class="priceTextBgColor" class="text-bold q-px-xs">{{ priceTextMini }}</div>	
					<div v-else>{{ priceTextMini }}</div>	
					<drop-item-timer v-if="isDropping" :dropItemId="dropItemId" :dropItem="dropItem"/>
				</q-card-section>	
			</q-card>
		</div>
		<div v-else-if="isThumb">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 300px;" :class="textBgColor">
				<drop-item-thumb :dropItemId="dropItemId" :dropItem="dropItem" vImageWidth="150px" hImageWidth="300px"/>
				<q-card-section class="text-caption q-pa-xs">
					<strong>{{dropItem.name}}</strong>
					<div v-if="dropItem.price">
						<div>{{ priceText }}</div>
						<div v-if="userIsBuyer" class="text-bold">You are the buyer</div> 
						<div v-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 
						<div v-if="isDropping">
							<drop-item-timer :dropItemId="dropItemId" :dropItem="dropItem"/>
							<div v-if="userIsHighBidder"  class="text-bold bg-green q-px-xs">You are High Bidder</div>
							<div v-else-if="userIsOutbid" class="text-bold bg-red   q-px-xs">You have been outbid</div> 
						</div> 
					</div> 
				</q-card-section>	
				<drop-item-actions :dropItemId="dropItemId" :dropItem="dropItem"/>
			</q-card>
		</div>
		
		<div v-else>
			<q-page class="q-pa-sm q-px-sm" :class="textBgColor"> 
				<q-card-section class="bg-white column">					
					<!-- todo - class="image-vertical" class="image-horizontal" not working -->
					<q-img v-if="dropItem.isHorizontal" :src="dropItem.imageUrl" 
						style="display: block; margin-left: auto; margin-right: auto; max-width: 700px; max-height: 1000px" contains/>
					<q-img v-else :src="dropItem.imageUrl" class="image-vertical"
						style="display: block; margin-left: auto; margin-right: auto; max-width: 500px; max-height: 1000px" contains/>
				</q-card-section>	
				<q-card-section class="text-subtitle2 q-pa-xs q-mt-sm">
					<strong>{{dropItem.name}}</strong>
					<div v-if="dropItem.price">
						<div>{{ priceText }}</div>
						<div v-if="userIsBuyer" class="text-bold">You are the buyer</div> 
						<div v-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 
						<div v-if="isDropping">
							<drop-item-timer :dropItemId="dropItemId" :dropItem="dropItem"/>
							<div v-if="userIsHighBidder"  class="text-bold bg-green q-px-xs">You are High Bidder</div>
							<div v-else-if="userIsOutbid" class="text-bold bg-red   q-px-xs">You have been outbid</div> 
						</div> 
					</div> 
				</q-card-section>	
				<drop-item-actions :dropItemId="dropItemId" :dropItem="dropItem"/>
			</q-page>
		</div>
  	</div>
</template>

<script>
	import { DropItemDisplayType, SaleType, DropItemStatus } from '../../constants/Constants.js';
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	
	export default {
		props: ['dropItemId', 'dropItem', 'displayType'], 
		data() {
			return {
				showEditModal: false
			}
		},
		computed: {
			...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('user', ['isAdmin']),
			...mapGetters('drop', ['getDropId', 'getDrop']),
			...mapGetters('color', ['red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]),
			
			isMini() { return DropItemDisplayType.MINI  == this.displayType },
			isThumb() { return DropItemDisplayType.THUMB == this.displayType },
			dropId() { return this.getDropId(this.dropItemId) },
			drop() { return this.getDrop(this.dropId) },
			hasImageUrl() { return (this.dropItem.imageUrl ? true : false) },
			textBgColor() {
				if (this.isHoldSold) { return (this.userIsBuyer || this.userIsHighBidder ? "bg-green" : "bg-red-5") }
				else if (this.isDropping) { return "bg-yellow" }
			},
			imageWidth() { return ("width: " + (this.dropItem.isHorizontal ? this.hImageWidth : this.vImageWidth)) },		
			imageUrl() { return this.dropItem.imageUrl ? this.dropItem.imageUrl : 'statics/image-placeholder.png' },
			itemSaleType() { return (this.dropItem.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.dropItem.saleType) },
			style() { return (this.dropItem.isHorizontal ? "width: 300px" : "width: 200px") },			
			userIsAdmin() { return this.isAdmin(this.userId) },
			isHoldSold() { return this.dropItem.status == DropItemStatus.HOLD || this.dropItem.status == DropItemStatus.SOLD },
			isDropping() { return this.dropItem.status == DropItemStatus.DROPPING },
			isBid() { return this.itemSaleType == SaleType.BID },
			isBuy() { return this.itemSaleType == SaleType.BUY },			
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
			priceTextMini() {
				if (this.dropItem.status == DropItemStatus.SOLD) { return DropItemStatus.SOLD }
				let price = "$" + this.priceCurr
				if (this.dropItem.status == DropItemStatus.HOLD) { price += (" (" + DropItemStatus.HOLD + ")") }
				else if (this.dropItem.status == DropItemStatus.DROPPING) { 
					price += ((this.numberOfBids > 0 ? " (" + this.numberOfBids +" Bids)" : ""))
				}
				return price
			},
			priceTextBgColor() { 
				if (this.isDropping && this.userIsHighBidder)  { return "bg-green" }
				else if (this.isDropping && this.userIsOutbid) { return "bg-red" }
				else  {return "" }
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
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
		},	
		components: {
			'drop-item-actions' : require('components/DropItem/DropItemActions.vue').default,
			'drop-item-thumb' : require('components/DropItem/DropItemThumb.vue').default,
			'drop-item-timer' : require('components/DropItem/DropItemTimer.vue').default
		}
	}

	// todo - this is how you make a global function
	function zeroPadded(num) {
		// 4 --> 04
		return num < 10 ? `0${num}` : num;
	}
</script>

<style>
	.image-vertical {
		display: block; 
		margin-left: auto; 
		margin-right: auto; 
		max-width: 500px; 
		max-height: 1000px;
	}

	.image-horizontal {
		display: block; 
		margin-left: auto; 
		margin-right: auto; 
		max-width: 700px; 
		max-height: 1000px;
	}
</style>


