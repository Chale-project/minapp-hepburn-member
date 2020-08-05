<template>
	<view class="pages">
		<view class="view1">
			<text class="text1"> 收款类目</text>
			<view style="display: flex;flex-direction: row;align-items: center;justify-content: left; width: 150px;height: 50px;"
			 @click="chooseStyle()">
				<text style="font-size: 15px;margin-left: 10px;">{{name}}</text>
				<image style="height:14px ;width: 14px;margin-left: 5px;" :src="!showDate?'../../../static/images/icon_sj2.png':'../../../static/images/icon_sj1.png'"></image>
			</view>
		</view>

		<view class="view-enter">
			<view class="text3">买单金额</view>
			<view class="view-money">
				<text class="text4">￥</text>
				<input class="uni-input edit-money" type="digit" placeholder-style="font-size:15px" placeholder="请输入收款金额" maxlength="11"
				 @input="onKeyInput" :value="money" />
			</view>


			<view class="view-remark">
				<view class="text5" style="width: 50px;">备注：</view>
				<view class="remark_edit">
					<input class="uni-input edit-remark" placeholder="请输入备注信息(选填)" @input="onKeyRemark" :value="remark" />
				</view>
			</view>
		</view>


		<view class="btn-view" @click="gathering()">
			<view></view>
			<button type="default" form-type="submit" class="but-default but-recharge-submit" :disabled="rechargeDisabled">
				<image src="/static/images/icon_saoma.png" mode="widthFix" /><text>收款</text>
			</button>
			<view></view>
		</view>

		<van-popup :show="showDate" position="bottom" @close="closeDate">
			<van-picker :columns="list" @change="onChange" show-toolbar="true" @cancel="onCancel" @confirm="onConfirm" />
		</van-popup>

		<van-popup :show="showResult" position="center" @close="closeResult" closeable custom-style="border-radius:6px;">
			<view style="width: 300px;padding-top: 20px;">
				<view style="height: 35px;align-items: center;display: flex;justify-content: center;">收款成功</view>
				<view style="display: flex;justify-content: space-between;padding-top: 10px;padding-bottom: 8px;padding-left: 20rpx;padding-right: 20px;">
					<view>类目：</view>
					<view>{{consumeTitle}}</view>
				</view>
				<view style="height: 0.5px;background-color: #F1F1F1;"></view>
				<view style="display: flex;justify-content: space-between;padding-top: 8px;padding-bottom: 8px;padding-left: 20rpx;padding-right: 20px;">
					<view>时间：</view>
					<view>{{addDataTime}}</view>
				</view>
				<view style="height: 0.5px;background-color: #F1F1F1;"></view>
				<view style="display: flex;justify-content: space-between;padding-top: 8px;padding-bottom: 8px;padding-left: 20rpx;padding-right: 20px;">
					<view>交易单号：</view>
					<view>{{orderNumber}}</view>
				</view>
				<view style="height: 0.5px;background-color: #F1F1F1;"></view>
				<view style="display: flex;justify-content: space-between;padding-top: 8px;padding-bottom: 8px;padding-left: 20rpx;padding-right: 20px;">
					<view>交易金额：</view>
					<view>￥{{verificationMoney}}</view>
				</view>
				<view style="height: 0.5px;background-color: #F1F1F1;"></view>
				<view style="padding-bottom: 8px;display: flex;justify-content: space-between;padding-top: 8px;padding-left: 20rpx;padding-right: 20px;">
					<view>备注：</view>
					<view>{{remarkString}}</view>
				</view>
				<view style="height: 0.5px;background-color: #F1F1F1;margin-bottom: 12px;"></view>
				<view @click="cancelResult" style="border-bottom: 6px;width: 100%;text-align: center;height: 42px;background-color: #000000;align-items: center;display: flex;justify-content: center;">
					<text style="color: #ECCDA0;font-size: 14px;">继续收款</text>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import { baseurl } from "@/common/api";
	import {
		verification
	} from '@/common/api'
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	import util from "@/common/utils";
	
	export default {
		data() {
			return {
				title: 'Hello',
				money: "",
				remark: "",
				list: [ //要展示的数据
					'酒水消费',
					'果盘消费',
					'其它',
				],
				name: "酒水消费",
				type: "",
				showDate: !1,
				showResult: !1,
				consumeTitle: "",
				orderNumber: "",
				verificationMoney: "",
				remarkString: "",
				addDataTime: ""
			}
		},
		computed: {
			...mapGetters(["shopId", "curShopUserInfo"])
		},
		onLoad() {

		},
		methods: {
			visibleChange(isShow) { // 列表框的显示隐藏事件
			},
			closeResult() {
				this.showResult = false
			},
			cancelResult() {
				this.showResult = false
			},
			onConfirm() {
				this.showDate = false
			},
			closeDate() {
				this.showDate = false
			},
			onCancel() {
				this.showDate = false
			},
			chooseStyle() {
				this.showDate = true
			},

			onChange(event) {
				const {
					picker,
					value,
					index
				} = event.detail;
				this.name = value
			},
			chearEdit() {
				this.name = "酒水消费";
			},
			onInput(event) {
				this.name = event.detail.value
			},
			onKeyInput: function(event) {
				this.money = event.target.value
			},
			onKeyRemark: function(event) {
				this.remark = event.target.value
			},
			//收款
			gathering() {
				if (!this.checkMoney()) {
					return
				}
				let that = this
				switch (that.name) {
					case "酒水消费":
						that.type = "drinks"
						break
					case "果盘消费":
						that.type = "compote"
						break
					case "其它":
						that.type = "otherConsume"
						break
				}

				// 只允许通过相机扫码
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						uni.request({
							url: baseurl + "shopClerk/verification", 
							method: 'POST',
							data: {
								"payCode": res.result,
								"money": that.money,
								"shopId": that.shopId,
								"remark": that.remark,
								"type": that.type
							},
							header: {
								'token': uni.getStorageSync('token') //自定义请求头信息
							},
							success: (res) => {
								console.log("456", res.data);
								if (res.data.code == 0) {
									that.money = ""
									that.remark = ""
									that.consumeTitle = res.data.result.consumeTitle
									that.orderNumber = res.data.result.orderNumber
									that.verificationMoney = res.data.result.verificationMoney
									that.remarkString = res.data.result.remark
									that.addDataTime = res.data.result.addDataTime
								}else{
									that.consumeTitle = res.data.result.consumeTitle
									that.consumeTitle = res.data.result.consumeTitleshowToast({
										title: res.data.msg,
										icon: "success"
									});
								}
							}
						});
					},
					fail: function(res) {
						// util.showToastError("请扫描正确的二维码或条形码");
					}
				});

			},

			//校验输入金额
			checkMoney() {
				let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
					inputMoney = this.money,
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
		}
	}
