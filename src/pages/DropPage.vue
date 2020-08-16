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
				<drop-item v-for="(dropItem, key) in dropItems" :key="key" :dropItemId="key" :dropItem="dropItem" :displayType="thumb"/>
			</div>
		</div>
		<div v-else>Loading</div>
	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { DropItemDisplayType, DropStatus } from '../constants/Constants.js';
	import { getStartDateText } from '../components/Drop/drop-util';

	export default {
		data() {
			return {				
				dropId: 0,
				showModal: false,
				showOnlyLikedItems: false
        }
		},
		created() {
			this.dropId = this.$route.params.dropId
      },
	  	computed: {
			...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('user', ['isAdmin', 'getLikes']),
			...mapGetters('drop', ['getDrop']),
			thumb() { return DropItemDisplayType.THUMB },
			drop() { return this.getDrop(this.dropId)},
			likes() { return this.getLikes(this.userId)},
			dropItems () {
				let items = {}
				if (this.showOnlyLikedItems) {
					if (this.likes && this.drop.items) { 
						let likedDropItemIds = Object.keys(this.likes)
						Object.keys(this.drop.items).forEach(key => {
							if (likedDropItemIds.includes(key)) { items[key] = this.drop.items[key] }
						})
					}
				}
				else { items = this.drop.items }
				return items
			},
			isPreDrop() { return this.drop.status == DropStatus.PREDROP },
			startDateText() { return getStartDateText(this.drop) },
			showLabel() { return this.showOnlyLikedItems ? "Show liked": "Show all" }
		},
		methods: {
			navBack() { this.$router.go(-1) },
		},
		components: {
	  		'drop-item' : require('components/DropItem/DropItem.vue').default,
	  		'modal-add-edit' : require('components/DropItem/ModalAddEdit.vue').default
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