<template>
	<q-page class="row justify-center" :class="pageClass">
		<drop-board v-if="dropBoardExpanded" :expandContainer="dropBoardExpandContainer" class="col q-mt-none vertical-top" :class="indigo"/>      
      <div v-else-if="visibleDropsExist" class="justify-center q-gutter-md row items-start">
	      <div class="col-1 q-mt-none q-gutter-y-md" style="width: 400px" :class="blue"> 
            <drop v-for="(drop, key) in visibleDrops.primary" :key="'prime'+key" :drop="drop" />
            <twitter v-if="hasTwitterId" :twitterId="twitterId" style="width: 400px" />
            <drop v-for="(drop, key) in visibleDrops.secondary" :key="'second'+key" :drop="drop" />
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
   import { DropMgr, HomePosition } from 'src/managers/DropMgr.js';
   import { Colors } from 'src/utils/Constants.js' 

	export default {
      data() {
			return {
            dropBoardExpandContainer: { isExpanded: false },
			}
		},
		computed: {
         ...mapGetters('drop', ['visibleDropsExist', 'getDrops']),
         ...mapGetters('setting', ['getSetting']),
         ...mapGetters('color', Colors),
         pageClass() { 
            // this.$q.platform.is.mobile works, but this.$q.platform.is.desktop undefined
            return (this.$q.platform.is.mobile ? "q-pa-sm q-gutter-xs " : "q-pa-md q-gutter-md ") + this.pink
         },
         drops() { return this.getDrops },
         visibleDrops () {
            const positionedDrops = new Map([
               [ HomePosition.PRIMARY_A, [] ],
               [ HomePosition.PRIMARY_B, [] ],
               [ HomePosition.SECOND_A,  [] ],
               [ HomePosition.SECOND_B,  [] ],
            ])

            // drops sorted by startDate ascending
            this.drops.forEach(drop => {
               if (drop.homePosition) { positionedDrops.get(drop.homePosition).push(drop) } 	
            })
            
            return { primary: positionedDrops.get(HomePosition.PRIMARY_A).concat(positionedDrops.get(HomePosition.PRIMARY_B)), 
                   secondary: positionedDrops.get(HomePosition.SECOND_A).concat(positionedDrops.get(HomePosition.SECOND_B)) }
         },
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
