<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Item</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-xs">
	      <q-input v-model="itemToSubmit.name" label="Name" ref="name"
	      	:rules="[ val => !!val || '* Required',
	          	val => val.length < 51 || 'Please use maximum 50 characters',
	        	]"
	      	filled class="col" />
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
				<q-checkbox v-model="itemToSubmit.isHorizontal" label="Horizontal Image" dense/>
	   	   <q-select label="Status" v-model="itemToSubmit.status" :options="statusOptions" filled/>
			   <q-select label="Sale Type" v-model="itemToSubmit.saleType" :options="saleTypeOptions" filled/>
		   </div>
         <div v-if="!uploaderDisplayed" class="col" style="height: 200px" :class="blue">
	         <q-img  style="height: 200px; width: 200px" :src="itemToSubmit.imageUrl ? itemToSubmit.imageUrl : 'statics/image-placeholder.png'" class="q-ml-lg" contain />
         </div>
    	</div>
	</q-card-section>

   <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import QFirebaseUploader from 'components/QFirebaseUploader.js'
   import { SaleType, ItemStatus, Colors } from 'src/utils/Constants.js'
   import { Tag } from 'src/models/Tag.js'
   
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
               status: ItemStatus.AVAILABLE,
					startPrice: 0,
					buyPrice: 0,
					imageUrl: '',
					isHorizontal: false,
               saleType: 'Default',
               bidderIds: []
            },
            artist: "",
				uploaderDisplayed: false,
				statusOptions: [ ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.DROPPING, ItemStatus.HOLD, ItemStatus.SOLD ],
				saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ]
			}
      },
      computed: {
         ...mapGetters('color', Colors),
         artistOptions() {
            return ["", "Nick Klein", "Cliff Chaing", "Geoff Shaw"]
         }
      },
		methods: {
			...mapActions('item', ['createItem', 'setItem']),
			submitForm() {
				// console.log("submitForm")
				this.$refs.name.validate()

				if (!this.$refs.name.hasError) {
               if (this.itemToSubmit.status == ItemStatus.AVAILABLE) { 
                  this.itemToSubmit.buyPrice = 0 
                  this.itemToSubmit.bidderIds = []
                  this.itemToSubmit.currBidderId = ''
                  this.itemToSubmit.currBidAmount = 0
                  this.itemToSubmit.currActionId = ''
                  this.itemToSubmit.numberOfBids = 0
                  this.itemToSubmit.buyerId = ''
                  this.itemToSubmit.buyerName = ''
                  this.itemToSubmit.dropDoneDate = 0 
						this.itemToSubmit.lastUserActivityDate = 0 
               }

               Tag.setArtist(this.itemToSubmit, this.artist)
               this.persistItem()
               this.$emit('close')
				}
			},
			persistItem() {
				// console.log("persistItem", this.dropItemToSubmit)
				if (this.type == 'add') { this.createItem(this.itemToSubmit) }
				else { this.setItem(this.itemToSubmit) }
			},
			uploadCompleted(emit) {
				console.log("uploadCompleted", emit)
            this.itemToSubmit.imageUrl = emit.url
            this.uploaderDisplayed = false
			}
		},
		components: {
    		QFirebaseUploader
		},
		mounted() {
         // slight delay because param update propagating as modal being popped up
         setTimeout(() => {    
            if (this.type == 'edit') { 
               this.itemToSubmit = Object.assign({}, this.item) 
               if (this.itemToSubmit.tags) { this.itemToSubmit.tags = {...this.item.tags} }
               this.artist = Tag.artist(this.itemToSubmit)
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