<template>
	<q-page class="q-pa-md">
      <div class="q-mt-sm">
         <span class="text-h6">{{ artist.name }}</span>
         <q-checkbox v-model="showHoldSold" label="Show Hold/Sold" class="float-right" dense />
		</div>
      
		<div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in items" :key="key" :item="item" :displayType="thumb"/>
      </div>
	</q-page>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { ItemDisplayType } from 'src/utils/Constants.js'
   
	export default {
		data() {
			return {				
            tagId: "",
            showHoldSold: true
        }
		},
	  	computed: {
			...mapGetters('tag', ['getTag']),
         ...mapGetters('item', ['getActiveItemsWithTag']),
         artist() { return this.getTag(this.tagId) },
         items () { return this.getActiveItemsWithTag(this.artist) },
         thumb() { return ItemDisplayType.THUMB },
      },
		methods: {
			navBack() { this.$router.go(-1) },
      },
      created() {
			this.tagId = this.$route.params.id
      },
		components: {
	  	   'item' : require('components/Item/Item.vue').default,
      },
      watch: {
         $route() {
            console.log("watch", this.$route.params.id)
            this.tagId = this.$route.params.id
         }
      },
	}

</script>

<style>
</style>