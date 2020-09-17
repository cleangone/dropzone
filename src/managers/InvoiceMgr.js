
export const InvoiceStatus = {
   CREATED: 'Created',
   UPDATED: 'Updated',
   SENT:    'Sent',
   PAID:    'Paid',
   SHIPPED: 'Shipped',
}

export class InvoiceMgr {
   static isSent(invoice)    { return invoice.status == InvoiceStatus.SENT }
   static isShipped(invoice) { return invoice.status == InvoiceStatus.SHIPPED }
   
   static setUpdated(invoice) { invoice.status = InvoiceStatus.UPDATED }
   
}
