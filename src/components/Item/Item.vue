<template>
	<div>
		<div v-if="displayMini">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 250px;" :class="textBgColor">				
				<item-thumb :item="item" vImageWidth="125px" hImageWidth="250px" imageMaxHeight="200px"/>
				<q-card-section class="text-caption q-pa-xs" :class="purple">
					<div :class="orange">{{ item.name }}</div>
               <div v-if="hasArtist" class="q-ma-none q-pa-none" style="line-height: 1em" :class="pink">{{artist}}</div>
					<div v-if="priceTextBgColor" :class="priceTextBgColor" class="text-bold q-px-xs">{{ priceTextMini }}</div>	
					<div v-else :class="blue">{{ priceTextMini }}</div>	
					<item-timer v-if="isDropping" :item="item"/>
				</q-card-section>	
			</q-card>
		</div>
		<div v-else-if="displayThumb">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 300px;" :class="textBgColor">
				<item-thumb :item="item" vImageWidth="150px" hImageWidth="300px" imageMaxHeight="250px"/>
				<q-card-section class="text-caption q-px-xs q-pt-xs q-pb-none" :class="purple">
					<div  class="text-weight-bold" :class="orange">{{ item.name }}</div>
               <div v-if="hasArtist" style="line-height: 1em" :class="pink"> {{artist}} </div>
               <div :class="indigo">{{ priceText }}</div>
               <div v-if="userIsBuyer" class="text-bold">You are the buyer</div> 
               <div v-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 
               <div v-if="isDropping">
                  <item-timer :item="item"/>
                  <div v-if="userIsHighBidder" class="text-bold bg-green q-px-xs">You are High Bidder</div>
                  <div v-if="userHasHigherMax" class="text-bold bg-green q-px-xs">Max bid {{ userMaxBid }}</div>
                  <div v-if="userIsOutbid"     class="text-bold bg-red-5 q-px-xs">You have been outbid</div> 
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
					<div :class="orange">
                  <strong>{{ item.name }}</strong>

                  <router-link :to="{ name: dropPageRoute, params: { dropId: item.dropId } }" class="float-right">{{drop.name}}</router-link>
                  <!-- <span class="float-right"> {{drop.name}} </span> -->

					</div>
               
               <!-- todo - add drop link -->
               
               
               <!-- todo - add link -->
               <div v-if="hasArtist"> {{artist}} </div>
               <div>{{ priceText }}</div>
               <div v-if="userIsBuyer" class="text-bold">You are the buyer</div>
               <div v-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 
               <div v-if="isDropping">
                  <item-timer :item="item"/>
                  <div v-if="userIsHighBidder" class="text-bold bg-green  q-px-xs">You are High Bidder</div>
                  <div v-if="userHasHigherMax" class="text-bold bg-green q-px-xs">Max bid {{ userMaxBid }}</div>
                  <div v-if="userIsOutbid"     class="text-bold bg-red-5 q-px-xs">You have been outbid</div> 
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
   import { ItemDisplayType, SaleType, Route, Colors } from 'src/utils/Constants.js'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr.js'
	import { TagMgr } from 'src/managers/TagMgr.js'
	import { dollars } from 'src/utils/Utils'
   
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
				if (this.isSetup) { return "bg-grey" }
				else if (this.isNotAvailable) { return (this.userIsBuyer || this.userIsHighBidder ? "bg-green" : "bg-red-5") }
				else if (this.isDropping) { return "bg-yellow" }
         },

         hasArtist() { return this.artist.length > 0 },
         artist() { return TagMgr.artist(this.item) },

			imageWidth() { return ("width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth)) },		
			imageUrl() { return this.item.imageUrl ? this.item.imageUrl : 'statics/image-placeholder.png' },
			itemSaleType() { return (this.item.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.item.saleType) },
			style() { return (this.item.isHorizontal ? "width: 300px" : "width: 200px") },			
         userIsAdmin() { return this.isAdmin(this.userId) },
         isSetup() { return ItemMgr.isSetup(this.item) },
         isNotAvailable() { return ItemMgr.isHold(this.item) || ItemMgr.isInvoiced(this.item) || ItemMgr.isSold(this.item) },
         isDropping() { return ItemMgr.isDropping(this.item) },
			isBid() { return this.itemSaleType == SaleType.BID },
			isBuy() { return this.itemSaleType == SaleType.BUY },			
			numberOfBids() { return this.item.bids ? Object.keys(this.item.bids).length : 0 },
			currPrice() { return dollars(this.item.buyPrice > this.item.startPrice ? this.item.buyPrice : this.item.startPrice) },
			priceText() { 
            const prefix = ItemMgr.isDropping(this.item) ? "Current Bid: " : "Price: "
            return this.buildPriceText(prefix) 
         },
			priceTextMini() { return this.buildPriceText("") },
			priceTextBgColor() { 
				if (this.isDropping && this.userIsHighBidder)  { return "bg-green" }
				else if (this.isDropping && this.userIsOutbid) { return "bg-red-5" }
				else  {return "" }
			},
			userIsBuyer()         { return this.loggedIn && this.isNotAvailable && !this.item.currBid && (this.item.buyerId == this.userId) },
			userIsWinningBidder() { return this.loggedIn && this.isNotAvailable && this.item.currBid  && (this.item.buyerId == this.userId) },
			userIsHighBidder() { return this.loggedIn && this.item.currBid && (this.item.currBid.userId == this.userId) },
			userIsOutbid() { return this.loggedIn && !this.userIsHighBidder && this.item.bidderIds && this.item.bidderIds.includes(this.userId) },
         userHasHigherMax() { return this.userIsHighBidder && (this.item.currBid.amount > this.item.buyPrice) },
         userMaxBid() { return dollars(this.item.currBid.amount) },
         dropPageRoute() { return Route.DROP },
      },
      methods: {
         buildPriceText(prefix) {
            let bidText = ""
            if (this.item.numberOfBids && this.item.numberOfBids == 1) { bidText = " (1 Bid)" }
            else if (this.item.numberOfBids && this.item.numberOfBids > 1) { bidText = " (" + this.item.numberOfBids + " Bids)" }

				if (ItemMgr.isSold(this.item)) { return ItemStatus.SOLD }
				else if (ItemMgr.isHold(this.item) || ItemMgr.isInvoiced(this.item)) { return ItemStatus.HOLD + " (" + this.currPrice + ")" }
            else if (ItemMgr.isDropping(this.item)) { return prefix + this.currPrice + bidText }
            else return prefix + this.currPrice
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


