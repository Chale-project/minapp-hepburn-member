<template >
  <view class="pages pay-code">
    <view class="pay-code-container">
      <view class="pay-code-header">
        <text>[{{curShopUserInfo.membershipName||''}}]</text>
      </view>
      <view class="pay-code-body">
        <view class="code-bar">
          <image :src="payCode.barcodePath?payCode.barcodePath:'payCode'" mode="widthFix" />
        </view>
        <view class="code-number">
          <text class="hide-number" v-if="hide">{{payCodeNumber}}</text>
          <text class="hide-number" v-else>{{payCode.payCode}}</text>
          <text class="btu-see-all-num" @click="toggleCodeShowHide">{{hide?'查看':'隐藏'}}数字</text>
        </view>
        <view class="code-qr">
          <image :src="payCode.paycodePath?payCode.paycodePath:'payCode'" mode="widthFix" />
        </view>

        <view class="pay-code-status">
          <view class="success" v-if="status">
            <van-icon name="passed" size="20px" custom-style="vertical-align: top;" /> <text>核销成功！</text>
          </view>
          <view class="waiting" v-else>
            <van-icon name="underway-o" size="20px" custom-style="vertical-align: top;" /> <text>等待核销…</text>
          </view>
        </view>

        <view class="pay-code-tips">
          <van-icon name="warn-o" size="18px" custom-style="vertical-align: top;" /> <text>本支付码定时更新，请勿截屏！</text>
        </view>
      </view>
      <view class="pay-code-footer">
        <view class="footer-left">
          <view class="balance-title"><text>￥</text> 余额</view>
          <view class="balance-value">￥ {{curShopUserInfo.balance|formatMoney}}</view>
        </view>
        <view class="footer-right">
          <button type="default" class="but-default but-to-recharge" @click="navigateTo">充值</button>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { getPayCode, getPayState } from "@/common/api";
import util from "@/common/utils";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      timerA: null,
      timerB: null,
      hide: !0,
      payCode: {},
      payCodeNumber: "",
      status: !1 // 是否已完成核销支付
    };
  },
  computed: {
    ...mapGetters(["shopId", "curShopUserInfo"])
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await Promise.all([
      this.getPayCodeInfo(),
      this.GetUserShopInfo(this.shopId)
    ]);
    uni.stopPullDownRefresh();
  },

  async onLoad(options) {
    await Promise.all([
      this.getPayCodeInfo(),
      this.GetUserShopInfo(this.shopId)
    ]);
  },

  onShow() {},

  created() {},

  mounted() {
    this.setTimerGetPayCode();
    this.checkIsPay();
  },

  onHide() {
    const _ta = this.timerA;
    const _tb = this.timerB;
    clearInterval(_ta);
    clearInterval(_tb);
    this.status = !1;
  },

  onUnload() {
    const _ta = this.timerA;
    const _tb = this.timerB;
    clearInterval(_ta);
    clearInterval(_tb);
    this.status = !1;
  },

  methods: {
    ...mapActions("userShop", ["GetUserShopInfo"]),

    //切换数字显示隐藏
    toggleCodeShowHide() {
      this.hide = !this.hide;
    },

    // 去充值
    navigateTo() {
      util.navigateTo("/pages/Customer/recharge/recharge");
    },

    // 定时获取支付码 2分钟
    setTimerGetPayCode(id) {
      this.timerA = setInterval(() => {
        this.getPayCodeInfo();
      }, 2 * 60 * 1000);
    },

    // 获取付款码信息
    async getPayCodeInfo() {
      util.showWxLoading();
      const info = await getPayCode(this.shopId)
        .then(res => {
          util.hideWxLoading();
          this.payCode = res.info;
          this.payCodeNumber = `${res.info.payCode.substring(0, 5)} ****`;
        })
        .catch(() => {
          util.hideWxLoading();
        });
    },

    // 定时获取核销状态 2秒
    checkIsPay() {
      this.timerB = setInterval(() => {
        if (!this.status) {
          this.getPayStatus();
        } else {
          clearInterval(this.timerB);
          setTimeout(() => {
            util.reLaunch("/pages/Customer/paycode/paySuccess");
          }, 200);
        }
      }, 2000);
    },

    // 查询是否已完成核销
    async getPayStatus() {
      const status = await getPayState().then(res => {
        this.status = res.result;
      });
    }
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.pay-code {
  padding: 20px 30px;
  position: relative;
  .pay-code-container {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .pay-code-header {
      padding: 10px 20px;
      text-align: center;
      color: #f2c977;
      font-size: 16px;
      background-color: #000;
    }
    .pay-code-body {
      min-height: 290px;
      padding: 20px;
      .code-bar {
        margin-bottom: 10px;
      }
      .code-number {
        margin-bottom: 10px;
        text-align: center;
        .hide-number {
          margin-right: 5px;
          letter-spacing: 2px;
        }
        .btu-see-all-num {
          cursor: pointer;
        }
      }
      .code-qr {
        margin-bottom: 10px;
        text-align: center;
        image {
          width: 200px;
        }
      }

      .pay-code-status {
        margin-bottom: 20px;
        text-align: center;
        .success {
          padding: 5px 0;
          color: #4cd964;
        }
        .waiting {
          padding: 5px 0;
        }
        .van-icon {
          margin-right: 10px;
        }
      }
      .pay-code-tips {
        font-size: 12px;
      }
    }
    .pay-code-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 5px;
      padding: 10px 20px;
      border-top: 1px dashed #ccc;
      stroke-dasharray: 4;
      stroke-dashoffset: 22;
      .footer-left {
        flex: 2;
        .balance-title {
          margin-bottom: 5px;
          text {
            display: inline-block;
            width: 12px;
            height: 12px;
            padding: 2px;
            margin-right: 5px;
            font-size: 12px;
            border-radius: 50%;
            line-height: 14px;
            text-align: center;
            border: 1upx solid #000;
          }
        }
      }
      .footer-right {
        flex: 1;
        text-align: right;
        .but-to-recharge {
        }
      }
    }
  }
}
</style>
