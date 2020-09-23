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
          
   static finalize(invoice, user, setting) { 
      invoice.total = invoice.subTotal + invoice.shippingCharge - invoice.priceAdjustment 
      InvoiceMgr.setUserFullName(invoice, user)
      InvoiceMgr.setHtml(invoice, user, setting)   
   }
   
   static setUserFullName(invoice, user) { 
      invoice.userFullName = (user.firstName || user.lastName) ?
         (user.firstName ? user.firstName : "") + (user.firstName && user.lastName ? " " : "") + (user.lastName ? user.lastName : "") :
         user.authEmailCopy
   }
   
   static getUserHtml(invoice, user) { 
      // console.log("getUserHtml: user", user)
      let html = []      
      html.push(
         div(invoice.userFullName) +
         div(user.address ? user.address : "ADDRESS" )  +
         div((user.city ? user.city : "CITY") + ", " + (user.state ? user.state : "STATE")) +
         div(user.zip ? user.zip : "ZIP" ) +
         (user.country ? div(user.country) : "" )
      )

      return html.join("")
   }

   static setHtml(invoice, user, setting) { 
      console.log("setHtml: user", user)
      console.log("setHtml: setting", setting)
      let html = []
      
      let paypal = "" 
      if (setting.paypal) {
         let paypalLink = setting.paypal 
         if (paypalLink.toLowerCase().startsWith("https://")) { paypalLink = paypalLink.substring(0, 8) }
         if (paypalLink.toLowerCase().startsWith("http://"))  { paypalLink = paypalLink.substring(0, 7) }

         paypal =  a(paypalLink, "https://" + paypalLink)
      }

      html.push(div(
         div(setting.companyName) + div(paypal), 
         "align=right"))
      html.push(br() + br())
      html.push(InvoiceMgr.getUserHtml(invoice, user) + br())
      
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
      html.push(br() + p(setting.invoiceNote))

      invoice.html = html.join("")
   }

   static setUpdated(invoice) { invoice.status = InvoiceStatus.UPDATED }
}

function a(innerHtml, href)        { return ele(innerHtml, "a", "href=" + href) }
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


