import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import shop from './modules/shop'
import userShop from './modules/userShop'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    shop,
    userShop
  },
  getters
})

export default store
