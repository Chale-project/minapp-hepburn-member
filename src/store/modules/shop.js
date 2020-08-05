import { getShopNumberByCode, getShopInfo } from '@/common/api'
import util from '@/common/utils'

const state = {
  shopId: 'c84ec80c143c4f799954d643b0e81223',
  shopInfo: {},
  refererSuid: null,

}

const mutations = {

  SET_SHOP_ID(state, id) {
    state.shopId = id
  },

  SET_SHOP_INFO(state, info) {
    state.shopInfo = info
  },

  SET_REFERER_SUID(state, id) {
    state.refererSuid = id
  },
}

const actions = {
  /**
   * 设置OptionsQuery
   */
  SetOptionsQuery({ dispatch, commit, state }, sq) {
    return new Promise(function (resolve, reject) {
      if (sq.shopId) { // 小程序内进入
        const _shopId = sq.shopId;
        commit('SET_SHOP_ID', _shopId)
      } else if (sq.options.scene) {  // 小程序码进入
        const sceneObj = util.strToObj(sq.options.scene);
        commit('SET_SHOP_ID', sceneObj.shopId)
      } else if (sq.options.shopId || sq.options.refererSuid) { // 分享进入
        const _shopId = sq.options.shopId;
        const _refererSuid = sq.options.refererSuid || null;
        commit('SET_SHOP_ID', _shopId)
        commit('SET_REFERER_SUID', _refererSuid)
      } else if (sq.options.q) { // 二维码进入
        const _shopId = util.getQueryString(sq.options.q, "shopId");
        const _code = util.getQueryString(sq.options.q, "code");
        if (_shopId) {
          commit('SET_SHOP_ID', _shopId)
        } else if (_code) {
          getShopNumberByCode(_code).then((res) => {
            const _codeShopId = res.result;
            commit('SET_SHOP_ID', _codeShopId)
          })
        }
      }
      dispatch('GetShopInfo', state.shopId)
      resolve()
    })

  },

  /**
   * 获取店铺信息
   */
  GetShopInfo({ commit }, shopId) {
    return new Promise(function (resolve, reject) {
      return getShopInfo(shopId).then((res) => {
        commit('SET_SHOP_INFO', res.result)
        resolve(res.result)
      }).catch((err) => {
        reject(err);
      })
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
