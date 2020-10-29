<template>
	<q-page class="q-pa-md">
      <div class="q-mt-sm text-h5" :class="orange">
         {{ category.name }}
         <q-btn v-if="category.video" icon="videocam" @click="showVideo=true" @click.stop size="md" flat dense color="primary" />
      </div>
      <div class="row" :class="red">
         <div v-if="thumbExists" class="q-mr-xs" :class="blue">
            <q-img :src="category.primaryImage.thumbUrl" style="width: 150px" class="image-centered" basic contain />
         </div>
         <div v-if="category.description" v-html="category.description" class="col q-mt-none" :class="green"  />
      </div>
      <div class="row q-mt-sm" :class="yellow">
         <q-checkbox v-model="showHoldSold" label="Show Hold/Sold" @input="showHoldSoldChecked()" class="text-grey-10" color="grey-10" dense />
      </div> 
      <tag-items v-if="recentItems.length" title="Recent" :tagId="recentItemsTagId" :items="recentItems" :expanded="recentItemsExpanded" />
      <tag-items v-for="(tag, key) in tags" :key="key" :title="tag.name" 
         :tagId="tag.id" :items="tagIdToItemsMap.get(tag.id)" :expanded="tagExpanded(tag.id)" />
      
      <q-dialog v-model="showVideo">	
			<show-video :container="category" @close="showVideo=false" />
		</q-dialog>
	</q-page>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { TagMgr } from 'src/managers/TagMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { Colors } from 'src/utils/Constants'
   import { withinMonth } from 'src/utils/DateUtils'
   
   // items grouped by their tags on the page, with Recent added to the Top, and General to the bottom
   const RECENT_ITEMS_TAG_ID = "0"
   const GENERAL_TAG_ID = "-1"
   const SESSION_SHOW_HOLD_SOLD = "ShowHoldSold"
   
   export default {
		data() {
			return {				
            categoryId: "",
            initialExpandedTagId: RECENT_ITEMS_TAG_ID, 
            showVideo: false,
            showHoldSold: true
        }
		},
	  	computed: {
			...mapGetters('category', ['getCategory']),
         ...mapGetters('item', ['getActiveItemsWithCategory']),
         ...mapGetters('color', Colors),
         category() { return this.getCategory(this.categoryId) },
         thumbExists() { return (this.category && this.category.primaryImage && this.category.primaryImage.thumbUrl) },
         items() { return this.getActiveItemsWithCategory(this.categoryId) },
         displayItems() { 
            SessionMgr.setCategoryItemsDesc(this.category.name, this.categoryId)             
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

            SessionMgr.setTagDisplayItems(RECENT_ITEMS_TAG_ID, recentItems)
				return recentItems
         },
         recentItemsTagId() { return RECENT_ITEMS_TAG_ID },
         tags() {  // return [{ id, name }]
            let tags = []
            let tagIds = []
            let hasGeneralTag = false
            this.displayItems.forEach(item => { 
               let primaryId = TagMgr.primaryId(item)
               if (primaryId.length) { 
                  if (!tagIds.includes(primaryId)) { 
                     tagIds.push(primaryId)
                     tags.push({ id: primaryId, name: TagMgr.primaryName(item) }) 
                  } 
               }
               else { hasGeneralTag = true }
            })
          
            // todo - not using tag.sortName
            tags.sort((a, b) => (a.name < b.name) ? -1 : 1)
            if (hasGeneralTag) { tags.push( { id: GENERAL_TAG_ID, name: "General" }) } // general is last
            return tags
         },
         tagIdToItemsMap() { 
            let map = new Map()
            this.displayItems.forEach(item => { 
               let primaryId = TagMgr.primaryId(item)
               if (!primaryId.length) { primaryId = GENERAL_TAG_ID }
               if (!map.has(primaryId)) { map.set(primaryId, []) }
               
               map.get(primaryId).push(item)
            })
            
            map.forEach((items, tagId) => { // (value, key) iterator
               SessionMgr.setTagDisplayItems(tagId, items)
            }) 

            return map
         },
         recentItemsExpanded() { return this.initialExpandedTagId == RECENT_ITEMS_TAG_ID },
      },
		methods: {
         tagExpanded(tagId) { return tagId == this.initialExpandedTagId },
         showHoldSoldChecked() { SessionMgr.set(SESSION_SHOW_HOLD_SOLD, this.showHoldSold) }
		},
      created() {
         this.categoryId = this.$route.params.id         
         if (this.$route.params.tagId) { this.initialExpandedTagId = this.$route.params.tagId }

         const sessionShowHoldSold = SessionMgr.get(SESSION_SHOW_HOLD_SOLD)
         if (sessionShowHoldSold != null) { this.showHoldSold = sessionShowHoldSold }
      },
		components: {
	  	   'tag-items' : require('components/Tag/TagItems.vue').default,
      	'show-video' : require('components/General/ShowVideo.vue').default
      },
      watch: {
         $route() {
            // console.log("watch", this.$route.params.id)
            this.categoryId = this.$route.params.id
            this.initialExpandedTagId = RECENT_ITEMS_TAG_ID
         }
      },
	}

</script>

<style>
</style>