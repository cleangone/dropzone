<template>
   <q-page>
      <div class="text-h5 q-mt-md q-ml-sm">ToDo</div>
      <div v-if="requestedItemsExist || holdItemsExist">
         <todo-purchase-req v-if="requestedItemsExist" class="q-pa-sm" :class="orange"/>
         <todo-hold v-if="holdItemsExist" class="q-pa-sm" :class="orange"/>
      </div>
      <div v-else class="q-mt-md q-ml-sm">No ToDo items</div>
   </q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { Colors } from 'src/utils/Constants'
   
	export default {
		computed: {
         ...mapGetters('item', ['requestedItemsExist', 'holdItemsExist']),
         ...mapGetters('color', Colors),
      },
		components: {
         'todo-purchase-req' : require('components/Admin/ToDoPurchaseReq.vue').default,
         'todo-hold' : require('components/Admin/ToDoHold.vue').default,
      },
   }

</script>