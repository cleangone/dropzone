<template>
	<q-card class="form-card">
      <q-card-section>
         <div v-html="html" />
      </q-card-section>
      <q-card-actions align="right">
         <q-btn label="Cancel" color="grey" v-close-popup />
      </q-card-actions>
  </q-card>
</template>

<script>
   import { mapGetters } from 'vuex'
   
	export default {
		props: ['invoice'],
		computed: {	
         html() { return this.invoice.html },
      }   
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>