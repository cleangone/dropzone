<template>
   <q-card class="form-card">
      <q-card-section>
         <div class="text-h6 heading">{{ type }} Item</div>
      </q-card-section>

      <q-card-section>
         <div class="row q-mb-xs q-gutter-sm">
            <q-input v-model="itemToSubmit.name" label="Name" ref="name" filled class="col"
               :rules="[ val => !!val || '* Required',
                  val => val.length < 51 || 'Please use maximum 50 characters']"/>
            <q-input v-model="itemToSubmit.sortName" label="Sort Name" ref="sort" filled class="col"
               :rules="[ val => val.length < 51 || 'Please use maximum 50 characters']" />
         </div>
         <div class="row q-mb-sm q-gutter-sm">
            <!-- install in quasar folder: > quasar ext add qdecimal -->
            <!-- <q-decimal v-model="itemToSubmit.startPrice" mode="currency" currency="USD" 
               label="Start Price" input-style="text-align: right" :prefix="true" filled class="col" ></q-decimal> -->
            <q-select v-model="artist" label="Artist" :options="artistOptions" filled class="col"/>
            <q-input v-model.number="itemToSubmit.startPrice" label="Price" type=number prefix="$" filled class="col" />
         </div>
         <div class="row q-mb-md items-center">
            <div v-if="uploaderDisplayed" class="col q-gutter-xs" :class="pink">
               <q-firebase-uploader path="drops/" @upload="uploadCompleted" style="width: 400px"/> 
               <q-btn @click="uploaderDisplayed=false" icon="clear" color="primary" size="sm" dense/>
            </div>
            <div v-else class="col q-gutter-sm" :class="yellow">
               <q-btn @click="uploaderDisplayed=true" label="Upload Image" color="primary" />
               <q-checkbox v-model="itemToSubmit.primaryImage.isHorizontal" label="Horizontal Image" dense/>
               <q-select label="Status" v-model="itemToSubmit.status" :options="statusOptions" filled/>
               <q-select label="Sale Type" v-model="itemToSubmit.saleType" :options="saleTypeOptions" filled/>
            </div>
            <div v-if="!uploaderDisplayed" class="col" style="height: 200px" :class="blue">
               <q-img style="height: 200px; width: 200px" :src="itemToSubmit.primaryImage.url ? itemToSubmit.primaryImage.url : 'statics/image-placeholder.png'" class="q-ml-lg" contain />
            </div>
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
            uploaderDisplayed: false,
				statusOptions: [ ItemStatus.PRIVATE, ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.DROPPING, ItemStatus.HOLD, ItemStatus.SOLD ],
            saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ],
         }
      },
      computed: {
         ...mapGetters('tag', ['getTags']),
         ...mapGetters('color', Colors),
         isEdit() { return this.type == 'edit' },
         artistMap() { 
            let map = new Map()
            for (var tag of this.getTags(TagCategory.ARTIST) ) {
               map.set(tag.name, tag)
            }
            return map
         },
         artistOptions() {
            let options = [NONE]
            for (var name of this.artistMap.keys() ) {
               options.push(name)
            }
            return options
         }
      },
		methods: {
			...mapActions('item', ['setItem']),
			persistItem() {
				// console.log("persistItem")
				this.$refs.name.validate()
            if (this.$refs.name.hasError) { return }
            
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
               this.itemToSubmit.lastUserActivityDate = 0 
            }

            if (this.artist) {
               const tag = this.artist == NONE ? { id:"", name: "", category: TagCategory.ARTIST } : this.artistMap.get(this.artist)
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
    		QFirebaseUploader
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