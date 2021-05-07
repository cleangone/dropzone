
/*
    user: 
      id (auth userId)    
      authEmailCopy (filled in if user logged in with email, password)
      anonUserEmail (used for anon logins)
      firstName, lastName
      nickname
      address, city, state, zip, country
      phone
      acceptTexts
      isAdmin   
      likedItemIds []
*/  

export const AlertType = {
   LATE_BID: 'Late Bid',
   OUTBID:   'Outbid',
}

export class UserMgr {   
   static getNickname(user) { 
      if (UserMgr.exists(user.nickname)) { return user.nickname }
      else if (UserMgr.exists(user.firstName)) { return user.firstName }
      else if (UserMgr.exists(user.lastName)) { return user.lastName }
      else if (UserMgr.exists(user.authEmailCopy)) { return user.authEmailCopy }
      else return "User"
   }

   static getUserIdToInfo(users) { 
      let userIdToInfo = new Map()
      for (var user of users) {
         userIdToInfo.set(user.id, UserMgr.getInfo(user))
      }
      
      return userIdToInfo      
   }

   static getInfo(user) { 
      let info = UserMgr.fullName(user)
      if (info.length > 0) { info += ", " }

      if (UserMgr.exists(user.authEmailCopy)) { info += user.authEmailCopy }
      else if (UserMgr.exists(user.anonUserEmail)) { info += (user.anonUserEmail + " (Anon User)") }
      
      return info      
   }

   static fullName(user) { 
      if (UserMgr.exists(user.firstName) && UserMgr.exists(user.lastName)) { return user.firstName + " " +  user.lastName}
      else if (UserMgr.exists(user.firstName)) { return user.firstName }
      else if (UserMgr.exists(user.lastName)) { return user.lastName }
      else return ""
   }

   static isOutbid(alert)  { return alert.alertType == AlertType.OUTBID } 
   static isLateBid(alert) { return alert.alertType == AlertType.LATE_BID } 
   
   static exists(field) { return field && field.length }
}
