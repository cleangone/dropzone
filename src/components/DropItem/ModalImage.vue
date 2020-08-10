<template>
	<q-card @click="closePopup" class="window-height window-width bg-grey-8">
      <q-card-section>
			<div class="text-h6 heading text-center text-white">{{ title }}</div>
		</q-card-section>
		<q-card-section>
			<q-img :src="imageUrl" style="width: 100%" />
		</q-card-section>
  </q-card>
</template>

<script>
	export default {
		props: ['title', 'imageUrl'],
		methods: {
			closePopup() { this.$emit('close') }
		}
	}
</script>
