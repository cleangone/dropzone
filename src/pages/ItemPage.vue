<template>
	<q-page class="q-pa-sm" :class="pink"> 
		<!-- have to wait for item if user followed an external link directly to this page -->
      <div v-if="itemsExist" v-touch-swipe.mouse="handleSwipe" class="column" :class="orange">
         <item :item="item" :displayType="displayTypeFull" :prev="prevItem" :next="nextItem" class="self-center"/>
      </div>
	</q-page>
</template>

<script>
	import { TouchSwipe } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
	import { SessionMgr } from 'src/managers/SessionMgr'
	import { ItemDisplayType, Route, Colors } from 'src/utils/Constants'
	import { isSwipeLeft, isSwipeRight } from 'src/utils/Utils'
	
	export default {
		data() {
			return {				
            itemId: "",
         }
		},
	  	computed: {
         ...mapGetters('item', ['itemsExist', 'getItem']),			
			...mapGetters('color', Colors),
			displayTypeFull() { return ItemDisplayType.FULL },
         item() { return this.getItem(this.itemId) },
         displayedItems() { 
            const itemsCollection = SessionMgr.getDisplayItemsDesc()
            if (SessionMgr.isArtist(itemsCollection)) {
               const artistCategoryId = SessionMgr.getArtistCategory()
               return SessionMgr.getCategoryDisplayItems(artistCategoryId)
            }
            else { return SessionMgr.getDisplayItems() }
         },
         prevItem() { 
            let prev = null
            for (var item of this.displayedItems) { 
               if (item.id == this.item.id) { return prev } 
               else { prev = item }
            }
            return null
         },
         nextItem() { 
            let itemIsNext = false
            for (var item of this.displayedItems) { 
               if (item.id == this.item.id) { itemIsNext = true } 
               else if (itemIsNext) { return item }
            }
            return null
         },
         itemPageRoute() { return Route.ITEM },
		},
		methods: {
         handleSwipe({ evt, ...info }) {
            if (isSwipeLeft(info) && this.nextItem)       { this.$router.push("/item/" + this.nextItem.id) }
            else if (isSwipeRight(info) && this.prevItem) { this.$router.push("/item/" + this.prevItem.id) }
         }
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
      directives: {
         TouchSwipe
      },
      created() {
         this.itemId = this.$route.params.itemId
      },
      watch: {
         $route() { this.itemId = this.$route.params.itemId }
      },
	}

</script>

<style>
   a {
      text-decoration: none;
   }
</style>