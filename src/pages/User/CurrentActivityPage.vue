<template>
	<q-page class="q-pa-md">
		<div class="text-h5">Current Activity</div>
      <div>  
         <q-checkbox v-model="showDropping"  label="Show Dropping"       class="text-grey-10"         color="grey-10" dense/>
         <q-checkbox v-model="showRequested" label="Show Requested"      class="q-ml-lg text-grey-10" color="grey-10" dense/>
         <q-checkbox v-model="showBuys"      label="Show Wins/Purchases" class="q-ml-lg text-grey-10" color="grey-10" dense/>
         <q-checkbox v-model="showOutbid"    label="Show Outbid"         class="q-ml-lg text-grey-10" color="grey-10" dense/>
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
            showRequested: true,
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
            const recent = new Date().getTime() - 1000*60*60*24*3 // 3 days ago in millis
            for (var action of this.getUserActions(this.userId)) {
               if ((action.createdDate > recent) && !currItemIds.includes(action.itemId)) {  
                  currItemIds.push(action.itemId)
               }  
            }
            
            return this.getItems(currItemIds)
         }, 
         displayItems() { 
            SessionMgr.setCurrentItemsDesc()

            const displayItems = []
            const requestItems = []
            const buyItems = []
            const outbidItems = []
            this.currentItems.forEach(item => { 
               if (this.showDropping && ItemMgr.isDropping(item)) { displayItems.push(item) }
               else if (this.showRequested && !ItemMgr.isGone(item))  { requestItems.push(item) }
               else if (this.showBuys && ItemMgr.isGone(item) && ItemMgr.isBuyerId(item, this.userId))  { buyItems.push(item) }
               else if (this.showOutbid && ItemMgr.isGone(item) && !ItemMgr.isBuyerId(item, this.userId)) { outbidItems.push(item) }
            })
            
            let allItems = displayItems.concat(requestItems).concat(buyItems).concat(outbidItems)
            return SessionMgr.setDisplayItems(allItems.sort((a,b) => a.sortName.localeCompare(b.sortName)))
         }
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
	}

</script>
