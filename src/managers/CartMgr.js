import { shallowEquals } from 'src/utils/Utils'

// Cart items handled in cart-store for push update of displayed count
export class CartMgr {
   static anonUser = {}
   static persistedAnonUser = {}
   
   static isAnonUserPersisted() { return shallowEquals(this.anonUser, this.persistedAnonUser) }  
   static setPersistedAnonUser() { this.persistedAnonUser = Object.assign({}, this.anonUser) } 
}
