<template>
	<q-page class="q-pa-md">
		<div class="text-h5">Current Activity</div>
      <div>  
         <q-checkbox v-model="showDropping" label="Show Dropping"   class="text-grey-10"         color="grey-10" dense/>
         <q-checkbox v-model="showBuys" label="Show Wins/Purchases" class="q-ml-lg text-grey-10" color="grey-10" dense/>
         <q-checkbox v-model="showOutbid"   label="Show Outbid"     class="q-ml-lg text-grey-10" color="grey-10" dense/>
      </div>
      <div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in displayItems" :key="key" :item="item" />
      </div>
	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
	
	export default {
      data() {
	  		return {
            showDropping: true,
            showBuys: true,
            showOutbid: true
         }
      },
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['getUserActions']),
			...mapGetters('item', ['getItems']),
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
            SessionMgr.setCurrentItemsDesc()

            const displayItems = []
            const buyItems = []
            const outbidItems = []
            this.currentItems.forEach(item => { 
               if (this.showDropping && ItemMgr.isDropping(item)) { displayItems.push(item) }
               else if (this.showBuys && ItemMgr.isGone(item) && ItemMgr.isBuyerId(item, this.userId))  { buyItems.push(item) }
               else if (this.showOutbid && ItemMgr.isGone(item) && !ItemMgr.isBuyerId(item, this.userId)) { outbidItems.push(item) }
            })
            
            return SessionMgr.setDisplayItems(displayItems.concat(buyItems).concat(outbidItems))
         }
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
	}

</script>
