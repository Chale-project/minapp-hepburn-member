<template>
	<view class="pages user">
		<view class="user-card">
			<view class="card-header">
				<text>会员数据统计</text>
			</view>
			<view class="card-body clearfix">
				<view class="category-link" v-for="(v,i) of managerMenu" :key="i" @click="goToManager(v.path, i)">
					<view class="category-icon-title">
						<!-- <image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" /> -->
						<text>{{v.name}}</text>
					</view>
					<view class="category-text">{{v.value}}</view>
				</view>
			</view>
		</view>

		<view class="line"></view>

		<view class="customer-body clearfix">
			<view class="customer-list" v-for="(v,i) of customerList" :key="i" @click="goToManager(v.path, i)">
				<view class="customer-icon-title">
					<image class="image1" :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="aspectFit" />
					<text>{{v.name}}</text>
				</view>
				<image class="image2" src="/static/images/icon_right.png" mode="aspectFit" />
			</view>

		</view>

	</view>
</template>

<script>
	import {
		uniList,
		uniListItem
	} from "@dcloudio/uni-ui";
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	export default {
		data() {
			return {
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
				customerList: [{
						name: "潜在客户",
						icon: "/static/images/icon_vip_list.png",
						path: "/pages/Manager/vip/vip",
						value: "0人"
					},
					{
						name: "新客户",
						icon: "/static/images/icon_sales_list.png",
						path: "/pages/Manager/consumption/consumption",
						value: "0人"
					},
					{
						name: "回头客",
						icon: "/static/images/icon_scan.png",
						path: "/pages/Manager/vip/vip",
						value: "0人"
					},
					{
						name: "流失客户",
						icon: "/static/images/icon_scan.png",
						path: "/pages/Manager/vip/vip",
						value: "0人"
					}
				]
			};
		},



		methods: {



		}
	};
</script>

<style lang="scss">
	.user {
		.line {
			height: 1px;
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
			.customer-list {
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

				.image2 {
					height: 20px;
					width: 20px;
					margin-right: 5px;
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
