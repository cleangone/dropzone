<template>
   <q-layout view="hHh lpr lFf">
      <q-header class="header" elevated>
         <q-toolbar class="row">
            <q-btn @click="toggleDrawerLock()" icon-right="menu" flat dense />
            <router-link to="/" class="col">
               <span class="absolute-center text-h5 text-white">Dropzone</span>
            </router-link>                     
            <q-btn v-if="userIsLoggedIn" icon-right="account_circle" :label="userDisplayName" flat dense >
               <q-menu content-class="bg-white">
                  <q-list dense style="min-width: 100px">
                     <list-item path="/account"   label="Account" />
                     <list-item path="/favorites" label="Favorites" />    
                     <list-item path="/actions"   label="History" />           
                     <list-item path="/invoices"  label="Invoices" />
                     <q-separator />
                     <q-item clickable v-close-popup><q-item-section @click="logoutUser">Logout</q-item-section></q-item>
                  </q-list>
               </q-menu>
            </q-btn>        
            <q-btn v-else icon-right="account_circle" to="/auth/login" label="Login" dense flat />
         </q-toolbar>
      </q-header>

      <!-- 
         desktop - mini is always shown, hamburger locks it open, mouseover also opens, drawer pushes content to right
         mobile - drawer not shown, hamburger shows it, no mini mode, drawer overlays content 
      -->
      <q-drawer id="drawer" v-model="showDrawer" :breakpoint="767" :width="225" bordered
         :mini="drawerMini" :overlay="$q.platform.is.mobile ? true : false"
         @mouseover="drawerMouseover=true" @mouseout="drawerMouseover=false">
         <q-list>
            <layout-item path="/" label="Home" iconName="home"/>
            <layout-item v-if="currentUserActionsExist" path="/current" :class="activeItemsClass" label="Current Activity" iconName="fas fa-gavel"/>          
            <q-expansion-item label="Artists" icon="brush" :content-inset-level="0.25" expand-separator>
               <layout-item v-for="(tag, key) in artistLinks" :key="key" :path="'/artist/' + tag.id" :label="tag.name" :tag="tag" />
            </q-expansion-item>                
            <q-expansion-item v-if="loggedIn" label="My Account" icon="account_circle" :content-inset-level="0.25" expand-separator>  
               <layout-item path="/account"   label="Account"   iconName="account_circle"/>
               <layout-item path="/favorites" label="Favorites" iconName="favorite" />    
               <layout-item path="/actions"   label="History"   iconName="history"/>           
               <layout-item path="/invoices"  label="Invoices"  iconName="shopping_cart"/>           
            </q-expansion-item>
            <q-expansion-item v-if="userIsAdmin" label="Admin" icon="settings" :content-inset-level="0.25" expand-separator>
               <layout-item path="/admin/drops"      label="Drops"      iconName="get_app"/>
               <layout-item path="/admin/users"      label="Users"      iconName="group"/>
               <layout-item path="/admin/invoices"   label="Invoices"   iconName="shopping_cart"/>
               <layout-item path="/admin/artists"    label="Artists"    iconName="brush"/>
               <layout-item path="/admin/categories" label="Categories" iconName="topic"/>
               <layout-item path="/admin/settings"   label="Settings"   iconName="settings"/>
            </q-expansion-item>
         </q-list>
         <q-list class="fixed-bottom">
            <q-item-label header class="text-caption">{{ version }}</q-item-label>       
         </q-list>
      </q-drawer>

      <q-page-container>
         <router-view />
      </q-page-container>

      <q-footer class="footer q-px-xs q-py-none">
         <q-tabs indicator-color="transparent" class="row q-my-none q-py-none q-px-none">
            <q-route-tab icon="home" to="/" size="sm" class="q-pa-none q-ma-none" dense /> 
            <span class="col"/>
    		 </q-tabs>
      </q-footer>

      <q-dialog v-model="userHasAlert">
         <user-alert :alert="userAlert" :user="user" :cancelledAlertIds="cancelledAlertIds" />
      </q-dialog>
  </q-layout>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { TagMgr, TagCategory } from 'src/managers/TagMgr.js'
   import { Versions } from 'src/utils/Constants'

   export default {
      name: 'MyLayout',
      data () {
         return {
            showDrawer: true,
            drawerLockedOpen: false,
            drawerMouseover: false,
            boundUserId: null,
            cancelledAlertIds: []
         }
      },
      computed: {
         ...mapGetters('auth', ['userId', 'loggedIn']),
         ...mapGetters('action', ['actionsExist', 'getUserActions']),
         ...mapGetters('current', ['currentActivityExists']),
         ...mapGetters('invoice', ['invoicesExist']),
         ...mapGetters('tag', ['getTags']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         drawerMini() { return this.$q.platform.is.mobile ? false : (!this.drawerLockedOpen && !this.drawerMouseover) },
         drawerOverlay() { return this.$q.platform.is.mobile ? true : false },
         user() { return this.getUser(this.userId)},
         userIsLoggedIn() { 
            // console.log("userIsLoggedIn")
            if (this.loggedIn) {
               if (this.userId != this.boundUserId) { 
                  // console.log("binding userId " + this.userId)
                  this.bindUserActions(this.userId) 
                  this.bindUserInvoices(this.userId) 
                  this.boundUserId = this.userId
               }
            }
            else {
               if (this.boundUserId != null) { 
                  // console.log("unbinding userId " + this.boundUserId)
                  this.unbindUserActions() 
                  this.unbindUserInvoices() 
                  this.boundUserId = null
               }
            }
            return this.loggedIn
         },
         userIsAdmin() { 
            const isAdmin = this.user && this.user.isAdmin
            // console.log("Layout.userIsAdmin", isAdmin)
            if (isAdmin) {
               if (!this.actionsExist) { this.bindActions() }
               if (!this.invoicesExist) { this.bindInvoices() }
            }
            return isAdmin 
         },
         userDisplayName() { return this.user.firstName ? this.user.firstName : this.user.authEmailCopy },
         userAlert() { 
            if (this.loggedIn && this.user.alerts) { 
               for (var alert of this.user.alerts) {
                  if (!this.cancelledAlertIds.includes(alert.id)) { return alert }
               }
            }
            return null
         },
         userHasAlert() { return this.userAlert != null },
         currentUserActionsExist() { 
            const yesterday = new Date().getTime() - 1000*60*60*24 // 24 hours ago in millis
            for (var action of this.getUserActions(this.userId)) {
               if (action.createdDate > yesterday) { return true }
            }
            return false
         }, 
         activeItemsClass() { 
            if (!this.currentActivityExists) { return "" }
            setTimeout(() => { this.setCurrentActivity(false) }, 3000)              
            return "text-bold bg-yellow-4"
         },
         artists() { return this.getTags(TagCategory.ARTIST) },
         artistLinks() { return TagMgr.tagsWithLinks(this.artists) },
         version() { return Versions[0] },
      },
      methods: {
         ...mapActions('action',  ['bindActions', 'bindUserActions', 'unbindUserActions']),
         ...mapActions('auth',    ['logoutUser']),
         ...mapActions('current', ['setCurrentActivity']),
         ...mapActions('drop',    ['bindDrops']),
         ...mapActions('invoice', ['bindInvoices', 'bindUserInvoices', 'unbindUserInvoices']),
         ...mapActions('item',    ['bindItems']),
         ...mapActions('setting', ['bindSettings']),
         ...mapActions('tag',     ['bindTags']),
         ...mapActions('user',    ['bindUsers']),
         toggleDrawerLock() { 
            if (this.$q.platform.is.mobile) {
               this.showDrawer = !this.showDrawer
               // console.log("mobile - showDrawer", this.showDrawer)
            }
            else {
               this.drawerLockedOpen = !this.drawerLockedOpen
               // console.log("desktop - drawerLockedOpen", this.drawerLockedOpen)
            }
         },
         logout() {        
            this.logoutUser()
            if (this.$route.path != "/") { this.$router.push("/") }
         },
      },
      components: {
         'layout-item' : require('layouts/LayoutItem.vue').default,
         'list-item'   : require('layouts/ListItem.vue').default,
         'user-alert'  : require('components/User/UserAlert.vue').default,
      },
      created() {
         this.bindDrops()
         this.bindItems()
         this.bindSettings()
         this.bindTags()
         this.bindUsers()
      },
  }


// When the user scrolls down 50px from the top of the document, resize the header's font size
// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {  
//   if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
//     document.getElementById("header").style.fontSize = "30px";
//   } else {
//     document.getElementById("header").style.fontSize = "90px";
//   }
  
  
//   var scrollBottom = document.documentElement.scrollHeight - window.innerHeight - document.documentElement.scrollTop
//   console.log(scrollBottom + " - win: " + window.innerHeight + ", doc: " + document.documentElement.scrollHeight + ", scrollTop: " + document.documentElement.scrollTop)
  
//   if (scrollBottom > 100) {
//     document.getElementById("footer").style.height = "10px";
//   } else {
//     document.getElementById("footer").style.height = "60px";
//   }
// }

</script>

<style>
	/* .footer { 
      background-color: rgba(0, 0, 0, 0.7);
      height: 40px;
      transition: height .25s; 
   } 
   */
   
   .footer { 
      background-color: rgba(0, 0, 0, 0.7);
   } 
   /* 
   .footer:hover { background-color: black;
      height: 60px;
   } 
   */ 
</style>
