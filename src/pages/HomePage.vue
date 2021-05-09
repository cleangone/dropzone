<template>
	<q-page class="row justify-center" :class="pageClass">
      <div class="col-1 q-mt-none q-gutter-y-md" style="width: 400px" :class="blue"> 
         <drop v-for="(drop, key) in visibleDrops.primary" :key="'prime'+key" :drop="drop" />
         <twitter v-if="hasTwitterId" :twitterId="twitterId" style="width: 400px" />
         <drop v-for="(drop, key) in visibleDrops.secondary" :key="'second'+key" :drop="drop" />
      </div>
      <recent-items class="col q-mt-none" :class="indigo"/>
	</q-page>
</template> 

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr'
   import { Colors } from 'src/utils/Constants'

	export default {
		computed: {
         ...mapGetters('drop', ['getDrops']),
         ...mapGetters('setting', ['getSetting']),
         ...mapGetters('color', Colors),
         pageClass() { 
            return (this.$q.platform.is.mobile ? "q-pa-sm q-gutter-xs " : "q-pa-md q-gutter-md ") + this.pink
         },
         drops() { return this.getDrops },
         visibleDrops () {
            const primaryDrops = []
            const secondaryDrops = []
            this.drops.forEach(drop => {
               if (DropMgr.isPrimaryGroup(drop)) { primaryDrops.push(drop) } 	
               else if (DropMgr.isSecondaryGroup(drop)) { secondaryDrops.push(drop) } 	
            })

            primaryDrops.sort((a, b)   => (DropMgr.homePosition(a) < DropMgr.homePosition(b) ? -1 : 1))
            secondaryDrops.sort((a, b) => (DropMgr.homePosition(a) < DropMgr.homePosition(b) ? -1 : 1))

            const primaryDropId = primaryDrops && primaryDrops.length ? primaryDrops[0].id : null
            if (primaryDropId) { this.bindDropItems(primaryDropId) }

            return { primary: primaryDrops, secondary: secondaryDrops}
         },
         hasTwitterId() { return this.twitterId && this.twitterId.length > 0 },
         twitterId() { return this.getSetting.twitterId },
      },
      methods: {
         ...mapActions('item', ['bindDropItems']),
      },
      components: {
         'drop' : require('components/Drop/Drop.vue').default,
         'recent-items' : require('components/Item/RecentItems.vue').default,
         'twitter' : require('components/General/Twitter.vue').default,
      },
	}
</script>

<style lang="scss">
</style>
