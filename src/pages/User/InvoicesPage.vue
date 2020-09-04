<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Invoices" :data="invoices" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="id" :filter="tableDataFilter"  :pagination.sync="pagination"
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
                  <q-th auto-width /> <!-- expand button -->
                  <q-th auto-width /> <!-- expand detail -->
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
               </q-tr>
            </template>

            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td auto-width>
                     <q-btn size="xs" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td/>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
               </q-tr>
               
               <template v-if="props.expand">
                  <q-tr v-for="detail in getInvoiceDetails(props.row.id)" :key="detail.name" :props="props">
                     <q-td />
                     <q-td class="text-left bg-grey-2">{{ detail.name }}</q-td>
                     <q-td class="text-right bg-grey-2">{{ detail.price }}</q-td>
                  </q-tr>
               </template>
            </template>
         </q-table>
		</div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		data() {
	  	   return {
			   tableDataFilter: '',
            visibleColumns: ['total', 'status', 'sentDate'],
 				columns: [
               { name: 'id', field: 'id' },                 
               { name: 'total',    label: 'Total',  align: 'right',  field: 'total',    sortable: true, format: val => val ? dollars(val) : '' },
					{ name: 'status',   label: 'Status', align: 'center', field: 'status',   sortable: true },
               { name: 'sentDate', label: 'Date',   align: 'left',   field: 'sentDate', sortable: true, format: val => val ? formatDateTime(val) : '' },
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('invoice', ['invoicesExist', 'getUserInvoices', 'getInvoice']),
         invoices() { return this.getUserInvoices(this.userId) },
      },
		methods: {
         ...mapActions('invoice', ['bindInvoices', 'deleteInvoice']),
         isDataCol(colName) { return (colName !== 'expand' && colName !== 'actions') },
         getInvoiceDetails(invoiceId) { 
            let details = []
            let invoice = this.getInvoice(invoiceId)
            for (var item of invoice.items) {
               details.push({ name: item.name, price: dollars(item.price) })
            }

            details.push({ name: "Shipping", price: dollars(invoice.shippingCharge) })
            if (invoice.priceAdjustment) { details.push({ name: "Adjustment", price: "(" + dollars(invoice.priceAdjustment) + ")" }) }

            return details 
         },
		},
      created() {
         console.log("InvoicesAdminPage")
         if (!this.invoicesExist) { this.bindInvoices() }
      }
	}

   function dollars(number) {
      return "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }

   function formatDateTime(createdDate) {
      let datetime = new Date(createdDate)
      return date.formatDate(datetime, 'YYYY-MM-DD HH:mm')   
   }
</script>