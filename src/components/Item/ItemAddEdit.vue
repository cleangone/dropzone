<template>
   <q-card class="form-card">
      <q-card-section class="q-pb-none" :class="red">
         <div class="text-h6 heading" :class="indigo">{{ type }} Item</div>
      </q-card-section>
      <q-card-section :class="pink">
         <div class="row q-mb-sm" :class="orange">
            <div class="col q-mb-sm q-gutter-sm q-pr-sm" :class="blue">
               <q-input v-model="itemToSubmit.name" label="Name" filled />
               <q-select v-model="artist" label="Artist" :options="artistOptions" filled />
               <q-input  v-if="!uploaderDisplayed" v-model.number="itemToSubmit.startPrice" label="Price" type=number prefix="$" filled />
               <q-select v-if="!uploaderDisplayed" label="Status" v-model="itemToSubmit.status" :options="statusOptions" filled/>
               <q-select v-if="!uploaderDisplayed" label="Sale Type" v-model="itemToSubmit.saleType" :options="saleTypeOptions" filled/>
               <q-select v-if="!uploaderDisplayed" label="Drop" v-model="itemToSubmit.dropId" 
                  :options="dropOptions" option-value="id" option-label="name" emit-value map-options filled/>
            </div>
            <div class="col q-mb-sm q-gutter-sm" :class="green">
               <q-input v-model="itemToSubmit.sortName" label="Sort Name" filled />
               <q-select v-model="category" label="Category" :options="categoryOptions" filled />
               <q-img v-if="!uploaderDisplayed" style="height: 200px; width: 200px;" class="q-ml-sm" :class="pink" contain
                  :src="itemToSubmit.primaryImage.url ? itemToSubmit.primaryImage.url : 'statics/image-placeholder.png'" />
               <div v-if="!uploaderDisplayed">
                  <q-checkbox v-model="itemToSubmit.primaryImage.isHorizontal" label="Horizontal"  dense/>
                  <q-btn @click="uploaderDisplayed=true" label="Upload Image" class="float-right" color="primary" />
               </div>
            </div>
         </div>
         <div v-if="uploaderDisplayed" class="col q-gutter-xs q-pr-xs" :class="yellow" >
            <q-firebase-uploader path="drops/" @upload="uploadCompleted" style="width: 100%; min-height: 225px"/> 
            <q-btn @click="uploaderDisplayed=false" class="float-right" icon="clear" color="primary" size="sm" dense/>
         </div>
         <div class="col q-gutter-xs" :class="purple" >
            <div v-if="uploaderDisplayed" style="height: 30px" :class="green" />
            <description-edit :container="itemToSubmit" />
         </div>
	   </q-card-section>

      <q-card-actions align="right">
         <q-btn @click="cancel"      label="Cancel" color="grey"/>
         <q-btn @click="persistItem" label="Save"   color="primary" />
      </q-card-actions>
   </q-card>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import QFirebaseUploader from 'components/QFirebaseUploader.js'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr.js'
   import { TagMgr, TagCategory } from 'src/managers/TagMgr.js'
   import { StorageMgr } from 'src/managers/StorageMgr.js'
   import { SaleType, Colors } from 'src/utils/Constants.js'
   
   const NONE = "(none)"

	export default {
      props: [
         'type', 
         'dropId', // only needed for add 
         'item'],
		data() {
			return {
            itemToSubmit: {
               name: '',
               dropId: '',
               status: ItemStatus.SETUP,
					startPrice: 0,
					buyPrice: 0,
					saleType: SaleType.DEFAULT,
               primaryImage: { isHorizontal: false },
            },
            artist: "",
            category: "",
            uploaderDisplayed: false,
				statusOptions: [ ItemStatus.PRIVATE, ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.DROPPING, ItemStatus.HOLD, ItemStatus.SOLD ],
            saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ],
         }
      },
      computed: {
         ...mapGetters('drop', ['getDrops']),
         ...mapGetters('tag', ['getTags']),
         ...mapGetters('color', Colors),
         isEdit() { return this.type == 'edit' },
         artistMap() { return this.getTagMap(TagCategory.ARTIST) },
         categoryMap() { return this.getTagMap(TagCategory.PRIMARY) },
         artistOptions() { return this.getTagOptions(this.artistMap) },
         categoryOptions() { return this.getTagOptions(this.categoryMap) },
         dropOptions() { return this.getDrops }
      },
		methods: {
         ...mapActions('item', ['setItem']),
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
			persistItem() {
				// console.log("persistItem")
				if (ItemMgr.isSetup(this.itemToSubmit) || ItemMgr.isAvailable(this.itemToSubmit)) {
               this.itemToSubmit.buyPrice = 0 
               this.itemToSubmit.buyDate = 0 
               this.itemToSubmit.bidderIds = []
               this.itemToSubmit.currBid = null,
               this.itemToSubmit.prevBids = null,
               this.itemToSubmit.numberOfBids = 0
               this.itemToSubmit.buyerId = ''
               this.itemToSubmit.buyerName = ''
               this.itemToSubmit.dropDoneDate = 0 
               this.itemToSubmit.userUpdatedDate = this.itemToSubmit.sortedCreateDate  
            }

            if (this.artist) {
               const tag = this.artist == NONE ? { id:"", name: "", category: TagCategory.ARTIST } : this.artistMap.get(this.artist)
               TagMgr.setTag(this.itemToSubmit, tag) 
            }
            
            if (this.category) {
               const tag = this.category == NONE ? { id:"", name: "", category: TagCategory.PRIMARY } : this.categoryMap.get(this.category)
               TagMgr.setTag(this.itemToSubmit, tag) 
            }
            
            // delete prev primaryImage files if they have changed
            if (this.isEdit) {
               const prevFilePath = this.item.primaryImage ? this.item.primaryImage.filePath : null
               const currFilePath = this.itemToSubmit.primaryImage ? this.itemToSubmit.primaryImage.filePath : null
               if (currFilePath != prevFilePath) { StorageMgr.deleteImageFiles(this.item.primaryImage) }
            }
              
            this.setItem(this.itemToSubmit)             
            this.$emit('close')
			},
			uploadCompleted(emit) {
            const itemName = emit.name.includes(".") ? emit.name.substring(0, emit.name.indexOf(".")) : emit.name
         
            if (!this.itemToSubmit.name) { this.itemToSubmit.name = itemName }
            if (!this.itemToSubmit.sortName) { this.itemToSubmit.sortName = itemName }

            const image = this.itemToSubmit.primaryImage
            image.url = emit.url
            image.baseName = emit.name
            image.thumbUrl = ""
            ItemMgr.setFilePaths(image)
            
            this.uploaderDisplayed = false
         },
         cancel(emit) {
            // delete primaryImage files if they are new
            if (this.isEdit) {
               const prevFilePath = this.item.primaryImage ? this.item.primaryImage.filePath : null
               const currFilePath = this.itemToSubmit.primaryImage ? this.itemToSubmit.primaryImage.filePath : null
               if (currFilePath != prevFilePath) { StorageMgr.deleteImageFiles(this.itemToSubmit.primaryImage) }
            }
            else { StorageMgr.deleteImageFiles(this.itemToSubmit.primaryImage) }

            this.$emit('close')
         }
		},
		components: {
         QFirebaseUploader,
         'description-edit' : require('components/Admin/DescriptionEdit.vue').default,
		},
		mounted() {
         // slight delay because param update propagating as modal being popped up
         setTimeout(() => {    
            if (this.isEdit) { 
               this.itemToSubmit = Object.assign({}, this.item) 
               this.itemToSubmit.primaryImage = Object.assign({}, this.item.primaryImage) // item copy not deep

               // copy maps to make vuex happy 
               if (this.itemToSubmit.tagIds) { this.itemToSubmit.tagIds = {...this.item.tagIds} }
               if (this.itemToSubmit.tagNames) { this.itemToSubmit.tagNames = {...this.item.tagNames} }
               this.artist = TagMgr.artist(this.itemToSubmit)
               this.category = TagMgr.primaryName(this.itemToSubmit)
            }
            else { this.itemToSubmit.dropId = this.dropId }
         }, 100)  
		}
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
	}
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
	.form-card .q-img__image { background-size: cover !important; }
	.form-card .q-rating__icon { opacity: 0.2; }
	.form-card .q-rating__icon--active { opacity: 1; }
</style>