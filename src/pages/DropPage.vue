<template>
	<q-page class="q-pa-md b-pink">
		<div v-if="drop">
			<div class="row q-mt-sm text-h5">{{ drop.name }}</div>
         <div v-if="adminViewingSetup" class="row q-mt-none">
            <q-checkbox v-model="adminView" label="Admin View" class="text-grey-7" color="grey-7" dense />
         </div>
			<div v-if="showItems" class="row q-mt-none">
				<q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="text-grey-10" color="grey-10" dense />
			</div>
         <div v-if="showItems" class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in displayItems" :key="key" :item="item" :displayType="displayTypeThumb"/>
			</div>
         <div v-else class="row q-mt-sm" >
				<q-img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'" basic contain>
               <drop-timer v-if="isCountdown" :drop="drop"/>
               <div v-else class="absolute-bottom text-h6">Drops: {{ startDateText }}</div>
				</q-img>
			</div>
		</div>
		<div v-else>Loading</div>
	</q-page>
</template>

<script>
   import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr.js';
	import { ItemMgr } from 'src/managers/ItemMgr.js'
   import { ItemDisplayType } from 'src/utils/Constants.js'
   import { getStartDateText } from 'src/utils/DateUtils'
   
	export default {
		data() {
			return {				
				dropId: 0,
            showHoldSold: true,
            adminView: false
        }
		},
		created() {
			this.dropId = this.$route.params.dropId
      },
	  	computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
			...mapGetters('drop', ['getDrop']),
			...mapGetters('item', ['getItemsInDrop']),
			adminViewingSetup() { 
            
//               const { viewport } = dom
// let {height, width} = viewport()
// console.log("dom", dom)
// const { height, width } = dom
// console.log("width", this.$q.screen.width)

            return this.isAdmin && DropMgr.isSetup(this.drop) },
         displayTypeThumb() { return ItemDisplayType.THUMB },
         drop() { return this.getDrop(this.dropId) },
         isCountdown() { return DropMgr.isCountdown(this.drop) },
         user() { return this.getUser(this.userId) },
         isAdmin() { return this.user && this.user.isAdmin },
         visibleItems () { 
            const visibleItems = []
            const items = this.getItemsInDrop(this.dropId) 
            items.forEach(item => { 
               if (ItemMgr.isActive(item) || (this.adminView && ItemMgr.isSetup(item))) { visibleItems.push(item) }
		      })
            return visibleItems
         },
         displayItems () { 
            if (this.showHoldSold) { return this.visibleItems }
            
            let availableItems = []
            this.visibleItems.forEach(item => { 
               if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { availableItems.push(item) }
		      })
				return availableItems
         },
         showItems() { return DropMgr.isActive(this.drop) || (this.adminView && DropMgr.isSetup(this.drop)) },
         startDateText() { return getStartDateText(this.drop.startDate) },
		},
		methods: {
			navBack() { this.$router.go(-1) },
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