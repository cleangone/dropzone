<template>
	<div class="column justify-center q-mt-md q-pa-sm rounded-borders bg-grey-4">
		<div class="self-center text-h6">Drop Board</div>
		<div class="row q-mt-xs q-gutter-xs">
			<!-- <drop-item-mini v-for="(dropItem, key) in getLiveDropItems" :key="key" :dropItemId="key" :dropItem="dropItem"/> -->
			<drop-item v-for="(dropItem, key) in getLiveDropItems" :key="key" :dropItemId="key" :dropItem="dropItem" :displayType="mini"/>
		</div>
  	</div> 
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { DropItemDisplayType, DropStatus } from '../../constants/Constants.js';
	import { getStartDateText } from './drop-util';

	export default {
		data() {
			return {
				showEditModal: false
			}
		},
		computed: {
			...mapGetters('drop', ['getLiveDropItems']),
			mini() { return DropItemDisplayType.MINI }
    	},
		components: {
			'drop-item' : require('components/DropItem/DropItem.vue').default
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