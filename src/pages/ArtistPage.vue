<template>
	<q-page class="q-pa-md">
      <div class="row q-mt-sm text-h5">{{ artist.name }}</div>
      <div class="row q-mt-none">
			<q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="text-grey-10" color="grey-10" dense />
		</div>
      <art-category title="Recent" :items="recentItems" :opened="true" />
      <art-category v-for="(category, key) in categories" :key="key" :title="category" :items="categoryToItemsMap.get(category)" />
	</q-page>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { TagMgr } from 'src/managers/TagMgr'
   import { withinMonth } from 'src/utils/DateUtils'
   
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
         items() { return this.getActiveItemsWithTag(this.artist) },
         displayItems() { 
            if (this.showHoldSold) { return this.items }
            
            let availableItems = []
            this.items.forEach(item => { 
               if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { availableItems.push(item) }
		      })
				return availableItems
         },
         recentItems() { 
            let recentItems = []
            this.displayItems.forEach(item => { 
               if (withinMonth(item.createdDate)) { recentItems.push(item) }
		      })
				return recentItems
         },
         categories() {  
            let categories = []
            let hasGeneralCategory = false
            this.displayItems.forEach(item => { 
               let primaryCategory = TagMgr.primary(item)
               if (primaryCategory.length) { 
                  if (!categories.includes(primaryCategory)) { categories.push(primaryCategory) } 
               }
               else { hasGeneralCategory = true }
            })
          
            // todo - not using tag.sortName
            categories.sort((a, b) => (a > b) ? 1 : -1)
            if (hasGeneralCategory) { categories.push("General") } // general is last
            return categories
         },
         categoryToItemsMap() {  
            let map = new Map()
            this.displayItems.forEach(item => { 
               let primaryCategory = TagMgr.primary(item)
               if (!primaryCategory.length) { primaryCategory = "General" }
               if (!map.has(primaryCategory)) { map.set(primaryCategory, []) }
               
               map.get(primaryCategory) .push(item)
            })
            return map
         }
      },
		methods: {
			navBack() { this.$router.go(-1) },
      },
      created() {
			this.tagId = this.$route.params.id
      },
		components: {
	  	   'art-category' : require('components/General/ArtCategory.vue').default,
      },
      watch: {
         $route() {
            // console.log("watch", this.$route.params.id)
            this.tagId = this.$route.params.id
         }
      },
	}

</script>

<style>
</style>