<template>
	<view class="pages user">
		<view class="content">
			<view class="search-box">
				<!-- mSearch组件 如果使用原样式，删除组件元素-->
				<mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)"
				 @input="inputChange" :inputWidth="'300upx'" @confirm="doSearch(false)" v-model="keyword"></mSearch>
			</view>
		</view>

		<view class="line"></view>

		<view class="listView" v-if="customerList.length>0">
			<van-row>
				<van-col span="12" v-for="(v,i) of customerList" :key="i" @click="goToManager(v.path, i)">
					<view class="customer-body">
						<view class="customer-list">
							<view class="head-view">
								<image :src="!v.clerkHeadPic?v.headPic:v.clerkHeadPic" mode="scaleToFill" style="width: 100%;height: 100%;"></image>
							</view>
							<view class="bottom-view">
								<image class="image1" :src="where==3?'../../../static/images/icon_chaping.png':''" @click="toNegative(v,0)"></image>
								<text class="text-name ellipsis">{{v.clerkNumber}}</text>
								<image class="image2" :src="where==3||where==1?'../../../static/images/icon_shang.png':'../../../static/images/icon_chaping.png'"
								 @click="toReward(v,1)"></image>
							</view>

						</view>
					</view>
				</van-col>
			</van-row>
		</view>
		<view class="no-data" style="margin-top: 50px;" v-else>
			<Empty />
		</view>

		<back-home />

		<!-- Auth -->
		<auth :showAuth="showAuth" @change="closeAuth" @getuserinfo="getUserInfo" />
	</view>
</template>

<script>
	import Auth from "@/components/auth";
	import backHome from "@/components/backHome";
	import {
		getShopClerkPage
	} from "@/common/api";
	//引用mSearch组件，如不需要删除即可
	import mSearch from "@/components/mehaotian-search-revision.vue";
	import Empty from "@/components/empty";
	import noMore from "@/components/noMore";
	import {
		uniList,
		uniListItem
	} from "@dcloudio/uni-ui";
	import {
		mapGetters,
		mapActions
	} from "vuex";
	export default {
		components: {
			Auth,
			backHome,
			Empty,
			noMore,
			mSearch
		},
		data() {
			return {
				showAuth: !1,
				where: 3,
				noMore: false,
				currentPage: 1,
				defaultKeyword: "",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: "",
				isShowKeywordList: false,
				value: "",
				customerList: []
			};
		},

		computed: {
			...mapGetters(["shopId", "isNewUser", "openid","curShopUserInfo","shopInfo"])
		},

		async onLoad(options) {
			this.where = options.where;
			this.init();
			this.SetOptionsQuery({
				options
			});

			if (this.isNewUser) {
				await Promise.all([this.CheckIsNewUser()]).then(() => {
					this.showAuth = this.isNewUser ? !0 : !1;
					if (!this.isNewUser) {
						this.getShopClerkPageList();
					}
				});
			} else {
				this.getShopClerkPageList();
			}
		},

		onShow() {},

		//分享
		onShareAppMessage() {
			return {
				title: this.shopInfo.shopName+'   邀您一起来嗨皮^_^！',
				path: '/pages/Customer/userList/userList?where=3&shopId='+this.shopId+'&refererSuid='+this.curShopUserInfo.id
			}
		},

		methods: {
			...mapActions("user", ["CheckIsNewUser", "DecryptUserInfo"]),
			...mapActions("shop", ["SetOptionsQuery"]),

			init() {
				this.loadDefaultKeyword();
			},
			//上拉加载
			onReachBottom() {
				if (this.currentPage >= this.totalPage) {
					this.noMore = true;
					return;
				} else {
					this.noMore = false;
				}
				this.currentPage = this.currentPage + 1;
				this.getShopClerkPageList();
			},
			getShopClerkPageList() {
				const data = {
					currentPage: this.currentPage,
					pageSize: 20,
					where: {
						shopId: this.shopId,
						clerkNumber: this.keyword
					}
				};
				getShopClerkPage(data).then(res => {
					if (res.code == 0) {
						let data = res.result;
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
				});
			},

			toReward(v, state) {
				if (this.where == 3 || this.where == 1) {
					uni.navigateTo({
						url: "/pages/Customer/reward/reward?uid=" +
							v.id+
							"&state=" +
							state
					});
				} else {
					// if(state==0){
					uni.navigateTo({
						url: "/pages/Customer/negative/negative2?json=" +
							JSON.stringify(v) +
							"&state=" +
							state
					});
					// }else{
					// 	uni.navigateTo({
					// 		url: "/pages/Customer/negative/negative?json="+JSON.stringify(v)+"&state="+state
					// 	})
					// }
				}
			},

			toNegative(v, state) {
				uni.navigateTo({
					url: "/pages/Customer/negative/negative2?json=" +
						JSON.stringify(v) +
						"&state=" +
						state
				});
			},
			blur() {
				uni.hideKeyboard();
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "搜索服务员编号或名称";
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
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//执行搜索
			doSearch(key) {
				console.log(this.keyword);
				this.currentPage = 1;
				this.getShopClerkPageList();
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
						this.getShopClerkPageList();
						this.closeAuth();
					});
				} else {
					util.showToastError("更多精彩将与你擦肩而过哦！");
				}
			}
		}
	};
</script>

<style lang="scss">
	.user {
		.listView {
			padding: 12px;
			background-color: #fff;
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
			display: flex;
			align-items: center;
			justify-content: center;

			.customer-list {
				background-color: #fff;
				display: flex;
				width: 90%;
				justify-content: space-between;
				align-items: center;
				flex-direction: column;
				border: 1px solid #000000;
				margin-left: 15px;
				margin: 7px;
				margin-top: 8px;
				height: 200px;

				.head-view {
					height: 160px;
					width: 100%;
				}

				.bottom-view {
					height: 40px;
					width: 100%;
					background-color: #000000;
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					.image1 {
						height: 25px;
						width: 25px;
						margin-top: 7px;
						padding: 3px;
					}

					.image2 {
						height: 25px;
						width: 25px;
						margin-top: 7px;
						padding: 3px;
					}

					.text-name {
						font-size: 13px;
						margin-top: 10px;
						color: #fff;
					}
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
	}
</style>
