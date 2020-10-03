<template>
	<q-page class="q-pa-md">
		<div class="text-h5">Current Activity</div>
      <div>
         <q-checkbox v-model="showBuysOnly" label="Show only Wins/Purchases"  class="text-grey-10" color="grey-10" dense/>
      </div>
      <div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in displayItems" :key="key" :item="item" :displayType="thumb"/>
      </div>
	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { ItemDisplayType } from 'src/utils/Constants.js'
	
	export default {
      data() {
	  		return {
            showBuysOnly: false
         }
      },
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['getUserActions']),
			...mapGetters('item', ['getItems']),
			thumb() { return ItemDisplayType.THUMB },
         currentItems() { 
            const currItemIds = []
            const yesterday = new Date().getTime() - 1000*60*60*24 // 24 hours ago in millis
            for (var action of this.getUserActions(this.userId)) {
               if ((action.createdDate > yesterday) && !currItemIds.includes(action.itemId)) {  
                  currItemIds.push(action.itemId)
               }  
            }
            return this.getItems(currItemIds)
         }, 
         displayItems() { 
            const displayItems = []
            this.currentItems.forEach(item => { 
               if (!this.showBuysOnly || item.buyerId == this.userId) { 
                  // displayItems.push(Object.assign({}, item)) }
                  displayItems.push(item) 
               }
            })
            return displayItems
         }
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
	}

</script>
