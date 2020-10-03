<template>
	<div :style="'width: ' + width + 'px'">
      <q-zoom background-color="black" >
         <img :src="src" class="zoom-image"/>
      </q-zoom>
   </div>
</template>

<script>
	export default {
		props: ['src', 'width'],
      // computed: {
         
		// 	widthie() { 
      //       console.log("ItemImageFull.width", "width: " + this.width + "px")
      //       return "width: " + this.width + "px" }
      // }   
   }
</script>

<style lang="stylus">
   .zoom-image
      width auto
      height auto
      max-width 100%
      max-height 100%
      margin auto
</style>