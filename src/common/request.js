// #ifdef  H5
import Fly from 'flyio/dist/npm/fly'
// #endif
// #ifdef  MP-WEIXIN
import Fly from 'flyio/dist/npm/wx'
// #endif
import util from "@/common/utils";

const request = new Fly()
let ApiRootUrl = null
switch (process.env.NODE_ENV) {
	case 'development':
		ApiRootUrl = "https://cs.wxmin.qiyijk.vip/gateway/" //线上环境
		// ApiRootUrl = "http://192.168.1.33:9028/gateway/"
		break;
	case 'production': 
		ApiRootUrl = "https://cs.wxmin.qiyijk.vip/gateway/" //线上环境
		break;
}

// 设置请求基地址
request.config.baseURL = ApiRootUrl
request.config.timeout = 10000

request.interceptors.request.use((request) => {
	// 给所有请求添加自定义header，带上token信息让服务器验证用户登陆
	request.headers['token'] = uni.getStorageSync('token');
	// console.log('flyio发请求,request为', request);
	uni.showNavigationBarLoading()
	return request
})

request.interceptors.response.use(
	(response, promise) => {
		uni.hideNavigationBarLoading()
		if (response.data.code === 0) {
			return promise.resolve(response.data)
		} else if (response.data.code === 401) {

			uni.reLaunch({
				url: "/pages/user/user"
			});
		} else {
			util.showToastError(response.data.msg);
			return promise.reject(response.data)
		}
	},
	(err, promise) => {
		uni.hideNavigationBarLoading()
		if (err.status == 0) {
			util.showToastError("网络连接异常，请检查您的网络！");
		} else if (err.status == 1) {
			util.showToastError("请求超时，请稍后再试！");
		} else {
			util.showToastError("加载失败，请稍后再试！");
		}
		return promise.resolve(err.data)
	}
)

export default request


