<template>
	<view class="pages user">
		<view class="user-card">
			<view class="card-header">
				<text>消费数据统计</text>
			</view>
			<view class="card-body clearfix">
				<view class="category-link" v-for="(v,i) of managerMenu" :key="i">
					<view class="category-icon-title">
						<!-- <image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" /> -->
						<text>{{v.name}}</text>
					</view>
					<view class="category-text ellipsis" style="font-size: 13px;">{{v.value}}</view>
				</view>
			</view>

			<view class="content" style="width: 100%;">
				<view class="search-box">
					<!-- mSearch组件 如果使用原样式，删除组件元素-->
					<mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)"
					 @input="inputChange" @confirm="doSearch(false)" v-model="keyword"></mSearch>
				</view>
			</view>
			<view class="line"></view>
			<!--筛选项-->
			<view class="tabTit box">
				<view class="flex1" @click="filterTab()">
					<text>{{showText}}</text>
					<image :src="showMenu?'/static/images/icon_sj2.png':'/static/images/icon_sj1.png'"></image>
				</view>
			</view>
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
					<view class="sub-menu-title">支付方式</view>
					<view class="sub-menu-list">
						<text :class="activeNum2==0?'tags ellipsis active':'tags ellipsis'" @click="filter2(0)">不限</text>
						<text :class="activeNum2==1?'tags ellipsis active':'tags ellipsis'" @click="filter2(1)">支付宝</text>
						<text :class="activeNum2==2?'tags ellipsis active':'tags ellipsis'" @click="filter2(2)">微信</text>
						<text :class="activeNum2==3?'tags ellipsis active':'tags ellipsis'" @click="filter2(3)">POS刷卡</text>
						<text :class="activeNum2==4?'tags ellipsis active':'tags ellipsis'" @click="filter2(4)">现金</text>
						<text :class="activeNum2==5?'tags ellipsis active':'tags ellipsis'" @click="filter2(5)">余额</text>
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


		<view class="customer-body clearfix" v-if="customerList.length>0">
			<view class="customer-list" v-for="(v,i) of customerList" :key="i">
				<view class="customer-icon-title">
					<view class="image-view">
						<image class="image1" :src="v.headPic?v.headPic:'/static/images/default_logo_1x1.jpg'" mode="aspectFit" />
						<view class="view-bg1"><text class="text5 ellipsis">{{v.buyerNick}}</text></view>
					</view>
					<view class="out-view">
						<view class="top-view">
							<text class="text3">{{v.orderTitle=="drinks"?"酒水消费":v.orderTitle=="compote"?"果盘消费":
							v.orderTitle=="recharge_opp"?"平台余额充值":v.orderTitle=="recharge_mini"?"客户余额支付":
							v.orderTitle=="reward"?"余额打赏":v.orderTitle}}</text>
							<view class="view-bg"><text class="text4">-{{v.payment}}</text></view>
						</view>
						<view class="top-view">
							<text class="text1">{{v.addDataTime}}</text>
							<text class="text2">{{v.paymentWay=="weixin"?"微信支付":v.paymentWay=="balance"?"余额支付":
							v.paymentWay=="alipay"?"支付宝支付":v.paymentWay=="bank"?"银行转账":v.paymentWay=="POS"?"POS机刷卡":
							v.paymentWay=="cash"?"现金":v.paymentWay=="present"?"赠送":""}}</text>
						</view>
					</view>
				</view>
			</view>
			<no-more />
		</view>
		<view class="no-data" style="margin-top: 260px;" v-else>
			<Empty />
		</view>
		<w-picker mode="range" startYear="2019" endYear="2030" :defaultVal="[0,0,0,0,0,0,0]" :current="true" @confirm="onConfirm"
		 ref="range" themeColor="#f00"></w-picker>
	</view>
</template>

