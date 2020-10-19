<template>
	<q-card class="form-card">
    <q-card-section :class="yellow">
      <div class="text-h6 heading">{{ type }} Drop</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-xs q-gutter-sm" :class="blue">
	      <q-input v-model="dropToSubmit.name" label="Name"  filled class="col" />
         <q-select label="Home Page Position" v-model="dropToSubmit.homePosition" :options="homePositionOptions" filled class="col"/>
    	</div>
    	<div class="row q-mb-xs q-gutter-sm" :class="red">
    		<q-input label="Start Date" v-model="startDate" mask="date" :rules="['date']" class="col" :class="purple" filled>
            <template v-slot:append>
               <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                     <q-date v-model="startDate" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
               </q-icon>
            </template>
        	</q-input>
			<q-input :label="'Start Time ' + timezone" v-model="startTime" mask="time" :rules="['time']" class="col" :class="purple" filled >
            <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" />
                </q-popup-proxy>
            </q-icon>
            </template>
        </q-input>
    	</div>
		<div class="row q-mb-sm items-center">
	      <div class="col">
            <div v-if="uploaderDisplayed" class="col q-gutter-xs">
               <q-firebase-uploader path="drops/" @upload="uploadCompleted" style="width: 100%; min-height: 160px"/> 
               <q-btn @click="uploaderDisplayed=false" icon="clear" color="primary" size="sm" dense/>
            </div>
            <div v-else class="col q-gutter-sm">
              <div align="right">
               <q-btn @click="uploaderDisplayed=true" label="Upload Image" color="primary" />
               </div>
               <q-select label="Status" v-model="dropToSubmit.status" :options="statusOptions" filled/>
			      <q-select label="Default Sale Type" v-model="dropToSubmit.defaultSaleType" :options="saleTypeOptions" filled/>  
	         </div>
	      </div>
         <q-img v-if="!uploaderDisplayed" :src="dropToSubmit.imageUrl ? dropToSubmit.imageUrl : 'statics/image-placeholder.png'"
               style="height: 160px; width: 200px" class="q-ml-sm" contain />
    	</div>
      <description-edit v-if="!uploaderDisplayed" :container="dropToSubmit" />
	</q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="persistDrop" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
   import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
	import QFirebaseUploader from 'components/QFirebaseUploader'
   import { DropMgr, DropStatus, HomePosition } from 'src/managers/DropMgr'
   import { SaleType, Colors } from 'src/utils/Constants.js'
   import { localTimezone } from 'src/utils/DateUtils'

	export default {
		props: ['type', 'drop'],
		data() {
			return {
				dropToSubmit: {
					name: '',
					startDate: null,
					status: DropStatus.PRIVATE,
					defaultSaleType: SaleType.BUY,
					imageUrl: ''
            },
            startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
            startTime: '09:00',
            timezone: localTimezone(),
            uploaderDisplayed: false,
            statusOptions: [ DropStatus.PRIVATE, DropStatus.SETUP, DropStatus.LIVE, DropStatus.DROPPED ],
            homePositionOptions: [ HomePosition.PRIMARY_A, HomePosition.PRIMARY_B, HomePosition.SECOND_A, HomePosition.SECOND_B ],
            saleTypeOptions: [ SaleType.BID, SaleType.BUY ]
			}
		},
		computed: {
         ...mapGetters('color', Colors),
         isEdit() { return this.type == 'edit' },
    	},
		methods: {
			...mapActions('drop', ['createDrop', 'setDrop']),
			
			persistDrop() {
            let timezoneOffset = date.formatDate(new Date(), 'Z')
            var isoDate = this.startDate.replace("/", "-").replace("/", "-")
            let formattedStartDate = isoDate + "T" + this.startTime + ":00.000" + timezoneOffset 
            this.dropToSubmit.startDate = new Date(formattedStartDate)
            
				if (this.type == 'add') { this.createDrop(this.dropToSubmit) }
				else { 
               // todo - does updating a scheduled drop auto reschedule it?
               if (DropMgr.isSetup(this.dropToSubmit) || DropMgr.isStartCountdown(this.dropToSubmit) || DropMgr.isLive(this.dropToSubmit)) {
                  this.dropToSubmit.cloudTaskId = "0" // if there is an existing queued task, stop it from starting countdown
               }
               this.setDrop(this.dropToSubmit) 
            }

            this.$emit('close')
			},
			uploadCompleted(emit) {
				console.log("uploadCompleted", emit)
				this.dropToSubmit.imageUrl = emit.url
				this.uploaderDisplayed = false
			}
		},
		components: {
    		QFirebaseUploader,
         'description-edit' : require('components/Admin/DescriptionEdit.vue').default,
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