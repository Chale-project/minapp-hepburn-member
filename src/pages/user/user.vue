<template>
  <view class="pages user">
    <view class="user-customer">
      <view class="user-info">
        <view class="user-info-left">
          <view class="user-avatar" @click="navigateToMember">
            <image :src="userInfo.headPic?userInfo.headPic:'/static/images/icon_avatar.png'" mode="widthFix" />
          </view>
        </view>
        <view class="user-info-center ellipsis">
          <template v-if="!isNewUser">
            <text class="user-nickname" @click="navigateToMember">尊敬的 {{userInfo.nickname}}</text><text class="user-level" @click="navigateToMember">[{{curShopUserInfo.membershipName?curShopUserInfo.membershipName:''}}]</text>
          </template>
          <template v-else>
            <view class="user-unlogin" @click="openAuth">点击登录</view>
          </template>
        </view>
        <view class="user-info-right" v-if="!isNewUser">
          <uni-icons type="compose" size="21" color="#eee" @click="goToProfile"></uni-icons>
        </view>
      </view>
      <view class="customer-info">
        <view class="customer-circle-progress" v-if="!isNewUser">
          <progress-bar ref="progress" :progress_max="curShopUserInfo.nextLevelMoneyQuota" :progress_txt="curShopUserInfo.sumPayment" :sum="curShopUserInfo.orderSum" :level="curShopUserInfo.nextLevelMembershipName" />
        </view>

        <view class="customer-paycode">
          <view class="customer-pay-but">
            <button type="default" class="but-default but-pay-code" hover-class="but-default-active" @click="createPayCode">
              <image src="/static/images/icon_vip_pay.png" mode="widthFix" /><text>会员支付</text>
            </button>
          </view>
          <view class="customer-pay-tips">点击生成付款码</view>
        </view>

      </view>
    </view>

    <!-- 员工专区 -->
    <view class="user-card" v-if="curShopUserInfo.clerk&&managerMenu.length>0">
      <view class="card-header">
        <text>员工专区</text>
      </view>
      <view class="card-body clearfix">
        <navigator :url="v.path" :class="'category-link line col-'+managerMenu.length" v-for="(v,i) of managerMenu" :key="i">
          <view class="category-icon">
            <image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
          </view>
          <view class="category-text">{{v.name}}</view>
        </navigator>
      </view>
    </view>

    <!-- 我的记录 -->
    <view class="user-card">
      <view class="card-header">
        <text>我的记录</text>
      </view>
      <view class="card-body clearfix">
        <navigator :url="v.path" class="category-link" v-for="(v,i) of recordMenu" :key="i">
          <view class="category-icon">
            <image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
          </view>
          <view class="category-text">{{v.name}}</view>
        </navigator>
      </view>
    </view>

    <!-- 我的钱包 -->
    <view class="user-card">
      <view class="card-header">
        <text>我的钱包</text>
      </view>
      <view class="card-body clearfix">
        <view class="category-link line" :hover-class="i!=0?'none':''" v-for="(v,i) of walletMenu" :key="i" @click="navigateTo(v.path)">
          <view class="category-icon-title">
            <image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
            <text>{{v.name}}</text>
          </view>
          <view class="category-value ellipsis">{{i==0?formatMoney(v.value):v.value}}</view>
        </view>
      </view>
    </view>

    <view class="user-options-card">
      <van-cell-group custom-class="user-options-card-item">
        <van-cell :title="v.name" is-link v-for="(v,i) of optionsMenu" :key="i" @click="navigateToOptions(v.path,i)" />
      </van-cell-group>
    </view>

    <!-- Auth -->
    <auth :showAuth="showAuth" @change="closeAuth" @getuserinfo="getUserInfo" />
  </view>
</template>

<script>
import { uniIcons, uniList, uniListItem } from "@dcloudio/uni-ui";
import Auth from "@/components/auth";
import progressBar from "@/components/chocolate-progress-bar";
import util from "@/common/utils";
import { getCardCoupon } from "@/common/api";
import { mapGetters, mapActions } from "vuex";

