<template>
	<q-page class="q-pa-md">
		<div class="q-mt-sm text-h5">Cart</div>
      <div v-if="cartItemsExist">
         <div class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in cartItems" :key="key" :item="item" :displayType="displayType" />
			</div>
		</div>
      <div v-else class="q-mt-md">
         Cart is empty
      </div>
      <!-- <div>Auth userId: {{userId}}</div> -->
      <q-card v-if="anonLoggedIn" class="form-card flat q-mt-md">
         <!-- <div>AnonUser.id: {{anonUser.id}}</div> -->
			<q-card-section>
            <div class="row">
               <div class="col q-gutter-sm">
                  <q-input v-model="anonUser.anonUserEmail" label="Email" ref="email" type="email" autocomplete="email" 
                     lazy-rules :rules="[ val => isValidEmailAddressLocal(val) || 'Not a valid email']" filled />
                  <div class="row">
                     <q-input v-model="anonUser.firstName" label="First Name" class="col-5" filled />
                     <q-input v-model="anonUser.lastName"  label="Last Name"  class="col q-ml-sm"  filled />
                  </div>               
                  <q-input v-model="anonUser.address" label="Address" filled/>
                  <q-input v-model="anonUser.city"    label="City" filled />
                  <div class="row">
                     <q-input v-model="anonUser.state"   label="State" class="col-3" filled />
                     <q-input v-model="anonUser.zip"     label="Zip"   class="col-4 q-ml-sm" filled />
                     <q-input v-model="anonUser.country" label="Country (if not USA)" class="col q-ml-sm" filled />
                  </div>
               </div>
            </div>
			</q-card-section>
      </q-card>
      <div v-if="cartItemsExist" class="q-mt-md">
		   <div v-if="loggedIn">
		      <q-btn label="Submit Purchase Request" @click="submitReq()" color="primary"/>
         </div>
         <div v-else-if="anonLoggedIn && anonUserValid">
		      <q-btn label="Submit Purchase Request" @click="submitReq()" color="primary"/>
         </div>
         <div v-else-if="anonLoggedIn">
		      <q-btn label="Submit Purchase Request" disable color="primary"/>
         </div>
         <div v-else class="q-mt-lg">
            <q-btn label="Login" to="/auth/login" color="primary" />
            <span class="q-mx-md">or</span>
            <q-btn label="Enter Shipping Info" @click="loginAnon()" color="primary" />
         </div>
      </div>
	</q-page>
</template>

<script>
   import { mapGetters, mapActions  } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr'
   import { CartMgr } from 'src/managers/CartMgr'
   import { ItemDisplayType } from 'src/utils/Constants'
   import { isValidEmailAddress } from 'src/utils/EmailUtils'
   
	export default {
		data() {
		   return {		
            anonUser: {},
         }
		},
	  	computed: {
			...mapGetters('auth', ['loggedIn', 'anonLoggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
			...mapGetters('cart', ['cartSize', 'getCartItemIds']),
         ...mapGetters('item', ['getItems']),			
         displayType() { return ItemDisplayType.CART },
         cartItemsExist() { return this.cartSize > 0 },
         cartItems() { 
            let items = this.getItems(this.getCartItemIds)
            return items.sort((a,b) => a.sortName.localeCompare(b.sortName))
         },
         anonUserValid() {
            return (this.anonUser.anonUserEmail &&
               this.anonUser.firstName &&
               this.anonUser.lastName)
         } 
      },
		methods: {
         ...mapActions('auth', ['loginAnonUser']),
         ...mapActions('action', ['submitPurchaseRequests']),
         ...mapActions('cart', ['clearCart']),
         ...mapActions('user', ['setUser']),
         loginAnon() { this.loginAnonUser() },
         isValidEmailAddressLocal(email) { return isValidEmailAddress(email) },
		   persistAnonUser() { 
            if (!this.anonUser.id) { this.anonUser.id = this.userId } 
            if (!CartMgr.isAnonUserPersisted()) { 
               this.setUser(CartMgr.anonUser) 
               CartMgr.setPersistedAnonUser()
            }
            return CartMgr.anonUser
         },
         submitReq() { 
            let user = this.loggedIn ? this.getUser(this.userId) : this.persistAnonUser()
              
            let actions = []
            for (var item of this.cartItems) {
               actions.push({ itemId: item.id, itemName: item.name, amount: item.startPrice, 
                              userId: user.id, userNickname: UserMgr.getNickname(user) })
            }
            this.submitPurchaseRequests(actions)
            this.clearCart()
         },
      },
		components: {
         'item' : require('components/Item/Item.vue').default,
      },
      mounted() { this.anonUser = CartMgr.anonUser }
	}

</script>
