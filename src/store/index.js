import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import action  from './action-store'
import auth    from './auth-store'
import color   from './color-store'
import current from './current-store'
import drop    from './drop-store'
import error   from './error-store'
import invoice from './invoice-store'
import item    from './item-store'
import setting from './setting-store'
import tag     from './tag-store'
import user    from './user-store'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      action,
      auth,
      color,
      current,
      drop,
      error,
      invoice,
      item,
      setting,
      tag,
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
