<template>
   <q-img :src="thumbUrl" v-on:click="navToItemPage" :style="imageWH" class="image-centered cursor-pointer" basic contain>
      <q-icon name="mdi-arrow-expand" size="md" color="blue-9" class="absolute-top-left" 
         @mouseenter="mouseenter()" @mouseleave="mouseleave()" /> 
      <item-liked :item="item" class="absolute-bottom-right"/>   
   </q-img>
</template>  

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SessionMgr } from 'src/managers/SessionMgr'	
	
	export default {
      props: ['item', 'image', 'hImageWidth', 'vImageWidth', 'imageMaxHeight', 'mouseContainer', 'tagId'], 
      data() {
	  		return {
            mouseleaveTime: 0,
			}
		},
		computed: {
         ...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
         user() { return this.getUser(this.userId)},		
         imageWH() { return this.mouseContainer && this.mouseContainer.mouseover ? 
            "width: " + (this.image.isHorizontal ? "450px" : "300px") :
            "width: " + (this.image.isHorizontal ? this.hImageWidth : this.vImageWidth) + "; max-height: " + this.imageMaxHeight
         },	
         thumbUrl() { return this.mouseContainer && this.mouseContainer.mouseover ? this.image.url : this.image.thumbUrl },	
      },
      methods: {
         navToItemPage() { 
            if (SessionMgr.isCategory(SessionMgr.getDisplayItemsDesc())) { SessionMgr.setCategoryTag(this.tagId) }
            this.$router.push("/item/" + this.item.id) 
         },
         mouseenter() {
            // todo - the last item in each row does nt have enough space to expand
            // could it expand left and over it's neighbor?  Could others expand over their neighbors?
            // would be nice to at least not have the expand icon
            if (this.mouseContainer) {
               const mouseenterTime = Date.now()
               setTimeout(() => {  // debounce mouseover 
                  if (mouseenterTime > this.mouseleaveTime ) { this.mouseContainer.mouseover = true }
               }, 250)  
            }
         },
         mouseleave() { if (this.mouseContainer) { this.mouseleaveTime = Date.now() } },
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



