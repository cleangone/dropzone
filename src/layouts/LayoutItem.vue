<template>
   <q-item clickable :to="path" exact :dense="dense">
      <q-item-section v-if="iconName || avatarImage" avatar class="q-pa-none" :class="orange">
         <q-icon v-if="iconName" :name="iconName"/>
         <q-avatar v-else square rounded :class="blue"><img :src="avatarImage"></q-avatar>
      </q-item-section>
      <q-item-section :class="yellow">
         <q-item-label v-if="splitLabel" :class="itemClass">{{ topLabel }}<br>{{ botLabel }}</q-item-label>
         <q-item-label v-else :class="itemClass">{{ label }}</q-item-label>
      </q-item-section>
   </q-item>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { Colors } from 'src/utils/Constants'
   
   export default { 
      props: ['path', 'label', 'iconName', 'avatarImage', 'bold', 'primary', 'topLabel', 'botLabel'],
      computed: {
         ...mapGetters('color', Colors),
         dense() { return this.primary == null ? true : false },
         splitLabel() { 
            console.log(this.label, this.topLabel, this.botLabel)
            return this.topLabel != null || this.botLabel != null },
         itemClass() { return this.bold ? "text-bold" : "" },
      },
   }
</script>
