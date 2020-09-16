<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">Item Bulk Edit</div>
    </q-card-section>
    <q-card-section>
      <div class="q-mb-sm">
         <q-select label="Status" v-model="status" :options="statusOptions" filled/>
      </div>
      <div class="q-mb-sm">
         <q-select v-model="artist" label="Artist" :options="artistOptions" filled class="col"/>
      </div>  
      <div class="q-mb-sm">
         <q-select label="Sale Type" v-model="saleType" :options="saleTypeOptions" filled/>
      </div>
	</q-card-section>
   <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="persistItems" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { SaleType, ItemStatus } from 'src/utils/Constants.js';
   import { Tag, TagCategory } from 'src/models/Tag.js'
   
	export default {
      props: ['items'],
		data() {
			return {
            status: "",
            artist: "",
            saleType: "",
				statusOptions: [ ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.HOLD, ItemStatus.SOLD ],
				saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ]
			}
      },
       computed: {
         ...mapGetters('tag', ['getTags']),
         artistOptions() {
            let artists = []
            let tags = this.getTags(TagCategory.ARTIST)
            tags.forEach(tag => { artists.push(tag.id) })
            artists.push("")
            return artists
         }
      },
      methods: {
			...mapActions('item', ['updateItems']),
			persistItems() {
            if (this.status.length || this.artist.length || this.saleType.length ) { 
               const itemUpdates = []
               this.items.forEach(item => {
                  let update = { id: item.id }
                  if (this.status.length) { update.status = this.status }
                  if (this.artist.length) { Tag.setArtist(update, this.artist) }
                  if (this.saleType.length) { update.saleType = this.saleType }

                  if (update.status == ItemStatus.AVAILABLE) { 
                     update.buyPrice = 0 
                     update.bidderIds = []
                     update.currBidderId = ''
                     update.currBidAmount = 0
                     update.currActionId = ''
                     update.numberOfBids = 0
                     update.buyerId = ''
                     update.buyerName = ''
                     update.dropDoneDate = 0 
                     update.lastUserActivityDate = 0 
                  }
                  // console.log("Bulk update", update)
                  itemUpdates.push(update)
               })
 
               this.updateItems(itemUpdates)
            }
            
            this.$emit('close')
			},
		},
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	
</style>