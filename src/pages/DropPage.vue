<template>
	<q-page class="q-pa-md b-pink">
		<div v-if="drop">
			<div class="row q-mt-sm text-h5">{{ drop.name }}</div>
         <div v-if="adminViewingPreDrop" class="row q-mt-none">
            <q-checkbox v-model="adminView" label="Admin Item View" class="text-grey-7" color="grey-7" dense />
         </div>
			<div v-else-if="showItems" class="row q-mt-none">
				<q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="text-grey-10" color="grey-10" dense />
			</div>
         <div v-if="showItems" class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in displayItems" :key="key" :item="item" :displayType="displayTypeThumb"/>
			</div>
         <div v-else class="q-mt-sm" style="max-width:500px">
				<q-img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'"  basic contain>
               <drop-timer v-if="isCountdown" :drop="drop"/>
               <div v-else class="absolute-bottom text-h6">Drops: {{ startDateText }}</div>
				</q-img>
            <div v-html="drop.description" class="q-pa-sm" />
			</div>
		</div>
		<div v-else>Loading</div>
	</q-page>
</template>

<script>
   import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr'
	import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { ItemDisplayType } from 'src/utils/Constants'
   import { formatTodayOr_ddd_MMM_D_h_mm } from 'src/utils/DateUtils'
   
	export default {
		data() {
			return {				
				dropId: 0,
            showHoldSold: true,
            adminView: false
        }
		},
	  	computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
			...mapGetters('drop', ['getDrop']),
			...mapGetters('item', ['getItemsInDrop']),
			adminViewingPreDrop() { return this.isAdmin && DropMgr.isPreDrop(this.drop) },
         displayTypeThumb() { return ItemDisplayType.THUMB },
         drop() { return this.getDrop(this.dropId) },
         isCountdown() { return DropMgr.isCountdown(this.drop) },
         user() { return this.getUser(this.userId) },
         isAdmin() { return this.user && this.user.isAdmin },
         visibleItems() { 
            const visibleItems = []
            const items = this.getItemsInDrop(this.dropId) 
            items.forEach(item => { 
               if (ItemMgr.isActive(item) || (this.adminView && ItemMgr.isSetup(item))) { visibleItems.push(item) }
		      })
            return visibleItems
         },
         displayItems() { 
            SessionMgr.setDropItemsDesc("Drop", this.dropId) 
            if (this.showHoldSold) { return SessionMgr.setDisplayItems(this.visibleItems) }

            const displayItems = []
            this.visibleItems.forEach(item => { 
               if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { displayItems.push(item) }
            })
            return SessionMgr.setDisplayItems(displayItems)
			},
         showItems() { return DropMgr.isActive(this.drop) || (this.adminView && DropMgr.isPreDrop(this.drop)) },
         startDateText() { return this.drop.startDate ? formatTodayOr_ddd_MMM_D_h_mm(this.drop.startDate) : "Date not set" },
		},
		methods: {
		},
      created() {
			this.dropId = this.$route.params.id
      },
		components: {
	  	   'drop-timer' : require('components/Drop/DropTimer.vue').default,
         'item' : require('components/Item/Item.vue').default,
	  	}
	}

</script>

<style>
	.q-img { max-height: 400px; max-width: 500px; }
</style>