const formatMoney = util.moneyFormat;
export default {
  name: "user",
  components: { Auth, progressBar, uniIcons, uniList, uniListItem },
  data() {
    return {
      formatMoney,
      showAuth: !1,
      managerMenu: [],
      recordMenu: [
        {
          name: "消费记录",
          icon: "/static/images/icon_sale_record.png",
          path: "/pages/Customer/consume/consumeRecord"
        },
        {
          name: "充值记录",
          icon: "/static/images/icon_recharge_record.png",
          path: "/pages/Customer/recharge/rechargeRecord"
        },
        {
          name: "评价记录",
          icon: "/static/images/icon_comment_record.png",
          path: "/pages/Customer/comments/commentList"
        }
      ],
      walletMenu: [
        {
          name: "储值",
          icon: "/static/images/icon_recharge.png",
          path: "/pages/Customer/recharge/recharge",
          value: 0
        },
        {
          name: "积分",
          icon: "/static/images/icon_integral.png",
          path: "/pages/Customer/integralRecord/integralRecord",
          value: 0
        },
        {
          name: "酒水",
          icon: "/static/images/icon_peer.png",
          path: "/pages/Customer/drinkDeposit/drinkDeposit",
          value: 0
        }
      ],
      optionsMenu: [
        {
          name: "加入微信卡包",
          path: "/pages/Customer/member/memberCard"
        },
        {
          name: "服务打赏评价",
          path: "/pages/Customer/userList/userList?where=3"
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "shopId",
      "shopInfo",
      "isNewUser",
      "openid",
      "userInfo",
      "curShopUserInfo",
      "refererSuid"
    ])
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await Promise.all([this.CheckIsNewUser()]).then(() => {
      this.showAuth = this.isNewUser ? !0 : !1;
      if (!this.isNewUser) {
        this.GetUserShopInfo(this.shopId).then(res => {
          const per =
            (res.sumPayment / res.nextLevelMoneyQuota).toFixed(2) * 100;
          this.$refs.progress.drawCircle(per);

          this.setBIJAndManagerMenu(res);
        });
      }
    });
    uni.stopPullDownRefresh();
  },

  // 初次加载
  async onLoad(options) {
    this.SetOptionsQuery({ options });
    await Promise.all([this.CheckIsNewUser()]).then(() => {
      this.showAuth = this.isNewUser ? !0 : !1;
      if (!this.isNewUser) {
        this.GetUserShopInfo(this.shopId).then(res => {
          const per =
            (res.sumPayment / res.nextLevelMoneyQuota).toFixed(2) * 100;
          this.$refs.progress.drawCircle(per);

          this.setBIJAndManagerMenu(res);
        });
      }
    });
  },

  created() {},

  mounted() {},

  methods: {
    ...mapActions("user", ["CheckIsNewUser", "DecryptUserInfo"]),
    ...mapActions("shop", ["SetOptionsQuery"]),
    ...mapActions("userShop", ["GetUserShopInfo"]),

    // 开启授权弹窗
    openAuth() {
      this.showAuth = !0;
    },

    // 关闭授权弹窗
    closeAuth() {
      this.showAuth = !1;
    },

    // 获取用户信息 绑定登录
    getUserInfo(e) {
      const data = e.detail;
      if (data.errMsg == "getUserInfo:ok") {
        const _decryptData = {
          encryptedData: data.encryptedData,
          iv: data.iv,
          openid: this.openid,
          shopId: this.shopId
        };
        this.DecryptUserInfo(_decryptData).then(res => {
          this.GetUserShopInfo(this.shopId).then(res => {
            const per =
              (res.sumPayment / res.nextLevelMoneyQuota).toFixed(2) * 100;
            this.$refs.progress.drawCircle(per);

            this.setBIJAndManagerMenu(res);
          });
          this.closeAuth();
        });
      } else {
        util.showToastError("更多精彩将与你擦肩而过哦！");
      }
    },

    //同步到微信卡包
    async getWxCard() {
      const that = this;
      const _info = await getCardCoupon(that.shopId)
        .then(res => {
          const _cardList = res.result;
          wx.addCard({
            cardList: _cardList,
            success: function(res) {
              util.showToastError("领取成功，请到微信-我的-卡包中查看");
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 设置储值、积分、酒水值，员工menuList
    setBIJAndManagerMenu(e) {
      let _walletMenu = this.walletMenu;
      _walletMenu[0].value = e.balance;
      _walletMenu[1].value = e.customerIntegral;
      this.managerMenu = e.menuList || [];
    },

    // 生成二维码
    createPayCode() {
      util.navigateTo("/pages/Customer/paycode/payCode");
    },

    // 到会员卡页面
    navigateToMember() {
      if (!this.isNewUser) util.navigateTo("/pages/Customer/member/memberCard");
    },

    // 到个人页面
    goToProfile() {
      util.navigateTo("/pages/Customer/profile/profile");
    },

    // 跳转
    navigateTo(path) {
      if (path) util.navigateTo(path);
    },

    //
    navigateToOptions(path, i) {
      if (i == 0) {
        uni.showModal({
          title: "提示",
          content: "确认领取微信卡包",
          success: res => {
            if (res.confirm) {
              this.getWxCard();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        util.navigateTo(path);
      }
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: `${this.shopInfo.shopName}邀您一起来嗨皮^_^！`,
      path: `/pages/user/user?shopId=${this.shopId}&refererSuid=${this.curShopUserInfo.id}`
    };
  }
};
</script>

<style lang="scss">
.user {
  .user-customer {
    padding: 10px 12px;
    background-color: #000;
    .user-info {
      display: flex;
      align-items: center;
      .user-info-left {
        width: 30px;
        height: 30px;
        margin-right: 5px;
        .user-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          image {
            width: 100%;
          }
        }
      }
      .user-info-center {
        width: calc(100% - 60px);
        color: #f2c977;
        font-size: 16px;
        .user-nickname {
        }
        .user-level {
          margin-left: 10px;
        }
      }
      .user-info-right {
        width: 24px;
        padding: 3px 0;
        text-align: right;
      }
    }
    .customer-info {
      padding: 10px 0;

      .customer-paycode {
        .customer-pay-but {
          width: 120px;
          margin: 0 auto 5px;
          .but-pay-code {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 2.3;
            background-color: #f2c977;
            image {
              width: 24px;
              margin-right: 5px;
            }
          }
        }
        .customer-pay-tips {
          padding: 5px 0;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .user-card {
    margin-bottom: 10px;
    background-color: #fff;
    .card-header {
      padding: 10px 12px;
      text-align: center;
      text {
        position: relative;
        padding: 5px 0;
        line-height: 20px;
      }
      text::after {
        //背景线条
        position: absolute;
        width: 30px;
        height: 1px;
        content: "";
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        background-color: rgb(182, 176, 176);
        overflow: hidden;
      }
    }
    .card-body {
      display: flex;
      justify-content: space-around;
      padding: 5px;
      background-color: #fff;
      .category-link {
        position: relative;
        width: 33.333333%;
        box-sizing: border-box;
        padding: 5px;
        text-align: center;
        .category-icon {
          height: 33px;
          line-height: 33px;
          margin-bottom: 10px;
          overflow: hidden;
          image {
            width: 30px;
          }
        }
        .category-icon-title {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            width: 20px;
            margin-right: 5px;
          }
          text {
            color: #666;
          }
        }
      }
      .category-link.line.col-2:nth-child(1)::after,
      .category-link.line.col-3:nth-child(1)::after,
      .category-link.line.col-3:nth-child(2)::after {
        content: "";
        position: absolute;
        width: 1px;
        top: 10px;
        bottom: 10px;
        right: 0;
        background-color: #eee;
      }
    }
  }
}
</style>