<script>
	import util from "@/common/utils";
	import Empty from "@/components/empty";
	import noMore from "@/components/noMore";
	import {
		getConsumeList
	} from "@/common/api";
	//引用mSearch组件，如不需要删除即可
	import mSearch from '@/components/mehaotian-search-revision.vue';
	import {
		uniList,
		uniListItem
	} from "@dcloudio/uni-ui";
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	import wPicker from "@/components/w-picker.vue";
	import { baseurl } from "@/common/api";
	export default {
		data() {
			return {
				timeString: "",
				activeNum: 0,
				activeNum1: 0,
				activeNum2: 0,
				showMenu: true,
				showText: "筛选",
				startYear: new Date().getFullYear(),
				mode: "range",
				noMore: false,
				customerName: "",
				currentPage: 1,
				defaultKeyword: "",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false,
				value: "",
				customerList: [],
				managerMenu: [{
						name: "今日消费总金额",
						icon: "/static/images/icon_vip_list.png",
						path: "/pages/Manager/vip/vip",
						value: "￥0"
					},
					{
						name: "今日消费总笔数",
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
				],
				integralGroup: "",
				startTime: "",
				endTime: "",
				orderSource: "",
				paymentWay: ""
			};
		},
		computed: {
			...mapGetters(["shopId"])
		},
		onLoad() {
			this.init();
			this.getConsumList()
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch,
			noMore,
			Empty,
			wPicker
		},
		methods: {
			onConfirm(val) {
				this.timeString = val.from + "至" + val.to
				this.startTime = val.from;
				this.endTime = val.to;
				this.searchList()
			},
			searchList() {
				this.currentPage = 1
				this.getConsumList()
			},
			filterTab() {
				this.showMenu = !this.showMenu
			},
			filter(index) {
				this.activeNum = index
				this.showMenu = !this.showMenu
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
				this.activeNum1 = index
				this.showMenu = !this.showMenu
				switch (index) {
					case 0:
						this.startTime = ""
						this.endTime = ""
						this.timeString = ""
						this.searchList()
						break
					case 1:
						this.$refs["range"].show();
						break
				}
			},
			filter2(index) {
				this.activeNum2 = index;
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
						this.paymentWay = "balance";
						this.searchList();
						break;
				}
			},
			getConsumList() {
				uni.request({
					url: baseurl + "consume/list", //仅为示例，并非真实接口地址。
					method: 'POST',
					data: {
						"currentPage": this.currentPage,
						"pageSize": 20,
						"where": {
							"shopId": this.shopId,
							"customerName": this.keyword,
							"orderSource": this.orderSource,
							"paymentWay": this.paymentWay,
							"startTime": this.startTime,
							"endTime": this.endTime
						}
					},
					header: {
						'token': uni.getStorageSync('token') //自定义请求头信息
					},
					success: (res) => {
						console.log("456", res.data);
						if (res.data.code == 0) {
							for (let i = 0; i < res.data.page.list.length; i++) {
								if (res.data.page.list[i].payment == null) {
									res.data.page.list[i].payment = ""
								} else {
									res.data.page.list[i].payment = "￥" + util.moneyFormat(res.data.page.list[i].payment)
								}
							}
							let data = res.data.page;
							this.managerMenu[0].value = "￥" + data.where.todayConsume;
							this.managerMenu[1].value = "" + data.where.todayConsumeCount + "笔";
							this.managerMenu[2].value = "￥" + data.where.allConsume;
							this.managerMenu[3].value = "￥" + data.where.allConsumeCount + "笔";
							let _list = data.list;
							for (let i = 0; i < _list.length; i++) {
								_list[i].addDataTime = util.timeToTime(_list[i].addDataTime)
							}
							let list = [];
							if (this.currentPage > 1) {
								list = this.customerList;
							}
							const _newList = list.concat(_list);
							this.customerList = _newList;
							if (_list.length > 0) {
								this.noMore = !1;
							} else {
								this.noMore = !0;
							}
						}
					}
				});
				
				
			},
			//上拉加载
			onReachBottom() {
				if (this.currentPage >= this.totalPage) {
					this.noMore = true
					return
				} else {
					this.noMore = false
				}
				this.currentPage = this.currentPage + 1;
				this.getConsumList()
			},
			init() {
				this.loadDefaultKeyword();
			},
			blur() {
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "搜索客户昵称";
			},
			//监听输入
			inputChange(event) {
				//兼容引入组件时传入参数情况
				var keyword = event.detail ? event.detail.value : event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//执行搜索
			doSearch(key) {
				console.log(this.keyword)
				this.currentPage = 1
				this.getConsumList()
			},
		}
	};
</script>

<style lang="scss">
	.user {
		position: relative;

		.tabTit {
			height: 90rpx;
			line-height: 90rpx;
			border-bottom: solid 1px #eee;
			top: 0;
			width: 750rpx;
			z-index: 1;
			background: #fff;
			font-size: 15px;
			text-align: center;
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
			box-shadow: 0 5px 5px rgba(0, 0, 0, .15);
			width: 750rpx;
			overflow: hidden;
			top: 90rpx;
			z-index: 1;
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
			border-bottom: 1px solid #E8E8E8;
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
			color: #FF2727;
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



		.three-btn {
			display: flex;
			background-color: #fff;

			.btn1 {
				flex-direction: row;
				justify-content: center;
				align-items: center;
				display: flex;
				height: 30px;
				width: 33.33333%;
			}

			.text5 {
				font-size: 13px;
				width: 40px;
			}

			.image2 {
				width: 15px;
				height: 15px;
			}
		}

		.line {
			height: 1px;
		}

		.line2 {
			height: 4px;
		}

		.customer-body {
			margin-top: 212px;
			width: 100%;

			.customer-list {
				padding-bottom: 5px;
				background-color: #fff;
				display: flex;
				padding-left: 12px;
				padding-right: 12px;
				justify-content: space-between;
				align-items: center;
				margin-top: 1px;
				flex-direction: row;

				.customer-icon-title {
					display: flex;
					width: 100%;
					height: 65px;
					flex-direction: row;
					align-items: center;
					justify-content: left;

					.image-view {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin-right: 22px;
						position: relative;
						width: 50px;
						margin-bottom: 5px;

						.image1 {
							position: absolute;
							height: 44px;
							width: 44px;
							border-radius: 50%;
						}

						.view-bg1 {
							position: absolute;
							width: 52px;
							height: 18px;
							border-radius: 3px;
							background-color: #000000;
							display: flex;
							justify-content: center;
							align-items: center;
							top: 14px;

							.text5 {
								font-size: 11px;
								padding-left: 5px;
								padding-right: 5px;
								color: #fff;
							}
						}
					}


					.out-view {
						width: 100%;
						display: flex;
						flex-direction: column;

						.top-view {
							display: flex;
							margin-top: 8px;
							flex-direction: row;

							.text1 {
								font-size: 12px;
								color: #666;
								width: 66%;
							}

							.text2 {
								font-size: 12px;
								color: #666;
								margin-left: 10px;
							}

							.text3 {
								font-size: 13px;
								width: 66%;
								color: #000000;
							}

							.view-bg {
								border-radius: round($number: 10);
								background-color: #fff;

								.text4 {
									font-size: 14px;
									padding-left: 2px;
									padding-right: 2px;
									color: #4CD964;
								}
							}
						}
					}
				}

				.image2 {
					height: 20px;
					width: 20px;
					margin-right: 5px;
				}
			}
		}

		.search-box {
			width: 95%;
			background-color: rgb(242, 242, 242);
			padding: 15upx 2.5%;
			display: flex;
			justify-content: space-between;
		}

		.search-box .mSearch-input-box {
			width: 100%;
		}

		.search-box .input-box {
			width: 85%;
			flex-shrink: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.search-box .search-btn {
			width: 15%;
			margin: 0 0 0 2%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-shrink: 0;
			font-size: 28upx;
			color: #fff;
			background: linear-gradient(to right, #ff9801, #ff570a);
			border-radius: 60upx;
		}

		.search-box .input-box>input {
			width: 100%;
			height: 60upx;
			font-size: 32upx;
			border: 0;
			border-radius: 60upx;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			padding: 0 3%;
			margin: 0;
			background-color: #ffffff;
		}

		.placeholder-class {
			color: #9e9e9e;
		}

		.search-keyword {
			width: 100%;
			background-color: rgb(242, 242, 242);
		}

		.keyword-list-box {
			height: calc(100vh - 110upx);
			padding-top: 10upx;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
		}

		.keyword-entry-tap {
			background-color: #eee;
		}

		.keyword-entry {
			width: 94%;
			height: 80upx;
			margin: 0 3%;
			font-size: 30upx;
			color: #333;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: solid 1upx #e7e7e7;
		}

		.keyword-entry image {
			width: 60upx;
			height: 60upx;
		}

		.keyword-entry .keyword-text,
		.keyword-entry .keyword-img {
			height: 80upx;
			display: flex;
			align-items: center;
		}

		.keyword-entry .keyword-text {
			width: 90%;
		}

		.keyword-entry .keyword-img {
			width: 10%;
			justify-content: center;
		}

		.keyword-box {
			height: calc(100vh - 110upx);
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
		}

		.keyword-box .keyword-block {
			padding: 10upx 0;
		}

		.keyword-box .keyword-block .keyword-list-header {
			width: 94%;
			padding: 10upx 3%;
			font-size: 27upx;
			color: #333;
			display: flex;
			justify-content: space-between;
		}

		.keyword-box .keyword-block .keyword-list-header image {
			width: 40upx;
			height: 40upx;
		}

		.keyword-box .keyword-block .keyword {
			width: 94%;
			padding: 3px 3%;
			display: flex;
			flex-flow: wrap;
			justify-content: flex-start;
		}

		.keyword-box .keyword-block .hide-hot-tis {
			display: flex;
			justify-content: center;
			font-size: 28upx;
			color: #6b6b6b;
		}

		.keyword-box .keyword-block .keyword>view {
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 60upx;
			padding: 0 20upx;
			margin: 10upx 20upx 10upx 0;
			height: 60upx;
			font-size: 28upx;
			background-color: rgb(242, 242, 242);
			color: #6b6b6b;
		}


		.user-customer {
			padding: 10px 12px;
			background-color: #2a2f45;

			.user-info {
				display: flex;
				align-items: center;

				.user-info-left {
					width: 30px;
					height: 30px;
					margin-right: 5px;

					.user-avatar {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 100%;
						}
					}
				}

				.user-info-center {
					width: calc(100% - 60px);
					color: #f2c977;
					font-size: 16px;

					.user-nickname {}

					.user-level {
						margin-left: 10px;
					}
				}

				.user-info-right {
					width: 24px;
					padding: 3px 0;
					text-align: right;
				}
			}
		}

		.user-card {
			position: fixed;
			margin-bottom: 10px;
			background-color: #fff;
			z-index: 99;
			top: 0;
			left: 0;
			right: 0;

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
