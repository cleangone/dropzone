import { SessionStorage } from 'quasar'
import { Route } from 'src/utils/Constants'
	
export class SessionMgr {      
   static getDisplayItems() { return SessionStorage.getItem('DisplayItems') }
   static setDisplayItems(value) { 
      SessionStorage.set('DisplayItems', value)
      return value 
   }
   
   static tagDisplayItemsKey(tagId) { return 'TagDisplayItems' + tagId }
   static getTagDisplayItems(tagId) { return SessionStorage.getItem(SessionMgr.tagDisplayItemsKey(tagId)) }
   static setTagDisplayItems(tagId, items) { SessionStorage.set(SessionMgr.tagDisplayItemsKey(tagId), items) }
   
   // specify target tag within a category
   static getCategoryTag() { return SessionStorage.getItem('CategoryTag')}
   static setCategoryTag(id) { SessionStorage.set('CategoryTag', id) }
   
   static setHomeItemsDesc()             { SessionMgr.setDisplayItemsDesc({ route: Route.HOME,     name: "Home" }) }
   static setDropItemsDesc(name, id)     { SessionMgr.setDisplayItemsDesc({ route: Route.DROP,     name: name, id: id }) }
   static setCategoryItemsDesc(name, id) { SessionMgr.setDisplayItemsDesc({ route: Route.CATEGORY, name: name, id: id }) }
   static setRecentItemsDesc()           { SessionMgr.setDisplayItemsDesc({ route: Route.RECENT,   name: "Recent Updates" }) }
   static setCurrentItemsDesc()          { SessionMgr.setDisplayItemsDesc({ route: Route.CURRENT,  name: "Current Activity" }) }
   static setFavoriteItemsDesc()         { SessionMgr.setDisplayItemsDesc({ route: Route.FAVORITE, name: "Favorites" }) }
   
   static getDisplayItemsDesc() { return SessionStorage.getItem('DisplayItemsDesc')}
   static setDisplayItemsDesc(desc) { return SessionStorage.set('DisplayItemsDesc', desc)}
   
   static isHome(displayItemsDesc)     { return displayItemsDesc.route == Route.HOME }
   static isDrop(displayItemsDesc)     { return displayItemsDesc.route == Route.DROP }
   static isCategory(displayItemsDesc) { return displayItemsDesc.route == Route.CATEGORY }
   static isRecent(displayItemsDesc)   { return displayItemsDesc.route == Route.RECENT }
   static isCurrent(displayItemsDesc)  { return displayItemsDesc.route == Route.CURRENT }
   static isFavorite(displayItemsDesc) { return displayItemsDesc.route == Route.FAVORITE }
}
