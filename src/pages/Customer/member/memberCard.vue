<template>
  <view class="pages member-card">
    <view class="member-card-container">
      <view class="card-face">
        <view class="card-face-top">
          <view class="user-info">
            <view class="user-avatar">
              <image :src="curShopUserInfo.headPic?curShopUserInfo.headPic:'/static/images/icon_user_head.png'" mode="widthFix" />
            </view>
            <view class="user-name-lev">
              <view class="user-name ellipsis" v-if="curShopUserInfo.nickname">{{curShopUserInfo.nickname}}<text v-if="curShopUserInfo.name">（{{curShopUserInfo.name}}）</text></view>
              <view class="user-name ellipsis" v-else @click="openAuth"><text>请登录</text></view>
              <view class="user-level">
                <image src="/static/images/logo.png" mode="widthFix" />
                <text>[{{curShopUserInfo.membershipName||''}}]</text>
              </view>
            </view>
          </view>
          <view class="user-qr-icon" @click="goToPayCode">
            <image src="/static/images/icon_qr.png" mode="widthFix" />
          </view>
        </view>

        <view class="card-face-middle">
          <image class="card-logo" src="/static/images/icon_logo_text.png" mode="widthFix" />
        </view>

        <view class="card-face-bottom">
          <view class="card-number ellipsis"><text>{{curShopUserInfo.membershipCardCode}}</text></view>
          <view class="card-balance">
            <view class="icon_balance">
              <image src="/static/images/icon_balance_black.png" mode="widthFix" />
            </view>
            <view class="balance-value ellipsis">￥{{curShopUserInfo.balance|formatMoney}}</view>
          </view>
        </view>
      </view>
      <view class="member-data">
        <view class="recharge-balance">
          <view class="title">充值余额（元）</view>
          <view class="value ellipsis">￥{{curShopUserInfo.chargeBalance|formatMoney}}</view>
        </view>
        <view class="give-balance">
          <view class="title">赠送余额（元）</view>
          <view class="value ellipsis">￥{{curShopUserInfo.presentBalance|formatMoney}}</view>
        </view>
      </view>
    </view>

    <view class="member-card-footer">
      <form @submit="goToRecharge" :report-submit='true'>
        <button type="default" form-type="submit" class="but-default but-recharge-submit">
          <image src="/static/images/icon_but_recharge.png" mode="widthFix" /><text>会员卡充值</text>
        </button>
      </form>
    </view>

    <back-home />

    <!-- Auth -->
    <auth :showAuth="showAuth" @change="closeAuth" @getuserinfo="getUserInfo" />
  </view>
</template>

<script>
import Auth from "@/components/auth";
import backHome from "@/components/backHome";
import { saveFormId } from "@/common/api";
import util from "@/common/utils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Auth,
    backHome
  },
  data() {
    return {
      showAuth: !1
    };
  },
  computed: {
    ...mapGetters(["shopId", "isNewUser", "openid", "curShopUserInfo"])
  },

  // 下拉刷新
  async onPullDownRefresh() {
    if (this.isNewUser) {
      await Promise.all([this.CheckIsNewUser()]).then(() => {
        this.showAuth = this.isNewUser ? !0 : !1;
        if (!this.isNewUser) {
          this.GetUserShopInfo(this.shopId);
        }
      });
    } else {
      this.GetUserShopInfo(this.shopId);
    }
    uni.stopPullDownRefresh();
  },

  async onLoad(options) {
    this.SetOptionsQuery({
      options
    });

    if (this.isNewUser) {
      await Promise.all([this.CheckIsNewUser()]).then(() => {
        this.showAuth = this.isNewUser ? !0 : !1;
        if (!this.isNewUser) {
          this.GetUserShopInfo(this.shopId);
        }
      });
    } else {
      this.GetUserShopInfo(this.shopId);
    }
  },

  onShow() {},

  created() {},

  mounted() {},

  methods: {
    ...mapActions("user", ["CheckIsNewUser", "DecryptUserInfo"]),
    ...mapActions("shop", ["SetOptionsQuery"]),
    ...mapActions("userShop", ["GetUserShopInfo"]),

    // 去付款页面
    goToPayCode() {
      util.navigateTo("/pages/Customer/paycode/payCode");
    },

    //去充值页面
    goToRecharge(e) {
      saveFormId(e.detail.formId);
      util.navigateTo("/pages/Customer/recharge/recharge");
    },

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
          this.GetUserShopInfo(this.shopId);
          this.closeAuth();
        });
      } else {
        util.showToastError("更多精彩将与你擦肩而过哦！");
      }
    }
  }
};
</script>

<style lang="scss">
.member-card {
  &-container {
    background-color: #3e3b3b;
    padding-top: 20px;

    .card-face {
      position: relative;
      width: 311px;
      height: 134px;
      margin: 0 auto;
      padding: 20px 12px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: #eccda0;
      color: #000;
      overflow: hidden;

      &-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;

        .user-info {
          width: calc(100% - 40px);
          display: flex;
          align-items: center;

          .user-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 10px;
            overflow: hidden;
          }

          .user-name-lev {
            width: calc(100% - 60px);

            .user-name {
              margin-bottom: 5px;
              font-size: 16px;
              font-weight: 700;
            }

            .user-level {
              image {
                width: 20px;
                margin-right: 5px;
              }
            }
          }
        }

        .user-qr-icon {
          width: 30px;
        }
      }

      &-middle {
        margin-bottom: 20px;
        text-align: right;

        .card-logo {
          width: 40%;
        }
      }

      &-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .card-number {
          width: 120px;

          text {
            font-size: 16px;
            text-shadow: 1px 1px 3px #666;
            font-weight: 700;
          }
        }

        .card-balance {
          width: calc(100% - 120px);
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .icon_balance {
            width: 22px;
            margin-right: 5px;
          }

          .balance-value {
            max-width: calc(100% - 27px);
            font-size: 19px;
            font-weight: 700;
          }
        }
      }
    }

    .member-data {
      padding: 15px;
      background-color: #000;
      display: flex;
      align-items: center;

      .recharge-balance,
      .give-balance {
        position: relative;
        width: 50%;

        .title,
        .value {
          padding: 5px;
          text-align: center;
          font-size: 18px;
          color: #fff;
        }

        .title {
          font-size: 16px;
        }
      }

      .recharge-balance::after {
        content: "";
        position: absolute;
        width: 1px;
        top: 10px;
        bottom: 10px;
        right: 0;
        background-color: #fff;
      }
    }
  }

  &-footer {
    margin: 50px 30px;

    .but-recharge-submit {
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 24px;
        margin-right: 15px;
      }
    }
  }
}
</style>
