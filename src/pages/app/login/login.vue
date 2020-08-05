<template>

	<view>
		<view class="logo">
			<view class="img">
				<image mode="widthFix" src="/static/images/hepburn_logo.png"></image>
			</view>
		</view>
		<!-- 账号密码输入框 -->
		<view class="form">
			<view class="username">
				<input placeholder="请输入手机号" v-model="phoneNumber" placeholder-style="color: #000000;" />
			</view>
			<view class="password">
				<input placeholder="请输入密码" v-model="passwd" password=true placeholder-style="color:#000000;" />
			</view>
			<view class="btn" @tap="doLogin">登 录</view>
			<view class="res">
				<view @tap="toPage('register')"></view>
				<view @tap="toPage('forgetPwd')"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseurl } from "@/common/api";
	import md5 from "@/common/md5.min.js";
	import {
		mapMutations
	} from "vuex"


	export default {
		data() {
			return {
				phoneNumber: '',
				passwd: '',
			}
		},
		computed: {},
		onShow() {
		},
		onLoad() {},
		methods: {
			...mapMutations("user", ["SET_TOKEN"]),
			...mapMutations("shop", ["SET_SHOP_ID"]),
			doLogin() {
				uni.hideKeyboard();
				// 验证手机号码
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))) {
					uni.showToast({
						title: '请填写正确手机号码',
						icon: "none"
					});
					return false;
				}
				uni.showLoading({
					title: "登录中"
				})
				uni.request({
					url: baseurl + 'customer/login', //仅为示例，并非真实接口地址。
					method: 'POST',
					data: {
						"userNumber": this.phoneNumber,
						"userSecret": md5(this.passwd)
					},
					success: (res) => {
						uni.hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							uni.setStorageSync("token",res.data.access_token)
							uni.setStorageSync("userInfo",res.data.customer)
							this.SET_TOKEN(res.data.access_token)
							this.SET_SHOP_ID(res.data.shopId)
							uni.showToast({
								title: '登录成功',
								icon: "success"
							});
							uni.navigateTo({
								url: '/pages/app/home/home'
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: linear-gradient(to bottom, #ffffff 0%, #ffffff 100%);
		height: 100%;
	}

	.icon {
		color: #ffffff;
	}

	.logo {
		width: 100%;
		height: 45vw;
		display: flex;
		justify-content: center;
		align-items: center;

		.img {
			background-color: #FFFFFF;
			image {
				width: 150px;
				height: 90px;
				margin-top: 18px;
				// border-radius: 100%;
			}
		}
	}


	.form {
		width: 86%;
		padding: 0 7%;
		font-size: 30upx;
		margin-top: 40px;
		.username,
		.password,
		.code {
			width: calc(100% - 90upx);
			height: 90upx;
			display: flex;
			align-items: center;
			border-radius: 45upx;
			border: 1px solid #666666;
			padding: 0 45upx;
			margin-bottom: 26upx;

			input {
				width: 100%;
				height: 50upx;
				color: #000000;
				font-weight: 200;
			}
		}

		.btn {
			color: #fff;
			width: 100%;
			height: 90upx;
			margin-top: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 45upx;
			background-color: #000;
			font-size: 40upx;
		}
	}

	.re {
		.username {
			position: relative;

			.get-code {
				position: absolute;
				height: 90upx;
				display: flex;
				align-items: center;
				justify-content: center;
				right: 0;
				padding: 0 40upx;
				z-index: 3;

				&:after {
					content: " ";
					width: 1upx;
					height: 50upx;
					background-color: #000000;
					position: absolute;
					z-index: 3;
					margin-right: 100%;
					left: 0;
					top: 20upx;
				}
			}
		}

		.res {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100upx;
			color: rgba($color: #ffffff, $alpha: 0.8);
		}
	}

	.form {
		.res {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100upx;
			color: rgba($color: #ffffff, $alpha: 0.8);
		}
	}
</style>
