<template>
	<view class="pages recharge-record">
		<view class="recharge-record-header">
			<view class="recharge-record-header-title">
				<text>充值数据统计</text>
			</view>
			<view class="recharge-record-header-content clearfix">
				<view class="data-face">
					<view class="data-face-title">累计充值</view>
					<view class="data-face-sub-title">总金额 (元)</view>
					<view class="data-face-value ellipsis">￥{{chargeMoney|formatMoney}}</view>
				</view>
				<view class="data-face">
					<view class="data-face-title">累计赠送</view>
					<view class="data-face-sub-title">总金额 (元)</view>
					<view class="data-face-value ellipsis">￥{{presentMoney|formatMoney}}</view>
				</view>
				<view class="data-face">
					<view class="data-face-title">累计充值</view>
					<view class="data-face-sub-title">总次数</view>
					<view class="data-face-value ellipsis">{{chargeCount}} 次</view>
				</view>
			</view>

			<view class="tabTit box">
				<view class="flex1" @click="filterTab()">
					<text>{{showText}}</text>
					<image :src="showMenu?'/static/images/icon_sj2.png':'/static/images/icon_sj1.png'"></image>
				</view>
			</view>
			<!--筛选项-->
			<view class="tabLayer" :hidden="showMenu">
				<view class="sub-menu-item">
					<view class="sub-menu-title">支付方式</view>
					<view class="sub-menu-list">
						<text :class="activeNum==0?'tags ellipsis active':'tags ellipsis'" @click="filter(0)">不限</text>
						<text :class="activeNum==1?'tags ellipsis active':'tags ellipsis'" @click="filter(1)">支付宝</text>
						<text :class="activeNum==2?'tags ellipsis active':'tags ellipsis'" @click="filter(2)">微信</text>
						<text :class="activeNum==3?'tags ellipsis active':'tags ellipsis'" @click="filter(3)">POS刷卡</text>
						<text :class="activeNum==4?'tags ellipsis active':'tags ellipsis'" @click="filter(4)">现金</text>
						<text :class="activeNum==5?'tags ellipsis active':'tags ellipsis'" @click="filter(5)">赠送</text>
					</view>
				</view>
				<view class="sub-menu-item">
					<view class="sub-menu-title">时间
						<text style="color: #000000;margin-left: 10px;font-size: 13px;">{{timeString}}</text>
					</view>
					<view class="sub-menu-list">
						<text :class="activeNum1==0?'tags ellipsis active':'tags ellipsis'" @click="filter1(0)">不限</text>
						<text :class="activeNum1==1?'tags ellipsis active':'tags ellipsis'" @click="filter1(1)">日期范围</text>
					</view>
				</view>
			</view>
		</view>

		<view class="recharge-record-content" v-if="rechargeRecordList.length>0">
			<view class="record-lists">
				<view class="record-item" v-for="(v,i) of rechargeRecordList" :key="i">
					<view class="record-item-left">
						<view class="record-title ellipsis">{{v.remainingType=='recharge'?'会员卡余额充值':v.remainingType=='present'?'充值赠送':'其他'}}</view>
						<view class="record-time ellipsis">{{v.addDataTime}}</view>
					</view>
					<view class="record-item-right">
						<view class="record-value">+￥{{v.money|formatMoney}}</view>
						<view class="record-type">{{v.paymentWay=="weixin"?"微信支付":v.paymentWay=="balance"?"余额支付":
							v.paymentWay=="alipay"?"支付宝支付":v.paymentWay=="bank"?"银行转账":v.paymentWay=="POS"?"POS机刷卡":
							v.paymentWay=="cash"?"现金":v.paymentWay=="present"?"赠送":""}}</view>
					</view>
				</view>
			</view>
			<no-more :noMore="noMore" />
		</view>

		<view class="no-data" v-else>
			<Empty />
		</view>
		<w-picker mode="range" startYear="2019" endYear="2030" :defaultVal="[0,0,0,0,0,0,0]" :current="true" @confirm="onConfirm"
		 ref="range" themeColor="#f00"></w-picker>

		<back-home />

		<!-- Auth -->
		<auth :showAuth="showAuth" @change="closeAuth" @getuserinfo="getUserInfo" />
	</view>
</template>

