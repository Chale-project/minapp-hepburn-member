<template>
	<view class="pages user">
		<view class="user-customer">
			<view class="user-info">
				<view class="user-info-left">
					<view class="user-avatar">
						<image :src="userInfo.headPic?userInfo.headPic:'/static/images/icon_avatar.png'" mode="widthFix" />
					</view>
				</view>
				<view class="user-info-center ellipsis">
					<text class="user-nickname">尊敬的 {{userInfo.nickname}}</text>
				</view>
			</view>
		</view>
		<!-- 员工专区 -->
		<view class="user-card" v-if="managerMenu.length>0">
			<view class="card-header">
				<text>员工专区</text>
			</view>
			<view class="card-body clearfix">
				<navigator :url="v.path" :class="'category-link line col-'+managerMenu.length" v-for="(v,i) of managerMenu" :key="i">
					<view class="category-icon">
						<image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
					</view>
					<view class="category-text">{{v.name}}</view>
				</navigator>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		uniIcons,
		uniList,
		uniListItem
	} from "@dcloudio/uni-ui";
	import Auth from "@/components/auth";
	import progressBar from "@/components/chocolate-progress-bar";
	import util from "@/common/utils";
	import {
		getCardCoupon
	} from "@/common/api";
	import {
		mapGetters,
		mapActions
	} from "vuex";


	const formatMoney = util.moneyFormat;
	export default {
		name: "user",
		components: {
			Auth,
			progressBar,
			uniIcons,
			uniList,
			uniListItem
		},
		data() {
			return {
				userInfo:{},
				formatMoney,
				showAuth: !1,
				managerMenu: [{
						"name": "会员清单",
						"icon": "/static/images/icon_vip_list.png",
						"path": "/pages/Manager/vip/vip"
					},
					{
						"name": "消费清单",
						"icon": "/static/images/icon_sales_list.png",
						"path": "/pages/Manager/consumption/consumption"
					},
					{
						"name": "收款",
						"icon": "/static/images/icon_scan.png",
						"path": "/pages/Manager/staff/staff"
					}
				]
			};
		},
		computed: {
			...mapGetters([
				"shopId",
				"shopInfo",
				"isNewUser",
				"openid",
				"curShopUserInfo",
				"refererSuid"
			])
		},


		// 初次加载
		async onLoad(options) {
			this.SetOptionsQuery({
				options
			});
			this.userInfo = uni.getStorageSync("userInfo")

			// await Promise.all([this.CheckIsNewUser()]).then(() => {
			// 	this.showAuth = this.isNewUser ? !0 : !1;
			// 	if (!this.isNewUser) {
			// 		this.GetUserShopInfo(this.shopId).then(res => {

			// 			this.setBIJAndManagerMenu(res);
			// 		});
			// 	}
			// });
		},

		created() {},

		mounted() {},

		methods: {
			...mapActions("user", ["CheckIsNewUser", "DecryptUserInfo"]),
			...mapActions("shop", ["SetOptionsQuery"]),
			...mapActions("userShop", ["GetUserShopInfo"]),


			// 设置储值、积分、酒水值，员工menuList
			setBIJAndManagerMenu(e) {
				let _walletMenu = this.walletMenu;
				_walletMenu[0].value = e.balance;
				_walletMenu[1].value = e.customerIntegral;
				this.managerMenu = e.menuList || [];
			},

			// 跳转
			navigateTo(path) {
				if (path) util.navigateTo(path);
			},

		},
	};
</script>

<style lang="scss">
	.user {
		.user-customer {
			padding: 10px 12px;
			background-color: #000;

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

			.customer-info {
				padding: 10px 0;

				.customer-paycode {
					.customer-pay-but {
						width: 120px;
						margin: 0 auto 5px;

						.but-pay-code {
							display: flex;
							align-items: center;
							justify-content: center;
							line-height: 2.3;
							background-color: #f2c977;

							image {
								width: 24px;
								margin-right: 5px;
							}
						}
					}

					.customer-pay-tips {
						padding: 5px 0;
						text-align: center;
						font-size: 12px;
						color: #999;
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
				display: flex;
				justify-content: space-around;
				padding: 5px;
				background-color: #fff;

				.category-link {
					position: relative;
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

				.category-link.line.col-2:nth-child(1)::after,
				.category-link.line.col-3:nth-child(1)::after,
				.category-link.line.col-3:nth-child(2)::after {
					content: "";
					position: absolute;
					width: 1px;
					top: 10px;
					bottom: 10px;
					right: 0;
					background-color: #eee;
				}
			}
		}
	}
</style>
