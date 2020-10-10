<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">Quick Price - {{ item.name }}</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-mb-sm q-gutter-sm">
         <q-input v-model.number="item.startPrice" label="Price" type=number prefix="$" filled class="col" />
         <q-img style="height: 200px; width: 200px" :src="item.primaryImage.thumbUrl ? item.primaryImage.thumbUrl : 'statics/image-placeholder.png'" class="col q-ml-lg" contain />
      </div> 
	</q-card-section>
   <q-card-actions align="right">
      <q-btn @click="close"    label="Cancel"    color="grey" />
      <q-btn @click="nextItem" label="Skip Item" color="grey" />
      <q-btn @click="saveItem" label="Save Item" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr.js';
   import { UI } from 'src/utils/Constants.js';
   
   export default {
      props: ['items'],
		data() {
			return {
            itemsToUpdate: null,
            currItemIndex: 0,
			}
      },
      computed: {
         item() { 
            return this.itemsToUpdate ? 
               this.itemsToUpdate[this.currItemIndex] : 
               { name: "", startPrice: 0, primaryImage: {}  } 
         },
      },
      methods: {
			...mapActions('item', ['updateItem']),
			saveItem() {
            this.updateItem(this.item)
            this.nextItem()
         },
         nextItem() {    
            if (this.currItemIndex == this.items.length - 1) { this.close() }
            else { this.currItemIndex++ }
         },
		   close() { this.$emit(UI.CLOSE) },
      },
      mounted() {
         setTimeout(() => { this.itemsToUpdate = Object.assign({}, this.items) }, 100) 
      } 
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>