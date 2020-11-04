<template>
   <div>
   <q-img :src="image.thumbUrl" v-on:click="navToItemPage" :style="thumbWH" class="image-centered cursor-pointer" 
      @mouseleave="imageMouseleave()" basic contain>
      <q-icon name="mdi-arrow-expand" size="md" color="blue-9" class="absolute-top-left" 
         @mouseenter="mouseenter($event)" @mouseleave="iconMouseleave()" /> 
      <item-liked :item="item" class="absolute-bottom-right"/>   
   </q-img>
   <q-img v-if="mouseover" :src="image.url" :placeholder-src="image.thumbUrl" 
      class="z-top image-centered image-popup" :style="popupStyle" basic />
   </div>
</template>  

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SessionMgr } from 'src/managers/SessionMgr'	
	
	export default {
      props: ['item', 'image', 'hImageWidth', 'vImageWidth', 'imageMaxHeight', 'mouseContainer', 'tagId'], 
      data() {
	  		return {
            mouseleaveTime: 0,
            mouseover: false,
            mouse: { x: 0, y: 0},
            page:  { w: 0, h: 0 }
			}
		},
		computed: {
         thumbWidth() { return parseInt(this.image.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         thumbWH() { return "width: " + this.thumbWidth + "px; max-height: " + this.imageMaxHeight + "px;"},	
         popupStyle() { 
            // console.log("popupStyle", this.mouse, this.page)
            const popupWidth = this.image.isHorizontal ? 450 : 300
            const xPos = this.mouse.x + 75 + popupWidth < this.page.w ? 
               this.mouse.x + 75 : this.mouse.x - 20 - popupWidth
            const yPos =  this.mouse.y + parseInt(this.hImageWidth) < this.page.h ? 
              this.mouse.y - 50 : this.page.h - parseInt(this.hImageWidth) - 100

            return  "width: " + popupWidth +  "px; left: " + xPos + "px; top: " + yPos + "px;"
         },
      },
      methods: {
         navToItemPage() { 
            if (SessionMgr.isCategory(SessionMgr.getDisplayItemsDesc())) { SessionMgr.setCategoryTag(this.tagId) }
            this.$router.push("/item/" + this.item.id) 
         },
         mouseenter(event) {
            console.log("mouseenter", event)
            this.mouse = { x: event.x, y: event.y }
            this.page  = { w: event.view.innerWidth, h: event.view.innerHeight }
            
            const mouseenterTime = Date.now()
            setTimeout(() => {  // debounce mouseover 
               if (mouseenterTime > this.mouseleaveTime ) { this.mouseover = true }
            }, 250)  
         },
         iconMouseleave() { this.mouseleaveTime = Date.now() },
         imageMouseleave() { this.mouseover = false }
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
   .image-popup {
      position: fixed;
		border: 5px solid; 
	}
</style>



