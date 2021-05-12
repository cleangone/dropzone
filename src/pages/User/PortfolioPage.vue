<template>
	<q-page class="q-pa-md">
		<div class="text-h5">Portfolio</div>
      <div>Clunky - needs sale date/info, sort by date, maybe artist select, maybe grouping</div>
      <div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in userItems" :key="key" :item="item" />
      </div>
	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
	
	export default {
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['getUserActions']),
			...mapGetters('item', ['getItems']),
			userItems() { 
            const userItemIds = []
            for (var action of this.getUserActions(this.userId)) {
               if (!userItemIds.includes(action.itemId)) { userItemIds.push(action.itemId) } 
            }

            SessionMgr.setPortfolioDesc()
            let displayItems = []
            this.getItems(userItemIds).forEach(item => { 
               if (ItemMgr.isGone(item) && ItemMgr.isBuyerId(item, this.userId))  { displayItems.push(item) }
            })

            return SessionMgr.setDisplayItems(displayItems.sort((a,b) => a.sortName.localeCompare(b.sortName)))
         }, 
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
	}

</script>
