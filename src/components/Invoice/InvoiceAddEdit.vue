<template>
	<q-card class="form-card">
      <q-card-section>
      <div class="text-h6 heading">{{ type }} Invoice</div>
    </q-card-section>
    <q-card-section>
      <div v-if="invoiceError" class="text-red text-bold q-mt-sm">{{ invoiceError }}</div>
      <div v-else class="q-mt-sm">
         <div v-html="userAddress" />
         <div class="q-mt-sm">
            <q-table :columns="columns" :data="invoiceToSubmit.items" :visible-columns="visibleColumns" row-key="name"
               :rows-per-page-options="[0]" pagination.sync="pagination" hide-header hide-bottom
               :dense="$q.screen.lt.md" class="q-mb-none">
                  
               <template v-slot:bottom-row >
                  <q-tr>
                     <q-td class="bg-grey-2">Sub-Total</q-td>
                     <q-td class="bg-grey-2" align=right>{{ subtotal }}</q-td>
                  </q-tr>
                  <q-tr>
                     <q-td> Shipping</q-td>
                     <q-td align=right>{{ shippingCharge }}</q-td>
                  </q-tr>
                  <q-tr v-if="invoiceToSubmit.priceAdjustment">
                     <q-td>Adjustment</q-td>
                     <q-td align=right>{{ priceAdjustment }}</q-td>
                  </q-tr>
                  <q-tr>
                     <q-td class="bg-grey-2"><span class="text-weight-bold">TOTAL</span></q-td>
                     <q-td class="bg-grey-2" align=right><span class="text-weight-bold">{{ total }}</span></q-td>
                  </q-tr>
               </template>
            </q-table>
         </div>
      </div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm q-gutter-sm">
         <q-input v-model.number="invoiceToSubmit.shippingCharge" label="Shipping" type=number prefix="$" filled class="col" />
			<q-input v-model.number="invoiceToSubmit.priceAdjustment" label="(Price Adjustment)" type=number prefix="$" filled class="col" />
		</div>
      <div class="row q-mb-none q-gutter-sm">
         <q-select v-if="isEdit" label="Status" v-model="invoiceToSubmit.status" :options="statusOptions" class="col" filled/>
         <div class="col"/>
		</div>
      <div v-if="isShipped" class="row q-mt-sm q-gutter-sm">
         <q-select v-model="invoiceToSubmit.carrier" label="Carrier" :options="carrierOptions" class="col" filled/>
         <q-input v-model="invoiceToSubmit.tracking" label="Tracking" filled class="col" />
		</div>
   </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn v-if="!invoiceError" @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr.js'
   import { InvoiceMgr, InvoiceStatus } from 'src/managers/InvoiceMgr.js'
   import { dollars } from 'src/utils/Utils'
   
	export default {
		props: ['type', 'items', 'invoice'],
		data() {
			return {
            user: null, 
            userAddress: null, 
            invoiceError: null,
				invoiceToSubmit: {
               userId: null,
               userName: '',
               items: [], // itemId, name, price
               status: InvoiceStatus.CREATED,
               subTotal: 0,
               shippingCharge: 25,
               priceAdjustment: 0,
            },
            statusOptions: [ InvoiceStatus.UPDATED, InvoiceStatus.PAID, InvoiceStatus.SHIPPED ],
            carrierOptions: InvoiceMgr.getCarriers(),
            visibleColumns: [ 'name', 'price'],
 				columns: [
        			{ name: 'name',  label: 'Item Name', align: 'left', field: 'name' },
				 	{ name: 'price', label: 'Price',     align: 'right', field: 'price', format: val => val ? dollars(val) : '' },
            ],
			}
		},
		computed: {	
         ...mapGetters('setting', ['getSetting']),
         ...mapGetters('user', ['getUser']),
         isEdit() { return this.type == "Update" },	
         isShipped() { return InvoiceMgr.isShipped(this.invoiceToSubmit) },	
         subtotal() { return dollars(this.invoiceToSubmit.subTotal) },
         shippingCharge() { return dollars(this.invoiceToSubmit.shippingCharge) },
         priceAdjustment() { return "(" + dollars(this.invoiceToSubmit.priceAdjustment) + ")" },
         total() { return dollars(this.invoiceToSubmit.subTotal + this.invoiceToSubmit.shippingCharge - this.invoiceToSubmit.priceAdjustment) }, 
    	},
		methods: {
			...mapActions('invoice', ['createInvoice', 'setInvoice']),
			...mapActions('item', ['updateItem']),
			submitForm() {
				this.persistInvoice()
            this.$emit('close')
			},
			persistInvoice() {
            // console.log("persistInvoice", this.invoiceToSubmit)
            InvoiceMgr.finalize(this.invoiceToSubmit, this.user, this.getSetting)
            if (this.isEdit) { this.setInvoice(this.invoiceToSubmit)}
            else { 
               this.createInvoice(this.invoiceToSubmit)
               for (var item of this.items) {
                  this.updateItem({ id: item.id, status: ItemStatus.INVOICED })
               }
            }
			}
      },
		created() {
         // slight delay because param update propagating as modal being popped up
         setTimeout(() => { 
            if (this.isEdit) {
               this.invoiceToSubmit = Object.assign({}, this.invoice) 
               // console.log("mounted: invoice", this.invoiceToSubmit)
            }
            else {
               // console.log("mounted", this.items)
               for (var item of this.items) {
                  if (!item.buyerId) { 
                     this.invoiceError = "Not all items have a buyer" 
                     return 
                  }

                  if (this.invoiceToSubmit.userId == null) { this.invoiceToSubmit.userId = item.buyerId }
                  if (item.buyerId != this.invoiceToSubmit.userId) { 
                     this.invoiceError = "Not all items have the same buyer"
                     return 
                  }
                  if (!ItemMgr.isHold(item) && !ItemMgr.isInvoice(item)) { 
                     this.invoiceError = "All item must be status Hold or Invoiced" 
                     return
                  }

                  this.invoiceToSubmit.items.push({ id: item.id, name: item.name, price: item.buyPrice })
                  this.invoiceToSubmit.subTotal += item.buyPrice
               }
            }
            this.user = this.getUser(this.invoiceToSubmit.userId)
            if (!this.isEdit) { InvoiceMgr.setUserFullName(this.invoiceToSubmit, this.user) }
            this.userAddress = InvoiceMgr.getUserHtml(this.invoiceToSubmit, this.user)
            // console.log("mounted: userAddress", this.userAddress)
         }, 100)  
		}
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>