<script>
	import Auth from "@/components/auth";
	import backHome from "@/components/backHome";
	import {
		getRechargeRecord
	} from "@/common/api";
	import util from "@/common/utils";
	import noMore from "@/components/noMore";
	import Empty from "@/components/empty";
	import wPicker from "@/components/w-picker.vue";
	import {
		mapGetters,
		mapActions
	} from "vuex";

	export default {
		components: {
			Auth,
			backHome,
			noMore,
			Empty,
			wPicker
		},
		data() {
			return {
				showAuth: !1,
				timeString: "",
				activeNum1: 0,
				showText: "筛选",
				startYear: new Date().getFullYear(),
				mode: "range",
				activeNum: 0,
				showMenu: true,
				chargeCount: 0,
				chargeMoney: 0.0,
				presentMoney: 0.0,
				type: "save", // 充值
				curPage: 1,
				pageSize: 20,
				allPage: null,
				noMore: !1,
				rechargeTotal: 0,
				rechargeRecordList: [],
				paymentWay: "",
				startTime: "",
				endTime: ""
			};
		},
		computed: {
			...mapGetters(["shopId", "isNewUser", "openid"])
		},

		async onLoad(options) {
			this.SetOptionsQuery({
				options
			});

			if (this.isNewUser) {
				await Promise.all([this.CheckIsNewUser()]).then(() => {
					this.showAuth = this.isNewUser ? !0 : !1;
					if (!this.isNewUser) {
						this.getRechargeList();
					}
				});
			} else {
				this.getRechargeList();
			}
		},

		onShow() {},

		created() {},

		mounted() {},

		methods: {
			...mapActions("user", ["CheckIsNewUser", "DecryptUserInfo"]),
			...mapActions("shop", ["SetOptionsQuery"]),

			onConfirm(val) {
				this.timeString = this.timeString = val.from+"至"+val.to
				this.startTime = val.from;
				this.endTime = val.to;
				this.searchList();
			},
			filterTab() {
				this.showMenu = !this.showMenu;
			},
			filter(index) {
				this.activeNum = index;
				this.showMenu = !this.showMenu;
				switch (index) {
					case 0:
						this.paymentWay = "";
						this.searchList();
						break;
					case 1:
						this.paymentWay = "alipay";
						this.searchList();
						break;
					case 2:
						this.paymentWay = "weixin";
						this.searchList();
						break;
					case 3:
						this.paymentWay = "POS";
						this.searchList();
						break;
					case 4:
						this.paymentWay = "cash";
						this.searchList();
						break;
					case 5:
						this.paymentWay = "present";
						this.searchList();
						break;
				}
			},
			filter1(index) {
				this.activeNum1 = index;
				this.showMenu = !this.showMenu;
				switch (index) {
					case 0:
						this.timeString = "";
						this.startTime = "";
						this.endTime = "";
						this.searchList();
						break;
					case 1:
						this.$refs["range"].show();
						break;
				}
			},
			searchList() {
				this.curPage = 1;
				Promise.all([this.getRechargeList()]);
			},

			//初始化
			init() {
				this.curPage = 1;
				this.rechargeRecordList = [];
				this.noMore = !1;
			},

			//获取余额记录
			async getRechargeList() {
				let data = {
					currentPage: this.curPage,
					pageSize: this.pageSize,
					where: {
						shopId: this.shopId,
						separateType: this.type,
						paymentWay: this.paymentWay,
						startTime: this.startTime,
						endTime: this.endTime
					}
				};
				const rechargeRecord = await getRechargeRecord(data)
					.then(res => {
						this.chargeMoney = res.page.where.chargeMoney;
						this.presentMoney = res.page.where.presentMoney;
						this.chargeCount = res.page.where.chargeCount;

						let data = res.page;
						let _list = data.list;
						for (let i = 0; i < _list.length; i++) {
							_list[i].addDataTime = util.timeToTime(_list[i].addDataTime);
						}
						let list = this.rechargeRecordList;
						if (this.curPage == 1) {
							list = [];
						}
						this.allPage = data.totalPage;
						this.rechargeTotal = data.where.money;
						const _newList = list.concat(_list);
						this.rechargeRecordList = _newList;
						if (_list.length > 0) {
							this.noMore = !1;
						} else {
							this.noMore = !0;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},

			// 关闭授权弹窗
			closeAuth() {
				this.showAuth = !1;
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
						this.getRechargeList();
						this.closeAuth();
					});
				} else {
					util.showToastError("更多精彩将与你擦肩而过哦！");
				}
			}
		},

		//上拉加载
		onReachBottom() {
			this.curPage = this.curPage + 1;
			if (this.curPage <= this.allPage) {
				Promise.all([this.getRechargeList()]);
			} else {
				this.noMore = !0;
			}
		}
	};
</script>

