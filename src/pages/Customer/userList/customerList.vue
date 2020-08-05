<template>
	<view class="pages user">
		<view class="content">
			<view class="search-box">
				<!-- mSearch组件 如果使用原样式，删除组件元素-->
				<mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)"
				 @input="inputChange" @confirm="doSearch(false)" v-model="keyword"></mSearch>
			</view>
		</view>
		<view class="line"></view>

		<view class="three-btn">
			<view class="btn1" @click="btn1Click()">
				<text class="text5" :style="{color:color1}">总交易额</text>
				<image class="image2" :src="image1" mode="aspectFit" />
			</view>
			<view class="btn1" :style="{color:color2}" @click="btn2Click()">
				<text class="text5">最近消费</text>
				<image class="image2" :src="image2" mode="aspectFit" />
			</view>
			<view class="btn1" :style="{color:color3}" @click="btn3Click()">
				<text class="text5">消费次数</text>
				<image class="image2" :src="image3" mode="aspectFit" />
			</view>
		</view>

		<view class="line2"></view>

		<view class="customer-body2 clearfix" v-if="customerList.length>0">
			<view class="customer-list2" v-for="(v,i) of customerList" :key="i" @click="goToDetail(v.userNumber, i)">
				<view class="customer-icon-title2">
					<image class="image12" :src="v.headPic?v.headPic:'/static/images/default_logo_1x1.jpg'" mode="aspectFit" />
					<view class="out-view2">
						<view class="top-view2">
							<text class="text32">{{v.name==null?v.nickname:v.name}}</text>
							<view class="view-bg2"><text class="text42">{{v.membershipName}}</text></view>
						</view>
						<view class="top-view2">
							<text class="text12">{{v.lastVisiteTime}}</text>
							<!-- <text class="text22">查看会员卡</text> -->
						</view>
					</view>
				</view>
				<image class="image22" src="/static/images/icon_right1.png" mode="aspectFit" />
			</view>
			<no-more />
		</view>
		<view class="no-data" v-else>
			<Empty />
		</view>
	</view>
</template>

