<template>
  <q-page padding>  
     <div class="text-h6">Settings</div>
	  <q-card class="form-card flat">
			<q-card-section>
				<div class="row q-mb-sm q-gutter-sm">
               <q-input v-model="settingToUpdate.companyName" label="Company Name" filled class="col-4" />
					<q-input v-model="settingToUpdate.fromEmail" label="From Email Address" filled class="col-4" />
               <q-input v-model="settingToUpdate.siteUrl" label="Site URL" filled class="col" />
            </div>
            <div class="row q-mb-sm q-gutter-sm">
				   <q-input v-model.number="settingToUpdate.bidAdditionalTime" label="Bid Timer (secs)" type="number" filled class="col-4"/>
               <q-input v-model="settingToUpdate.paypal" label="Paypal Address" filled class="col" />
            </div>
            <div class="row q-mb-sm q-gutter-sm">
				   <q-input v-model="settingToUpdate.invoiceNote" label="Invoice Note" filled class="col" />
            </div>
            <email-settings-edit :emailSetting="emailPurchaseSuccess" />
            <email-settings-edit :emailSetting="emailPurchaseFail" />
            <email-settings-edit :emailSetting="emailWinningBid" />
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
   
   const EmailType = {
      PURCHASE_SUCCESS: 'emailPurchaseSuccess',
      PURCHASE_FAIL:    'emailPurchaseFail',
      WINNING_BID:      'winningBid',
   }
   const EMAIL_FIELD_SUBJECT_SUFFIX = 'Subject'
   const EMAIL_FIELD_BODY_SUFFIX    = 'Body'

	export default {
		data() {
	  		return {
            settingToUpdate: {},
            emailPurchaseSuccess: {},
            emailPurchaseFail: {},
            emailWinningBid: {},
         }
		},
		computed: {
         ...mapGetters('setting', ['getSetting']),
		},
		methods: {
			...mapActions('setting', ['setSetting']),
         reset() { 
            this.settingToUpdate = Object.assign({}, this.getSetting) 
            this.emailPurchaseSuccess = this.getEmailSetting(EmailType.PURCHASE_SUCCESS, "Successful Purchase Request")
            this.emailPurchaseFail    = this.getEmailSetting(EmailType.PURCHASE_FAIL,    "Failed Purchase Request")
            this.emailWinningBid      = this.getEmailSetting(EmailType.WINNING_BID,      "Winning Bid")
         },
         submitUpdate() { 
            this.setEmailSettings(this.emailPurchaseSuccess, EmailType.PURCHASE_SUCCESS)
            this.setEmailSettings(this.emailPurchaseFail,    EmailType.PURCHASE_FAIL)
            this.setEmailSettings(this.emailWinningBid,      EmailType.WINNING_BID)
            this.setSetting(this.settingToUpdate)
         },
         getEmailSetting(emailType, label) { 
            return { 
               subject: this.settingToUpdate[emailType + EMAIL_FIELD_SUBJECT_SUFFIX], 
               body:    this.settingToUpdate[emailType + EMAIL_FIELD_BODY_SUFFIX], 
               label: label 
            }
         },
         setEmailSettings(emailSetting, emailType) { 
            this.settingToUpdate[emailType + EMAIL_FIELD_SUBJECT_SUFFIX] = emailSetting.subject
            this.settingToUpdate[emailType + EMAIL_FIELD_BODY_SUFFIX] = emailSetting.body
         }
      },
      components: {
			'email-settings-edit' : require('components/Admin/EmailSettingsEdit.vue').default,
      },
		created() { 
         this.reset() }
   }

</script>