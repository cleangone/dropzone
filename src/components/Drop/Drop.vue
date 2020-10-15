<template>
	<q-card class="card" :class="bgColor">
		<router-link :to="{ name: dropPageRoute, params: { dropId: drop.id } }">
			<q-img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'" basic contain>
            <drop-timer v-if="isCountdown" :drop="drop"/>
            <div v-else class="absolute-bottom text-h6">{{ drop.name }}</div>
			</q-img>
         <!-- parallax only works when you have to scroll on a page  -->
         <!-- <q-parallax :height="150" :speed="0.5">
            <template v-slot:media>
               <img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'">
            </template>

            <drop-timer v-if="isCountdown" :drop="drop"/>
            <div v-else class="absolute-bottom text-h6">{{ drop.name }}</div>
         </q-parallax> -->
		</router-link>
		<q-card-section class="q-px-xs q-py-md" :class="bgColor">
		   <span class="q-px-sm text-bold">{{ dropText }}</span>
		</q-card-section>		
  	</q-card> 
</template>

<script>
   import { date } from 'quasar'
	import { mapGetters } from 'vuex'
	import { Route, Colors } from 'src/utils/Constants.js'
   import { DropMgr } from 'src/managers/DropMgr.js'
   import { formatTodayOr_ddd_MMM_D_h_mm } from 'src/utils/DateUtils'
   
	export default {
		props: ['drop'],
		computed: {
         ...mapGetters('color', Colors),
         isPreDrop() { return !DropMgr.isActive(this.drop) },
         isCountdown() { return DropMgr.isCountdown(this.drop) },
			bgColor() { return this.isPreDrop ? "" : "bg-green" },
         dropPageRoute() { return Route.DROP },
         dropText() { return this.isPreDrop ? this.dropDateText : "Drop is LIVE" },
         dropDateText() { return this.drop.startDate ? "Drops: " + formatTodayOr_ddd_MMM_D_h_mm(this.drop.startDate) : "Drop date TBD" }
      },
      components: {
         'drop-timer' : require('components/Drop/DropTimer.vue').default
      }
	}
</script>

<style>
	.card {
		width: 400px;
		min-height: 250px;
		max-width: 500px;
		min-width: 200px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	}
	.card .q-img { max-height: 180px; }
	.card .q-img__image { background-size: cover !important; }
	
</style>