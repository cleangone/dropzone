<template>
  <q-page padding>  
     <div class="text-h6">Settings</div>
	  <q-card class="form-card flat">
			<q-card-section>
				<div class="row q-mb-sm q-gutter-sm">
					<q-input v-model="settingToUpdate.siteUrl" label="Site URL" filled class="col" />
					<q-input v-model="settingToUpdate.fromEmail" label="From Email Address" filled class="col" />
            </div>
				<div class="row q-mb-sm q-gutter-sm">
				<q-input v-model.number="settingToUpdate.bidAdditionalTime" label="Bid Timer (secs)" type="number" filled class="col"/>
            <div class="col"/>
            </div>
            
			</q-card-section>
		
			<q-card-actions >
				<q-btn @click="reset" label="Reset" color="grey" />
				<q-btn @click="submitUpdate" label="Save" color="primary" />
			</q-card-actions>
  		</q-card>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { Notify } from 'quasar'
   
	export default {
		data() {
	  		return {
            settingToUpdate: {},
         }
		},
		computed: {
			...mapGetters('setting', ['getSetting']),
		},
		methods: {
			...mapActions('setting', ['setSetting']),
         reset() { this.settingToUpdate = Object.assign({}, this.getSetting) },
         submitUpdate() { this.setSetting(this.settingToUpdate) },
      },
		mounted() { this.reset() }
	}

</script>