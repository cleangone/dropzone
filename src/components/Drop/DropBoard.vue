<template>
	<div class="column justify-center q-mt-md q-pa-sm rounded-borders bg-grey-4">
		<div class="self-center text-h6"> 
         <span v-if="liveDropsExist">Live</span> Drop Board
      </div>
		<div class="row q-mt-xs q-gutter-xs">
			<item v-for="(item, key) in items" :key="key" :item="item" :displayType="mini"/>
		</div>
  	</div> 
</template>

<script>
   import { mapState, mapGetters, mapActions } from 'vuex'
   import { DropStatus } from 'src/managers/DropMgr.js';
	import { ItemDisplayType } from 'src/utils/Constants.js'
	
	export default {
		data() {
			return {
				showEditModal: false
			}
		},
		computed: {
			...mapGetters('drop', ['getDropIds']),
			...mapGetters('item', ['getItemsInDrops']),
         mini() { return ItemDisplayType.MINI },
         liveDropIds() { return this.getDropIds(DropStatus.LIVE) },
         liveDropsExist() { return this.liveDropIds.length > 0 },
         droppedDropIds() { return this.getDropIds(DropStatus.DROPPED) },
         items() {
            const dropIds = this.liveDropsExist ? this.liveDropIds : this.droppedDropIds
            const items = this.getItemsInDrops(dropIds)

            // active items shown at top 
            const activeItems = []
            const inactiveItems = []
            for (var item of items) {
               if (item.lastUserActivityDate == 0) { inactiveItems.push(item) }
               else { activeItems.push(item) }
            }

            activeItems.sort((a, b) => (a.lastUserActivityDate > b.lastUserActivityDate) ? -1 : 1)
            inactiveItems.sort((a, b)  => (a.sortName > b.sortName) ? 1 : -1)
   
            return activeItems.concat(inactiveItems)
         }
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