<template>
   <q-list bordered class="rounded-borders q-mt-sm">
      <q-expansion-item :label="title" expand-separator :default-opened="expanded" class="text-bold">
         <div class="row q-mt-sm q-gutter-sm">
            <item v-for="(item, key) in items" :key="key" :item="item" :artistCategoryId="categoryId" />
         </div>
      </q-expansion-item>
   </q-list>
</template>

<script>
   import { SessionMgr } from 'src/managers/SessionMgr'
   
	export default {
      props: ['title', 'categoryId', 'items', 'expanded'],
      created() {
         SessionMgr.setCategoryDisplayItems(this.categoryId, this.items)
      },
      components: {
	  	   'item' : require('components/Item/Item.vue').default,
      },
   }
</script>
