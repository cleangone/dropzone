<template>
	<q-page class="q-pa-sm" :class="pink"> 
		<!-- have to wait for item if user followed an external link directly to this page -->
      <div v-if="itemsExist" v-touch-swipe.mouse="handleSwipe" class="column" :class="orange">
         <item :item="item" :displayType="displayType" :prev="prevItem" :next="nextItem" class="self-center"/>
      </div>
      <!-- <div v-else-if="itemsExist" class="row" :class="blue">
         <div class="col" :class="indigo" align="right">
           <div style="height: 40px"/>
            <div v-if="prevItem" class="text-bold">
               <router-link :to="{ name: itemPageRoute, params: { itemId: prevItem.id } }" class="q-mr-sm">
                  <q-btn icon="arrow_back_ios" size="md" flat dense color="primary"/>{{prevItem.name}}
               </router-link> 
            </div>
         </div>
         <div class=".col-12 .col-md-auto">
            <div v-touch-swipe.mouse="handleSwipe" class="column" :class="yellow">
               <item :item="item" :displayType="displayType" :prev="prevItem" :next="nextItem" class="self-center"/>
            </div>    
         </div>
         <div class="col" :class="purple">
            <div style="height: 40px"/>
            <div v-if="nextItem" class="text-bold">
               <router-link :to="{ name: itemPageRoute, params: { itemId: nextItem.id } }" class="q-ml-sm">
                   {{ nextItem.name }}<q-btn icon="arrow_forward_ios" size="md" flat dense color="primary"/>
    	         </router-link>
            </div>
         </div>
      </div> -->
	</q-page>
</template>

<script>
	import { TouchSwipe } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
	import { ItemDisplayType, Route, Colors } from 'src/utils/Constants.js'
	import { isSwipeLeft, isSwipeRight } from 'src/utils/Utils.js'
	
	export default {
		data() {
			return {				
				itemId: "",
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
               prev = item
            }
            return null
         },
         nextItem() { 
            let itemIsNext = false
               for (var item of this.otherItems) { 
               if (itemIsNext) { return item }
               if (item.id == this.item.id) { itemIsNext = true }  
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