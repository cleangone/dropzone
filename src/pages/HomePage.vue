<template>
	<q-page class="q-pa-md justify-center q-gutter-md row" :class="pink">
		<div class="column" :class="red">
			<div v-if="dropsExist" class=" q-gutter-y-lg" :class="blue"> 
				<drop v-for="(drop, key) in getDrops" :key="key" :drop="drop"  />
			</div>
		</div> 
		<div v-if="activeDropsExist" class="col q-mt-none" :class="indigo">
			<live-drops-board/>
		</div> 
	</q-page>
</template> 

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { Colors } from 'src/utils/Constants.js' 

	export default {
		computed: {
			...mapGetters('drop', ['dropsExist', 'getDrops', 'activeDropsExist']),
			...mapGetters('color', Colors),
      },
      components: {
			'live-drops-board' : require('components/Drop/LiveDropsBoard.vue').default,
			'drop' : require('components/Drop/Drop.vue').default
      },
	}
</script>

<style lang="scss">
</style>
