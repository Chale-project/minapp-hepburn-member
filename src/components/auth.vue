<template >
  <uni-popup ref="popup" :custom="true" :mask-click="false" :show="showAuth">
    <view class="auth">
      <image src="/static/images/logo.png" mode="widthFix" style="width:100px"></image>
      <view class="auth-modal-mask-title">{{authTitle}}</view>
      <view class="auth-modal-mask-sub-title">{{authSubTitle}}</view>
      <button v-if="canIUse" type="default" class="but-default btn-auth-login" hover-class="but-default-active" lang="zh_CN" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">立即加入</button>
      <text v-else>微信版本太低，请先升级微信！</text>
    </view>
    <view class="auth-close" @click="closePopup">
      <uni-icons type="close" size="30" color="#ccc"></uni-icons>
    </view>

  </uni-popup>
</template>

<script>
import { uniPopup, uniIcons } from "@dcloudio/uni-ui";

export default {
  name: "Auth",
  components: {
    uniPopup,
    uniIcons
  },
  props: {
    showAuth: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      canIUse: uni.canIUse("button.open-type.getUserInfo"),
      authTitle: "赫本酒吧申请获得以下权限",
      authSubTitle: "获取您的公开信息（头像、昵称、地区及性别）"
    };
  },
  computed: {},
  created() {},

  mounted() {},

  onLoad() {},

  onShow() {},

  methods: {
    closePopup() {
      this.$emit("change");
    },

    bindGetUserInfo(e) {
      this.$emit("getuserinfo", e);
    }
  }
};
</script>

<style lang="scss">
.auth {
  background: #fff;
  border-radius: 4px;
  text-align: center;
  padding: 15px;
  overflow: hidden;
  .auth-modal-mask-title {
    padding: 10px 0;
    color: #222;
  }

  .auth-modal-mask-sub-title {
    font-size: 11px;
    color: #999;
  }

  .btn-auth-login {
    margin-top: 15px;
  }
}
.auth-close {
  width: 30px;
  height: 30px;
  margin: 15px auto 0;
}
</style>
