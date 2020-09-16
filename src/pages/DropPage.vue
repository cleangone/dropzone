<template>
	<q-page class="q-pa-md b-pink">
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
		<q-toggle v-if="loggedIn" class="float-right" v-model="showAvailable" :label= "showAvailable ? 'Show All': 'Show Available'"/>
		<div v-if="drop">
			<div class="row q-mt-sm text-h6">{{ drop.name }}</div>
			<div v-if="showItems" class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in items" :key="key" :item="item" :displayType="thumb"/>
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
   import { ItemDisplayType, ItemStatus } from 'src/utils/Constants.js'
   import { DropMgr } from 'src/managers/DropMgr.js';
   
	import { getStartDateText } from 'src/utils/DateUtils'
   
	export default {
		data() {
			return {				
				dropId: 0,
				showAvailable: false
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
			thumb() { return ItemDisplayType.THUMB },
         drop() { return this.getDrop(this.dropId) },
         isCountdown() { return DropMgr.isCountdown(this.drop) },
         user() { return this.getUser(this.userId) },
         isAdmin() { return this.user && this.user.isAdmin },
         items () { 
            let items = this.getItemsInDrop(this.dropId) 
            if (!this.showAvailable) { return items }
            
            let availableItems = []
            items.forEach(item => { 
               if (item.status == ItemStatus.AVAILABLE || item.status == ItemStatus.DROPPING) { availableItems.push(item) }
		      })
				return availableItems
         },
         showItems() { 
            return (this.isAdmin && DropMgr.isSetup(this.drop) || DropMgr.isLive(this.drop) || DropMgr.isDropped(this.drop) )
         },
			startDateText() { return getStartDateText(this.DropMgr.startDate) },
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