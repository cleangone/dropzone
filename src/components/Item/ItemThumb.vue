<template >
	<q-img :src="item.imageUrl" v-on:click="navToItemPage" :style="imageWH" class="image-centered" basic contain>
      <q-btn v-if="isLiked"    icon="favorite"        class="absolute-bottom-right" @click.stop="unlike" flat small dense/>
		<q-btn v-if="isNotLiked" icon="favorite_border" class="absolute-bottom-right" @click.stop="like"   flat small dense/>
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
        
         
         isLiked()   { return this.loggedIn && this.user.likedItemIds && this.user.likedItemIds.includes(this.item.id) },		
		   isNotLiked() { return this.loggedIn && (!this.user.likedItemIds || !this.user.likedItemIds.includes(this.item.id)) },		
		},
      methods: {
         ...mapActions('user', ['setLikes']),
			navToItemPage() { this.$router.push("/item/" + this.item.id) },
         like() { 
            let likedItemIds = this.user.likedItemIds ? [...this.user.likedItemIds] : []
            likedItemIds.push(this.item.id) 
            this.setLikes({ id: this.user.id, likedItemIds: likedItemIds }) 
         },
			unlike() { 
            let likedItemIds = []
            this.user.likedItemIds.forEach(likedItemId => { if (likedItemId != this.item.id) { likedItemIds.push(likedItemId)} })
            this.setLikes({ id: this.user.id, likedItemIds: likedItemIds }) 
         },
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



