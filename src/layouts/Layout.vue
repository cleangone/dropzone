<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row">
        
        <q-btn @click="leftDrawerOpen = !leftDrawerOpen" icon-right="menu" flat dense />
        <!-- using span because of problems with toolbar-title vertical alignment on ios -->
        <!-- <q-toolbar-title class="col absolute-center items-center">Dropzone</q-toolbar-title> -->
        <span class="col absolute-center text-h5">Dropzone</span>
        <q-btn label="" dense flat class="col" />
              
        <q-btn v-if="loggedIn" icon-right="account_circle" :label="userFirstName" flat dense >
          <q-menu content-class="bg-grey-4 ">
            <q-list dense style="min-width: 100px">
              <q-item clickable to="/account" v-close-popup><q-item-section style="bg-black">Account</q-item-section></q-item>
              <q-item clickable to="/actions"  v-close-popup><q-item-section style="bg-black">Bids/Buys</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section @click="logoutUser">Logout</q-item-section></q-item>
            </q-list>
          </q-menu>
        </q-btn>        
        <q-btn v-else icon-right="account_circle" to="/auth" label="Login" dense flat />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :breakpoint="767"  bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <layout-item path="/" label="Drops" iconName="home"/>

        <!-- <q-item clickable to="/auth" exact>
          <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
          <q-item-section><q-item-label>Login</q-item-label></q-item-section>
        </q-item> -->
        <div v-if="loggedIn">
          <layout-item path="/account" label="My Account"        iconName="account_circle"/>
          <layout-item path="/actions" label="My Bids/Purchases" iconName="monetization_on"/>           
          <layout-item path="/checkout" label="Checkout"         iconName="shopping_cart"/>           
        </div>

        <div v-if="userIsAdmin">
          <q-item-label header>Admin</q-item-label>
          <layout-item path="/drops" label="Drop Admin" iconName="get_app"/>
          <layout-item path="/users" label="User Admin" iconName="group"/>
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
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { openURL } from 'quasar'

  export default {
    name: 'MyLayout',
    data () {
      return {
        leftDrawerOpen: this.$q.platform.is.desktop,
      }
    },
    computed: {
      ...mapState('auth', ['userId']),
			...mapGetters('auth', ['loggedIn']),
      ...mapGetters('user', ['getUser']),
      user() { return this.getUser(this.userId)},
      userIsAdmin() { return this.loggedIn && this.user.isAdmin },
      userFirstName() { return this.user.firstName }
    },
    methods: {
      ...mapActions('auth', ['logoutUser']),
      openURL
    },
    components: {
			'layout-item' : require('layouts/LayoutItem.vue').default
		},
  }
</script>

<style>
</style>
