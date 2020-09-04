<template>
  <q-page padding>  
	  <q-card class="form-card flat">
			<q-card-section>
            <div class="q-mb-sm">
					<span class="text-grey-9 text-caption">Email: </span>
               <span> {{ email }} </span>
               <!-- <span v-if="emailVerified" class="text-primary"> (Verified) </span>
				   <span v-if="(userEmail != null) && !emailVerified" class="text-primary"> 
                  <q-btn @click="verifyEmail" label="Verify" color="primary"  size="sm" dense/> 
               </span> -->
               <q-btn @click="showEditEmailModal=true" icon="edit" color="primary" size="xs" flat dense/> 
            </div>
				<div class="q-mb-sm">
					<q-input v-model="userToUpdate.firstName" label="First Name" stack-label />
				</div>
				<div class="q-mb-sm">
					<q-input v-model="userToUpdate.lastName" label="Last Name" stack-label />
				</div>
			</q-card-section>
		
			<q-card-actions >
				<q-btn @click="reset" label="Reset" color="grey" />
				<q-btn @click="submitUpdate" label="Save" color="primary" />
			</q-card-actions>
  		</q-card>
      <div class="row self-center q-mt-md q-gutter-sm" style="width: 30em">    
         <q-btn @click="updatePassword" label="Update Password" color="primary"/>
      </div>
      <q-dialog v-model="showEditEmailModal">
			<edit-email @emailUpdated="emailUpdated" />
		</q-dialog> 
  	</q-page>
</template>

<script>
	// import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { Notify } from 'quasar'
   import { firebaseAuth } from 'boot/firebase'


	export default {
		data() {
	  		return {
            userToUpdate: {},
            email: '',
            showEditEmailModal: false
			}
		},
		computed: {
			...mapGetters('auth', ['userId', 'currentUser']),
			...mapGetters('user', ['getUser', 'isAdmin']),
			user() { return this.getUser(this.userId)},
		},
		methods: {
			...mapActions('auth', ['sendPasswordResetEmail', 'sendEmailVerification', 'reload']),
			...mapActions('user', ['setUser']),
         reset() { 
            console.log("AccountPage.reset")
            this.userToUpdate = Object.assign({}, this.user) 
            this.email = this.currentUser.email
         },
         submitUpdate() { this.setUser(this.userToUpdate) },
         async updatePassword() { 
            try {
               // todo - the user stays logged in even when the password changes - fix?
               await this.sendPasswordResetEmail(this.userEmail)
               notifyPositive('Password reset email was sent')
            } 
            catch (err) { notifyNegative(`There was an error: ${err}`) }
         },  
         emailUpdated() {
            this.reload()
            this.email = this.currentUser.email
            this.showEditEmailModal=false
         },
      },
      components: {
         'edit-email' : require('components/User/EditEmail.vue').default,
      },
		mounted() { this.reset() }
	}

   function notifyPositive(msg) { Notify.create( {type: "positive", message: msg} )}
   function notifyNegative(msg) { Notify.create( {type: "negative", message: msg} )}

</script>