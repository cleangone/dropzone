<template>
	<q-card class="form-card">
      <q-card-section>
         <div class="text-h6 heading">Add Multiple Items</div>
      </q-card-section>
      <q-card-section>
         <q-firebase-uploader path="drops/" multiple @upload="uploadCompleted" /> 
      </q-card-section>
      <q-card-actions align="right">
         <q-btn label="Cancel" color="grey" v-close-popup />
      </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import QFirebaseUploader from 'components/QFirebaseUploader.js'
   import { SaleType, ItemStatus } from 'src/utils/Constants.js';
   
	export default {
      props: ['dropId'],
		methods: {
			...mapActions('item', ['createItem']),
			uploadCompleted(emit) {
            let itemName = emit.name.includes(".") ? emit.name.substring(0, emit.name.indexOf(".")) : emit.name
            this.createItem({
               name: itemName,
               dropId: this.dropId,
               status: ItemStatus.AVAILABLE,
               imageUrl: emit.url,
               isHorizontal: false,
					saleType: SaleType.DEFAULT
            })
         }
      },
		components: {
    		QFirebaseUploader
		}
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
	}
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
	.form-card .q-img__image { background-size: cover !important; }
	.form-card .q-rating__icon { opacity: 0.2; }
	.form-card .q-rating__icon--active { opacity: 1; }
</style>