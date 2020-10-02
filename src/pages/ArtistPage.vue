<template>
	<q-page class="q-pa-md">
      <div class="row q-mt-sm text-h5">{{ artist.name }}</div>
      <div class="row q-mt-none">
			<q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="text-grey-10" color="grey-10" dense />
		</div>
		<div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in displayItems" :key="key" :item="item" :displayType="displayTypeThumb"/>
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
         displayTypeThumb() { return ItemDisplayType.THUMB },
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