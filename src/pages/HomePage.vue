<template>
	<q-page class="q-pa-md justify-center q-gutter-md row" :class="pink">
		<div class="column" :class="red">
			<div v-if="dropsDownloaded" class=" q-gutter-y-lg" :class="blue"> 
				<drop v-for="(drop, key) in getDrops" :key="key" :dropId="key" :drop="drop"  />
			</div>
			<div v-else>
				<span class="absolute-center">
					<q-spinner color="primary" size="3em" :thickness="2" />
				</span>
			</div>
		</div> 
		<div v-if="localHasLiveDrops" class="col q-mt-none" :class="indigo">
			<live-drops-board/>
		</div> 
	</q-page>
</template> 

<script>
	import { mapState, mapGetters } from 'vuex'
	import { getStartDateText } from '../components/Drop/drop-util';

	export default {
		data() {
	  		return {
	  			showModal: false
	  		}
	  	},
	  	computed: {
			...mapState('drop', ['dropsDownloaded']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('drop', ['hasDrops', 'getDrops', 'hasLiveDrops']),
			...mapGetters('color', ['red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]),
			localHasLiveDrops() {
				let liveDr = this.hasLiveDrops
				console.log("localHasLiveDrops", liveDr)
				return liveDr
			},
		},
		components: {
			'live-drops-board' : require('components/Drop/LiveDropsBoard.vue').default,
			'drop' : require('components/Drop/Drop.vue').default
	  	}
	}
</script>

<style lang="scss">
</style>
