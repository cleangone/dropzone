import { Config } from 'boot/Config.js'

export const ItemStatus = {
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
   
   // static getThumbFilePath(item) {
   //    console.log("getThumbFilePath ", item)
            
   //    if (!item.imageFileName) { return logError("getThumbFilePath: item url does not contain imageFileName") }
   //    if (!item.imageUrl || !item.imageUrl.includes(item.imageFileName)) {
   //       return logError("getThumbUrl: uploaded url does not contain filename " + item.imageFileName, item.imageUrl)
   //    }

   //    let filePathPrefix = item.imageUrl
   //    filePathPrefix = filePathPrefix.substring(0, filePathPrefix.indexOf(item.imageFileName))            
   //    filePathPrefix = filePathPrefix.substring(filePathPrefix.lastIndexOf("/"))
   //    filePathPrefix = decodeURIComponent(filePathPrefix)
   //    if (!filePathPrefix.startsWith(Config.STORAGE_DIR)) {
   //       return logError("getThumbUrl: uploaded url file path does not start with directory path " + Config.STORAGE_DIR, filePathPrefix)
   //    }

   //    filePathPrefix = filePathPrefix.substring(1)
   //    const extension = item.imageFileName.substring(item.imageFileName.lastIndexOf("."))
   //    const filename = item.imageFileName.substring(0, item.imageFileName.lastIndexOf(".")) 
   //    const thumbDimensions = "_" + Config.THUMBNAIL_DIMENSION + "x" + Config.THUMBNAIL_DIMENSION
   //    const thumbnailFilePath = filePathPrefix + filename + thumbDimensions + extension
      
   //    return thumbnailFilePath
      // var storageRef = firebaseStorage.ref()
      // return storageRef.child(thumbnailFilePath).getDownloadURL().then(function(url) {
      //    console.log("getThumbUrl: thumbUrl", url)
      //    return url
      // })
      // .catch(function(error) {
      //    console.log("getThumbUrl: cannot get downloadURL from thumbnail " + thumbnailFilePath, error)
      //    return null
      // })
   // }

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
