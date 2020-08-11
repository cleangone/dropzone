<template>
	<router-link :to="{ name: itemPage, params: { itemId: dropItemId } }">
		<q-img :src="dropItem.imageUrl" :style="imageWidth" basic contain/>
	</router-link>
</template>

<script>
	import { Page } from '../../constants/Constants.js';
	
	export default {
		props: ['dropItemId', 'dropItem', 'hImageWidth', 'vImageWidth'], 
		computed: {
			itemPage() { return Page.ITEM },
			cellHeight() { return this.height ? "height: " + this.height : ""},			
			imageWidth() { return ("width: " + (this.dropItem.isHorizontal ? this.hImageWidth : this.vImageWidth)) },			
		}
	}
</script>



