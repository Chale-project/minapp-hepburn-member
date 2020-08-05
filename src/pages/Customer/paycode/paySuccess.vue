<template>
  <view class="pages pay-success">
    <view class="pay-success-content">
      <view class="pay-success-icon">
        <van-icon name="success" color="#fff" size="24px" />
      </view>
      <view class="pay-success-text">
        <text>支付成功</text>
      </view>
    </view>

    <view class="pay-success-button">
      <button type="default" class="but-default but-to-home" @click="navigateTo">返回首页</button>
    </view>

    <!-- 返回店铺首页 -->
    <back-home />
  </view>
</template>

<script>
import util from "@/common/utils";
import backHome from "@/components/backHome";
export default {
  components: {
    backHome
  },
  data() {
    return {};
  },

  onLoad(options) {},

  onShow() {},
  created() {},

  mounted() {},

  methods: {
    // 返回首页
    navigateTo() {
      util.reLaunch("/pages/user/user");
    }
  }
};
</script>

<style lang="scss">
.pay-success {
  position: relative;
  .pay-success-content {
    padding: 50px 15px 30px;
    .pay-success-icon {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      text-align: center;
      line-height: 65px;
      border-radius: 50%;
      background-color: #4bc065;
    }
    .pay-success-text {
      padding: 20px 0 0;
      text-align: center;
      font-size: 20px;
      color: #333;
    }
  }

  .pay-success-button {
    margin: 0 50px;
    padding: 0 15px;
    text-align: center;
    .but-go-shopping {
      border: 1px solid #f85437;
      border-radius: 4px;
    }
    .but-go-order {
      margin-left: 10px;
    }
    .pay-button {
      height: 38px;
      line-height: 38px;
      background: transparent;
      border-color: #666;
      border-radius: 6px;
    }
  }
}
</style>
