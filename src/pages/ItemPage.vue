<template>
	<q-page class="q-pa-md" :class="pink"> 
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
		<drop-item :dropItemId="dropItemId" :dropItem="dropItem" :displayType="full" class="q-mt-md"/>	
	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { DropItemDisplayType, DropStatus } from '../constants/Constants.js';
	
	export default {
		data() {
			return {				
				dropItemId: "",
        }
		},
		created() {
			this.dropItemId = this.$route.params.itemId
      },
	  	computed: {
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('drop', ['getDropId', 'getDropItem']),
			...mapGetters('color', ['red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]),
			full() { return DropItemDisplayType.FULL },
			dropId() { return this.getDropId(this.dropItemId)},
			dropItem() { return this.getDropItem(this.dropId, this.dropItemId) },
		},
		methods: {
			navBack() { this.$router.go(-1) },
		},
		components: {
	  		'drop-item' : require('components/DropItem/DropItem.vue').default,
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