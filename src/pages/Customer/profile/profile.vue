<template>
  <view class="pages profile">
    <van-cell-group>
      <van-cell>
        <view slot="title" class="profile-avatar">
          <view class="avatar-title">头像</view>
          <view class="avatar-image">
            <image :src="userInfo.headPic?userInfo.headPic:'/static/images/icon_avatar.png'" mode="widthFix" />
          </view>
        </view>
      </van-cell>
      <van-field :value="userInfo.nickname" label="昵称" placeholder="请填写昵称" @change="onChangeNickname" input-class="textstyle" />
      <van-field :value="userInfo.name" label="真实姓名" placeholder="请填写真实姓名" @change="onChangeName" input-class="textstyle" />
      <van-field :value="userInfo.phoneNumber" label="手机号" placeholder=" " is-link disabled input-class="textstyle">
        <button slot="button" v-if="!userInfo.phoneNumber" type="default" class="but-default but-bind-mobile" hover-class="but-default-active" open-type="getPhoneNumber" @getphonenumber="goToBindMobile">绑定微信手机号</button>
      </van-field>
      <van-cell :value="userInfo.gender=='man'?'男':'女'" title="性别" is-link @click="toggleSex" value-class="textstyle" />
      <van-field :value="userInfo.age" label="年龄" type="number" placeholder="请填写年龄" @change="onChangeAge" input-class="textstyle" />
      <van-cell :value="userInfo.birthday" title="生日" is-link @click="setBirthday" value-class="textstyle" />
      <!-- <van-field :value="userInfo.idNumber" label="身份证" :maxlength="18" placeholder="请填写身份证" @change="onChangeIdNumber" input-class="textstyle" /> -->
      <!-- <van-field :value="userInfo.bodyStature" label="身高" type="number" placeholder="请填写身高（单位：cm）" @change="onChangeBodyStature" input-class="textstyle" /> -->
      <!-- <van-field :value="userInfo.bodyWeight" label="体重" type="number" placeholder="请填写体重（单位：kg）" @change="onChangeBodyWeight" input-class="textstyle" /> -->

      <van-cell :value="pca" title="省市区" @click="choicePCA" value-class="textstyle" />

      <van-field :value="userInfo.wechat" label="微信号" placeholder="请填写微信号" @change="onChangeWechat" input-class="textstyle" />

    </van-cell-group>
    <view class="submit-button">
      <form @submit="saveProfile" :report-submit='true'>
        <button type="default" form-type="submit" class="but-default but-save-profile">
          保存修改
        </button>
      </form>
    </view>

    <van-popup :show="showArea" position="bottom" @close="closeArea">
      <van-area :area-list="areaList" @confirm="sureArea" @cancel="cancelArea" />
    </van-popup>

    <van-popup :show="showDate" position="bottom" @close="closeDate">
      <van-datetime-picker type="date" :value="currentDate" :min-date="minDate" :max-date="maxDate" @confirm="sureDate" @cancel="cancelDate" />
    </van-popup>

  </view>
</template>

