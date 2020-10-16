<template>
	<q-page class="q-pa-md justify-center q-gutter-md row" :class="pink">
		<drop-board v-if="dropBoardExpanded" :expandContainer="dropBoardExpandContainer" class="col q-mt-none vertical-top" :class="indigo"/>
		<div v-else-if="activeDropsExist" class="justify-center q-gutter-md row items-start">
	      <div class="col-1 q-mt-none q-gutter-y-md" style="width: 400px" :class="blue"> 
            <drop v-for="(drop, key) in featuredDrops" :key="key" :drop="drop" />
            <twitter v-if="hasTwitterId" :twitterId="twitterId" style="width: 400px" />
            <drop v-for="(drop, key) in onDeckDrops" :key="'other'+key" :drop="drop" />
         </div>
         <drop-board :expandContainer="dropBoardExpandContainer" class="col q-mt-none vertical-top" :class="indigo"/>
      </div>
      <div v-else class="justify-center q-gutter-md row" :class="red">
         <twitter v-if="hasTwitterId" :twitterId="twitterId" class="col q-mt-none" style="width: 400px" :class="yellow"/>
         <div class="column q-gutter-y-lg" :class="blue"> 
				<drop v-for="(drop, key) in drops" :key="key" :drop="drop" :class="orange"/>
			</div>
      </div>
	</q-page>
</template> 

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr.js';
   import { Colors } from 'src/utils/Constants.js' 

	export default {
      data() {
			return {
            dropBoardExpandContainer: { isExpanded: false },
			}
		},
		computed: {
         ...mapGetters('drop', ['dropsExist', 'getDrops', 'activeDropsExist']),
         ...mapGetters('setting', ['getSetting']),
         ...mapGetters('color', Colors),
         drops() { return this.getDrops },
         segmentedDrops () {
            const featured = []
            const onDeck = []
            const segmentedDrops = { featured: featured, onDeck: onDeck }
            this.drops.forEach(drop => {
               if (DropMgr.isScheduled(drop) || DropMgr.isInCountdown(drop) || DropMgr.isActive(drop)) { featured.push(drop) }		
               else if (DropMgr.isSetup(drop)) { onDeck.push(drop) }	
            })

            // have at least one featured drop
            if (featured.length == 0  && onDeck.length > 0) { featured.push(onDeck.shift()) }
            return segmentedDrops
         },
         featuredDrops() { return this.segmentedDrops.featured },
         onDeckDrops() { return this.segmentedDrops.onDeck },
         dropBoardExpanded() { return this.dropBoardExpandContainer.isExpanded },
         hasTwitterId() { return this.twitterId && this.twitterId.length > 0 },
         twitterId() { return this.getSetting.twitterId },
      },
      components: {
         'drop' : require('components/Drop/Drop.vue').default,
         'drop-board' : require('components/Drop/DropBoard.vue').default,
         'twitter' : require('components/General/Twitter.vue').default,
      },
	}
</script>

<style lang="scss">
</style>
