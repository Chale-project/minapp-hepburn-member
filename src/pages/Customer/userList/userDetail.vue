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
							<view class="user-name ellipsis">{{curShopUserInfo.nickname}}<text v-if="curShopUserInfo.name">（{{curShopUserInfo.name}}）</text></view>
							<view class="user-level">
								<image src="/static/images/logo.png" mode="widthFix" />
								<text>[{{curShopUserInfo.membershipName}}]</text>
							</view>
						</view>
					</view>
					<view class="user-qr-icon">
						<image src="/static/images/icon_qr.png" mode="widthFix" />
					</view>
				</view>

				<view class="card-face-middle">
					<image class="card-logo" src="/static/images/icon_logo_text.png" mode="widthFix" />
				</view>

				<view class="card-face-bottom">
					<view class="card-number ellipsis"><text>{{curShopUserInfo.cardCode}}</text></view>
					<view class="card-balance">
						<!-- <view class="icon_balance">
              <image src="/static/images/icon_balance_black.png" mode="widthFix" />
            </view>
            <view class="balance-value ellipsis">￥{{'0.00'}}</view> -->
					</view>
				</view>
			</view>

			<view class="user-card">
				<view class="card-header">
					<text>消费数据统计</text>
				</view>
				<view class="card-body clearfix">
					<view class="category-link" v-for="(v,i) of managerMenu" :key="i" >
						<view class="category-icon-title">
							<!-- <image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" /> -->
							<text>{{v.name}}</text>
						</view>
						<view class="category-text">{{v.value}}</view>
					</view>
				</view>
			</view>

		</view>


		<view style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;background-color: #FFFFFF;height: 38px;">
			<image src="../../../static/images/icon_dongtai.png" style="width: 18px;height: 18px;margin-left: 15px;"></image>
			<text style="font-size: 14px;margin-left: 5px;">客户动态</text>
		</view>

		<view style="height: 1px;background: #dddddd;"></view>

		<view v-if="dynamicList.length>0">
			<view class="cu-timeline" v-for="(v,i) of dynamicList" :key="i">
				<view class="cu-time">{{v.statisticsDate}}</view>
				<view class="cu-item" v-for="(vc,j) of v.customerStep" :key="j">
					<view class="content">
						<text>{{vc.statisticsTime}} {{vc.recordTarget}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="no-data"  v-else>
			<Empty />
		</view>
		
		<back-home />
	</view>
</template>

<script>
	import backHome from "@/components/backHome";
	import {
		getShopActionPage,
		getShopCustomerInfo
	} from "@/common/api";
	import util from "@/common/utils";
	import {
		mapGetters
	} from "vuex";
	import Empty from "@/components/empty";
	import noMore from "@/components/noMore";
	import { baseurl } from "@/common/api";
	
	export default {
		data() {
			return {
				noMore: false,
				currentPage: 1,
				userNumber: "",
				curShopUserInfo: {},
				dynamicList: [],
				managerMenu: [{
						name: "近日消费总金额",
						icon: "/static/images/icon_vip_list.png",
						path: "/pages/Manager/vip/vip",
						value: "￥0"
					},
					{
						name: "近日消费总笔数",
						icon: "/static/images/icon_sales_list.png",
						path: "/pages/Manager/consumption/consumption",
						value: "0笔"
					},
					{
						name: "累计消费总金额",
						icon: "/static/images/icon_scan.png",
						path: "/pages/Manager/vip/vip",
						value: "￥0.00"
					},
					{
						name: "累计消费总笔数",
						icon: "/static/images/icon_scan.png",
						path: "/pages/Manager/vip/vip",
						value: "0笔"
					}
				]

			};
		},
		onLoad(option) {
			this.userNumber = option.userNumber
			this.getUserInfo()
			this.getDynamic()
		},
		computed: {
			...mapGetters(["shopId"])
		},
		onShow() {},

		created() {},

		mounted() {},
		components: {
			Empty,
			noMore,
			backHome
		},
		methods: {
			//上拉加载
			onReachBottom() {
				if (this.currentPage >= this.totalPage) {
					this.noMore = true
					return
				} else {
					this.noMore = false
				}
				this.currentPage = this.currentPage + 1;
				this.getDynamic()
			},
			//获取用户动态
			getDynamic() {
				uni.request({
					url: baseurl + "customerAction/getShopActionPage", //仅为示例，并非真实接口地址。
					method: 'POST',
					data:{
						"currentPage": this.currentPage,
						"pageSize": 20,
						"where": {
							"shopId": this.shopId,
							"userNumber": this.userNumber,
						}
					},
					header: {
						'token': uni.getStorageSync('token') //自定义请求头信息
					},
					success: (res) => {
						console.log("456", res.data);
						if (res.data.code == 0) {
							let data = res.data.result;
							let _list = data.list;
							let list = this.dynamicList;
							if (_list.length > 0) {
								const _newList = list.concat(_list);
								this.dynamicList = _newList;
								this.noMore = !1;
							} else {
								this.noMore = !0;
							}
						}
					}
				});
			},

			//获取用户信息
			getUserInfo() {
				uni.request({
					url: baseurl + "shopCustomer/getShopCustomerInfo", //仅为示例，并非真实接口地址。
					method: 'POST',
					data:{
						"shopId": this.shopId,
						"userNumber": this.userNumber,
					},
					header: {
						'token': uni.getStorageSync('token') //自定义请求头信息
					},
					success: (res) => {
						console.log("456", res.data);
						if (res.data.code == 0) {
							this.curShopUserInfo = res.data.result
							this.managerMenu[0].value = "￥" + util.moneyFormat(this.curShopUserInfo.lastSumPayment)
							this.managerMenu[1].value = this.curShopUserInfo.lastOrderCount + "笔"
							this.managerMenu[2].value = "￥" + util.moneyFormat(this.curShopUserInfo.sumPayment)
							this.managerMenu[3].value = this.curShopUserInfo.orderCount + "笔"
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.cu-timeline {
		display: block;
		background-color: #fff;
	}

	.cu-timeline .cu-time {
		width: 120rpx;
		text-align: center;
		padding: 20rpx 0;
		font-size: 26rpx;
		color: #888;
		display: block;
	}

	.cu-timeline>.cu-item {
		padding: 30rpx 30rpx 30rpx 120rpx;
		position: relative;
		display: block;
		z-index: 0;
	}

	.cu-timeline>.cu-item:not([class*="text-"]) {
		color: #ccc;
	}

	.cu-timeline>.cu-item::after {
		content: "";
		display: block;
		position: absolute;
		width: 1rpx;
		background-color: #ddd;
		left: 60rpx;
		height: 100%;
		top: 0;
		z-index: 8;
	}

	.cu-timeline>.cu-item::before {
		content: '';
		display: block;
		position: absolute;
		top: 36rpx;
		z-index: 9;
		background-color: #fff;
		width: 20rpx;
		height: 20rpx;
		text-align: center;
		border: 15rpx solid #ddd;
		line-height: 50rpx;
		left: 36rpx;
		border-radius: 50%;
	}

	.cu-timeline>.cu-item:not([class*="icon-"])::before {}

	.cu-timeline>.cu-item[class*="icon"]::before {
		background-color: #fff;
		width: 50rpx;
		height: 50rpx;
		text-align: center;
		border: none;
		line-height: 50rpx;
		left: 36rpx;
	}

	.cu-timeline>.cu-item>.content {
		padding: 30rpx;
		border-radius: 6rpx;
		display: block;
		line-height: 1.6;
	}

	.cu-timeline>.cu-item>.content:not([class*="bg-"]) {
		background-color: #f1f1f1;
		color: #666;
	}

	.cu-timeline>.cu-item>.content+.content {
		margin-top: 20rpx;
	}


	.dynamic-view {
		display: flex;
		flex-direction: row;
	}

	.dynamic-view1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.dynamic-view2 {
		display: flex;
	}

	.dynamic-text1 {
		font-size: 14px;
	}

	.member-card {
		&-container {
			background-color: #000000;
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

		.user-card {
			margin-bottom: 10px;
			background-color: #fff;

			.card-header {
				padding: 10px 12px;
				text-align: center;

				text {
					position: relative;
					padding: 5px 0;
					line-height: 20px;
				}

				text::after {
					//背景线条
					position: absolute;
					width: 30px;
					height: 1px;
					content: "";
					left: 50%;
					transform: translateX(-50%);
					bottom: 0;
					background-color: rgb(182, 176, 176);
					overflow: hidden;
				}
			}

			.card-body {
				padding: 5px;
				background-color: #fff;

				.category-link {
					position: relative;
					float: left;
					width: 25%;
					box-sizing: border-box;
					padding: 5px;
					text-align: center;

					.category-icon {
						height: 33px;
						line-height: 33px;
						margin-bottom: 10px;
						overflow: hidden;

						image {
							width: 30px;
						}
					}

					.category-icon-title {
						margin-bottom: 10px;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 20px;
							margin-right: 5px;
						}

						text {
							color: #666;
						}
					}
				}

				.category-link:nth-child(1)::after,
				.category-link:nth-child(2)::after,
				.category-link:nth-child(3)::after {
					content: "";
					position: absolute;
					width: 1px;
					top: 10px;
					bottom: 10px;
					right: 0;
					background-color: #ccc;
				}
			}
		}
	}
</style>
