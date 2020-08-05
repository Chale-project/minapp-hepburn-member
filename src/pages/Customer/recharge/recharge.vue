<template >
  <view class="pages recharge">
    <view class="recharge-balance-face">
      <view class="cur-title"> <text>我的钱包</text> </view>

      <view class="cur-balance">
        <view class="icon_balance">
          <image src="/static/images/icon_balance_white.png" mode="widthFix" />
        </view>
        <view class="balance-value ellipsis">￥ {{curShopUserInfo.balance|formatMoney}}</view>
      </view>
    </view>

    <view class="recharge-container">
      <view class="recharge-container-shop">
        <view class="shop-logo">
          <image src="/static/images/logo.png" mode="widthFix" />
        </view>
        <view class="shop-name ellipsis">赫本酒吧<text>(武汉国广)</text></view>
      </view>
      <view class="recharge-container-form">
        <view class="form-title">充值金额</view>
        <view class="form-money">
          <view class="money-icon">￥</view>
          <view class="money-input">
            <input :value="inputMoney" type="digit" placeholder-style="font-size:14px" placeholder="请输入充值金额" @focus="onFocusMoney" @input="onChangeMoney" />
          </view>
        </view>
      </view>

      <view class="recharge-container-content">
        <van-row gutter="10">
          <van-col span="8" custom-class="recharge-card-item" v-for="(v,i) of rechargeCardList" :key="i">
            <view :class="v.checked?'recharge-card-content active':'recharge-card-content'" @click="choiceRecharge(i)">
              <view class="recharge-card-value ellipsis">
                ￥
                <text>{{v.cardMoney/100}}</text>
              </view>
              <view class="recharge-card-desc ellipsis">{{v.presentMoney>0?' 送'+v.presentMoney/100+'元余额':''}}{{v.presentIntegral>0?' 送'+v.presentIntegral+'积分':''}}</view>
            </view>
          </van-col>
        </van-row>
        
        <view class="recharge-detail" v-if="(checkedObj.presentMoney/100).toFixed(2).length>=5||checkedObj.presentMoney||checkedObj.presentIntegral||checkedObj.presentJson">
          <text>充{{checkedObj.cardMoney/100}}元，</text><text v-if="checkedObj.presentMoney">送{{checkedObj.presentMoney/100}}余额；</text><text v-if="checkedObj.presentIntegral">送{{checkedObj.presentIntegral}}积分；</text><text v-if="checkedObj.presentJson">赠{{checkedObj.presentJson}}。</text>
        </view>

        <view class="recharge-tips">
          <uni-icons type="info" size="21" color="#333"></uni-icons>
          <text>充值赠送金额与酒水果盘不支持退货退款！</text>
        </view>
      </view>

      <view class="recharge-container-submit">
        <form @submit="formSubmit" :report-submit='true'>
          <button type="default" form-type="submit" class="but-default but-recharge-submit" :disabled="rechargeDisabled">
            <image src="/static/images/icon_but_recharge.png" mode="widthFix" /><text>立即充值</text>
          </button>
        </form>
      </view>
    </view>

    <back-home />
  </view>
</template>

