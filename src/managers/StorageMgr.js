import { firebaseStorage } from 'boot/firebase'

export class StorageMgr {   
   static deleteItemFiles(items) { 
      let files = []
      for (var item of items) {
         files.push(item.imageFilePath)
         files.push(item.thumbFilePath)
      }

      StorageMgr.deleteFiles(files)
   }

   static deleteFiles(files) { 
      const storageRef = firebaseStorage.ref()
      for (var file of files) {
         console.log("Deleting file " + file)
         storageRef.child(file).delete()
         .catch(function(error) {
            console.log("Error deleting file " + file, error)
         })
      }
   }
}
