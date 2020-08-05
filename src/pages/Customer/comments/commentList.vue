<template>
	<view class="pages consume-record">
		<view class="consume-record-header">
			<view class="consume-record-header-title">
				<text>我去评价</text>
			</view>
			<view class="consume-record-header-content clearfix">
				<view class="data-face" @click="toPage(1)">
					<image class="image3" src="../../../static/images/icon_dashang.png"></image>
					<view class="data-face-value ellipsis">打赏小费</view>
				</view>
				<view class="data-face" @click="toPage(2)">
					<image class="image3" src="../../../static/images/icon_tousu.png"></image>
					<view class="data-face-value ellipsis">服务投诉</view>
				</view>
			</view>


			<van-tabs active="0" bind:change="onChange" color="#000000">
				<van-tab title="打赏">
					<view class="consume-record-content" v-if="commonList.length>0">
						<view class="customer-list" v-for="(v,i) of commonList" :key="i" @click="goToManager(v.path, i)">
							<view class="customer-icon-title">
								<view class="image-view">
									<image class="image1" :src="!v.clerkHeadPic?v.headPic:v.clerkHeadPic" mode="aspectFit" />
									<view class="view-bg1"><text class="text5">{{v.clerkNumber}}</text></view>
								</view>
								<view class="out-view">
									<view class="top-view">
										<text class="text3">{{v.commentDescribe}}</text>
										<view class="view-bg"><text class="text4">{{v.value}}</text></view>
									</view>
									<view class="top-view">
										<text class="text1">{{v.addDataTime}}</text>
										<text class="text2"></text>
									</view>
								</view>
							</view>

							<view style="height: 1px;background-color: #DDDDDD;"></view>
						</view>
						<no-more />
					</view>
					<view class="no-data" v-else>
						<Empty />
					</view>
				</van-tab>
				<van-tab title="评价">
					<view class="consume-record-content" v-if="consumeRecordList.length>0">
						<view class="customer-list" v-for="(v,i) of consumeRecordList" :key="i" @click="goToManager(v.path, i)">
							<view class="customer-icon-title">
								<view class="image-view">
									<image class="image1" :src="!v.clerkHeadPic?v.headPic:v.clerkHeadPic" mode="aspectFit" />
									<view class="view-bg1"><text class="text5">{{v.clerkNumber}}</text></view>
								</view>
								<view class="out-view">
									<view class="top-view">
										<text class="text3">{{v.commentDescribe}}</text>
										<view class="view-bg">
											<uni-rate size="16" :value="v.commentScore"></uni-rate>
										</view>
									</view>
									<view class="top-view">
										<text class="text1">{{v.addDataTime}}</text>
										<text class="text2"></text>
									</view>
								</view>
							</view>
						</view>
						<no-more />
					</view>
					<view class="no-data" v-else>
						<Empty />
					</view>
				</van-tab>
			</van-tabs>
		</view>
	</view>
</template>

<script>
	import {
		getClerkCommentPage
	} from "@/common/api";
	import util from "@/common/utils";
	import Empty from "@/components/empty";
	import noMore from "@/components/noMore";
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	import {
		uniRate
	} from "@dcloudio/uni-ui";

	export default {
		components: {
			Empty,
			noMore,
			uniRate
		},
		data() {
			return {
				currentPage: 1,
				color1: "#000000",
				color2: "#fff",
				allPage: null,
				noMore: !1,
				consumeTotal: 0,
				consumeRecordList: [],
				commonList: []
			};
		},
		onLoad() {
			this.getCommentList()
		},
		created() {},
		mounted() {},
		computed: {
			...mapGetters(["shopId", "userInfo"])
		},
		methods: {

			onChange(event) {
				if (event.detail.index == 0) {} else {
					this.currentPage = 1
					this.getCommentList()
				}
			},

			getCommentList() {
				const data = {
					"currentPage": this.currentPage,
					"pageSize": 20,
				}
				getClerkCommentPage(data)
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							let data = res.result;
							let _list = data.list;
							let list = [];
							if (this.currentPage > 1) {
								list = this.consumeRecordList;
							}
							const _newList = list.concat(_list);
							this.consumeRecordList = _newList;
							if (_list.length > 0) {
								this.noMore = !1;
							} else {
								this.noMore = !0;
							}
						}
					})
			},
			toPage(urlString) {
				util.navigateTo('/pages/Customer/userList/userList?where=' + urlString);
			}
		},

		//上拉加载
		onReachBottom() {
			this.currentPage = this.currentPage + 1;
			this.getCommentList()
		},

		async onShow() {
			// await Promise.all([this.getConsumeList()]);
		},

		//上拉加载
		onReachBottom() {
			this.curPage = this.curPage + 1;
			if (this.curPage <= this.allPage) {
				Promise.all([this.getConsumeList()]);
			}
		}
	};
</script>

<style lang="scss">
	.consume-record {
		position: relative;


		.consume-record-header {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 9;
			// box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);

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
					//背景线条
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
						margin-top: 5px;
						color: #666;
					}

					.image3 {
						height: 30px;
						width: 32px;
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

			.consume-record-query {
				height: 50px;
				background-color: #fff;
				display: flex;
				flex-direction: row;

				.view1 {
					width: 50%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.text {
						font-size: 14px;
						color: #000000;
					}

					.line1 {
						width: 20px;
						height: 1px;
					}
				}
			}


		}

		.consume-record-content {
			position: relative;
			background-color: #fff;
			height: 100%;

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

			.no-more {
				padding: 10px 12px;
				text-align: center;
				color: #999;
			}
		}

		.no-data {
			position: relative;
			margin-top: 52px;
		}

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
			border-bottom: 1px solid #dddddd;

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
						margin-top: 16px;
						flex-direction: row;

						.text1 {
							font-size: 12px;
							color: #918D8D;
							width: 70%;
						}

						.text2 {
							font-size: 12px;
							color: #666;
							margin-left: 10px;
						}

						.text3 {
							font-size: 14px;
							width: 70%;
							color: #000000;
						}

						.view-bg {
							border-radius: round($number: 10);
							background-color: #fff;

							.text4 {
								font-size: 13px;
								padding-left: 2px;
								padding-right: 2px;
								color: #dddddd;
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
</style>
