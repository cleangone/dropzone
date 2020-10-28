<template>
	<q-card class="form-card">
      <q-card-section class="q-pb-none" :class="red">
      <div class="text-h6 heading">{{ isEdit ? "Edit" : "Add" }} Category</div>
      </q-card-section>
      <q-card-section :class="pink">
         <div class="row q-mb-sm q-gutter-sm" :class="indigo">
            <q-input v-model="categoryToSubmit.name" label="Name" class="col" filled />
         </div>
         <div class="row q-mb-sm q-gutter-sm" :class="orange">
            <q-input v-model="categoryToSubmit.shortName" label="Short Name" class="col" filled />
            <q-input v-model="categoryToSubmit.sortName"  label="Sort Name" class="col" filled />
         </div>
         <div class="row q-mb-sm q-gutter-sm" :class="orange">
            <q-input label="Video" v-model="categoryToSubmit.video" class="col" filled/>
         </div>
         <div class="row q-mb-sm q-gutter-sm" :class="orange">
            <q-select label="Status" v-model="categoryToSubmit.status" :options="statusOptions" class="col" filled />
            <div class="col"/>
         </div>
         <div class="row q-mb-sm q-gutter-sm" :class="purple" >
            <description-edit :container="categoryToSubmit" class="col" />
         </div>	
   </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="save" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
	import { CategoryStatus } from 'src/managers/CategoryMgr'
   import { UI, Colors } from 'src/utils/Constants'
   
	export default {
		props: ['category'],
		data() {
			return {
				categoryToSubmit: {
					name: '',
               status: CategoryStatus.PRIVATE,
               shortName: '',
				   sortName: '',
            },
            statusOptions: [ CategoryStatus.PRIVATE, CategoryStatus.PUBLIC ],            
			}
		},
		computed: {
         ...mapGetters('color', Colors),
         isEdit() { return this.category != null },
      },
		methods: {
			...mapActions('category', ['createCategory', 'updateCategory']),
			save() {
            if (this.isEdit) { this.updateCategory(this.categoryToSubmit) }
            else { this.createCategory(this.categoryToSubmit) }

            this.$emit(UI.CLOSE)
			},
		},
		components: {
    		'description-edit' : require('components/Admin/DescriptionEdit.vue').default,
      },
		mounted() {
			if (this.isEdit) {
            // param update propagating as modal is being popped up
			   setTimeout(() => { this.categoryToSubmit = Object.assign({}, this.category) }, 100)  
         }
		}
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>