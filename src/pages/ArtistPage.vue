<template>
	<q-page class="q-pa-md">
      <div class="row q-mt-sm text-h5">{{ artist.name }}</div>
      <div class="row q-mt-none">
			<q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="text-grey-10" color="grey-10" dense />
		</div>
      <art-category title="Recent" :categoryId="recentItemsCategoryId" :items="recentItems" :expanded="recentItemsExpanded" />
      <art-category v-for="(category, key) in categories" :key="key" :title="category.name" 
         :categoryId="category.id" :items="categoryIdToItemsMap.get(category.id)" :expanded="categoryExpanded(category.id)" />
	</q-page>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { TagMgr } from 'src/managers/TagMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { withinMonth } from 'src/utils/DateUtils'
   
   const RECENT_ITEMS_CATEGORY_ID = "0"
   const GENERAL_CATEGORY_ID = "-1"

   export default {
		data() {
			return {				
            artistTagId: "",
            initialCategoryId: RECENT_ITEMS_CATEGORY_ID,
            showHoldSold: true
        }
		},
	  	computed: {
			...mapGetters('tag', ['getTag']),
         ...mapGetters('item', ['getActiveItemsWithTag']),
         artist() { return this.getTag(this.artistTagId) },
         items() { return this.getActiveItemsWithTag(this.artist) },
         displayItems() { 
            SessionMgr.setArtistItemsDesc(this.artist.name, this.artistTagId)             
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
         recentItemsCategoryId() { return RECENT_ITEMS_CATEGORY_ID },
         categories() {  // return [{ id, name }]
            let categories = []
            let categoryIds = []
            let hasGeneralCategory = false
            this.displayItems.forEach(item => { 
               let primaryId = TagMgr.primaryId(item)
               if (primaryId.length) { 
                  if (!categoryIds.includes(primaryId)) { 
                     categoryIds.push(primaryId)
                     categories.push({ id: primaryId, name: TagMgr.primaryName(item) }) 
                  } 
               }
               else { hasGeneralCategory = true }
            })
          
            // todo - not using tag.sortName
            categories.sort((a, b) => (a.name < b.name) ? -1 : 1)
            if (hasGeneralCategory) { categories.push( { id: GENERAL_CATEGORY_ID, name: "General" }) } // general is last
            return categories
         },
         categoryIdToItemsMap() { 
            let map = new Map()
            this.displayItems.forEach(item => { 
               let primaryId = TagMgr.primaryId(item)
               if (!primaryId.length) { primaryId = GENERAL_CATEGORY_ID }
               if (!map.has(primaryId)) { map.set(primaryId, []) }
               
               map.get(primaryId).push(item)
            })
            return map
         },
         recentItemsExpanded() { return this.initialCategoryId == RECENT_ITEMS_CATEGORY_ID },
      },
		methods: {
         categoryExpanded(categoryId) { return categoryId == this.initialCategoryId },
		},
      created() {
         this.artistTagId = this.$route.params.id         
         if (this.$route.params.catId) { this.initialCategoryId = this.$route.params.catId }
      },
		components: {
	  	   'art-category' : require('components/General/ArtCategory.vue').default,
      },
      watch: {
         $route() {
            // console.log("watch", this.$route.params.id)
            this.artistTagId = this.$route.params.id
            this.initialCategoryId = RECENT_ITEMS_CATEGORY_ID
         }
      },
	}

</script>

<style>
</style>