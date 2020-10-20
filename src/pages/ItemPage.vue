<template>
	<q-page class="q-pa-md" :class="pink"> 
		<!-- <a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a> -->
      <!-- will have to wait for items if user followed a link directly to this page -->
      <!-- <div class="column" :class="blue"> -->
         <div v-if="itemsExist" class="column" :class="yellow">

            <!-- todo - need to figure out prev/next layout for mobile -->


            <!-- <div class="col" :class="indigo" align="right">
               <div style="height: 20px"/>
               <router-link v-if="prevItem" :to="{ name: itemPageRoute, params: { itemId: prevItem.id } }" class="q-ma-lg">
                  {{prevItem.name}}
               </router-link>
            </div> -->
            <item :item="item" :displayType="displayType" class="self-center"/>	
            <!-- <div class="col" :class="purple">
               <div style="height: 20px"/>
               <router-link v-if="nextItem" :to="{ name: itemPageRoute, params: { itemId: nextItem.id } }" class="q-ma-lg">
                  {{nextItem.name}}
               </router-link>
            </div> -->
         <!-- </div> -->
      </div>
	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { ItemDisplayType, Route, Colors } from 'src/utils/Constants.js'
	
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
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
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
	
</style>