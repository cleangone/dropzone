<template>
	<div class="column justify-center q-mt-md q-pa-sm rounded-borders bg-grey-4">
      <div class="self-center text-h6 " :class="red"> 
         <span v-if="liveDropsExist">Live</span> Drop Board
         <q-btn v-if="isExpanded" @click="collapse()" icon="mdi-arrow-collapse" color="primary"  size="sm" flat dense />
         <q-btn v-else            @click="expand()"   icon="mdi-arrow-expand"   color="primary"  size="sm" flat dense />
      </div>
		<div class="row q-mt-xs q-gutter-xs" :class="orange">
			<item v-for="(item, key) in items" :key="key" :item="item" :displayType="displayType"/>
		</div>
  	</div> 
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { DropStatus } from 'src/managers/DropMgr'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { ItemDisplayType, Colors } from 'src/utils/Constants'
   
	export default {
      props: ['expandContainer'],
		computed: {
			...mapGetters('drop', ['getDropIds']),
         ...mapGetters('item', ['getItemsInDrops']),
         ...mapGetters('color', Colors),
         isExpanded() { return this.expandContainer.isExpanded },
         displayType() { return ItemDisplayType.MINI },
         liveDropIds() { return this.getDropIds(DropStatus.LIVE) },
         liveDropsExist() { return this.liveDropIds.length > 0 },
         droppedDropIds() { return this.getDropIds(DropStatus.DROPPED) },
         items() {
            SessionMgr.setHomeItemsDesc("Drops") 
            const dropIds = this.liveDropsExist ? this.liveDropIds : this.droppedDropIds
            const items = this.getItemsInDrops(dropIds)

            // show items with user activity at top 
            const userActivityItems = []
            const noActivityItems = []
            for (var item of items) {
               if (ItemMgr.isActive(item)) {
                  if (item.lastUserActivityDate == 0) { noActivityItems.push(item) }
                  else { userActivityItems.push(item) }
               }
            }

            userActivityItems.sort((a, b) => (a.lastUserActivityDate > b.lastUserActivityDate) ? -1 : 1)
            noActivityItems.sort((a, b)  => (a.sortName > b.sortName) ? 1 : -1)
   
            return SessionMgr.setDisplayItems(userActivityItems.concat(noActivityItems))
         }
       },
       methods: {
         expand()   { this.expandContainer.isExpanded = true },
         collapse() { this.expandContainer.isExpanded = false },
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