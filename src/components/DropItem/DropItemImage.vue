<template>
	<div :style="cellHeight" class="bg-white">
		<div @click="showImageModal=true" >
			<q-img :src="dropItem.imageUrl" :style="imageWidth"/>	
		</div>
		<q-dialog v-model="showImageModal">
			<modal-image :title="dropItem.name" :imageUrl="dropItem.imageUrl" @close="showImageModal=false" />
		</q-dialog>
  	</div>
</template>

<script>
	export default {
		props: ['dropItem', 'height', 'hImageWidth', 'vImageWidth'], 
		data() {
			return {
				showImageModal: false
			} 
		},
		computed: {
			cellHeight() { return this.height ? "height: " + this.height : ""},			
			imageWidth() { return ("width: " + (this.dropItem.isHorizontal ? this.hImageWidth : this.vImageWidth)) },			
		},
		methods: {	
		},
		components: {
			'modal-image' : require('components/DropItem/ModalImage.vue').default,
		}
	}
</script>

<style>
</style>


