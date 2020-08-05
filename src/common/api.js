import request from './request'

let ApiRootUrl = null
switch (process.env.NODE_ENV) {
  case 'development':
    ApiRootUrl = "https://cs.wxmin.qiyijk.vip/gateway/"//线上环境
    // ApiRootUrl = "http://192.168.1.33:9028/gateway/"
    break;
  case 'production':
    ApiRootUrl = "https://cs.wxmin.qiyijk.vip/gateway/"//线上环境
    break;
}
export const baseurl = ApiRootUrl
/**
 * 公共接口
 */

// 微信登录通过code获取session_key openid(new)
export const getOpenIdByCode = (code) => request.get('customer/getSessionKeyByCode/' + code)

// 通过openid获取用户信息(是否是新用户)
export const getUserInfoByOpenId = (code) => request.get('customer/getSessionIdByCode/' + code)

// 通过encryptedData，session_key，iv解密用户信息， 在满足UnionID下发条件的情况下会返回
export const decryptUserInfo = (paramObj) => request.post('customer/getWxUserInfo', paramObj)

// 通过encryptedData，session_key，iv，openid解密用户手机号
//绑定微信手机号
export const bindWxMobile = (paramObj) => request.post('customerData/binding/phone', paramObj)

// 存储用户小程序formId
export const saveFormId = (id) => request.get('customerData/saveFormId/' + id)

//上传文件接口
export const uploadFile = ApiRootUrl + 'basic/file/upload'

//发送验证码
export const getSmsCode = (paramObj) => request.get('customer/registerSmsSend/' + paramObj.mobile)

// 支付
export const payment = (paramObj) => request.post('shoube/pay', paramObj)

/**
 * 个人信息相关
 */
// 修改个人信息
export const modifyUserInfo = (paramObj) => request.put('customerData/modify', paramObj)

/**
 * 个人在当前店铺数据
 */
export const getCurShopUserInfo = (id) => request.get('shopCustomer/getUserInfoOrClerkInfo/' + id)

// 获取我的付款码
export const getPayCode = (id) => request.get('customerData/paycode/' + id)

// 获取付款码核销结果
export const getPayState = () => request.get('customerData/pay/result')

// 获取微信卡包
export const getCardCoupon = (id) => request.get('shopCard/wxAddCard/' + id)

// 获取充值记录（type: save,充值记录）
export const getRechargeRecord = (paramObj) => request.post('remainingRecord/list', paramObj)

// 获取消费记录（type: expense，消费记录。）
export const getConsumeRecord = (paramObj) => request.post('consume/list', paramObj)

//获取积分列表
export const getIntegralRecord = (paramObj) => request.post('integralRecord/list', paramObj)

//添加评论
export const addClerkComment = (paramObj) => request.post('clerkComment/addClerkComment', paramObj)

//获取评论
export const getClerkCommentPage = (paramObj) => request.post('clerkComment/getClerkCommentPage', paramObj)


/**
 * 获取店铺相关
 */
// 获取店铺信息
export const getShopInfo = (id) => request.get('shop/getShopInfo/' + id)
// 通过code获取店铺number
export const getShopNumberByCode = () => request.get('getShopNumberByCode')
//获取店铺会员列表
export const getShopCustomerPage = (paramObj) => request.post('shopAnalysis/customerList', paramObj)
//收款
export const verification = (paramObj) => request.post('shopClerk/verification', paramObj)
//会员数据统计
export const customerListAnalysis = (id) => request.get('shopAnalysis/customerAnalysis/' + id)
// 获取店铺充值卡
export const getRechargeCardList = (id) => request.get('rechargeCcard/all/list/' + id)
// 获取用户动态
export const getShopActionPage = (paramObj) => request.post('customerAction/getShopActionPage', paramObj)
// 获取用户信息
export const getShopCustomerInfo = (paramObj) => request.post('shopCustomer/getShopCustomerInfo', paramObj)
//消费清单
export const getConsumeList = (paramObj) => request.post('consume/list', paramObj)
//消费清单
export const getShopClerkPage = (paramObj) => request.post('shopClerk/getShopClerkPage', paramObj)
//获取店员信息
export const getShopClerkInfo = (id) => request.get('shopClerk/getShopClerkInfo/' + id)
//查询店铺寄存商品列表
export const getConsignList = (shopId) => request.get('consign/all/list/' + shopId)
//寄存记录分页列表
export const getConsignRecordList = (paramObj) => request.post('/consign/record/list', paramObj)