<template >
	<router-link :to="{ name: itemPageRoute, params: { itemId: item.id } }">
		<q-img :src="item.imageUrl" :style="imageWidth" class="image-centered" basic contain/>
	</router-link>
</template>

<script>
	import { Route } from 'src/utils/Constants.js';
	
	export default {
		props: ['item', 'hImageWidth', 'vImageWidth'], 
		computed: {
			itemPageRoute() { return Route.ITEM },
			// cellHeight() { return this.height ? "height: " + this.height : ""},			
			imageWidth() { return ("width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth)) },			
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



