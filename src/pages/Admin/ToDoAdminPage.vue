<template>
  <q-page>
		<todo-items-admin :items="items"  class="full-width full-height" :class="orange"/>
  	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { Colors } from 'src/utils/Constants'
   
	export default {
		data() {
	  		return {
         }
		},
		computed: {
         ...mapGetters('item', ['getRequestedItems']),
         ...mapGetters('color', Colors),
 			items() { return this.getRequestedItems },
      },
		components: {
         'todo-items-admin' : require('components/Admin/ToDoItemsAdmin.vue').default,
      },
   }

</script>