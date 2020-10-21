import { SessionStorage } from 'quasar'

export const CollectionType = {
   HOME:   'Home',
   DROP:   'Drop',
   ARTIST: 'Artist',
}

export class SessionMgr {   
   static setDisplayItems(value) { 
      // console.log("setDisplayItems", value)
      SessionStorage.set('DispItems', value)
      return value }
   static getDisplayItems() { 
      // console.log("getDisplayItems", SessionStorage.getItem('DispItems'))
      return SessionStorage.getItem('DispItems') }

   static setCategoryDisplayItems(categoryId, items) {
      SessionStorage.set('CategoryDispItems' + categoryId, items)
   }
   static getCategoryDisplayItems(categoryId) {
      return SessionStorage.getItem('CategoryDispItems' + categoryId) 
   }

   static setArtistCategory(id) { SessionStorage.set('ArtistCategory', id) }
   static getArtistCategory() { return SessionStorage.getItem('ArtistCategory')}

   static setHomeItemsDesc(name)       { SessionStorage.set('DispItemsDesc', { type: CollectionType.HOME, name: name }) }
   static setDropItemsDesc(name, id)   { SessionStorage.set('DispItemsDesc', { type: CollectionType.DROP,   id: id, name: name }) }
   static setArtistItemsDesc(name, id) { SessionStorage.set('DispItemsDesc', { type: CollectionType.ARTIST, id: id, name: name }) }
   static getDisplayItemsDesc() { return SessionStorage.getItem('DispItemsDesc')}

   static isHome(collection)   { return collection.type == CollectionType.HOME }
   static isDrop(collection)   { return collection.type == CollectionType.DROP }
   static isArtist(collection) { return collection.type == CollectionType.ARTIST }
}