</script>

<style lang="scss">
	.pages {
		background: #F1F1F1;
	}


	.content {
		text-align: center;
		height: 400upx;
	}

	.edit-remark {
		font-size: 14px;
	}

	.text4 {
		font-size: 34px;
		color: #000000;
	}

	.remark_edit {
		width: 100%;
		border-bottom: 1px solid #dddddd;
	}

	.edit-money {
		height: 40px;
		width: 100%;
		font-size: 26px;
		margin-left: 12px;
	}

	.btn-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 100px;
		justify-content: center;
	}

	.view-money {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #dddddd;
		margin-top: 15px;
		margin-left: 20px;
		justify-content: center;
		align-items: center;
	}

	.view-remark {
		display: flex;
		flex-direction: row;
		margin-top: 35px;
		margin-bottom: 20px;
		margin-left: 20px;
	}

	.view-enter {
		display: flex;
		margin-top: 20px;
		flex-direction: column;
		background: #FFFFFF;
		padding: 12px;
	}

	.btn {
		border-radius: 8px solid #000000;
		height: 40px;
		width: 120px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #000000;
		justify-content: center;
	}

	.text6 {
		font-size: 14px;
		color: #FFFFFF;
	}

	.text3 {
		font-size: 15px;
		color: #000000;
		margin-left: 10px;
	}

	.text5 {
		padding-top: 4px;
		font-size: 14px;
		color: #000000;
	}

	.text1 {
		margin-left: 20px;
		padding-top: 12px;
		padding-bottom: 12px;
		font-size: 15px;
		color: #000000;
	}

	.text2 {
		margin-left: 50px;
		padding-top: 12px;
		padding-bottom: 12px;
		font-size: 13px;
		color: #000000;
	}

	.view1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #FFFFFF;
		justify-content: left;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.btn-view {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
		margin-bottom: 100px;
		margin-top: 60px;
		justify-content: space-between;

		.but-recharge-submit {
			display: flex;
			align-items: center;
			height: 42px;
			width: 280px;
			justify-content: center;

			image {
				width: 18px;
				margin-right: 15px;
			}
		}
	}
</style>
