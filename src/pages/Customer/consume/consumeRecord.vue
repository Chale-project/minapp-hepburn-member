<template>
	<view class="pages consume-record">
		<view class="consume-record-header">
			<view class="consume-record-header-title">
				<text>消费数据统计</text>
			</view>
			<view class="consume-record-header-content clearfix">
				<view class="data-face">
					<view class="data-face-title">最近一日</view>
					<view class="data-face-sub-title">消费金额 (元)</view>
					<view class="data-face-value ellipsis">￥{{lastConsum}}</view>
				</view>
				<view class="data-face">
					<view class="data-face-title">累计消费</view>
					<view class="data-face-sub-title">总金额 (元)</view>
					<view class="data-face-value ellipsis">￥{{sumConsum}}</view>
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
					<view class="sub-menu-title">类目</view>
					<view class="sub-menu-list">
						<text :class="activeNum==0?'tags ellipsis active':'tags ellipsis'" @click="filter(0)">不限</text>
						<text :class="activeNum==1?'tags ellipsis active':'tags ellipsis'" @click="filter(1)">酒水消费</text>
						<text :class="activeNum==2?'tags ellipsis active':'tags ellipsis'" @click="filter(2)">果盘消费</text>
						<text :class="activeNum==3?'tags ellipsis active':'tags ellipsis'" @click="filter(3)">其它消费</text>
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

		<view class="consume-record-content" v-if="consumeRecordList.length>0">
			<view class="record-lists" v-for="(v,i) of consumeRecordList" :key="i">
				<view class="record-item">
					<view class="record-item-left">
						<view class="record-title ellipsis">{{v.orderTitle}}</view>
						<view class="record-time ellipsis">{{v.addDataTime}}</view>
					</view>
					<view class="record-item-right">
						<view class="record-value">-￥{{v.payment}}</view>
						<view class="record-type">{{v.paymentWay=="weixin"?"微信支付":v.paymentWay=="balance"?"余额支付":
							v.paymentWay=="alipay"?"支付宝支付":v.paymentWay=="bank"?"银行转账":v.paymentWay=="POS"?"POS机刷卡":
							v.paymentWay=="cash"?"现金":v.paymentWay=="present"?"赠送":""}}</view>
					</view>
				</view>
			</view>
			<no-more />
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
		getConsumeRecord
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
				showText: "筛选",
				startYear: new Date().getFullYear(),
				mode: "range",
				activeNum: 0,
				activeNum1: 0,
				showMenu: true,
				lastConsum: 0.0,
				sumConsum: 0.0,
				type: "expense", // 消费
				curPage: 1,
				pageSize: 20,
				allPage: null,
				noMore: !1,
				consumeTotal: 0,
				consumeRecordList: [],
				orderSource: "",
				startTime: "",
				endTime: "",
				timeString: ""
			};
		},
		computed: {
			...mapGetters(["shopId", "isNewUser", "openid", "userInfo"])
		},

		async onLoad(options) {
			this.SetOptionsQuery({
				options
			});

			if (this.isNewUser) {
				await Promise.all([this.CheckIsNewUser()]).then(() => {
					this.showAuth = this.isNewUser ? !0 : !1;
					if (!this.isNewUser) {
						this.getConsumeList();
					}
				});
			} else {
				this.getConsumeList();
			}
		},

		onShow() {},

		created() {},

		mounted() {},

		methods: {
			...mapActions("user", ["CheckIsNewUser", "DecryptUserInfo"]),
			...mapActions("shop", ["SetOptionsQuery"]),

			searchList() {
				this.curPage = 1;
				Promise.all([this.getConsumeList()]);
			},

			onConfirm(val) {
				this.timeString = val.from+"至"+val.to
				this.startTime = val.from;
				this.endTime = val.to;
				this.curPage = 1;
				Promise.all([this.getConsumeList()]);
			},
			filterTab() {
				this.showMenu = !this.showMenu;
			},
			filter(index) {
				this.activeNum = index;
				this.showMenu = !this.showMenu;
				switch (index) {
					case 0:
						this.orderSource = "";
						this.searchList();
						break;
					case 1:
						this.orderSource = "drinks";
						this.searchList();
						break;
					case 2:
						this.orderSource = "compote";
						this.searchList();
						break;
					case 3:
						this.orderSource = "otherConsume";
						this.searchList();
						break;
				}
			},
			filter1(index) {
				this.activeNum1 = index;
				this.showMenu = !this.showMenu;
				switch (index) {
					case 0:
						this.timeString = ""
						this.startTime = "";
						this.endTime = "";
						this.searchList();
						break;
					case 1:
						this.$refs["range"].show();
						break;
				}
			},

			//初始化
			init() {
				this.curPage = 1;
				this.consumeRecordList = [];
				this.noMore = !1;
			},

			//获取消费记录
			async getConsumeList() {
				let data = {
					currentPage: this.curPage,
					pageSize: this.pageSize,
					where: {
						shopId: this.shopId,
						userNumber: this.userInfo.userNumber,
						startTime: this.startTime,
						endTime: this.endTime,
						orderSource: this.orderSource
					}
				};
				const consumeRecord = await getConsumeRecord(data)
					.then(res => {
						if (res.code != 0) {
							return;
						}

						this.lastConsum = res.page.where.lastConsum;
						this.sumConsum = res.page.where.sumConsum;

						let data = res.page;
						let _list = data.list;
						for (let i = 0; i < _list.length; i++) {
							_list[i].addDataTime = util.timeToTime(_list[i].addDataTime);
							_list[i].payment = util.moneyFormat(_list[i].payment);
						}
						let list = this.consumeRecordList;
						if (this.curPage == 1) {
							list = [];
						}
						this.allPage = data.totalPage;
						this.consumeTotal = util.moneyFormat(data.where.money);
						_list.map(i => {
							i.money = util.moneyFormat(i.money);
						});
						const _newList = list.concat(_list);
						this.consumeRecordList = _newList;
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
						this.getConsumeList();
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
				Promise.all([this.getConsumeList()]);
			} else {
				this.noMore = !0;
			}
		}
	};
</script>

<style lang="scss">
	.consume-record {
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
			margin-top: 135px;
			background: #f1f1f1;
			// padding-bottom: 20rpx;
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

		.consume-record-header {
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
					width: 50%;
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

				.data-face:nth-child(1)::after {
					content: "";
					position: absolute;
					width: 1px;
					top: 10px;
					bottom: 10px;
					right: 0;
					background-color: #eee;
				}
			}

			.consume-record-query {
				padding: 10px 12px;
				background-color: #fff;
			}
		}

		.consume-record-content {
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
						color: #4cd964;
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
		}

		.no-data {
			position: relative;
			margin-top: 232px;
		}
	}
</style>
