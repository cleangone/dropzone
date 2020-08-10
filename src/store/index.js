import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth-store'
import drop from './drop-store'
import user from './user-store'
import color from './color-store'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      drop,
      user,
      color
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
