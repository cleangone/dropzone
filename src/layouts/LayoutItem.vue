<template>
   <q-item clickable :to="path" exact>
      <q-item-section v-if="iconName" avatar><q-icon :name="iconName"/></q-item-section>
      <q-item-section>
         <q-item-label v-if="bold" class="text-bold">{{label}}</q-item-label>
         <q-item-label v-else>{{label}}</q-item-label>
      </q-item-section>
   </q-item>
</template>

<script>
   export default { 
      props: ['path', 'label', 'iconName', 'bold']
   }
</script>
