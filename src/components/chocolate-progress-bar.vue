<template>
  <view class="progress_box">
    <canvas class="progress_bg" canvas-id="cpbg"></canvas>
    <canvas class="progress_bar" canvas-id="cpbar"></canvas>
    <view class="progress_txt" v-if="progress_txt/progress_max>=1">
      <view style="margin-bottom:5px;">累计消费</view>
      <view style="margin-bottom:5px;">{{sum|formatMoney}}</view>
      <view>您已成为[{{level}}]</view>
    </view>
    <view class="progress_txt" v-else>
      <view v-if="((progress_max-progress_txt)/100).toFixed(2).length>=10">
        <view style="margin-bottom:5px;">再消费</view>
        <view class="progress_info ellipsis">{{progress_max-progress_txt|formatMoney}}元</view>
      </view>
      <view v-else>
        <view class="progress_info ellipsis">再消费{{progress_max-progress_txt|formatMoney}}元</view>
      </view>
      <text>可升级为[{{level}}]</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    progress_txt: {
      type: Number,
      default: 0
    },
    progress_max: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      default: "普通会员"
    },
    sum: {
      type: Number,
      default: 0
    }
  },
  onReady: function() {
    this.drawProgressbg();
    // this.drawCircle(this.progress_txt); //参数为1-100
  },
  methods: {
    drawProgressbg: function() {
      // 自定义组件实例 this ，表示在这个自定义组件下查找拥有 canvas-id 的 <canvas/>
      var ctx = uni.createCanvasContext("cpbg", this);
      ctx.setLineWidth(15); // 设置圆环的宽度
      ctx.setStrokeStyle("#292e44"); // 设置圆环的颜色
      ctx.setLineCap("round"); // 设置圆环端点的形状
      ctx.beginPath(); //开始一个新的路径
      ctx.arc(150, 110, 90, 0.75 * Math.PI, 0.25 * Math.PI, false);
      //设置一个原点(110,110)，半径为100的圆的路径到当前路径
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();
    },
    drawCircle: function(step) {
      var ctx = uni.createCanvasContext("cpbar", this);
      // 进度条的渐变(中心x坐标-半径-边宽，中心Y坐标，中心x坐标+半径+边宽，中心Y坐标)
      var gradient = ctx.createLinearGradient(28, 55, 192, 55);
      gradient.addColorStop("0", "#e7cb9c");
      gradient.addColorStop("1.0", "#f2c977");
      ctx.setLineWidth(15);
      ctx.setStrokeStyle(gradient);
      ctx.setLineCap("round");
      ctx.beginPath();
      // 参数step 为绘制的百分比
      step = 0.015 * step + 0.75;
      if (step >= 2) {
        step = step % 2;
      }
      ctx.arc(150, 110, 90, 0.75 * Math.PI, step * Math.PI, false);
      ctx.stroke();
      ctx.draw();
    }
  }
};
</script>

<style>
.progress_box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.progress_bg {
  position: absolute;
  width: 300px;
  height: 200px;
}
.progress_bar {
  width: 300px;
  height: 200px;
}
.progress_txt {
  position: absolute;
  width: 150px;
  font-size: 12px;
  color: #f2c977;
}
.progress_info {
  margin-bottom: 5px;
  letter-spacing: 1px;
  font-size: 13px;
  color: #f2c977;
}
.progress_dot {
  width: 16upx;
  height: 16upx;
  border-radius: 50%;
  background-color: #fb9126;
}
</style>
