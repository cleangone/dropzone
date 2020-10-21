<template>
	<q-page class="q-pa-sm" :class="pink"> 
		<!-- have to wait for item if user followed an external link directly to this page -->
      <div v-if="itemsExist" v-touch-swipe.mouse="handleSwipe" class="column" :class="orange">
         <item :item="item" :displayType="displayType" :prev="prevItem" :next="nextItem" class="self-center"/>
      </div>
	</q-page>
</template>

<script>
	import { TouchSwipe } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr.js'
	import { ItemDisplayType, ItemCollectionType, Route, Colors } from 'src/utils/Constants.js'
	import { isSwipeLeft, isSwipeRight } from 'src/utils/Utils.js'
	
	export default {
		data() {
			return {				
            itemId: "",
            itemCollectionType: "",
        }
		},
	  	computed: {
         ...mapGetters('item', ['itemsExist', 'getItem', 'getItemsInDrop']),			
			...mapGetters('color', Colors),
			displayType() { return ItemDisplayType.FULL },
         item() { return this.getItem(this.itemId) },
         otherItems() { return this.getItemsInDrop(this.item.dropId) },
         prevItem() { 
            let prev = null
            for (var item of this.otherItems) { 
               if (item.id == this.item.id) { return prev } 
               else if ((this.itemCollectionType == ItemCollectionType.DROP) || !ItemMgr.isGone(item)) {
                  prev = item
               }
            }
            return null
         },
         nextItem() { 
            let itemIsNext = false
            for (var item of this.otherItems) { 
               if (item.id == this.item.id) { itemIsNext = true } 
               else if (itemIsNext && ((this.itemCollectionType == ItemCollectionType.DROP) || !ItemMgr.isGone(item))) {
                  return item 
               }
            }
            return null
         },
         itemPageRoute() { return Route.ITEM },
		},
		methods: {
         handleSwipe({ evt, ...info }) {
            if (isSwipeLeft(info) && this.nextItem)       { this.$router.push("/item/" + this.nextItem.id + "/" + this.itemCollectionType) }
            else if (isSwipeRight(info) && this.prevItem) { this.$router.push("/item/" + this.prevItem.id + "/" + this.itemCollectionType) }
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
         this.itemCollectionType = this.$route.params.itemColType
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