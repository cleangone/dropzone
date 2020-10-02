<template>
	<q-page class="q-pa-md">
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
      <div class="row q-mt-sm q-pl-xs text-h6">Current Activity</div>
      <div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in items" :key="key" :item="item" :displayType="thumb"/>
      </div>
	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { ItemDisplayType } from 'src/utils/Constants.js'
	
	export default {
		computed: {
			...mapGetters('event', ['getActiveItemIds']), 
			...mapGetters('item', ['getItems']),
			thumb() { return ItemDisplayType.THUMB },
         items () { return this.getItems(this.getActiveItemIds) },
		},
		methods: {
         navBack() { this.$router.go(-1) },
		},
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
	}

</script>

<style>
</style>