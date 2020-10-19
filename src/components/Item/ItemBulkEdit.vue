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
         <q-checkbox label="Name: Trim leading 0 from numbers" v-model="trimLeadingZero" dense/>
		</div>
      <div class="q-mb-sm">
         <q-select label="Status" v-model="status" :options="statusOptions" filled/>
      </div>
      <div class="q-mb-sm">
         <q-select v-model="artist" label="Artist" :options="artistOptions" filled class="col"/>
      </div>  
      <div class="q-mb-sm">
         <q-select v-model="primaryCategory" label="Category" :options="primaryCategoryOptions" filled class="col"/>
      </div>  
      <div class="q-mb-sm">
         <q-select label="Sale Type" v-model="saleType" :options="saleTypeOptions" filled/>
      </div>
      <div class="q-mb-sm">
         <q-checkbox label="Delete Items" v-model="deleteItems" dense/>
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
	import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr.js';
   import { TagMgr, TagCategory } from 'src/managers/TagMgr.js'
   import { SaleType } from 'src/utils/Constants.js';
   
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
            primaryCategory: "",
            saleType: "",
            deleteItems: false,
				statusOptions: [ ItemStatus.PRIVATE, ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.HOLD, ItemStatus.SOLD ],
				saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ]
			}
      },
      computed: {
         ...mapGetters('tag', ['getTags']),
         artistMap() { return this.getTagMap(TagCategory.ARTIST) },
         primaryCategoryMap() { return this.getTagMap(TagCategory.PRIMARY) },
         artistOptions() { return this.getTagOptions(this.artistMap) },
         primaryCategoryOptions() { return this.getTagOptions(this.primaryCategoryMap) }
      },
      methods: {
         ...mapActions('item', ['updateItems', 'deleteItem']),
         getTagMap(category) { 
            let map = new Map()
            for (var tag of this.getTags(category)) {
               map.set(tag.name, tag)
            }
            return map
         },
         getTagOptions(map) { 
            let options = [NONE]
            for (var name of map.keys() ) {
               options.push(name)
            }
            return options
         },
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

               if (this.trimLeadingZero) { 
                  // " 0[0-9]" matches " 0n"
                  const name = update.name ? update.name : item.name
                  const regex = / 0([0-9])/g
                  const replace = " \$1" 
                  update.name = name.replace(regex, replace)
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
                     update.lastUserActivityDate = 0 
                  }
               }

               if (this.saleType.length) { update.saleType = this.saleType }

               if (this.artist.length || this.primaryCategory.length) { 
                  update.tagIds = Object.assign({}, item.tagIds) 
                  update.tagNames = Object.assign({}, item.tagNames) 
                  if (this.artist.length) { 
                     const tag = this.artist == NONE ? { id:"", name: "", category: TagCategory.ARTIST } : this.artistMap.get(this.artist)
                     TagMgr.setTag(update, tag) 
                  }
                  if (this.primaryCategory.length) { 
                     const tag = this.primaryCategory == NONE ? { id:"", name: "", category: TagCategory.PRIMARY } : this.primaryCategoryMap.get(this.primaryCategory)
                     TagMgr.setTag(update, tag) 
                  }
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