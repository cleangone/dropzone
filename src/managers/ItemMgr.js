import { Config } from 'boot/Config.js'

/*
   item
      id
      status
      dropId
      name
      startPrice
      buyPrice
      buyDate
      buyerId
      buyerName
      bidderIds [id]
      numberOfBids
      currBid { actionId, userId, userNickname, amount, date }
      prevBids [currBid obj]
      createdDate
      lastUserActivityDate
      dropDoneDate
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
   static setFilePaths(item) {     
      if (!item.imageBaseName) { return logError("setFilePaths: item url does not contain imageBaseName") }
      if (!item.imageUrl || !item.imageUrl.includes(item.imageBaseName)) {
         return logError("setFilePaths: imageUrl does not contain baseName " + item.imageBaseName, item.imageUrl)
      }

      let filePathPrefix = item.imageUrl
      filePathPrefix = filePathPrefix.substring(0, filePathPrefix.indexOf(item.imageBaseName))            
      filePathPrefix = filePathPrefix.substring(filePathPrefix.lastIndexOf("/"))
      filePathPrefix = decodeURIComponent(filePathPrefix)
      // console.log("filePathPrefix", filePathPrefix)

      if (!filePathPrefix.startsWith(Config.STORAGE_DIR)) {
         return logError("setFilePaths: imageUrl file path does not start with directory path " + Config.STORAGE_DIR, filePathPrefix)
      }

      filePathPrefix = filePathPrefix.substring(1)
      item.imageFilePath = filePathPrefix + item.imageBaseName
      // console.log("imageFilePath ", item.imageFilePath)

      const baseExtension = item.imageBaseName.substring(item.imageBaseName.lastIndexOf("."))
      const baseFilename = item.imageBaseName.substring(0, item.imageBaseName.lastIndexOf(".")) 
      const thumbDimensions = "_" + Config.THUMBNAIL_DIMENSION + "x" + Config.THUMBNAIL_DIMENSION
      item.thumbFilePath = filePathPrefix + baseFilename + thumbDimensions + baseExtension
      // console.log("thumbFilePath ", item.thumbFilePath)
   }

   static itemText(items) {
      let priv = 0
      let setup = 0
      let available = 0
      let hold = 0
      let sold = 0

      items.forEach(item => {
         if (ItemMgr.isPrivate(item)) { priv++ }
         else if (ItemMgr.isSetup(item)) { setup++ }
         else if (ItemMgr.isAvailable(item) || ItemMgr.isDropping(item)) { available++ }
         else if (ItemMgr.isHold(item) || ItemMgr.isInvoiced(item) ) { hold++ }
         else if (ItemMgr.isSold(item)) { sold++ }
      })

      const text = []
      if (priv)      { text.push(priv + " Private") }
      if (setup)     { text.push(setup + " Setup") }
      if (available) { text.push(available + " Available") }
      if (hold)      { text.push(hold + " Hold") }
      if (sold)      { text.push(sold + " Sold") }

      return text.join(", ")
   }

   static isActive(item)    { return !ItemMgr.isPrivate(item) && !ItemMgr.isSetup(item) } 
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
