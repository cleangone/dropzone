<template>
	<q-page class="q-pa-md">
      <div class="q-mt-sm">
         <span class="text-h6">{{ artist.name }}</span>
         <q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="float-right" dense />
		</div>
      
		<div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in displayItems" :key="key" :item="item" :displayType="thumb"/>
      </div>
	</q-page>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr.js'
   import { ItemDisplayType } from 'src/utils/Constants.js'
   
	export default {
		data() {
			return {				
            tagId: "",
            showHoldSold: true
        }
		},
	  	computed: {
			...mapGetters('tag', ['getTag']),
         ...mapGetters('item', ['getActiveItemsWithTag']),
         artist() { return this.getTag(this.tagId) },
         thumb() { return ItemDisplayType.THUMB },
         items () { return this.getActiveItemsWithTag(this.artist) },
         displayItems () { 
            if (this.showHoldSold) { return this.items }
            
            let availableItems = []
            this.items.forEach(item => { 
               if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { availableItems.push(item) }
		      })
				return availableItems
         },
         
      },
		methods: {
			navBack() { this.$router.go(-1) },
      },
      created() {
			this.tagId = this.$route.params.id
      },
		components: {
	  	   'item' : require('components/Item/Item.vue').default,
      },
      watch: {
         $route() {
            console.log("watch", this.$route.params.id)
            this.tagId = this.$route.params.id
         }
      },
	}

</script>

<style>
</style>