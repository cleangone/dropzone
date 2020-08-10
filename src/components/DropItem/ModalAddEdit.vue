<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Drop Item</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm">
	      <q-input v-model="dropItemToSubmit.name" label="Name" ref="name"
	      	:rules="[ val => !!val || '* Required',
	          	val => val.length < 51 || 'Please use maximum 50 characters',
	        	]"
	      	filled class="col" />
    	</div>

		<div class="row q-mb-sm">
			<!-- install in quasar folder: > quasar ext add qdecimal -->
			<q-decimal v-model="dropItemToSubmit.price" mode="currency" currency="USD" 
				label="Price" input-style="text-align: right" :prefix="true" filled class="col" ></q-decimal>
		</div>

    	<div class="row q-mb-md items-center">
	      <div class="col">
				<q-btn v-if="!uploaderDisplayed" @click="uploaderDisplayed=true" label="Upload Image" color="primary" />
				<q-firebase-uploader v-else path="drops/" @upload="uploadCompleted"/> 
	      </div>
	      <q-img :src="dropItemToSubmit.imageUrl ? dropItemToSubmit.imageUrl : 'statics/image-placeholder.png'"
          	class="q-ml-sm" contain />
    	</div>
		<div class="row q-mb-sm">
				<q-checkbox v-model="dropItemToSubmit.isHorizontal" label="Horizontal Image" dense/>
		</div>
		<div class="row q-mb-xs q-gutter-md">
			<q-select label="Status" v-model="dropItemToSubmit.status" :options="statusOptions" class="col" filled/>
			<q-select label="Sale Type" v-model="dropItemToSubmit.saleType" :options="saleTypeOptions" class="col" filled/>
		</div>
	</q-card-section>

   <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { SaleType, DropItemStatus } from '../../constants/Constants.js';
	import { mapState, mapActions } from 'vuex'
	import QFirebaseUploader from '../QFirebaseUploader.js'
	
	export default {
		props: ['type', 'dropId', 'dropItemId', 'dropItem'],
		data() {
			return {
				dropItemToSubmit: {
					name: '',
					price: 0,
					currPrice: 0,
					imageUrl: '',
					isHorizontal: false,
					status: DropItemStatus.AVAILABLE,
					saleType: 'Default'
				},
				uploaderDisplayed: false,
				statusOptions: [ DropItemStatus.PREVIEW, DropItemStatus.AVAILABLE, DropItemStatus.DROPPING, DropItemStatus.HOLD, DropItemStatus.SOLD ],
				saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ]
			}
		},
		computed: {
			...mapState('auth', ['userId']),
    	},
		methods: {
			...mapActions('drop', ['createDropItem', 'updateDropItem']),
			submitForm() {
				// console.log("submitForm")
				this.$refs.name.validate()

				if (!this.$refs.name.hasError) {
					this.$emit('close')
					this.submitDropItem()
				}
			},
			submitDropItem() {
				// console.log("submitDropItem", this.dropItemToSubmit)
				if (this.type == 'add') { this.createDropItem({dropId: this.dropId, dropItem: this.dropItemToSubmit}) }
				else { 
					if (this.dropItemToSubmit.status == DropItemStatus.AVAILABLE) { 
						this.dropItemToSubmit.buyerId = null
						this.dropItemToSubmit.currBidderId = null 
						this.dropItemToSubmit.currPrice = 0 
						this.dropItemToSubmit.bids = {}
					}
					this.updateDropItem({dropId: this.dropId, dropItemId: this.dropItemId, dropItem: this.dropItemToSubmit}) 
				}
			},
			uploadCompleted(emit) {
				console.log("uploadCompleted", emit)
				this.dropItemToSubmit.imageUrl = emit.url
				this.uploaderDisplayed = false
			}
		},
		components: {
    		QFirebaseUploader
		},
		mounted() {
			if (this.type == 'edit') {
				// param update propagating as modal being popped up
				// todo - could be fixed by reading from the store
				setTimeout(() => { this.dropItemToSubmit = Object.assign({}, this.dropItem) }, 100)  
			}
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