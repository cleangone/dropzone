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
          
   static finalize(invoice, setting) { 
      console.log("finalize pre", invoice)
      invoice.total = invoice.subTotal + invoice.shippingCharge - invoice.priceAdjustment 
      InvoiceMgr.setHtml(invoice, setting)
      console.log("finalize post", invoice)
   }
   
   static setHtml(invoice, setting) { 
      console.log("setHtml", setting)
      let html = []
      
      let company = div(setting.companyName)
      let ppal =  div("Paypal: " + setting.paypal)
      html.push(div(company + ppal, "align=right"))
      html.push(br() + br())

      let name = p(invoice.userName)
      html.push(name)
   
      let detailRows = []
      for (var item of invoice.items) {
         detailRows.push(tr(td(item.name) + tdRight(dollars(item.price))))
      }

      let subtotal = tr(td("SubTotal") + tdRight(dollars(invoice.subTotal)))
      let shipping = tr(td("Shipping") + tdRight(dollars(invoice.shippingCharge)))
      let adjustment = invoice.priceAdjustment == 0 ? "" : tr(td("Adjustment") +  tdRight("(" + dollars(invoice.priceAdjustment) + ")"))
      let line = tr(td(hr(), "colspan=2"))
      let total = tr(td(b("Total")) + tdRight(b(dollars(invoice.total))))
      
      let itemsTable = table(detailRows.join("") + line + subtotal + shipping + adjustment + line + total, "width=100% style='border:1px solid'")
      html.push(itemsTable)
      html.push(br() + p("Please forward total amount to Paypal address"))

      invoice.html = html.join("")
   }

   static setUpdated(invoice) { invoice.status = InvoiceStatus.UPDATED }
}

function b(innerHtml)              { return ele(innerHtml, "b") }
function br()                      { return closedEle("br") }
function div(innerHtml, attr)      { return ele(innerHtml, "div", attr) }
function p(innerHtml)              { return ele(innerHtml, "p") }
function h4(innerHtml)             { return ele(innerHtml, "h4") }
function hr()                      { return closedEle("hr") }
function table(innerHtml, attr)    { return ele(innerHtml, "table", attr) }
function tr(innerHtml)             { return ele(innerHtml, "tr") }
function td(innerHtml, attr)       { return ele(innerHtml, "td", attr) }
function tdRight(innerHtml)        { return td(innerHtml, "align=right") }

function ele(innerHtml, tag, attr) { return openTagPrefix(tag, attr) + ">" + innerHtml + "</" + tag +">" }
function closedEle(tag, attr)      { return openTagPrefix(tag, attr) + "/>" }
function openTagPrefix(tag, attr)  { return "<" + tag + (attr ? " " + attr : "") }


