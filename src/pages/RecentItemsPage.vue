<template>
	<q-page class="q-pa-md">
		<div class="q-mt-sm text-h5">Recent Updates</div>
      <q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="text-grey-10" color="grey-10" dense />
      <div v-if="recentItemsExist">
         <div class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in displayItems" :key="key" :item="item" />
			</div>
		</div>
		<div v-else>Loading</div>
	</q-page>
</template>

<script>
   import { mapGetters  } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   
	export default {
		data() {
			return {				
				showHoldSold: true,
        }
		},
	  	computed: {
			...mapGetters('item', ['recentItemsExist', 'getRecentItems']),
			displayItems() { 
            console.log("displayItems", this.getRecentItems)
            SessionMgr.setRecentItemsDesc() 
            if (this.showHoldSold) { return SessionMgr.setDisplayItems(this.getRecentItems) }

            const displayItems = []
            this.getRecentItems.forEach(item => { 
               if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { displayItems.push(item) }
            })
            return SessionMgr.setDisplayItems(displayItems)
			},
      },
		methods: {
		},
      created() {
		},
		components: {
	  	   'item' : require('components/Item/Item.vue').default,
	  	}
	}

</script>

<style>
	.q-img { max-height: 400px; max-width: 500px; }
</style>