<style lang="scss">
	.recharge-record {
		position: relative;

		.tabTit {
			height: 90rpx;
			line-height: 90rpx;
			border-bottom: solid 1px #eee;
			position: fixed;
			top: 0;
			width: 750rpx;
			z-index: 1;
			background: #fff;
			font-size: 15px;
			text-align: center;
			margin-top: 135px;
		}

		.tabTit .active {
			color: #e64340;
			background: #fff;
		}

		.tabTit .active image {
			transform: rotate(180deg);
			background: none;
		}

		.tabTit image {
			width: 26rpx;
			height: 26rpx;
			vertical-align: middle;
			margin-left: 5px;
		}

		.tabLayer {
			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.15);
			width: 750rpx;
			overflow: hidden;
			position: fixed;
			top: 90rpx;
			z-index: 1;
			margin-top: 136px;
			background: #f1f1f1;
			border-bottom: solid 1px #eee;
			.sub-menu-item {
				.sub-menu-title {
					padding: 5px 12px;
					font-size: 16px;
					color: #000;
				}
			
				.sub-menu-list {
					padding: 5px 0 5px 12px;
			
					.tags {
						display: inline-block;
						padding: 5px;
						width: 94px;
						margin: 0 12px 12px 0;
						background-color: #ccc;
						text-align: center;
					}
			
					.tags.active {
						background-color: #e64340;
						color: #fff;
					}
				}
			}
		}
		.flex1 {
			flex: 1;
			overflow: hidden;
			display: block;
		}

		/*弹性盒模型*/
		.box {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
		}

		navigator {
			display: inline;
		}

		.list {
			margin-top: 50px;
		}

		.list .list_item {
			margin-top: 10px;
			padding: 10px;
			height: 100px;
			border-bottom: 1px solid #e8e8e8;
		}

		.list .list_item .img {
			float: left;
			width: 40%;
			height: 100%;
		}

		.list .list_item .img image {
			width: 100%;
			height: 100%;
		}

		.list .list_item .info {
			width: 59%;
			float: right;
			height: 100px;
			position: relative;
		}

		.list .list_item .info .title {
			color: #333;
			margin-left: 10px;
			font-size: 15px;
		}

		.list .list_item .info .price {
			color: #ff2727;
			margin-left: 10px;
			margin-top: 10px;
			font-size: 15px;
		}

		.list .list_item .info .num {
			position: absolute;
			left: 0px;
			bottom: 10px;
			color: #747474;
			margin-left: 10px;
			font-size: 15px;
		}

		.recharge-record-header {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 9;
			box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);

			&-title {
				text-align: center;
				padding: 10px 12px;
				background-color: #fff;

				text {
					position: relative;
					padding: 5px 0;
					line-height: 20px;
				}

				text::after {
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

			&-content {
				border-bottom: 10px solid #f1f1f1;
				padding: 10px 12px;
				background-color: #fff;

				.data-face {
					position: relative;
					float: left;
					width: 33.333333%;
					box-sizing: border-box;
					padding: 5px;
					text-align: center;

					&-title,
					&-sub-title {
						font-size: 12px;
						padding: 2px 0;
					}

					&-value {
						color: #000;
					}
				}

				.data-face:nth-child(1)::after,
				.data-face:nth-child(2)::after {
					content: "";
					position: absolute;
					width: 1px;
					top: 10px;
					bottom: 10px;
					right: 0;
					background-color: #eee;
				}
			}

			.recharge-record-query {
				padding: 10px 12px;
				background-color: #fff;
			}
		}

		.recharge-record-content {
			position: relative;
			margin-top: 178px;
			background-color: #fff;

			.record-lists {
				position: relative;

				.record-item {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 10px 12px;

					&-left,
					&-right {
						flex: 1;
					}

					&-right {
						text-align: right;
					}

					.record-title,
					.record-value {
						padding-bottom: 5px;
					}

					.record-time,
					.record-type {
						padding-top: 5px;
						font-size: 12px;
						color: #999;
					}

					.record-title {
						color: #000;
					}

					.record-value {
						color: #dd524d;
					}
				}

				.record-item::after {
					position: absolute;
					content: "";
					left: 12px;
					right: 0;
					bottom: 0;
					height: 1px;
					transform: scaleY(0.5);
					overflow: hidden;
					background-color: #eee;
				}

				.record-item:last-child::after {
					height: 0;
				}
			}

			.record-lists::before {
				top: 0;
			}

			.record-lists::before,
			.record-lists::after {
				position: absolute;
				content: "";
				left: 0;
				right: 0;
				height: 1px;
				transform: scaleY(0.5);
				overflow: hidden;
				background-color: #eee;
			}

			.record-lists::before {
				top: 0;
			}

			.record-lists::after {
				bottom: 0;
			}

			.no-more {
				padding: 10px 12px;
				text-align: center;
				color: #999;
			}
		}

		.no-data {
			position: relative;
			margin-top: 232px;
		}
	}
</style>
