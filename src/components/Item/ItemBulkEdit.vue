<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">Item Bulk Edit</div>
    </q-card-section>
    <q-card-section>
       <div class="q-mb-sm">
         <q-input v-model="nameFind"    label="Name: Find Text" filled class="col" />
         <q-input v-model="nameReplace" label="Name: Replace Text With" filled class="col" />
      </div>
      <div class="q-mb-sm">
         <q-select v-model="status" label="Status" :options="statusOptions" filled/>
      </div>
      <div class="q-mb-sm">
         <q-select v-model="artist" label="Artist" :options="artistOptions" option-value="id" option-label="name" filled />
      </div>  
      <div class="q-mb-sm">
         <q-select v-model="primaryTagName" label="Category" :options="tagOptions" filled class="col"/>
      </div>  
      <div class="q-mb-sm">
         <q-select v-model="saleType" label="Sale Type" :options="saleTypeOptions" filled/>
      </div>
      <div class="q-mb-sm">
         <q-checkbox v-model="deleteItems" label="Delete Items" dense/>
		</div>
	</q-card-section>
   <q-card-actions align="right">
      <q-btn @click="cancel" label="Cancel" color="grey" />
      <q-btn @click="save"   label="Save"   color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { CategoryMgr, CATEGORY_NONE } from 'src/managers/CategoryMgr'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr'
   import { TagMgr, TagCategory } from 'src/managers/TagMgr'
   import { SaleType, UI } from 'src/utils/Constants'
   
   const NONE = "(none)"

	export default {
      props: ['items'],
		data() {
			return {
            nameFind: "",
            nameReplace: "",
            trimLeadingZero: false,
            status: "",
            artist: "",
            primaryTagName: "",
            saleType: "",
            deleteItems: false,
				statusOptions: [ ItemStatus.PRIVATE, ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.HOLD, ItemStatus.SOLD ],
				saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ]
			}
      },
      computed: {
         ...mapGetters('category', ['getPublicCategories']),
         ...mapGetters('tag', ['getTags']),
         // artistMap() { return this.getTagMap(TagCategory.ARTIST) },
         artistOptions() { return CategoryMgr.categoryOptions(this.getPublicCategories) },
         tagMap() { return TagMgr.getNameToTagMap(this.getTags(TagCategory.PRIMARY)) },
         tagOptions() { return TagMgr.getNames(this.tagMap.values()).concat([UI.NONE]) }, 
      },
      methods: {
         ...mapActions('item', ['updateItems', 'deleteItem']),
			save() {
            if (this.deleteItems) { 
               this.promptToDelete() 
               return
            }

            const itemUpdates = []
            this.items.forEach(item => {
               let update = { }
               if (this.nameFind.length && this.nameReplace.length && item.name.includes(this.nameFind)) { 
                  console.log("replace '" + this.nameFind + "' with '" + this.nameReplace + "'")
                  update.name = item.name.replace(this.nameFind, this.nameReplace)
               }

               if (this.status.length) { 
                  update.status = this.status 
                  if (ItemMgr.isSetup(update) || ItemMgr.isAvailable(update)) {
                     update.buyPrice = 0 
                     update.buyDate = 0 
                     update.bidderIds = []
                     update.numberOfBids = 0
                     update.currBid = null,
                     update.prevBids = null,
                     update.buyerId = ''
                     update.buyerName = ''
                     update.dropDoneDate = 0 
                     
                     // old items do not have sortedCreateDate
                     update.userUpdatedDate = item.sortedCreateDate ? 
                        item.sortedCreateDate : item.createdDate 
                  }
                  if (ItemMgr.isAvailable(update)) { update.availableDate = new Date().getTime() }
               }

               if (this.saleType.length) { update.saleType = this.saleType }
               if (this.artist) { update.category = CategoryMgr.isNone(this.artist) ? null : this.artist }

               if (this.primaryTagName.length) { 
                  update.tagIds = Object.assign({}, item.tagIds) 
                  update.tagNames = Object.assign({}, item.tagNames) 
      
                  const tag = this.primaryTagName == NONE ? { id:"", name: "", category: TagCategory.PRIMARY } : this.tagMap.get(this.primaryTagName)
                  TagMgr.setTag(update, tag)          
               }

               if (Object.keys(update).length) { 
                  update.id = item.id 
                  itemUpdates.push(update)
               }
            })

            if (itemUpdates.length) { this.updateItems(itemUpdates) }
            this.$emit('close')
         },
         promptToDelete() {
            this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.items.length + ' Items?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
               this.items.forEach(item => { this.deleteItem(item.id) })
               this.$emit('close')
				})
         },
         cancel() { this.$emit('close') }
		},
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>