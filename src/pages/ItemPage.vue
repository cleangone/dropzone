<template>
	<q-page class="q-pa-md" :class="pink"> 
		<!-- <a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a> -->
      <!-- will have to wait for items if user followed a link directly to this page -->
      <div v-if="itemsExist" class="column" :class="yellow">
			<item :item="item" :displayType="displayType" class="self-center"/>	
		</div>
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
         // navBack() { this.$router.go(-1) },
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
	
</style>