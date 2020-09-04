import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import action  from './action-store'
import auth    from './auth-store'
import color   from './color-store'
import invoice from './invoice-store'
import item    from './item-store'
import drop    from './drop-store'
import user    from './user-store'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      action,
      auth,
      color,
      drop,
      invoice,
      item,
      user
    },
    mutations: {
      ...vuexfireMutations
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
