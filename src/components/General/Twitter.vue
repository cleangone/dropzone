<template>
   <q-scroll-area style="width: 400px; height: 500px;">
      <Timeline :id="twitterId" sourceType="profile" :options="{ tweetLimit: '5' }"/>
   </q-scroll-area> 
</template>

<script>
   import { Timeline } from 'vue-tweet-embed'
   
	export default {
      props: ['twitterId'],
      components: {
         Timeline,
      },
   }
</script>
