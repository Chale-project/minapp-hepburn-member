import { getCurShopUserInfo } from '@/common/api'

const state = {
  curShopUserInfo: {},

}

const mutations = {

  SET_USER_SHOP_INFO(state, info) {
    state.curShopUserInfo = info
  }

}

const actions = {

  /**
   * 获取用户当前店铺信息店铺信息
   */
  GetUserShopInfo({ commit }, shopId) {
    return new Promise(function (resolve, reject) {
      return getCurShopUserInfo(shopId).then((res) => {
        commit('SET_USER_SHOP_INFO', res.result)
        resolve(res.result)
      }).catch((err) => {
        reject(err);
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
