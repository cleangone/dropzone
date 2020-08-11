<template>
	<q-card class="card">
		<router-link :to="{ name: dropPage, params: { dropId: dropId } }">
			<q-img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'" basic contain>
				<div class="absolute-bottom text-h6">{{ drop.name }}</div>
				
			</q-img>
		</router-link>
		<q-card-section class="q-px-xs q-py-md" :class="purple">
			<div v-if="isPreDrop">
				<span class="text-bold">Drops:</span>
				<span> {{ startDateText }}</span>
			</div>
			<div v-else class="text-green text-bold">Drop is LIVE</div>
		</q-card-section>		
		<q-card-actions v-if="userIsAdmin" class="absolute-bottom q-pa-none">
			<q-btn @click="showEditModal = true" icon="edit" color="blue" flat small class="col" align="right"/>
		</q-card-actions>
		<q-dialog v-model="showEditModal">
			<modal-add-edit type="edit" :id="dropId" :drop ="drop" @close="showEditModal = false" />
		</q-dialog>
  	</q-card> 
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { Page, DropStatus } from '../../constants/Constants.js';
	import { getStartDateText } from './drop-util';

	export default {
		props: ['dropId', 'drop'],
		data() {
			return {
				showEditModal: false
			}
		},
		computed: {
			...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('user', ['isAdmin']),
			...mapGetters('color', ['purple']),
			userIsAdmin() { return this.isAdmin(this.userId) },
			isPreDrop() { return this.drop.status == DropStatus.PREDROP },
			dropPage() { return Page.DROP },
			startDateText() { return getStartDateText(this.drop) },
    	},
		components: {
			'modal-add-edit' : require('components/Drop/ModalAddEdit.vue').default
		}
	}
</script>

<style>
	.card {
		width: 400px;
		min-height: 250px;
		max-width: 500px;
		min-width: 200px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	}
	.card .q-img { max-height: 180px; }
	.card .q-img__image { background-size: cover !important; }
	
</style>