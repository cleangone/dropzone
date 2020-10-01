<template>
	<q-page class="q-pa-md b-pink">
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
      <div class="row q-mt-sm text-h6">Favorites</div>
      <div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in items" :key="key" :item="item" :displayType="thumb"/>
      </div>
		
		
	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { ItemDisplayType } from 'src/utils/Constants.js'
	
	export default {
		data() {
			return {
        }
		},
	  	computed: {
			...mapGetters('auth', ['userId']),
			...mapGetters('user', ['getUser']),
			...mapGetters('item', ['getItems']),
			thumb() { return ItemDisplayType.THUMB },
			user() { return this.getUser(this.userId) },
         items () { return (this.user.likedItemIds ? this.getItems(this.user.likedItemIds) : []) },
		},
		methods: {
         ...mapActions('localEvent', ['setFavorites']),
			navBack() { this.$router.go(-1) },
		},
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
      mounted() {
			this.setFavorites(false)
      },
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