<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row">
        
        <q-btn @click="leftDrawerOpen = !leftDrawerOpen" icon-right="menu" flat dense />
        <!-- using span because of problems with toolbar-title vertical alignment on ios -->
        <!-- <q-toolbar-title class="col absolute-center items-center">Dropzone</q-toolbar-title> -->
        <span class="col absolute-center text-h5">Dropzone</span>
        <q-btn label="" dense flat class="col" />
              
        <q-btn v-if="userIsLoggedIn" icon-right="account_circle" :label="userDisplayName" flat dense >
          <q-menu content-class="bg-grey-4 ">
            <q-list dense style="min-width: 100px">
               <list-item path="/account"   label="Account" />
               <list-item path="/favorites" label="Favorites" />    
               <list-item path="/actions"   label="History" />           
               <list-item path="/invoices"  label="Invoices" />
               <q-item clickable v-close-popup><q-item-section @click="logoutUser">Logout</q-item-section></q-item>
            </q-list>
          </q-menu>
        </q-btn>        
        <q-btn v-else icon-right="account_circle" to="/auth/login" label="Login" dense flat />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :breakpoint="767" :width="225" bordered content-class="bg-grey-2">
      <q-list>
         <q-item-label header></q-item-label>
         <layout-item path="/" label="Drops" iconName="home"/>
         <layout-item v-if="activeItemsExist" path="/activity" :class="activeItemsClass" label="Current Activity" iconName="fas fa-gavel"/>

         <q-expansion-item label="Artists" :content-inset-level="1" switch-toggle-side expand-separator>
            <layout-item v-for="(tag, key) in artistLinks" :key="key" :path="'/artist/' + tag.id" :label="tag.name"/>
         </q-expansion-item>
         <q-expansion-item v-if="loggedIn" label="My Account" 
               :content-inset-level="1" switch-toggle-side expand-separator>
            <layout-item path="/account"   label="Account"   iconName="account_circle"/>
            <layout-item path="/favorites" label="Favorites" iconName="favorite" />    
            <layout-item path="/actions"   label="History"   iconName="history"/>           
            <layout-item path="/invoices"  label="Invoices"  iconName="shopping_cart"/>           
         </q-expansion-item>
         <q-expansion-item v-if="userIsAdmin" label="Admin" 
               :content-inset-level="1" switch-toggle-side expand-separator>
            <layout-item path="/admin/drops"    label="Drops"    iconName="get_app"/>
            <layout-item path="/admin/users"    label="Users"    iconName="group"/>
            <layout-item path="/admin/invoices" label="Invoices" iconName="shopping_cart"/>
            <layout-item path="/admin/artists"  label="Artists"  iconName="brush"/>
            <layout-item path="/admin/settings" label="Settings" iconName="settings"/>
         </q-expansion-item>
      </q-list>
      <q-list class="fixed-bottom">
         <!-- v 0.11 - add Current Acitivity -->
         <q-item-label header class="text-caption">Ver. 0.11.2 - 10/1/20</q-item-label> 
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-tabs indicator-color="transparent" class="row">
        <q-route-tab icon="home" to="/" class="col-1" />
        <span class="col"/> <!-- filler -->
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { TagMgr, TagCategory } from 'src/managers/TagMgr.js'
   
   export default {
      name: 'MyLayout',
      data () {
         return {
            leftDrawerOpen: this.$q.platform.is.desktop,
            boundUserId: null  // userId that has data boung to it
         }
      },
      computed: {
         ...mapGetters('auth', ['userId', 'loggedIn']),
         ...mapGetters('event', ['activeItemsExist', 'immediateItemActivityExists']),
         ...mapGetters('invoice', ['invoicesExist']),
         ...mapGetters('event', ['activeItemsExist', 'immediateItemActivityExists']),
         ...mapGetters('tag', ['getTags']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         activeItemsClass() { 
            if (!this.immediateItemActivityExists) { return "" }
            setTimeout(() => {  this.setImmediateItemActivity(false)  }, 3000)              
            return "text-bold bg-yellow-4"
         },         
         user() { return this.getUser(this.userId)},
         userIsLoggedIn() { 
            // console.log("Layout.userIsLoggedIn", this.loggedIn)
            const userId = this.loggedIn ? this.userId : "-" // placeholder to clear bound data
            if (userId != this.boundUserId) { 
               this.bindUserInvoices(userId) 
               this.boundUserId = userId
               // console.log("Layout.boundUserId", this.boundUserId)
            }

            return this.loggedIn
         },
         userIsAdmin() { 
            const isAdmin = this.user && this.user.isAdmin
            // console.log("Layout.userIsAdmin", isAdmin)
            if (isAdmin && !this.invoicesExist) { this.bindInvoices() }
            return isAdmin 
         },
         userDisplayName() { return this.user.firstName ? this.user.firstName : this.user.authEmailCopy },
         artists() { return this.getTags(TagCategory.ARTIST) },
         artistLinks() { return TagMgr.tagsWithLinks(this.artists) },
      },
      methods: {
         ...mapActions('action',  ['bindActions']),
         ...mapActions('auth',    ['logoutUser']),
         ...mapActions('drop',    ['bindDrops']),
         ...mapActions('event',   ['setImmediateItemActivity']),
         ...mapActions('invoice', ['bindInvoices', 'bindUserInvoices']),
         ...mapActions('item',    ['bindItems']),
         ...mapActions('setting', ['bindSettings']),
         ...mapActions('tag',     ['bindTags']),
         ...mapActions('user',    ['bindUsers']),
         logout() {        
            this.logoutUser()
            if (this.$route.path != "/") { this.$router.push("/") }
         },
      },
      components: {
         'layout-item' : require('layouts/LayoutItem.vue').default,
         'list-item' : require('layouts/ListItem.vue').default
      },
      created() {
         this.bindActions() 
         this.bindDrops()
         // this.bindInvoices() 
         this.bindItems()
         this.bindSettings()
         this.bindTags()
         this.bindUsers()
      },
  }
</script>
