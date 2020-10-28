<template>
   <q-item clickable :to="path" exact>
      <q-item-section v-if="iconName" avatar><q-icon :name="iconName"/></q-item-section>
      <q-item-section>
         <q-item-label :class="itemClass">{{ label }}</q-item-label>
      </q-item-section>
   </q-item>
</template>

<script>
   export default { 
      props: ['path', 'label', 'iconName', 'bold'],
      computed: {
         itemClass() { return this.bold ? "text-bold" : "" },
      },
   }
</script>
