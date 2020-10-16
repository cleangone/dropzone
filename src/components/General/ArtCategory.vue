<template>
   <q-list bordered class="rounded-borders q-mt-sm">
      <q-expansion-item :label="title" expand-separator :default-opened="opened" class="text-bold">
         <div class="row q-mt-sm q-gutter-sm">
            <item v-for="(item, key) in items" :key="key" :item="item" :displayType="displayType"/>
         </div>
      </q-expansion-item>
   </q-list>
</template>

<script>
   import { ItemDisplayType } from 'src/utils/Constants'
   
	export default {
      props: ['title', 'items', 'opened'],
      computed: {
			displayType() { return ItemDisplayType.THUMB },
      },
      components: {
	  	   'item' : require('components/Item/Item.vue').default,
      },
   }
</script>
