<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row">
        
        <q-btn @click="leftDrawerOpen = !leftDrawerOpen" icon-right="menu" flat dense />
        <!-- using span because of problems with toolbar-title vertical alignment on ios -->
        <!-- <q-toolbar-title class="col absolute-center items-center">Dropzone</q-toolbar-title> -->
        <span class="col absolute-center text-h5">Dropzone</span>
        <q-btn label="" dense flat class="col" />
              
        <q-btn v-if="loggedIn" icon-right="account_circle" :label="userDisplayName" flat dense >
          <q-menu content-class="bg-grey-4 ">
            <q-list dense style="min-width: 100px">
              <q-item clickable to="/account" v-close-popup><q-item-section style="bg-black">Account</q-item-section></q-item>
              <q-item clickable to="/invoices"  v-close-popup><q-item-section style="bg-black">Invoices</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section @click="logoutUser">Logout</q-item-section></q-item>
            </q-list>
          </q-menu>
        </q-btn>        
        <q-btn v-else icon-right="account_circle" to="/auth/login" label="Login" dense flat />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :breakpoint="767"  bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <layout-item path="/" label="Drops" iconName="home"/>

        <div v-if="loggedIn">
            <layout-item path="/account"  label="My Account"        iconName="account_circle"/>
            <layout-item path="/actions"  label="My Bids/Purchases" iconName="monetization_on"/>           
            <layout-item path="/invoices" label="Invoices"          iconName="shopping_cart"/>           
        </div>

        <div v-if="userIsAdmin">
            <q-item-label header>Admin</q-item-label>
            <layout-item path="/admin/drops"    label="Drop Admin" iconName="get_app"/>
            <layout-item path="/admin/users"    label="User Admin" iconName="group"/>
            <layout-item path="/admin/invoices" label="Invoices"   iconName="shopping_cart"/>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-tabs indicator-color="transparent" class="row">
        <q-route-tab  icon="home" to="/" />
        <span class="col"/> <!-- filler to push home to left -->
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   // import { openURL } from 'quasar'

   export default {
      name: 'MyLayout',
      data () {
         return {
         leftDrawerOpen: this.$q.platform.is.desktop,
         }
      },
      computed: {
         ...mapGetters('auth', ['userId', 'loggedIn']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         user() { return this.getUser(this.userId)},
         userIsAdmin() { return this.user && this.user.isAdmin },
         userDisplayName() { return this.user.firstName ? this.user.firstName : this.user.authEmailCopy },
      },
      methods: {
         ...mapActions('auth', ['logoutUser']),
         ...mapActions('user', ['bindUsers']),
         logout() {        
            this.logoutUser()
            if (this.$route.path != "/") { this.$router.push("/") }
         },
      },
      components: {
         'layout-item' : require('layouts/LayoutItem.vue').default
      },
      created() {
         this.bindUsers()
      },
  }
</script>

<style>
</style>
