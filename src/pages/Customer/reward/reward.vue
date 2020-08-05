<template>

	<view class="pages">
		<view class="head-view">
			<view>
				<image src="../../../static/images/icon_head_bg.png" style="width: 100%;height: 100px;" mode="scaleToFill"></image>
			</view>
			<view class="image-view" style="position: absolute;bottom: 0px;">
				<image class="image1" :src="!info.clerkHeadPic?info.headPic:info.clerkHeadPic" mode="aspectFit" />
			</view>
		</view>

		<view class="textname">{{info.clerkNumber}}</view>
		<view class="text1">赞赏才是最好的支持</view>

		<view class="money-view">
			<van-row gutter="10">
				<van-col span="8" custom-class="recharge-card-item" v-for="(v,i) of moneyList" :key="i">
					<view :class="v.checked?'recharge-card-content active':'recharge-card-content'" @click="choiceRecharge(i)">
						<view class="recharge-card-value">
							<text>{{v.name}}</text>
						</view>
					</view>
				</van-col>
			</van-row>
		</view>

		<view class="enter-view">

			<view class="edit-view">
				<input class="uni-input" style="padding-left: 5px;" @focus="onFocusMoney" type="digit" maxlength="8"
				 placeholder-style="color:#dddddd" placeholder="任意金额(500元内)" @input="onKeyInput" />
			</view>

		</view>



		<view class="btn-view">
			<view></view>
			<form @submit="formSubmit" :report-submit='true'>
				<button type="default" style="width:280px;" form-type="submit" class="but-default but-recharge-submit" :disabled="rechargeDisabled"
				 @bur="bindTextAreaBlur">
					<image src="/static/images/icon_send_comment.png" mode="widthFix" style="height: 20px;width: 20px;" />
					<text style="margin-left: 5px;">确定</text>
				</button>
			</form>
			<view></view>
		</view>



		<view class="bottom-view">

			<view class="bottom1">
				<image class="image1" src="../../../static/images/icon_shafa.png"></image>
				<text class="text11">快来成为第一个赞赏我的人吧 ~~ </text>
			</view>

			<view class="bottom2"></view>
		</view>
		<back-home />

		<!-- Auth -->
		<auth :showAuth="showAuth" @change="closeAuth" @getuserinfo="getUserInfo" />
	</view>

</template>

<script>
	import backHome from "@/components/backHome";
	import {
		addClerkComment,
		getShopClerkInfo
	} from "@/common/api";
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";

	import Auth from "@/components/auth";


	export default {
		components: {
			Auth,
			backHome
		},
		computed: {
			...mapGetters(["shopId", "userInfo", "isNewUser", "openid", "curShopUserInfo", "shopInfo"])
		},
		data() {
			return {
				rechargeDisabled: false,
				name: "A0001",
				chooseMoney: "",
				moneyList: [{
					name: "￥0.1元",
					checked: false,
					value: 0.1
				}, {
					name: "￥1元",
					checked: false,
					value: 1
				}, {
					name: "￥6元",
					checked: false,
					value: 6
				}, {
					name: "￥16元",
					checked: false,
					value: 16
				}, {
					name: "￥66元",
					checked: false,
					value: 66
				}, {
					name: "￥99元",
					checked: false,
					value: 99
				}],
				info: {},
				uid: "",
				showAuth: false
			};
		},
		methods: {
			...mapActions("user", ["CheckIsNewUser", "DecryptUserInfo"]),
			...mapActions("shop", ["SetOptionsQuery"]),

			choiceRecharge(i) {
				const _rechargeCardList = this.moneyList;
				_rechargeCardList.map((item, index) => {
					if (index == i) {
						item.checked = !0;
						this.chooseMoney = item.value
						this.rechargeDisabled = !1;
					} else {
						item.checked = !1;
					}
				});
			},

			onKeyInput: function(event) {
				this.chooseMoney = event.target.value
			},

			//输入框获取焦点
			onFocusMoney() {
				const _cardList = this.moneyList;
				if (_cardList.length > 0) {
					_cardList.map(i => {
						if (i.checked) i.checked = !1;
					});
				}
			},

			formSubmit(e) {
				if (this.chooseMoney > 500) {
					uni.showToast({
						icon: "none",
						title: "输入金额不得高于500元"
					})
					return
				}
				if (this.state == 0) {
					uni.navigateTo({
						url: "/pages/Customer/negative/negative2?json=" + JSON.stringify(this.info) + "&state=" + this.state
					})
				} else {
					uni.navigateTo({
						url: "/pages/Customer/negative/negative?json=" + JSON.stringify(this.info) + "&state=" + this.state
					})
				}
			},

			// 关闭授权弹窗
			closeAuth() {
				this.showAuth = !1;
			},

			//获取员工详情
			getClerkInfo() {
				getShopClerkInfo(this.uid)
					.then(res => {
						console.log(res)
						this.info = res.result
					})
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
						this.getClerkInfo();
						this.closeAuth();
					});
				} else {
					util.showToastError("更多精彩将与你擦肩而过哦！");
				}
			}
		},

		//分享
		onShareAppMessage() {
			return {
				title: this.shopInfo.shopName + '   邀您一起来嗨皮^_^！',
				path: '/pages/Customer/reward/reward?state=1&shopId=' + this.shopId + '&refererSuid=' + this.curShopUserInfo.id +
					"&uid=" + this.uid
			}
		},


		onLoad(options) {
			// this.info = JSON.parse(options.json)
			this.uid = options.uid
			this.state = options.state

			this.SetOptionsQuery({
				options
			});

			if (this.isNewUser) {
				Promise.all([this.CheckIsNewUser()]).then(() => {
					this.showAuth = this.isNewUser ? !0 : !1;
					if (!this.isNewUser) {
						this.getClerkInfo();
					}
				});
			} else {
				this.getClerkInfo();
			}
		}
	};
</script>


<style lang="scss">
	page {
		background-color: #FFFFFF;
	}


	.pages {
		background-color: #fff;

		.recharge-card-item {
			padding-top: 5px;
			padding-bottom: 5px;

			.recharge-card-content {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 5px;
				height: 80rpx;
				border: 0.5px solid #ddd;
				border-radius: 4px;
				overflow: hidden;

				.recharge-card-title {}

				.recharge-card-value {
					text-align: center;
					color: #555555;

					text {
						font-size: 16px;
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

		.head-view {
			height: 115px;
			position: relative;
		}

		.image-view {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.image1 {
			width: 70px;
			border-radius: 50%;
			height: 70px;
			border: 1px #DDDDDD solid;
		}

		.textname {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 8px;
			font-size: 14px;
			color: #333333;
		}

		.text1 {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			margin-top: 8px;
		}

		.money-view {
			margin-top: 40px;
			padding-left: 15px;
			padding-right: 15px;

			.money-item {
				border: 1px solid #969696;
				border-radius: 4px;
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 15px;

				.text {
					font-size: 13px;
					color: #000000;
				}
			}

		}


		.enter-view {
			display: flex;
			flex-direction: row;
			margin: 15px;

			.edit-view {
				border: 1px solid #969696;
				border-radius: 4px;
				height: 50px;
				width: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.bottom-view {
			margin-top: 25px;
			padding-bottom: 25px;

			.bottom1 {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.image1 {
					height: 18px;
					width: 18px;
					margin-bottom: 12px;
				}

				.text11 {
					font-size: 12px;
					color: #333333;
				}
			}

			.bottom2 {}
		}

	}
</style>
