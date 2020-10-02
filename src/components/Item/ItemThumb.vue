<template >
	<q-img :src="thumbUrl" v-on:click="navToItemPage" :style="imageWH" class="image-centered" basic contain>
      <item-liked :item="item" class="absolute-bottom-right"/>   
   </q-img>
</template>  

<script>
   import { mapGetters, mapActions } from 'vuex'
	import { Route } from 'src/utils/Constants.js';
	
	export default {
		props: ['item', 'hImageWidth', 'vImageWidth', 'imageMaxHeight'], 
		computed: {
         ...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
         user() { return this.getUser(this.userId)},
			itemPageRoute() { return Route.ITEM },
			// cellHeight() { return this.height ? "height: " + this.height : ""},			
         imageW() { return "width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         imageH() { return "height: " + this.imageHeight },	
         imageWH() { return "width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth) +"; max-height: " + this.imageMaxHeight },	
         thumbUrl() { return this.item.thumbUrl },	
      },
      methods: {
         navToItemPage() { this.$router.push("/item/" + this.item.id) },
      },
      components: {
			'item-liked' : require('components/Item/ItemLiked.vue').default,
      }
	}
</script>

<style>
	.image-centered {
		display: block; 
		margin-left: auto; 
		margin-right: auto; 
	}
</style>



