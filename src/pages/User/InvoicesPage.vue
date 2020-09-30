<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Invoices" :data="invoices" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="id" :filter="tableDataFilter" :pagination.sync="pagination"
            no-data-label="No invoices"
				:dense="$q.screen.lt.md" class="q-mb-sm">
				<template v-slot:top-right>
					<q-space />					
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>            
            <template v-slot:header="props">
               <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
               </q-tr>
            </template>
            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                     <invoice-td :invoice="props.row" :col="col"/>
                  </q-td>
               </q-tr>
            </template>
         </q-table>
		</div>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { dollars } from 'src/utils/Utils'
   
	export default {
		data() {
	  	   return {
			   tableDataFilter: '',
            visibleColumns: ['name', 'total', 'status', 'tracking', 'sentDate'],
 				columns: [
               { name: 'name',     label: 'Name',      align: 'left',   field: 'name',        sortable: true },
					{ name: 'total',    label: 'Total',     align: 'right',  field: 'total',       sortable: true, format: val => dollars(val) },
					{ name: 'status',   label: 'Status',    align: 'center', field: 'status',      sortable: true },
               { name: 'tracking', label: 'Tracking',  align: 'center', field: 'tracking' },
               { name: 'sentDate', label: 'Sent Date', align: 'left',   field: 'sentDate',     sortable: true },
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('invoice', ['getUserInvoices']),
         invoices() { 
            try { return this.getUserInvoices(this.userId) } 
            catch (error)
            {
               console.log("Invoices ERROR", error)
               this.createError({ 
                  title: "InvoicesPage.invoices() > getUserInvoices", 
                  description: error.message })
               return []
            }
         }
      },
      methods: {
         ...mapActions('invoice', ['bindInvoices']),
         ...mapActions('error', ['createError'])
      },
		components: {
         'invoice-td' : require('components/Invoice/InvoiceTd.vue').default,
      }
	}
</script>