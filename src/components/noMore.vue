<template>
  <view class="no-more" v-if="noMore">
    <image src="/static/images/icon_no_more.png" mode="widthFix" />
    <text>{{desc}}</text>
  </view>
</template>

<script>
export default {
  name: "noMore",
  props: {
    noMore: {
      type: !1,
      default: "没有更多记录了！"
    },
    desc: {
      type: String,
      default: "没有更多记录了！"
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="scss">
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  text-align: center;
  font-size: 12px;
  color: #999;
  image {
    width: 20px;
    margin-right: 5px;
  }
}
</style>