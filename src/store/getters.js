const getters = {
  isNewUser: state => state.user.isNewUser,
  token: state => state.user.token,
  openid: state => state.user.openid,
  userInfo: state => state.user.userInfo,
  shopId: state => state.shop.shopId,
  shopInfo: state => state.shop.shopInfo,
  refererSuid: state => state.shop.refererSuid,
  
  curShopUserInfo: state => state.userShop.curShopUserInfo
}
export default getters
