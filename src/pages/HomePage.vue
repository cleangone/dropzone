<template>
	<q-page class="q-pa-md justify-center q-gutter-md row" :class="pink">
		<div class="column" :class="red">
			<div v-if="dropsExist" class=" q-gutter-y-lg" :class="blue"> 
				<drop v-for="(drop, key) in getDrops" :key="key" :drop="drop"  />
			</div>
			<!-- <div v-else>
				<span class="absolute-center">
					<q-spinner color="primary" size="3em" :thickness="2" />
				</span>
			</div> -->
		</div> 
		<div v-if="liveDropsExist" class="col q-mt-none" :class="indigo">
			<live-drops-board/>
		</div> 
	</q-page>
</template> 

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { Colors } from 'src/utils/Constants.js' 

	export default {
		data() {
	  		return {
	  			showModal: false
	  		}
	  	},
	  	computed: {
			...mapGetters('drop', ['dropsExist', 'getDrops', 'liveDropsExist']),
			...mapGetters('item', ['itemsExist']),
			...mapGetters('color', Colors),
      },
      methods: {
         ...mapActions('drop', ['bindDrops']),
         ...mapActions('item', ['bindItems']),
      },
		components: {
			'live-drops-board' : require('components/Drop/LiveDropsBoard.vue').default,
			'drop' : require('components/Drop/Drop.vue').default
        },
      created() {
         this.bindDrops()
         this.bindItems()
         // if (!this.dropsExist) { this.bindDrops() } 
         // if (!this.itemsExist) { this.bindItems() } 
      }
	}
</script>

<style lang="scss">
</style>
