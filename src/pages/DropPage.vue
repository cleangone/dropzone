<template>
	<q-page class="q-pa-md b-pink">
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
		<q-toggle v-if="loggedIn" class="float-right" v-model="showOnlyLikedItems" icon="favorite" :label= "showLabel" />
		<div v-if="drop">
			<div class="row q-mt-sm text-h6">{{ drop.name }}</div>
			<div v-if="isPreDrop" class="row q-mt-sm" >
				<q-img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'" basic contain>
					<div class="absolute-bottom text-h6">Drops: {{ startDateText }}</div>
				</q-img>
			</div>
			<div v-else class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in dropItems" :key="key" :item="item" :displayType="thumb"/>
			</div>
		</div>
		<div v-else>Loading</div>
	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { DropStatus, ItemDisplayType } from 'src/utils/Constants.js'
	import { getStartDateText } from 'src/utils/DateUtils'
   
	export default {
		data() {
			return {				
				dropId: 0,
				showOnlyLikedItems: false
        }
		},
		created() {
			this.dropId = this.$route.params.dropId
      },
	  	computed: {
			// ...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
			// ...mapGetters('user', ['isAdmin', 'getLikes']),
			...mapGetters('drop', ['getDrop']),
			...mapGetters('item', ['getItemsInDrop']),
			thumb() { return ItemDisplayType.THUMB },
			drop() { return this.getDrop(this.dropId)},
			likes() { return this.getLikes(this.userId)},
			// dropItems () {
			// 	let items = {}
			// 	if (this.showOnlyLikedItems) {
			// 		if (this.likes && this.drop.items) { 
			// 			let likedDropItemIds = Object.keys(this.likes)
			// 			Object.keys(this.drop.items).forEach(key => {
			// 				if (likedDropItemIds.includes(key)) { items[key] = this.drop.items[key] }
			// 			})
			// 		}
			// 	}
			// 	else { items = this.drop.items }
			// 	return items
         // },
         dropItems () { return this.getItemsInDrop(this.dropId) },
			isPreDrop() { return this.drop.status == DropStatus.PREDROP },
			startDateText() { return getStartDateText(this.drop) },
			showLabel() { return this.showOnlyLikedItems ? "Show liked": "Show all" }
		},
		methods: {
			navBack() { this.$router.go(-1) },
		},
		components: {
	  		'item' : require('components/Item/Item.vue').default,
	  	}
	}

</script>

<style>
	/* .card {
		min-height: 250px;
		max-width: 500px;
		min-width: 400px;
		transition: background 0.3s;
	}

	.card {
		min-height: 250px;
		max-width: 500px;
		min-width: 400px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	} */
	.q-img { max-height: 400px; 
	max-width: 500px;
	}
	/*
	.card .q-img__image { background-size: cover !important; }
	 */
</style>