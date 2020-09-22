<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ updateType }} {{ tagToSubmit.category }}</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm">
	      <q-input v-model="tagToSubmit.name" label="Name" ref="name" class="col" filled
	      	:rules="[ val => !!val || '* Required',
	          	val => val.length < 21 || 'Please use maximum 20 characters' ]" />
    	</div>
		<div class="row q-mb-sm q-gutter-md">
		   <q-input label="Sort Name" v-model="tagToSubmit.sortName" class="col" filled/>
		</div>	
      <div class="row q-mb-sm q-gutter-md">
		   <q-checkbox label="Show Link" v-model="tagToSubmit.showLink"  class="col" dense />
		</div>	
	</q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import { DropMgr, DropStatus } from 'src/managers/DropMgr.js';
   
   const UPDATE_ADD = "Add"
   const UPDATE_EDIT = "Edit"

	export default {
		props: ['tag', 'category'],
		data() {
			return {
            updateType: "",
            tagToSubmit: {
					name: "",
               sortName: "",
               showLink: false,
               category: "",
            },
			}
		},
		computed: {
      },
		methods: {
			...mapActions('tag', ['createTag', 'setTag']),
			submitForm() {
				this.$refs.name.validate()
				if (!this.$refs.name.hasError) {
               if (this.updateType == UPDATE_ADD) { this.createTag(this.tagToSubmit) }
               else { this.setTag(this.tagToSubmit) }
            
               this.$emit('close')
				}
			},
		},
		
		mounted() {
         // param update propagating as modal being popped up
			setTimeout(() => { 
            if (this.tag) { 
               this.updateType = UPDATE_EDIT   
               this.tagToSubmit = Object.assign({}, this.tag) 
            }
            else { 
               this.updateType = UPDATE_ADD
               this.tagToSubmit.category = this.category
            }
         }, 100)  
		}
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
</style>