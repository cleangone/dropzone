<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Drop</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm">
	      <q-input v-model="dropToSubmit.name" label="Name" ref="name" filled class="col"
	      	:rules="[ val => !!val || '* Required',
	          	val => val.length < 21 || 'Please use maximum 20 characters' ]" />
    	</div>
    	<div class="row q-mb-xs q-gutter-md">
    		<q-input label="Start Date" v-model="dropToSubmit.startDate" mask="date" :rules="['date']" class="col" filled>
            <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="dropToSubmit.startDate" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
            </q-icon>
            </template>
        	</q-input>
			<q-input label="Start Time (Pacific)" v-model="dropToSubmit.startTime" mask="time" :rules="['time']" class="col" filled>
            <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="dropToSubmit.startTime" />
                </q-popup-proxy>
            </q-icon>
            </template>
        </q-input>
    	</div>
		<div class="row q-mb-sm q-gutter-md">
			<q-select label="Status" v-model="dropToSubmit.status" :options="statusOptions" class="col" filled/>
			<q-select label="Default Sale Type" v-model="dropToSubmit.defaultSaleType" :options="saleTypeOptions" class="col" filled/>
		</div>
		<div class="row q-mb-sm q-gutter-md">
			<q-input v-model.number="dropToSubmit.previewDuration" label="Preview Duration (secs)" type="number" filled class="col"/>
			<q-input v-model.number="dropToSubmit.bidAdditionalTime" label="Bid Timer (secs)" type="number" filled class="col"/>
		
		</div>	
		<div class="row q-mb-sm items-center">
	      <div class="col">
				<!-- <q-input v-model="dropToSubmit.imageUrl" label="Image URL" filled/> -->
				<q-btn v-if="!uploaderDisplayed" @click="uploaderDisplayed=true" label="Upload Image" color="primary" />
				<q-firebase-uploader v-else path="drops/" @upload="uploadCompleted"/> 
	      </div>
	      <q-img :src="dropToSubmit.imageUrl ? dropToSubmit.imageUrl : 'statics/image-placeholder.png'"
          	class="q-ml-sm" contain />
    	</div>
	</q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapActions } from 'vuex'
	import QFirebaseUploader from '../QFirebaseUploader.js'
	import { SaleType, DropStatus } from '../../constants/Constants.js'
	
	export default {
		props: ['type', 'id', 'drop'],
		data() {
			return {
				dropToSubmit: {
					name: '',
					startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
					startTime: '09:00',
					status: '',
					previewDuration: 15,
					bidAdditionalTime: 60,
					defaultSaleType: '',
					imageUrl: ''
				},
				uploaderDisplayed: false,
				statusOptions: [ DropStatus.PREDROP, DropStatus.LIVE, DropStatus.POSTDROP ],
				saleTypeOptions: [ SaleType.BID, SaleType.BUY ]
			}
		},
		computed: {
			...mapState('auth', ['userId'])
    	},
		methods: {
			...mapActions('drop', ['createDrop', 'updateDrop']),
			submitForm() {
				console.log("submitForm")
				this.$refs.name.validate()

				if (!this.$refs.name.hasError) {
					this.$emit('close')
					this.submitDrop()
				}
			},
			submitDrop() {
				if (this.type == 'add') {
					console.log("submitDrop", this.dropToSubmit)
					this.createDrop(this.dropToSubmit)
				}
				else { 
					this.dropToSubmit.startDateTime = Date.now()
					this.updateDrop({id: this.id, value: this.dropToSubmit }) }
			},
			uploadCompleted(emit) {
				console.log("uploadCompleted", emit)
				this.dropToSubmit.imageUrl = emit.url
				this.uploaderDisplayed = false
			}
		},
		components: {
    		QFirebaseUploader
  		},
		mounted() {
			if (this.type == 'edit') {
				setTimeout(() => { this.dropToSubmit = Object.assign({}, this.drop) }, 100)  // param update propagating as modal being popped up
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