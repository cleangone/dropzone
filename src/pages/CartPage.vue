<template>
	<q-page class="q-pa-md">
		<div class="q-mt-sm text-h5">Cart</div>
      <div v-if="cartItemsExist">
         <div class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in cartItems" :key="key" :item="item" :displayType="displayType" />
			</div>
		   <q-btn class="q-mt-md" label="Submit Purchase Request" @click="submitReq()" color="primary" size="md" dense no-caps/>
      </div>
      <div v-else class="q-mt-md">
         Cart is empty
      </div>
	</q-page>
</template>

<script>
   import { mapGetters, mapActions  } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr.js'
   import { ItemDisplayType } from 'src/utils/Constants'
   
	export default {
		data() {
			return {				
        }
		},
	  	computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
			...mapGetters('cart', ['cartSize', 'getCartItemIds']),
         ...mapGetters('item', ['getItems']),			
         displayType() { return ItemDisplayType.CART },
         cartItemsExist() { return this.cartSize > 0 },
         cartItems() { 
            let items = this.getItems(this.getCartItemIds)
            return items.sort((a,b) => a.sortName.localeCompare(b.sortName))
         },
      },
		methods: {
         ...mapActions('action', ['submitPurchaseRequest', 'submitSilentPurchaseRequest']),
         ...mapActions('cart', ['clearCart']),
         submitReq() { 
            let userId = "tempid"
            let userNickname = "temp nickname"
            if (this.loggedIn) {
               userId = this.userId
               const user = this.getUser(this.userId)
               userNickname = UserMgr.getNickname(user)
            }
      
            let firstItem = true
            for (var item of this.cartItems) {
               const action = { 
                  itemId: item.id, itemName: item.name, amount: item.startPrice, 
                  userId: userId, userNickname: userNickname }
            
               if (firstItem) { 
                  this.submitPurchaseRequest(action)
                  firstItem = false
               }
               else { this.submitSilentPurchaseRequest(action) }
            }
            
            this.clearCart()
         }
		},
      
		components: {
         'item' : require('components/Item/Item.vue').default,
      }
	}

</script>
