import { Config } from 'boot/Config'
   
/*
   item
      id
      status
      dropId
      categoryId - todo may also need category name for searching, may have multiple categories
      name
      startPrice
      buyPrice
      buyDate
      buyerId
      buyerName
      bidderIds [ id ]
      numberOfBids
      numberOfPurchaseReqs
      acceptedPurchaseReqId 
      purchaseReqs [ { actionId, userId, userNickname, amount, date }]
      currBid { actionId, userId, userNickname, amount, date }
      prevBids [ currBid obj ]
      createdDate
      sortedCreateDate
      userUpdatedDate
      dropDoneDate
      primaryImage { baseName, isHorizontal, url, filePath, thumbUrl, thumbFilePath }
      images [ Image Obj ]
*/

export const ItemStatus = {
   PRIVATE:   'Private',
   SETUP:     'Setup',
   AVAILABLE: 'Available',
   DROPPING:  'Dropping',
   REQUESTED: 'Requested',
   HOLD:      'On Hold',
   INVOICED:  'Invoiced',
   SOLD:      'Sold',
}

export class ItemMgr {
   static itemText(items) {
      let priv = 0
      let setup = 0
      let available = 0
      let requested = 0
      let hold = 0
      let invoiced = 0
      let sold = 0

      items.forEach(item => {
         if (ItemMgr.isPrivate(item)) { priv++ }
         else if (ItemMgr.isSetup(item)) { setup++ }
         else if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { available++ }
         else if (ItemMgr.isRequested(item)) { requested++ }
         else if (ItemMgr.isHold(item)) { hold++ }
         else if (ItemMgr.isInvoiced(item)) { invoiced++ }
         else if (ItemMgr.isSold(item)) { sold++ }
      })

      const text = []
      if (priv)      { text.push(priv + " Private") }
      if (setup)     { text.push(setup + " Setup") }
      if (available) { text.push(available + (requested || hold || invoiced || sold ?  " Avail" : " Available")) }
      if (requested) { text.push(requested + " Req") }
      if (hold)      { text.push(hold + " Hold") }
      if (invoiced)  { text.push(invoiced + " Invoiced") }
      if (sold)      { text.push(sold + " Sold") }

      return text.length ? text.join(", ") : "None"
   }

   static isBuyerId(item, userId) { return item.buyerId == userId } 
                    
   static isActive(item)    { return !ItemMgr.isPrivate(item) && !ItemMgr.isSetup(item) } 
   static isGone(item)      { return ItemMgr.isHold(item) || ItemMgr.isInvoiced(item) || ItemMgr.isSold(item) } 
   
   static isPrivate(item)   { return item.status == ItemStatus.PRIVATE }
   static isSetup(item)     { return item.status == ItemStatus.SETUP }
   static isAvailable(item) { return item.status == ItemStatus.AVAILABLE }
   static isDropping(item)  { return item.status == ItemStatus.DROPPING }
   static isRequested(item) { return item.status == ItemStatus.REQUESTED }
   static isHold(item)      { return item.status == ItemStatus.HOLD }
   static isInvoiced(item)  { return item.status == ItemStatus.INVOICED }
   static isSold(item)      { return item.status == ItemStatus.SOLD }
}
