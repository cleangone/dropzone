<template>
	<q-card class="form-card" @click="close()">
      <q-card-section>
         <div v-html="html" />
      </q-card-section>
  </q-card>
</template>

<script>
   import { mapGetters } from 'vuex'
   
	export default {
		props: ['invoice'],
		computed: {	
         html() { return this.invoice.html },
      },
      methods: {
			close() { this.$emit('close') }
      }   
   }

</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>