
export class CartMgr {
   itemIds = []
   add(id) { itemIds.push(id) }
   itemCount() { return itemIds.length } 
}
