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
   HOLD:      'On Hold',
   INVOICED:  'Invoiced',
   SOLD:      'Sold',
}

export class ItemMgr {
   // note - image.thumbUrl set when stored - have to wait for file to be created by resize function
   static setFilePaths(image) {   
      // console.log("setFilePaths ", image)
      if (!image.baseName) { return logError("setFilePaths: baseName not set") }
      if (!image.url || !image.url.includes(image.baseName)) {
         return logError("setFilePaths: url does not contain baseName " + image.baseName, image.url)
      }

      let filePathPrefix = image.url
      filePathPrefix = filePathPrefix.substring(0, filePathPrefix.indexOf(image.baseName))            
      filePathPrefix = filePathPrefix.substring(filePathPrefix.lastIndexOf("/"))
      filePathPrefix = decodeURIComponent(filePathPrefix)
      // console.log("filePathPrefix", filePathPrefix)

      if (!filePathPrefix.startsWith(Config.STORAGE_DIR)) {
         return logError("setFilePaths: url file path does not start with directory path " + Config.STORAGE_DIR, filePathPrefix)
      }

      filePathPrefix = filePathPrefix.substring(1)
      image.filePath = filePathPrefix + image.baseName
      // console.log("imageFilePath ", item.imageFilePath)

      const baseExtension = image.baseName.substring(image.baseName.lastIndexOf("."))
      const baseFilename = image.baseName.substring(0, image.baseName.lastIndexOf(".")) 
      const thumbDimensions = "_" + Config.THUMBNAIL_DIMENSION + "x" + Config.THUMBNAIL_DIMENSION
      image.thumbFilePath = filePathPrefix + baseFilename + thumbDimensions + baseExtension
      // console.log("thumbFilePath ", item.thumbFilePath)
   }

   static itemText(items) {
      let priv = 0
      let setup = 0
      let available = 0
      let hold = 0
      let invoiced = 0
      let sold = 0

      items.forEach(item => {
         if (ItemMgr.isPrivate(item)) { priv++ }
         else if (ItemMgr.isSetup(item)) { setup++ }
         else if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { available++ }
         else if (ItemMgr.isHold(item)) { hold++ }
         else if (ItemMgr.isInvoiced(item)) { invoiced++ }
         else if (ItemMgr.isSold(item)) { sold++ }
      })

      const text = []
      if (priv)      { text.push(priv + " Private") }
      if (setup)     { text.push(setup + " Setup") }
      if (available) { text.push(available + (hold || sold?  " Avail" : " Available")) }
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
   static isHold(item)      { return item.status == ItemStatus.HOLD }
   static isInvoiced(item)  { return item.status == ItemStatus.INVOICED }
   static isSold(item)      { return item.status == ItemStatus.SOLD }
}

function logError(msg, error = null) {
   if (error) { console.log(msg, error)}
   else { console.log(msg) }

   return null
}