<script>
import {
  saveFormId,
  modifyUserInfo,
  getOpenIdByCode,
  bindWxMobile
} from "@/common/api";
import util from "@/common/utils";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      showArea: !1,
      showDate: !1,
      minDate: new Date(1950, 0, 1).getTime(),
      maxDate: new Date().getTime(),
      currentDate: new Date().getTime(),
      areaList: [],
      pca: "请选择省市区"
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created() {},

  onLoad(options) {
    uni.request({
      url: "https://cashier.youzan.com/wsctrade/uic/address/getAllRegion.json",
      success: response => {
        this.areaList = response.data.data;
      }
    });

    const _province = this.userInfo.province || "";
    const _city = this.userInfo.city || "";
    const _area = this.userInfo.area || "";
    if (!_province && !_city && !_area) {
      this.pca = "请选择省市区";
    } else {
      this.pca = _province + " " + _city + " " + _area;
    }
  },

  onShow() {},

  mounted() {},

  methods: {
    ...mapMutations("user", ["SET_USER_INFO"]),
    ...mapActions("user", ["GetOpenId"]),
    //设置昵称
    onChangeNickname(e) {
      const _nickname = e.detail;
      this.userInfo.nickname = _nickname;
    },

    //设置真实姓名
    onChangeName(e) {
      const _name = e.detail;
      this.userInfo.name = _name;
    },

    // 设置手机号
    onChangeMobile(e) {
      const _mobile = e.detail;
      this.userInfo.phoneNumber = _mobile;
    },

    //去绑定手机号
    goToBindMobile(e) {
      let data = e.detail;
      if (data.errMsg == "getPhoneNumber:ok") {
        this.GetOpenId()
          .then(openid => {
            const _encodeData = {
              encryptedData: data.encryptedData,
              iv: data.iv,
              openid: openid
            };
            this.bindUserMobile(_encodeData);
          })
          .catch(() => {
            console.log("session_key:获取失败");
          });
      }
    },

    //绑定手机号
    bindUserMobile(_encodeData) {
      bindWxMobile(_encodeData).then(res => {
        const _userInfo = res.info;
        this.SET_USER_INFO(_userInfo);
      });
    },

    //设置年龄
    onChangeAge(e) {
      const _age = e.detail;
      this.userInfo.age = _age;
    },

    //设置微信号
    onChangeWechat(e) {
      const _wechat = e.detail;
      this.userInfo.wechat = _wechat;
    },

    //设置身高
    onChangeBodyStature(e) {
      const _bodyStature = e.detail;
      this.userInfo.bodyStature = _bodyStature;
    },

    //设置体重
    onChangeBodyWeight(e) {
      const _bodyWeight = e.detail;
      this.userInfo.bodyWeight = _bodyWeight;
    },

    //展示性别选择
    toggleSex() {
      uni.showActionSheet({
        itemList: ["男", "女"],
        success: res => {
          if (res.tapIndex == 0) {
            this.userInfo.gender = "man";
          } else if (res.tapIndex == 1) {
            this.userInfo.gender = "woman";
          }
        }
      });
    },

    setBirthday() {
      this.showDate = !0;
    },

    closeDate() {
      this.showDate = !1;
    },
    //确认选择的
    sureDate(e) {
      const _date = util.formatTime(e.detail);
      this.userInfo.birthday = _date;
      this.showDate = !1;
    },

    //取消选择的
    cancelDate() {
      this.showDate = !1;
    },

    //选择省市区
    choicePCA() {
      this.showArea = !0;
    },

    //关闭省市区选择
    closeArea() {
      this.showArea = !1;
    },

    //确认选择的
    sureArea(e) {
      const _area = e.detail.values.map(item => {
        return item.name;
      });
      this.userInfo.province = _area[0];
      this.userInfo.city = _area[1] || "";
      this.userInfo.area = _area[2] || "";
      this.pca = _area.join(" ");
      this.showArea = !1;
    },

    //取消选择的
    cancelArea() {
      this.showArea = !1;
    },

    //保存个人信息
    async saveProfile(e) {
      saveFormId(e.detail.formId);
      const reg = /^(1)[0-9]{10}$/;

      const data = this.userInfo;
      if (data.phoneNumber) {
        if (!reg.test(data.phoneNumber)) {
          util.showToastError("请输入有效的手机号！");
          return;
        }
      }

      const info = await modifyUserInfo(data)
        .then(res => {
          util.showToastSuccess("修改成功！");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
.profile {
  position: relative;
  .profile-avatar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .avatar-title {
      width: calc(100% - 40px);
    }
    .avatar-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      image {
        width: 100%;
      }
    }
  }
  .textstyle {
    text-align: right;
    color: #666;
  }
  .but-bind-mobile {
    padding-right: 0;
    line-height: 1.7;
    color: #07c160;
    font-size: 14px;
    background-color: transparent;
  }
  button[type="default"].but-default.but-bind-mobile {
    background-color: transparent;
    color: #07c160;
  }

  button[type="default"].but-bind-mobile.but-default-active {
    opacity: 0.6;
  }

  button[disabled][type="default"].but-default.but-bind-mobile {
    background-color: transparent;
    opacity: 0.6;
  }
  button[type="default"].but-bind-mobile::after {
    width: 0;
    height: 0;
  }
  .submit-button {
    margin: 30px;
    .but-save-profile {
    }
  }
}
</style>
