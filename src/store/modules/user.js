import {
	getOpenIdByCode,
	getUserInfoByOpenId,
	decryptUserInfo
} from '@/common/api'
import util from '@/common/utils'

const state = {
	isNewUser: !0,
	token: uni.getStorageSync('token'),
	userInfo: {},
	openid: null,

}

const mutations = {

	SET_IS_NEW_USER(state, status) {
		state.isNewUser = status
	},

	SET_TOKEN(state, token) {
		state.token = token
	},

	SET_USER_INFO(state, userinfo) {
		state.userInfo = userinfo;
	},

	SET_OPENID(state, openid) {
		state.openid = openid;
	},
}

const actions = {
	/**
	 * 调用微信登录小程序根据code换取openId
	 */
	GetOpenId({
		commit
	}) {
		let code = null;
		return new Promise((resolve, reject) => {
			return util.getProvider('oauth').then(res => {
				if (res.provider.includes('weixin')) {
					return util.login('weixin').then((res) => {
						code = res.code
						return getOpenIdByCode(code).then((res) => {
							commit('SET_OPENID', res.openid)
							resolve(res.openid)
						}).catch((err) => {
							reject(err);
						})
					})
				}
			})
		})
	},

	/**
	 * 检测是否为系统用户
	 */
	CheckIsNewUser({
		commit
	}) {
		let code = null;
		return new Promise((resolve, reject) => {
			return util.getProvider('oauth').then(res => {
				if (res.provider.includes('weixin')) {
					return util.login().then((res) => {
						code = res.code
						return getUserInfoByOpenId(code).then((res) => {
							let data = res.result;
							commit('SET_IS_NEW_USER', data.isNew)
							if (data.isNew) {
								commit('SET_OPENID', data.openid)
							} else {
								console.log("保存token")
								wx.setStorageSync('token', data.token.access_token)
								wx.setStorageSync('userInfo', data.userInfo)
								commit('SET_TOKEN', data.token.access_token)
								commit('SET_USER_INFO', data.userInfo)
							}
							resolve()
						}).catch((err) => {
							reject(err);
						})
					})
				}
			})
		})
	},

	/**
	 * 解密用户信息并登录
	 */
	DecryptUserInfo({
		commit
	}, _data) {
		return new Promise(function(resolve, reject) {
			return decryptUserInfo(_data).then((res) => {
				let _token = res.result.token.access_token;
				let _userInfo = res.result.userInfo;

				uni.setStorageSync("token", _token);
				uni.setStorageSync("userInfo", _userInfo);

				commit("SET_TOKEN", _token);
				commit("SET_USER_INFO", _userInfo);

				commit('SET_IS_NEW_USER', !1)
				resolve()
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
