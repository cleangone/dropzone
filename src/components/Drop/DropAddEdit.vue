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
    		<q-input label="Start Date" v-model="startDate" mask="date" :rules="['date']" class="col" filled>
            <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="startDate" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
            </q-icon>
            </template>
        	</q-input>
			<q-input :label="'Start Time ' + timezone" v-model="startTime" mask="time" :rules="['time']" class="col" filled>
            <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" />
                </q-popup-proxy>
            </q-icon>
            </template>
        </q-input>
    	</div>
		<div class="row q-mb-sm q-gutter-md">
		   <q-select label="Status" v-model="dropToSubmit.status" :options="statusOptions" class="col" filled/>
			<q-select label="Default Sale Type" v-model="dropToSubmit.defaultSaleType" :options="saleTypeOptions" class="col" filled/>  
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
	import QFirebaseUploader from 'components/QFirebaseUploader.js'
   import { SaleType } from 'src/utils/Constants.js'
   import { DropMgr, DropStatus } from 'src/managers/DropMgr.js';
   import { localTimezone } from 'src/utils/DateUtils';

	export default {
		props: ['type', 'drop'],
		data() {
			return {
				dropToSubmit: {
					name: '',
					startDate: null,
					status: DropStatus.SETUP,
					bidAdditionalTime: 60,
					defaultSaleType: '',
					imageUrl: ''
            },
            startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
            startTime: '09:00',
            timezone: localTimezone(),
            uploaderDisplayed: false,
            statusOptions: [ DropStatus.SETUP, DropStatus.SCHEDULE, DropStatus.START_COUNTDOWN, DropStatus.LIVE, DropStatus.DROPPED ],
            saleTypeOptions: [ SaleType.BID, SaleType.BUY ]
			}
		},
		computed: {
         isEdit() { return this.type == 'edit' },
    	},
		methods: {
			...mapActions('drop', ['createDrop', 'setDrop']),
			submitForm() {
				console.log("submitForm")
				this.$refs.name.validate()

				if (!this.$refs.name.hasError) {
               this.submitDrop()
               this.$emit('close')
				}
			},
			submitDrop() {
            let timezoneOffset = date.formatDate(new Date(), 'Z')
            var isoDate = this.startDate.replace("/", "-").replace("/", "-")
            let formattedStartDate = isoDate + "T" + this.startTime + ":00.000" + timezoneOffset 
            this.dropToSubmit.startDate = new Date(formattedStartDate)
            
				if (this.type == 'add') { this.createDrop(this.dropToSubmit) }
				else { 
               // todo - also have to figure out if drop was scheduled and date has changed
               // does updating a scheduled drop auto reschedule it?
               if (DropMgr.isSetup(this.dropToSubmit) || DropMgr.isStartCountdown(this.dropToSubmit) || DropMgr.isLive(this.dropToSubmit)) {
                  // stop any existing queued task from starting countdown
                  this.dropToSubmit.cloudTaskId = "0" 
               }
               this.setDrop(this.dropToSubmit) }
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
			if (this.isEdit) {
				setTimeout(() => { 
               this.dropToSubmit = Object.assign({}, this.drop) 
               let datetime = new Date(this.dropToSubmit.startDate.seconds * 1000)
               this.startDate = date.formatDate(datetime, 'YYYY-MM-DD')
               this.startTime = date.formatDate(datetime, 'HH:mm')
            }, 100)  // param update propagating as modal being popped up
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
</style>