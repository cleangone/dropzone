<template>
	<q-card class="card">
		<router-link :to="{ name: dropPageRoute, params: { dropId: drop.id } }">
			<q-img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'" basic contain>
            <drop-timer v-if="isCountdown" :drop="drop"/>
            <div v-else class="absolute-bottom text-h6">{{ drop.name }}</div>
			</q-img>
		</router-link>
		<q-card-section class="q-px-xs q-py-md" :class="purple">
			<div v-if="isPreDrop">
				<span class="text-bold">Drops:</span>
				<span> {{ startDateText }}</span>
			</div>
			<div v-else class="text-green text-bold">Drop is LIVE</div>
		</q-card-section>		
  	</q-card> 
</template>

<script>
   import { date } from 'quasar'
	import { mapGetters } from 'vuex'
	import { Route, DropStatus, Colors } from 'src/utils/Constants.js';
   import { getStartDateText } from 'src/utils/DateUtils'
   
	export default {
		props: ['drop'],
		computed: {
         ...mapGetters('color', Colors),
			isCountdown() { return this.drop.status == DropStatus.COUNTDOWN},
			isPreDrop() { return this.drop.status != DropStatus.LIVE && this.drop.status != DropStatus.DROPPED },
			dropPageRoute() { return Route.DROP },
         startDateText() { return getStartDateText(this.drop.startDate) }
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