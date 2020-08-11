<template>
	<q-page class="q-pa-md b-pink">
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
		<div v-if="drop">
			<div class="row q-mt-sm text-h6">{{ drop.name }}</div>
			<div v-if="isPreDrop" class="row q-mt-sm" >
				<q-img :src="drop.imageUrl ? drop.imageUrl : 'statics/image-placeholder.png'" basic contain>
					<div class="absolute-bottom text-h6">Drops: {{ startDateText }}</div>
				</q-img>
			</div>
			<div v-else class="row q-mt-sm q-gutter-sm">
				<drop-item v-for="(dropItem, key) in drop.items" :key="key" :dropId="dropId" :drop="drop" :dropItemId="key" :dropItem="dropItem"/>
			</div>
		</div>
		<div v-else>Loading</div>
	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { DropStatus } from '../constants/Constants.js';
	import { getStartDateText } from '../components/Drop/drop-util';

	export default {
		data() {
			return {				
				dropId: 0,
				showModal: false,
        }
		},
		created() {
			this.dropId = this.$route.params.dropId
      },
	  	computed: {
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('drop', ['getDrop']),
			drop() { return this.getDrop(this.dropId)},
			isPreDrop() { return this.drop.status == DropStatus.PREDROP },
			startDateText() { return getStartDateText(this.drop) }
		},
		methods: {
			navBack() { this.$router.go(-1) },
		},
		components: {
	  		'drop-item' : require('components/DropItem/DropItem.vue').default,
	  		'modal-add-edit' : require('components/DropItem/ModalAddEdit.vue').default
	  	}
	}

</script>

<style>
	/* .card {
		min-height: 250px;
		max-width: 500px;
		min-width: 400px;
		transition: background 0.3s;
	}

	.card {
		min-height: 250px;
		max-width: 500px;
		min-width: 400px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	} */
	.q-img { max-height: 400px; 
	max-width: 500px;
	}
	/*
	.card .q-img__image { background-size: cover !important; }
	 */
</style>