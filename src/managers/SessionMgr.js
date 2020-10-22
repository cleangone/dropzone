import { SessionStorage } from 'quasar'

// todo - this could be replaced by Constants.Route
export const CollectionType = {
   HOME:     'Home',
   DROP:     'Drop',
   ARTIST:   'Artist',
   CURRENT:  'Current',
   FAVORITE: 'Favorite',
}

export class SessionMgr {   
   static getDisplayItems() { return SessionStorage.getItem('DispItems') }
   static setDisplayItems(value) { 
      SessionStorage.set('DispItems', value)
      return value 
   }
   
   static getCategoryDisplayItems(categoryId) { return SessionStorage.getItem('CategoryDispItems' + categoryId) }
   static setCategoryDisplayItems(categoryId, items) { SessionStorage.set('CategoryDispItems' + categoryId, items) }
   
   static getArtistCategory() { return SessionStorage.getItem('ArtistCategory')}
   static setArtistCategory(id) { SessionStorage.set('ArtistCategory', id) }
   
   static setHomeItemsDesc(name)       { SessionMgr.setDisplayItemsDesc({ type: CollectionType.HOME,     name: name }) }
   static setDropItemsDesc(name, id)   { SessionMgr.setDisplayItemsDesc({ type: CollectionType.DROP,     name: name, id: id }) }
   static setArtistItemsDesc(name, id) { SessionMgr.setDisplayItemsDesc({ type: CollectionType.ARTIST,   name: name, id: id }) }
   static setCurrentItemsDesc()        { SessionMgr.setDisplayItemsDesc({ type: CollectionType.FAVORITE, name: "Current Activity" }) }
   static setFavoriteItemsDesc()       { SessionMgr.setDisplayItemsDesc({ type: CollectionType.FAVORITE, name: "Favorites" }) }
   
   static getDisplayItemsDesc() { return SessionStorage.getItem('DisplayItemsDesc')}
   static setDisplayItemsDesc(desc) { return SessionStorage.set('DisplayItemsDesc', desc)}
   
   static isHome(collection)     { return collection.type == CollectionType.HOME }
   static isDrop(collection)     { return collection.type == CollectionType.DROP }
   static isArtist(collection)   { return collection.type == CollectionType.ARTIST }
   static isCurrent(collection)  { return collection.type == CollectionType.CURRENT }
   static isFavorite(collection) { return collection.type == CollectionType.FAVORITE }
}
