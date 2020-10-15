<template>
   <q-item clickable :to="path" exact>
      <q-item-section v-if="iconName" avatar><q-icon :name="iconName"/></q-item-section>
      <q-item-section>
         <q-item-label :class="itemClass">
            {{label}} <q-btn v-if="hasVideo" icon="videocam" @click="showVideo = true" @click.stop size="sm" flat dense color="primary" />
         </q-item-label>
      </q-item-section>
      <q-dialog v-model="showVideo">	
			<tag-video :tag="tag" @close="showVideo=false" />
		</q-dialog>
   </q-item>
</template>

<script>
   export default { 
      props: ['path', 'label', 'iconName', 'bold', 'tag'],
      data() {
	  		return {
				showVideo: false,
			}
		},
      computed: {
         itemClass() { return this.bold ? "text-bold" : "" },
         hasVideo() { return this.tag && this.tag.video },
      },
      components: {
			'tag-video' : require('components/Tag/TagVideo.vue').default
      },
   }
</script>
