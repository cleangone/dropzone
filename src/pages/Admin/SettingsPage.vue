<template>
  <q-page padding>  
     <div class="text-h6">Settings</div>
	  <q-card class="form-card flat">
			<q-card-section>
				<div class="row q-mb-sm q-gutter-sm">
					<q-input v-model="settingToUpdate.siteUrl" label="Site URL" filled class="col-4" />
					<q-input v-model="settingToUpdate.fromEmail" label="From Email Address" filled class="col-4" />
               <q-input v-model.number="settingToUpdate.bidAdditionalTime" label="Bid Timer (secs)" type="number" filled class="col"/>
            </div>
            <div class="row q-mb-sm q-gutter-sm">
					<q-input v-model="settingToUpdate.companyName" label="Company Name"   filled class="col-4" />
            	<q-input v-model="settingToUpdate.paypal"      label="Paypal Address" filled class="col-4" />
            </div>
            <email-settings-edit :emailSetting="emailPurchaseSuccess" />
            <email-settings-edit :emailSetting="emailPurchaseFail" />
            <email-settings-edit :emailSetting="emailWinningBid" />
            <email-settings-edit :emailSetting="emailInvoice" />
            <email-settings-edit :emailSetting="emailShipping" />
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
   import { EmailFields } from 'src/utils/Constants.js'
   
	export default {
		data() {
	  		return {
            settingToUpdate: {},
            emailPurchaseSuccess: {},
            emailPurchaseFail: {},
            emailWinningBid: {},
            emailInvoice: {},
            emailShipping: {},
         }
		},
		computed: {
         ...mapGetters('setting', ['getSetting']),
		},
		methods: {
			...mapActions('setting', ['setSetting']),
         reset() { 
            this.settingToUpdate = Object.assign({}, this.getSetting) 
            this.emailPurchaseSuccess = this.getEmailSetting(EmailFields.PURCHASE_SUCCESS, "Successful Purchase Request")
            this.emailPurchaseFail    = this.getEmailSetting(EmailFields.PURCHASE_FAIL,    "Failed Purchase Request")
            this.emailWinningBid      = this.getEmailSetting(EmailFields.WINNING_BID,      "Winning Bid")
            this.emailInvoice         = this.getEmailSetting(EmailFields.INVOICE,          "Invoice")
            this.emailShipping        = this.getEmailSetting(EmailFields.SHIIPPING,        "Shipping")
         },
         getEmailSetting(field, label) { 
            return { 
               subject: this.settingToUpdate[field + EmailFields.SUBJECT_SUFFIX], 
               body:    this.settingToUpdate[field + EmailFields.BODY_SUFFIX], 
               label: label }
         },
         submitUpdate() { 
            this.setEmailSettings(this.emailPurchaseSuccess, EmailFields.PURCHASE_SUCCESS)
            this.setEmailSettings(this.emailPurchaseFail,    EmailFields.PURCHASE_FAIL)
            this.setEmailSettings(this.emailWinningBid,      EmailFields.WINNING_BID)
            this.setEmailSettings(this.emailInvoice,         EmailFields.INVOICE)
            this.setEmailSettings(this.emailShipping,        EmailFields.SHIIPPING)
            this.setSetting(this.settingToUpdate)
         },
         setEmailSettings(emailSetting, field) { 
            this.settingToUpdate[field + EmailFields.SUBJECT_SUFFIX] = emailSetting.subject
            this.settingToUpdate[field + EmailFields.BODY_SUFFIX] = emailSetting.body
         }
      },
      components: {
			'email-settings-edit' : require('components/Admin/EmailSettingsEdit.vue').default,
      },
		created() { 
         this.reset() }
   }

  

</script>