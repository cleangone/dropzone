
export const ItemStatus = {
   SETUP:     'Setup',
   AVAILABLE: 'Available',
   DROPPING:  'Dropping',
   HOLD:      'On Hold',
   INVOICED:  'Invoiced',
   SOLD:      'Sold',
}

export class ItemMgr {
   
   static isSetup(item)     { return item.status == ItemStatus.SETUP }
   static isAvailable(item) { return item.status == ItemStatus.AVAILABLE }
   static isDropping(item)  { return item.status == ItemStatus.DROPPING }
   static isHold(item)      { return item.status == ItemStatus.HOLD }
   static isInvoiced(item)  { return item.status == ItemStatus.INVOICED }
   static isSold(item)      { return item.status == ItemStatus.SOLD }
}
