<template>
   <div>
   	<item-bid v-if="isOutbidAlert" msg="You have been outbid" :item="alertItem" @close="cancelAlert()" />
      <q-card v-else class="form-card">
         <q-card-section>    
            <div v-if="isLateBidAlert" class="text-h6">{{ alert.itemName }} bidding already ended.</div>
            <div v-else class="text-h6">Unknown Alert</div>
         </q-card-section>
         <q-card-actions align="right">
            <q-btn label="Cancel" @click="cancelAlert()" color="grey" />
         </q-card-actions>
      </q-card>
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr.js'
   
	export default {
      props: ['alert', 'user', 'cancelledAlertIds'],
		computed: {
         ...mapGetters('item', ['getItem']),
         isOutbidAlert()  { return UserMgr.isOutbid(this.alert) },
         isLateBidAlert() { return UserMgr.isLateBid(this.alert) },
         alertItem() { return this.getItem(this.alert.itemId) },
      },
		methods: {
         ...mapActions('user', ['updateUser']),
         cancelAlert() {
            this.cancelledAlertIds.push(this.alert.id) 
            
            const remainingAlerts = []
            for (var alert of this.user.alerts) {
               if (alert.id != this.alert.id) { remainingAlerts.push(alert) }
            }
            this.updateUser({ id: this.user.id, alerts: remainingAlerts})
         }
      },
      components: {
         'item-bid' : require('components/Item/ItemBid.vue').default
      },		
	}
</script>