<script>
	import { baseurl } from "@/common/api";
	import {
		getShopCustomerPage,
		customerListAnalysis
	} from '@/common/api'
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
	import util from "@/common/utils";
	import Empty from "@/components/empty";
	import noMore from "@/components/noMore";

	export default {
		data() {
			return {
				type: "",
				avgPayment: 0,
				customerCount: 0,
				lossCustomerCount: 0,
				newCustomerCount: 0,
				newRepeatBuyerCount: 0,
				potentialCustomerCount: 2,
				repeatBuy: "0",
				noMore: false,
				sort1: 1,
				sort2: 0,
				sort3: 0,
				totalPage: 0,
				sort: "sumPayment",
				isAsc: 'false',
				currentPage: 1,
				state1: 1,
				state2: 0,
				state3: 0,
				color1: "#ff4444",
				color2: "#dddddd",
				color3: "#dddddd",
				image1: "/static/images/sort1.png",
				image2: "/static/images/sort0.png",
				image3: "/static/images/sort0.png",
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
						name: "客户总数",
						icon: "/static/images/icon_vip_list.png",
						path: "/pages/Manager/vip/vip",
						value: "0位"
					},
					{
						name: "回头率",
						icon: "/static/images/icon_sales_list.png",
						path: "/pages/Manager/consumption/consumption",
						value: "0.00%"
					},
					{
						name: "7日客单价(元)",
						icon: "/static/images/icon_scan.png",
						path: "/pages/Manager/vip/vip",
						value: "0人"
					}
				],
				list1: [{
						name: "潜在客户",
						icon: "/static/images/icon_user1.png",
						path: "/pages/Customer/userList/customerList",
						value: "0人"
					},
					{
						name: "新客户",
						icon: "/static/images/icon_user2.png",
						path: "/pages/Customer/userList/customerList",
						value: "0人"
					},
					{
						name: "回头客",
						icon: "/static/images/icon_user3.png",
						path: "/pages/Customer/userList/customerList",
						value: "0人"
					},
					{
						name: "流失客户",
						icon: "/static/images/icon_user4.png",
						path: "/pages/Customer/userList/customerList",
						value: "0人"
					}
				]
			};
		},
		onLoad(option) {
			console.log(option)
			this.type = option.type
			this.init();
			this.loadDefaultKeyword()
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch,
			Empty,
			noMore
		},
		computed: {
			...mapGetters(["shopId", "curShopUserInfo"])
		},
		methods: {
			goToDetail(userNumber, i) {
				uni.navigateTo({
					url: "/pages/Customer/userList/userDetail?userNumber=" + userNumber
				})
			},

			btn1Click() {
				this.sort = 'sumPayment'
				this.image2 = "/static/images/sort0.png"
				this.image3 = "/static/images/sort0.png"
				this.color1 = "#ff4444"
				this.color2 = "#dddddd"
				this.color3 = "#dddddd"
				this.state2 = 0
				this.state3 = 0
				if (this.state1 == 0 || this.state1 == 2) {
					this.image1 = "/static/images/sort1.png"
					this.state1 = 1
				} else {
					this.image1 = "/static/images/sort2.png"
					this.state1 = 2
				}
				if (this.sort1 == 0) {
					this.isAsc = 'false'
					this.sort1 = 1
				} else {
					this.isAsc = 'true'
					this.sort1 = 0
				}
				this.sort2 = 0
				this.sort3 = 0
				this.currentPage = 1
				this.getUserList()
			},
			btn2Click() {
				this.sort = 'lastOrderTime'
				this.image1 = "/static/images/sort0.png"
				this.image3 = "/static/images/sort0.png"
				this.color1 = "#dddddd"
				this.color2 = "#ff4444"
				this.color3 = "#dddddd"
				this.state1 = 0
				this.state3 = 0
				this.sort1 = 0
				this.sort3 = 0
				if (this.state2 == 0 || this.state2 == 2) {
					this.image2 = "/static/images/sort1.png"
					this.state2 = 1
				} else {
					this.image2 = "/static/images/sort2.png"
					this.state2 = 2
				}
				if (this.sort2 == 0) {
					this.isAsc = 'false'
					this.sort2 = 1
				} else {
					this.sort2 = 0
					this.isAsc = 'true'
				}
				this.currentPage = 1
				this.getUserList()
			},
			btn3Click() {
				this.sort = 'orderCount'
				this.image1 = "/static/images/sort0.png"
				this.image2 = "/static/images/sort0.png"
				this.color1 = "#dddddd"
				this.color2 = "#dddddd"
				this.color3 = "#ff4444"
				this.state2 = 0
				this.state1 = 0
				if (this.state3 == 0 || this.state3 == 2) {
					this.image3 = "/static/images/sort1.png"
					this.state3 = 1
				} else {
					this.image3 = "/static/images/sort2.png"
					this.state3 = 2
				}
				if (this.sort3 == 0) {
					this.isAsc = 'false'
					this.sort3 = 1
				} else {
					this.isAsc = 'true'
					this.sort3 = 0
				}
				this.sort2 = 0
				this.sort1 = 0
				this.currentPage = 1
				this.getUserList()
			},

			init() {
				this.getUserList()
			},
			//获取会员列表
			getUserList() {
				uni.request({
					url: baseurl + "shopAnalysis/customerList/", //仅为示例，并非真实接口地址。
					method: 'POST',
					data: {
						"currentPage": this.currentPage,
						"pageSize": 20,
						"where": {
							"shopId": this.shopId,
							"type": this.type,
							'nickname': this.keyword,
							'sort': this.sort,
							'isAsc': this.isAsc,
						}
					},
					header: {
						'token': uni.getStorageSync('token') //自定义请求头信息
					},
					success: (res) => {
						console.log("456", res.data);
						if (res.data.code == 0) {
							for (let i = 0; i < res.data.result.list.length; i++) {
								if (res.data.result.list[i].lastVisiteTime == null) {
									res.data.result.list[i].lastVisiteTime = ""
								} else {
									res.data.result.list[i].lastVisiteTime = util.timeago(res.data.result.list[i].lastVisiteTime * 1000)
								}
							}
							let data = res.data.result;
							let _list = data.list;
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
					},
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
				this.getUserList()
			},
			blur() {
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "搜索客户名称";
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
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//执行搜索
			doSearch(key) {
				console.log(this.keyword)
				this.currentPage = 1
				this.getUserList()
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						console.log(res.data);
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.user {
		.no-data {
			position: relative;
			margin-top: 45px;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
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
			}

			.image2 {
				width: 10px;
				height: 10px;
			}
		}

		.line {
			height: 1px;
			background-color: #dddddd;
		}

		.line2 {
			height: 4px;
		}

		.customer-body2 {
			.customer-list2 {
				background-color: #fff;
				display: flex;
				padding-left: 12px;
				padding-right: 12px;
				justify-content: space-between;
				align-items: center;
				margin-top: 1px;
				flex-direction: row;

				.customer-icon-title2 {
					display: flex;
					height: 65px;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.image12 {
						height: 45px;
						width: 45px;
						margin-right: 12px;
						border-radius: 50%;
					}

					.out-view2 {
						display: flex;
						flex-direction: column;

						.top-view2 {
							display: flex;
							margin-top: 8px;
							flex-direction: row;

							.text12 {
								font-size: 13px;
								color: #FF3333;
							}

							.text22 {
								font-size: 12px;
								margin-left: 20px;
								color: #6D6D72;
							}

							.text32 {
								font-size: 13px;
								color: #000000;
							}

							.view-bg2 {
								border-radius: round($number: 10);
								background-color: #EccDa0;
								margin-left: 20px;

								.text42 {
									font-size: 12px;
									padding-left: 5px;
									padding-right: 5px;
									border-radius: 5px;
									color: #000000;
								}
							}
						}
					}
				}

				.image22 {
					height: 10px;
					width: 10px;
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

		.customer-body {
			.customer-list21 {
				display: flex;
				flex-direction: column;
				padding-top: 5px;

				.customer-list {
					background-color: #fff;
					padding-bottom: 5px;
					display: flex;
					padding-left: 12px;
					padding-right: 12px;
					justify-content: space-between;
					align-items: center;
					margin-top: 1px;
					flex-direction: row;

					.customer-icon-title {
						display: flex;
						height: 40px;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;

						.image1 {
							height: 25px;
							width: 25px;
							margin-right: 5px;
						}
					}

					.right-image {
						height: 10px;
						width: 10px;
						margin-right: 5px;
					}

					.image2 {
						height: 20px;
						width: 20px;
						margin-right: 5px;
					}
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
					width: 33.333333%;
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
				.category-link:nth-child(2)::after {
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
