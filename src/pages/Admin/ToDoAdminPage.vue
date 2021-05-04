<template>
  <q-page>
     <div class="text-h5 q-mt-md q-ml-sm">ToDo</div>
      <!-- page may contain multiple sections with diff types of todo's -->
		<purchase-req-todo class="q-pa-sm" :class="orange"/>
   </q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { Colors } from 'src/utils/Constants'
   
	export default {
		computed: {
         ...mapGetters('color', Colors),
      },
		components: {
         'purchase-req-todo' : require('components/Admin/PurchaseReqToDo.vue').default,
      },
   }

</script>