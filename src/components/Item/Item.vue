<template>
	<div>
		<div v-if="displayMini">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 250px;" :class="textBgColor">				
				<item-thumb :item="item" vImageWidth="125px" hImageWidth="250px"/>
				<q-card-section class="text-caption q-pa-xs">
					<div>{{ item.name }}</div>
					<div v-if="priceTextBgColor" :class="priceTextBgColor" class="text-bold q-px-xs">{{ priceTextMini }}</div>	
					<div v-else>{{ priceTextMini }}</div>	
					<item-timer v-if="isDropping" :item="item"/>
				</q-card-section>	
			</q-card>
		</div>
		<div v-else-if="displayThumb">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 300px;" :class="textBgColor">
				<item-thumb :item="item" vImageWidth="150px" hImageWidth="300px"/>
				<q-card-section class="text-caption q-pa-xs">
					<strong>{{ item.name }}</strong>
               <div>{{ priceText }}</div>
               <div v-if="userIsBuyer" class="text-bold">You are the buyer</div> 
               <div v-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 
               <div v-if="isDropping">
                  <item-timer :item="item"/>
                  <div v-if="userIsHighBidder"  class="text-bold bg-green q-px-xs">You are High Bidder</div>
                  <div v-else-if="userIsOutbid" class="text-bold bg-red   q-px-xs">You have been outbid</div> 
               </div> 
				</q-card-section>	
				<item-actions :item="item" :displayType="displayType"/>
			</q-card>
		</div>
		<div v-else>
			<q-page class="q-pa-sm q-px-sm" :class="textBgColor"> 
				<q-card-section class="bg-white column">					
					<!-- todo - class="image-vertical" class="image-horizontal" not working -->
					<q-img v-if="item.isHorizontal" :src="item.imageUrl" 
						style="display: block; margin-left: auto; margin-right: auto; max-width: 700px; max-height: 1000px" contains/>
					<q-img v-else :src="item.imageUrl" class="image-vertical"
						style="display: block; margin-left: auto; margin-right: auto; max-width: 500px; max-height: 1000px" contains/>
				</q-card-section>	
				<q-card-section class="text-subtitle2 q-pa-xs q-mt-sm">
					<strong>{{ item.name }}</strong>
               <div>{{ priceText }}</div>
               <div v-if="userIsBuyer" class="text-bold">You are the buyer</div>
               <div v-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 
               <div v-if="isDropping">
                  <item-timer :item="item"/>
                  <div v-if="userIsHighBidder"  class="text-bold bg-green q-px-xs">You are High Bidder</div>
                  <div v-else-if="userIsOutbid" class="text-bold bg-red   q-px-xs">You have been outbid</div> 
               </div> 
				</q-card-section>	
				<item-actions :item="item" :displayType="displayType"/>
			</q-page>
		</div>
  	</div>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters, mapActions } from 'vuex'
	import { ItemDisplayType, ItemStatus, SaleType, Colors } from 'src/utils/Constants.js';
	
	export default {
		props: ['item', 'displayType'], 
		data() {
			return {
				showEditModal: false
			}
		},
		computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
			...mapGetters('user', ['isAdmin']),
			...mapGetters('drop', ['getDrop']),
			...mapGetters('color', Colors),
			
			displayMini() { return ItemDisplayType.MINI  == this.displayType },
			displayThumb() { return ItemDisplayType.THUMB == this.displayType },
			drop() { return this.getDrop(this.item.dropId) },
			hasImageUrl() { return (this.item.imageUrl ? true : false) },
			textBgColor() {
				if (this.isNotAvailable) { return (this.userIsBuyer || this.userIsHighBidder ? "bg-green" : "bg-red-5") }
				else if (this.isDropping) { return "bg-yellow" }
			},
			imageWidth() { return ("width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth)) },		
			imageUrl() { return this.item.imageUrl ? this.item.imageUrl : 'statics/image-placeholder.png' },
			itemSaleType() { return (this.item.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.item.saleType) },
			style() { return (this.item.isHorizontal ? "width: 300px" : "width: 200px") },			
			userIsAdmin() { return this.isAdmin(this.userId) },
         isNotAvailable() { return this.item.status == ItemStatus.HOLD || this.item.status == ItemStatus.INVOICED || this.item.status == ItemStatus.SOLD },
         isDropping() { return this.item.status == ItemStatus.DROPPING },
			isBid() { return this.itemSaleType == SaleType.BID },
			isBuy() { return this.itemSaleType == SaleType.BUY },			
			numberOfBids() { return this.item.bids ? Object.keys(this.item.bids).length : 0 },
			currPrice() { return dollars(this.item.buyPrice > this.item.startPrice ? this.item.buyPrice : this.item.startPrice) },
			priceText() {
				if (this.item.status == ItemStatus.SOLD) { return ItemStatus.SOLD }
				else if (this.item.status == ItemStatus.HOLD) { return ItemStatus.HOLD + " (" + this.currPrice + ")"}
				else if (this.item.status == ItemStatus.DROPPING) { 
					return "Price: " + this.currPrice + (this.numberOfBids > 0 ? " (" + this.numberOfBids +" Bids)" : "")
				}
				return "Price: " + this.currPrice
			},
			priceTextMini() {
				if (this.item.status == ItemStatus.SOLD) { return ItemStatus.SOLD }
				let price = this.currPrice
				if (this.item.status == ItemStatus.HOLD || this.item.status == ItemStatus.INVOICED) { price += (" (" + ItemStatus.HOLD + ")") }
				else if (this.item.status == ItemStatus.DROPPING) { 
					price += ((this.numberOfBids > 0 ? " (" + this.numberOfBids +" Bids)" : ""))
				}
				return price
			},
			priceTextBgColor() { 
				if (this.isDropping && this.userIsHighBidder)  { return "bg-green" }
				else if (this.isDropping && this.userIsOutbid) { return "bg-red" }
				else  {return "" }
			},
			userIsBuyer() { 
            return this.loggedIn && this.isNotAvailable && (this.item.buyerId == this.userId) && (this.item.currBidderId == "") 
         },
			userIsWinningBidder() { 
            return this.loggedIn && this.isNotAvailable && (this.item.buyerId == this.userId) && (this.item.currBidderId == this.userId) },
			userIsHighBidder() { return this.loggedIn && (this.item.currBidderId == this.userId) },
			userIsOutbid() { 
				// todo - looks like multiple returns don't work
				let outbid = false 				
				if (this.item.bids && this.loggedIn && !this.userIsHighBidder) {
					Object.keys(this.item.bids).forEach(key => {
						//console.log("userIsOutbid: bid user", this.dropItem.bids[key].userId)
						if (this.item.bids[key].userId == this.userId) { outbid = true } // user bid but is not high bidder	
					})
				}
				return outbid
			},
    	},
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
		},	
		components: {
			'item-actions' : require('components/Item/ItemActions.vue').default,
			'item-thumb' : require('components/Item/ItemThumb.vue').default,
			'item-timer' : require('components/Item/ItemTimer.vue').default
		}
	}

   function dollars(number) {
      return "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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


