<template>
	<view class="pages consume-record">
		<view class="consume-record-header">
			<view class="consume-record-header-title">
				<text>我的积分</text>
			</view>
			<view class="consume-record-header-content clearfix">
				<view class="data-face">
					<view class="data-face-title">可用积分</view>
					<view class="data-face-sub-title"></view>
					<view class="data-face-value ellipsis">{{integral}}</view>
				</view>
				<view class="data-face">
					<view class="data-face-title">累计产生积分</view>
					<view class="data-face-sub-title"></view>
					<view class="data-face-value ellipsis">{{produce}}</view>
				</view>
				<view class="data-face">
					<view class="data-face-title">已使用积分</view>
					<view class="data-face-sub-title"></view>
					<view class="data-face-value ellipsis">{{used}}</view>
				</view>
			</view>


			<view class="tabTit box">
				<view class="flex1" @click="filterTab()">
					<text>{{showText}}</text>
					<image :src="showMenu?'../../../static/images/icon_sj2.png':'../../../static/images/icon_sj1.png'"></image>
				</view>
			</view>
			<!--筛选项-->
			<view class="tabLayer" :hidden="showMenu">
				<view class="sub-menu-item">
					<view class="sub-menu-title">类目</view>
					<view class="sub-menu-list">
						<text :class="activeNum==0?'tags ellipsis active':'tags ellipsis'" @click="filter(0)">不限</text>
						<text :class="activeNum==1?'tags ellipsis active':'tags ellipsis'" @click="filter(1)">减扣积分</text>
						<text :class="activeNum==2?'tags ellipsis active':'tags ellipsis'" @click="filter(2)">增加积分</text>
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
			<view v-for="(v,i) of consumeRecordList" :key="i">
				<view class="record-lists">
					<view class="record-item">
						<view class="record-item-left">
							<view class="record-title ellipsis">{{v.source=="cardSend"?"会员卡充值":v.source}}</view>
							<view class="record-time ellipsis">{{v.addDataTime}}</view>
						</view>
						<view class="record-item-right">
							<view class="record-value">+{{v.integral}}</view>
							<view class="record-type"></view>
						</view>
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
	</view>
</template>

<script>
	import {
		getIntegralRecord
	} from "@/common/api";
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	import util from "@/common/utils";
	import Empty from "@/components/empty";
	import noMore from "@/components/noMore";
	import wPicker from "@/components/w-picker.vue";

	export default {
		computed: {
			...mapGetters(["shopId", "userInfo"])
		},
		components: {
			Empty,
			noMore,
			wPicker
		},
		data() {
			return {
				timeString: "",
				activeNum1: 0,
				showText: "筛选",
				startYear: new Date().getFullYear(),
				mode: "range",
				activeNum: 0,
				showMenu: true,
				integral: 0,
				produce: 0,
				used: 0,
				currentPage: 1,
				allPage: null,
				noMore: !1,
				consumeTotal: 0,
				consumeRecordList: [],
				themeColor: '#000000',
				titleColor: '#666666',
				filterResult: '',
				integralGroup: "",
				startTime: "",
				endTime: ""
			};
		},
		created() {},

		methods: {

			searchList() {
				this.currentPage = 1
				this.getIntegralRecordList()
			},

			onConfirm(val) {
				console.log(val);
				this.timeString = this.timeString = val.from+"至"+val.to;
				this.startTime = val.from
				this.endTime = val.to
				this.searchList()
			},

			filterTab() {
				this.showMenu = !this.showMenu
			},
			filter(index) {
				this.activeNum = index
				this.showMenu = !this.showMenu
				switch (index) {
					case 0:
						this.integralGroup = ""
						this.searchList()
						break
					case 1:
						this.integralGroup = "use"
						this.searchList()
						break
					case 2:
						this.integralGroup = "input"
						this.searchList()
						break
				}
			},
			filter1(index) {
				this.activeNum1 = index
				this.showMenu = !this.showMenu
				switch (index) {
					case 0:
						this.timeString = ""
						this.startTime = ""
						this.endTime = ""
						this.searchList()
						break
					case 1:
						this.$refs["range"].show();
						break
				}
			},

			result(val) {
				console.log('filter_result:' + JSON.stringify(val));
				this.filterResult = JSON.stringify(val, null, 2)
			},
			// 重置所有选项，包括默认选项，并更新result
			resetAllSelect() {
				this.$refs.slFilter.resetAllSelect(function(result) {
					console.log('重置之后回调的result:' + JSON.stringify(result))
				})
			},
			// 重置选项为设置的默认值，并更新result
			resetSelectToDefault() {
				this.$refs.slFilter.resetSelectToDefault(function(result) {
					console.log('重置为默认值之后回调的result:' + JSON.stringify(result))
				})
			},
			//初始化
			init() {
				this.noMore = !1;
			},
			getIntegralRecordList() {
				const data = {
					"currentPage": this.currentPage,
					"pageSize": 20,
					"where": {
						"shopId": this.shopId,
						'userNumber': this.userInfo.userNumber,
						integralGroup: this.integralGroup,
						startTime: this.startTime,
						endTime: this.endTime
					}
				}
				getIntegralRecord(data)
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							this.used = res.page.where.used
							this.integral = res.page.where.integral
							this.produce = res.page.where.produce
							let data = res.page;
							let _list = data.list;
							for (let i = 0; i < _list.length; i++) {
								_list[i].addDataTime = util.timeToTime(_list[i].addDataTime)
							}
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
			}
		},

		onLoad(options) {},

		async onShow() {
			this.init();
			this.getIntegralRecordList()
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
			this.getIntegralRecordList()
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
			margin-top: 115px;
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
			position: fixed;
			top: 90rpx;
			z-index: 1;
			margin-top: 116px;
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
					width: 33.3333%;
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

			.consume-record-query {
				padding: 10px 12px;
				background-color: #fff;
			}
		}

		.consume-record-content {
			position: relative;
			margin-top: 160px;
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
						color: #EB0000;
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
			margin-top: 212px;
		}
	}
</style>
