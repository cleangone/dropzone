import { SessionStorage } from 'quasar'
import { Route } from 'src/utils/Constants'
	
export class SessionMgr {   
   static getDisplayItems() { return SessionStorage.getItem('DisplayItems') }
   static setDisplayItems(value) { 
      SessionStorage.set('DisplayItems', value)
      return value 
   }
   
   static categoryKey(categoryId) { return 'CategoryDisplayItems' + categoryId }
   static getCategoryDisplayItems(categoryId) { return SessionStorage.getItem(SessionMgr.categoryKey(categoryId)) }
   static setCategoryDisplayItems(categoryId, items) { SessionStorage.set(SessionMgr.categoryKey(categoryId), items) }
   
   // can target category within an artist listing
   static getArtistCategory() { return SessionStorage.getItem('ArtistCategory')}
   static setArtistCategory(id) { SessionStorage.set('ArtistCategory', id) }
   
   static setHomeItemsDesc()           { SessionMgr.setDisplayItemsDesc({ route: Route.HOME,     name: "Home" }) }
   static setDropItemsDesc(name, id)   { SessionMgr.setDisplayItemsDesc({ route: Route.DROP,     name: name, id: id }) }
   static setArtistItemsDesc(name, id) { SessionMgr.setDisplayItemsDesc({ route: Route.ARTIST,   name: name, id: id }) }
   static setRecentItemsDesc()         { SessionMgr.setDisplayItemsDesc({ route: Route.RECENT,   name: "Recent Updates" }) }
   static setCurrentItemsDesc()        { SessionMgr.setDisplayItemsDesc({ route: Route.CURRENT,  name: "Current Activity" }) }
   static setFavoriteItemsDesc()       { SessionMgr.setDisplayItemsDesc({ route: Route.FAVORITE, name: "Favorites" }) }
   
   static getDisplayItemsDesc() { return SessionStorage.getItem('DisplayItemsDesc')}
   static setDisplayItemsDesc(desc) { return SessionStorage.set('DisplayItemsDesc', desc)}
   
   static isHome(displayItemsDesc)     { return displayItemsDesc.route == Route.HOME }
   static isDrop(displayItemsDesc)     { return displayItemsDesc.route == Route.DROP }
   static isArtist(displayItemsDesc)   { return displayItemsDesc.route == Route.ARTIST }
   static isRecent(displayItemsDesc)   { return displayItemsDesc.route == Route.RECENT }
   static isCurrent(displayItemsDesc)  { return displayItemsDesc.route == Route.CURRENT }
   static isFavorite(displayItemsDesc) { return displayItemsDesc.route == Route.FAVORITE }
}
