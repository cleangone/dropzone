import { dollars } from 'src/utils/Utils'

export const InvoiceStatus = {
   CREATED: 'Created',
   UPDATED: 'Updated',
   SENT:    'Sent',
   PAID:    'Paid',
   SHIPPED: 'Shipped',
}

const InvoiceCarrier = {
   USPS_PRIORITY: 'USPS Priority',
   FEDEX:         'FedEx',
}

export class InvoiceMgr {
   static isSent(invoice)    { return invoice.status == InvoiceStatus.SENT }
   static isShipped(invoice) { return invoice.status == InvoiceStatus.SHIPPED }
   
   static getCarriers() { return [ InvoiceCarrier.USPS_PRIORITY, InvoiceCarrier.FEDEX ] }
   static isUspsPriority(invoice) { return invoice.carrier == InvoiceCarrier.USPS_PRIORITY }
   
   // todo - tracking has a lot of hardcoding
   static hasTrackingLink(invoice) { 
      return (invoice.tracking && invoice.tracking.length > 5 && InvoiceMgr.isUspsPriority(invoice)) 
   }
   static getTrackingLink(invoice) {  
      if (InvoiceMgr.isUspsPriority(invoice)) { 
         return "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + invoice.tracking }
      else { return ""}
   }         

   static getDetails(invoice) { 
      let details = []
      for (var item of invoice.items) {
         details.push({ name: item.name, price: dollars(item.price) })
      }

      details.push({ name: "Shipping", price: dollars(invoice.shippingCharge) })
      if (invoice.priceAdjustment) { details.push({ name: "Adjustment", price: "(" + dollars(invoice.priceAdjustment) + ")" }) }

      return details 
   }
            
   static getHtml(invoice) { 
      console.log("getHtml", invoice)
      return "<h2>Coming Soon</h2>"
   }

   static setUpdated(invoice) { invoice.status = InvoiceStatus.UPDATED }
}
