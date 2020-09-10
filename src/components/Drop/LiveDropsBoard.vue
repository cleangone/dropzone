<template>
	<div class="column justify-center q-mt-md q-pa-sm rounded-borders bg-grey-4">
		<div class="self-center text-h6">Drop Board</div>
		<div class="row q-mt-xs q-gutter-xs">
			<item v-for="(item, key) in activeDropItems" :key="key" :item="item" :displayType="mini"/>
		</div>
  	</div> 
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { DropStatus, ItemDisplayType } from 'src/utils/Constants.js';
	
	export default {
		data() {
			return {
				showEditModal: false
			}
		},
		computed: {
			...mapGetters('drop', ['getActiveDropIds']),
			...mapGetters('item', ['getItemsInDrops']),
         mini() { return ItemDisplayType.MINI },
         activeDropItems() { return this.getItemsInDrops(this.getActiveDropIds) }
    	},
		components: {
			'item' : require('components/Item/Item.vue').default
		}
	}
</script>

<style>
	.card {
		min-height: 250px;
		max-width: 500px;
		min-width: 400px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	}
	.card .q-img { max-height: 180px; }
	.card .q-img__image { background-size: cover !important; }
	
</style>