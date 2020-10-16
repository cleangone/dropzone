<template>
   <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Artists" :data="artistTags" 
				:columns="columns" :visible-columns="visibleColumns" row-key="id" :filter="tableDataFilter" 
            no-data-label="No Artists" :pagination.sync="pagination"
				:dense="$q.screen.lt.md" class="q-mb-sm"> -->
				<template v-slot:top-right>
				   <q-space />
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <q-td slot="body-cell-video" slot-scope="props" :props="props"> 
	            <q-btn v-if="props.row.video" icon="videocam" @click="showVideo(props.row)" @click.stop size="sm" flat dense color="primary" />
            </q-td>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props"> 
	            <q-btn icon="edit"   @click="edit(props.row.id)"        @click.stop size="sm" flat dense color="primary" />
    				<q-btn icon="delete" @click="promptToDelete(props.row)" @click.stop size="sm" flat dense color="red" />
  				</q-td> 
			</q-table>
		 	<q-btn @click="showAddModal=true" icon="add" unelevated color="primary"/>
	   </div>

		<q-dialog v-model="showAddModal">	
			<tag-add-edit :category="category" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<tag-add-edit :tag="tagToEdit" showLink="true" showVideo="true" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showVideoModal">	
			<tag-video :tag="videoTag" @close="showVideoModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { TagCategory } from 'src/managers/TagMgr.js'
   
	export default {
		data() {
	  		return {
				showAddModal: false,
				showEditModal: false,
				showVideoModal: false,
				videoTag: false,
				tagIdToEdit: '',
				tableDataFilter: '',
				visibleColumns: [ 'name', 'sort', 'link', 'video', 'actions'],
 				columns: [
               { name: 'name',    label: 'Name',      align: 'left',   field: 'name',     sortable: true },
				 	{ name: 'sort',    label: 'Sort Name', align: 'left',   field: 'sortName', sortable: true },
					{ name: 'link',    label: 'Show Link', align: 'center', field: 'showLink', sortable: true, format: val => val ? "Yes" : "" },
					{ name: 'video',   label: 'Video',     align: 'center', field: 'video' },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
         ...mapGetters('tag', ['tagsExist', 'getTags', 'getTag']),
         category() { return TagCategory.ARTIST },
			artistTags() { 
            let artistTags = []
            for (var tag of this.getTags(this.category) ) {
               artistTags.push(Object.assign({}, tag) ) 
            }
            return artistTags
         },
			tagToEdit() { return this.getTag(this.tagIdToEdit) },
		},
		methods: {
         ...mapActions('tag', ['deleteTag']),
      	edit(tagId) {
            this.tagIdToEdit = tagId
				this.showEditModal = true
         },
         showVideo(tag) {
            this.videoTag = tag
				this.showVideoModal = true
         },
			promptToDelete(tag) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + tag.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteTag(tag.id) })
			}
		},
		components: {
			'tag-add-edit' : require('components/Tag/TagAddEdit.vue').default,
      	'tag-video'    : require('components/Tag/TagVideo.vue').default
      }  
   }
</script>