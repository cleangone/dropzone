<template>
   <q-img :src="thumbUrl" v-on:click="navToItemPage" :style="imageWH" class="image-centered" basic contain
         @mouseenter="imageMouseover=true" @mouseleave="imageMouseover=false">
      <item-liked :item="item" class="absolute-bottom-right"/>   
   </q-img>
</template>  

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SessionMgr } from 'src/managers/SessionMgr'	
	
	export default {
      props: ['item', 'image', 'hImageWidth', 'vImageWidth', 'imageMaxHeight', 'tagId'], 
      data() {
	  		return {
            imageMouseover: false,
			}
		},
		computed: {
         ...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
         user() { return this.getUser(this.userId)},
			// cellHeight() { return this.height ? "height: " + this.height : ""},			
         imageW() { return "width: " + (this.image.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         // imageH() { return "height: " + this.imageHeight },	
         imageWH() { return this.imageMouseover ? 
            "width: " + (this.image.isHorizontal ? "400px" : "300px") :
            "width: " + (this.image.isHorizontal ? this.hImageWidth : this.vImageWidth) + "; max-height: " + this.imageMaxHeight
         },	
         thumbUrl() { return this.imageMouseover ? this.image.url : this.image.thumbUrl },	
      },
      methods: {
         navToItemPage() { 
            if (SessionMgr.isCategory(SessionMgr.getDisplayItemsDesc())) { SessionMgr.setCategoryTag(this.tagId) }
            this.$router.push("/item/" + this.item.id) 
         },
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



