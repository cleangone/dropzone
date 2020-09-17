<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">{{ type }} Invoice</div>

      <div v-if="invoiceError" class="text-red text-bold q-mt-sm">{{ invoiceError }}</div>
      <div v-else class="q-mt-sm">
         <q-table
            :title="'Buyer: ' + invoiceToSubmit.userName"
            :columns="columns"
            :visible-columns="visibleColumns"
            :data="invoiceToSubmit.items"
            row-key="name"
            :dense="$q.screen.lt.md"
            class="q-mb-none">
               
            <template v-slot:bottom-row >
               <q-tr>
                  <q-td class="text-bold bg-grey-2">Sub-Total</q-td>
                  <q-td class="text-bold bg-grey-2">{{ subtotal }}</q-td>
               </q-tr>
               <q-tr>
                  <q-td class="text-bold bg-grey-2">Shipping</q-td>
                  <q-td class="text-bold bg-grey-2">{{ shippingCharge }}</q-td>
               </q-tr>
               <q-tr v-if="invoiceToSubmit.priceAdjustment">
                  <q-td class="text-bold bg-grey-2">Adjustment</q-td>
                  <q-td class="text-bold bg-grey-2">{{ priceAdjustment }}</q-td>
               </q-tr>
               <q-tr>
                  <q-td class="text-bold bg-grey-2">TOTAL</q-td>
                  <q-td class="text-bold bg-grey-2">{{ total }}</q-td>
               </q-tr>
            </template>
         </q-table>
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
            statusOptions: [ InvoiceStatus.CREATED, InvoiceStatus.UPDATED, InvoiceStatus.PAID, InvoiceStatus.SHIPPED ],
            carrierOptions: InvoiceMgr.getCarriers(),
            visibleColumns: [ 'name', 'price'],
 				columns: [
        			{ name: 'name',  label: 'Item Name', align: 'left', field: 'name' },
				 	{ name: 'price', label: 'Price',     align: 'left', field: 'price', format: val => val ? dollars(val) : '' },
            ],
			}
		},
		computed: {	
         ...mapGetters('user', ['getUser']),
         isEdit() { return this.type == "edit" },	
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
            if (this.isEdit) { this.setInvoice(this.invoiceToSubmit)}
            else { 
               this.createInvoice(this.invoiceToSubmit)
               for (var item of this.items) {
                  this.updateItem({ id: item.id, status: ItemStatus.INVOICED })
               }
            }
			}
      },
		mounted() {
         if (this.isEdit) {
            // slight delay because param update propagating as modal being popped up
            setTimeout(() => { this.invoiceToSubmit = Object.assign({}, this.invoice) }, 100)  
         }
         else {
            console.log("mounted", this.items)
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

            let user = this.getUser(this.invoiceToSubmit.userId)
            this.invoiceToSubmit.userName = (user.firstName || user.lastName) ?
               (user.firstName ? user.firstName : "") + (user.firstName && user.lastName ? " " : "") + (user.lastName ? user.lastName : "") :
               user.authEmailCopy
         }
		}
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
	}
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
	.form-card .q-img__image { background-size: cover !important; }
</style>