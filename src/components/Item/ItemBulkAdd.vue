<template>
	<q-card class="form-card">
      <q-card-section>
         <div class="text-h6 heading">Add Multiple Items</div>
         <li v-for="(item, key) in itemsToAdd" :key="key">{{item.imageBaseName}}</li>			
      </q-card-section>
      <q-card-section>
         <q-firebase-uploader path="drops/" multiple @upload="uploadCompleted" /> 
      </q-card-section>
      <q-card-actions align="right">
         <q-btn @click="cancel" label="Cancel" color="grey"/>
         <q-btn @click="save"   label="Save"   color="primary"/>
      </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import QFirebaseUploader from 'components/QFirebaseUploader.js'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr.js'
   import { StorageMgr } from 'src/managers/StorageMgr.js'
	import { SaleType } from 'src/utils/Constants.js'
   
	export default {
      props: ['dropId'],
      data() {
         return {
			   itemsToAdd: []
         }
      },
		methods: {
			...mapActions('item', ['setItem']),
			uploadCompleted(emit) {
            const itemName = emit.name.includes(".") ? emit.name.substring(0, emit.name.indexOf(".")) : emit.name
            const item = {
               name: itemName,
               sortName: itemName,
               dropId: this.dropId,
               status: ItemStatus.SETUP,
               imageUrl: emit.url,
               imageBaseName: emit.name,
               isHorizontal: false,
					saleType: SaleType.DEFAULT
            }

            ItemMgr.setFilePaths(item)
            this.itemsToAdd.push(item)
            this.itemsToAdd.sort((a, b) => (a.imageBaseName > b.imageBaseName) ? 1 : -1) 
         },
         save() {
            for (var item of this.itemsToAdd) { this.setItem(item) }
            this.$emit('close')
         },
         cancel() {
            StorageMgr.deleteItemFiles(this.itemsToAdd) 
            this.$emit('close')
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