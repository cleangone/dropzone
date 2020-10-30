<template>
   <q-btn-toggle v-model="modelContainer.model" :options="options" style="height: 25px" size="sm"
      toggle-color="blue-8" color="grey-1"  text-color="blue-9" dense unelevated no-caps @input="toggled()"/>
</template>

<script>
   import { SessionMgr } from 'src/managers/SessionMgr'
   
   export default {
      props: ['modelContainer', 'options', 'sessionKey'],
      methods: {
         toggled() { if (this.sessionKey) { SessionMgr.set(this.sessionKey, this.modelContainer) }
         }
		}
   }
</script>