<script>
import { saveFormId, getRechargeCardList } from "@/common/api";
import util from "@/common/utils";
import pay from "@/common/pay";
import Empty from "@/components/empty";
import backHome from "@/components/backHome";
import { uniIcons } from "@dcloudio/uni-ui";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Empty,
    uniIcons,
    backHome
  },
  data() {
    return {
      orderType: "recharge",
      rechargeCardList: [],
      inputMoney: null,
      checkedCardId: null,
      checkedObj: {},
      rechargeDisabled: !0
    };
  },
  computed: {
    ...mapGetters(["shopId", "curShopUserInfo"])
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await Promise.all([
      this.getRechargeList(),
      this.GetUserShopInfo(this.shopId)
    ]);
    uni.stopPullDownRefresh();
  },

  async onLoad() {
    await Promise.all([
      this.getRechargeList(),
      this.GetUserShopInfo(this.shopId)
    ]);
  },

  onShow() {},

  created() {},

  mounted() {},

  methods: {
    ...mapActions("userShop", ["GetUserShopInfo"]),

    //输入框获取焦点
    onFocusMoney() {
      this.rechargeDisabled = !0;
      this.checkedCardId = null;
      this.checkedObj = {};
      const _cardList = this.rechargeCardList;
      if (_cardList.length > 0) {
        _cardList.map(i => {
          if (i.checked) i.checked = !1;
        });
      }
    },

    // 输入充值金额
    onChangeMoney(e) {
      const _inputMoney = e.detail.value;
      if (_inputMoney - 0.01 >= 0) {
        this.rechargeDisabled = !1;
        this.inputMoney = _inputMoney;
      } else {
        this.inputMoney = null;
        this.rechargeDisabled = !0;
      }
    },

    //校验输入金额
    checkMoney() {
      let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
        inputMoney = this.inputMoney,
        flag = !0,
        limitminInputMoney = 0.01;

      if (!reg.test(inputMoney)) {
        util.showToastError("请输入有效的充值金额！");
        flag = !1;
      } else if (inputMoney - limitminInputMoney < 0) {
        util.showToastError("至少支付一分钱！");
        flag = !1;
      }
      return flag;
    },

    // 校验充值卡
    checkCard() {
      const flag = !0;
      if (this.rechargeCardList.length > 0) {
        if (!this.checkedCardId) {
          util.showToastError("请点选充值卡！");
          flag = !1;
        }
      } else {
        util.showToastError("请输入充值金额！");
        flag = !1;
      }
      return flag;
    },

    //点选充值卡
    choiceRecharge(i) {
      this.inputMoney = null;
      const _rechargeCardList = this.rechargeCardList;
      _rechargeCardList.map((item, index) => {
        if (index == i) {
          item.checked = !0;
          this.checkedCardId = item.id;
          this.checkedObj = item;
          this.rechargeDisabled = !1;
        } else {
          item.checked = !1;
        }
      });
    },

    formSubmit(e) {
      saveFormId(e.detail.formId);
      if (!this.inputMoney) {
        const _flagA = this.checkCard();
        _flagA && this.submitRecharge();
      } else {
        const _flagB = this.checkMoney();
        _flagB && this.submitRecharge();
      }
    },

    //充值
    async submitRecharge() {
      if (this.rechargeDisabled) return;

      const data = {
        shopId: this.shopId,
        orderType: this.orderType,
        money: this.inputMoney,
        rerechargeCardId: this.checkedCardId
      };
      this.rechargeDisabled = !0;
      const recharge = await pay
        .payOrder(data)
        .then(res => {
          this.rechargeDisabled = !1;
          if (res.errMsg === "requestPayment:ok") {
            util.showToastSuccess("充值成功！");
          }
        })
        .catch(err => {
          this.rechargeDisabled = !1;
          if (err.errMsg === "requestPayment:fail cancel") {
            util.showToastError("取消支付！");
          } else if (err.msg) {
            util.showToastError(err.msg);
          }
        });
    },

    //获取充值列表
    async getRechargeList() {
      const recharge = await getRechargeCardList(this.shopId).then(res => {
        if (res.list.length > 0) {
          const _list = res.list;
          _list.map(i => {
            i.checked = !1;
          });
          this.rechargeCardList = _list;

          this.rechargeDisabled = !1;
          this.rechargeCardList[0].checked = !0;
          this.checkedCardId = this.rechargeCardList[0].id;
          this.checkedObj = this.rechargeCardList[0];
        } else {
          this.rechargeDisabled = !0;
          this.rechargeCardList = [];
          this.checkedCardId = null;
          this.checkedObj = {};
          this.inputMoney = null;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.recharge {
  &-balance-face {
    padding: 5px 12px 50px;
    text-align: center;
    background-color: #000;
    color: #fff;
    .cur-title {
      margin-bottom: 10px;
      text {
        position: relative;
        padding-bottom: 5px;
        line-height: 20px;
      }
      text::after {
        //背景线条
        position: absolute;
        content: "";
        width: 30px;
        height: 1px;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        background-color: rgb(182, 176, 176);
        overflow: hidden;
      }
    }
    .cur-balance {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      padding: 10px 0;

      .icon_balance {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        overflow: hidden;
      }
      .balance-value {
        max-width: calc(100% - 50px);
        font-size: 24px;
      }
    }
  }

  &-container {
    position: relative;
    margin: -50px 12px 0;
    padding: 10px 12px;
    z-index: 99;
    background-color: #fff;
    border-radius: 8px;
    &-shop {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .shop-logo {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border-radius: 50%;
        overflow: hidden;
      }
      .shop-name {
        width: calc(100% - 40px);
        font-size: 16px;
      }
    }
    &-form {
      margin-bottom: 20px;
      .form-title {
        margin-bottom: 10px;
      }
      .form-money {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f1f1f1;
        .money-icon {
          width: 40px;
          font-size: 30px;
        }
        .money-input {
          width: calc(100% - 40px);
          margin-top: 5px;
          font-size: 20px;
        }
      }
    }
    &-content {
      padding: 15px 0;
      .recharge-card-item {
        padding-top: 5px;
        padding-bottom: 5px;
        .recharge-card-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5px;
          height: 130rpx;
          border: 0.5px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          .recharge-card-title {
          }
          .recharge-card-value {
            text-align: center;
            color: #f85437;
            text {
              font-size: 20px;
            }
          }
          .recharge-card-desc {
            text-align: center;
            font-size: 12px;
            color: #999;
          }
        }
        .recharge-card-content.active {
          border-color: #000;
        }
      }
      .recharge-detail {
        padding: 5px 0;
        color: #999;
      }
      .recharge-tips {
        padding-top: 15px;
        text {
          margin-left: 10px;
        }
      }
    }

    &-submit {
      margin: 20px 15px;
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
}
</style>
