<template>
	<q-page class="q-pa-md" :class="pink"> 
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
      <!-- will have to wait for items if user followed a link directly to this page -->
		<item v-if="itemsExist" :item="item" :displayType="displayType" class="q-mt-md"/>	
	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters, mapActions } from 'vuex'
	import { ItemDisplayType, Colors } from 'src/utils/Constants.js'
	
	export default {
		data() {
			return {				
				itemId: "",
        }
		},
	  	computed: {
         ...mapGetters('item', ['itemsExist', 'getItem']),			
			...mapGetters('color', Colors),
			displayType() { return ItemDisplayType.FULL },
			item() { return this.getItem(this.itemId) },
		},
		methods: {
         navBack() { this.$router.go(-1) },
		},
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
      created() {
         this.itemId = this.$route.params.itemId
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