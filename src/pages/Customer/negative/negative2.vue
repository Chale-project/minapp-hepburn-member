<template>

	<view class="pages">
		<view class="head-view">
			<view>
				<image src="../../../static/images/icon_head_bg.png" style="width: 100%;height: 100px;" mode="scaleToFill"></image>
			</view>
			<view class="image-view" style="position: absolute;bottom: 0px;">
				<image class="image1" :src="!info.clerkHeadPic?info.headPic:info.clerkHeadPic" mode="aspectFit" />
			</view>
		</view>

		<view class="textname">{{info.clerkNumber}}</view>
		<view class="text1">感谢您的支持，比心~</view>

		<view class="star-view">
			<text class="text2">整体评价</text>
			<uni-rate size="26" :value="starNum" @change="changeStar"></uni-rate>
			<text style="margin-left: 20px;color: #DDDDDD">{{starText}}</text>
		</view>

		<view class="edit-view">
			<textarea class="uni-input edit-text" @input="editEnter" style="height: 90px;" focus placeholder="服务您是否满意？说说他或她的优点和美中不足的地方吧(30字内) "
			 maxlength="30" />
			</view>

		<view class="btn-view">
			<view></view>
			<form @submit="formSubmit" :report-submit='true'>
			<button type="default" form-type="submit" class="but-default but-recharge-submit" :disabled="rechargeDisabled" @bur="bindTextAreaBlur" >
				<image src="/static/images/icon_send_comment.png" mode="widthFix" /><text>发送</text>
			</button>
			 </form>
			<view></view>
		</view>
		<back-home />
	</view>

</template>

<script>
	import { uniRate } from "@dcloudio/uni-ui";
	import {
		addClerkComment
	} from "@/common/api";
	import backHome from "@/components/backHome";
	import {
		mapGetters
	} from "vuex";
	export default {
		  components: {uniRate,backHome},
		  computed: {
		  	...mapGetters(["shopId", "userInfo"])
		  },
		data() {
			return {
				starText:"一般",
				state:"",
				commentDescribe:"",
				rechargeDisabled:false,
				id:"",
				icon:"",
				name: "",
				score:"",
				describe:"",
				starNum:3,
				info:{}
			};
		},
		
		methods:{
			
			changeStar: function(e){
				console.log(e.value)
				this.starNum = e.value
				switch(this.starNum){
					case 0:
					this.starText = "非常差"
					break
					case 1:
					this.starText = "非常差"
					break
					case 2:
					this.starText = "差"
					break
					case 3:
					this.starText = "一般"
					break
					case 4:
					this.starText = "满意"
					break
					case 5:
					this.starText = "非常满意"
					break
				}
			},
			
			editEnter: function (e){
				this.commentDescribe = e.detail.value
			},
			
			formSubmit(e){
				if(!this.commentDescribe){
					uni.showToast({
						icon:"none",
						title:"请输入评论类容"
					})
					return
				}
				
				this.addComment();
			},
			
			addComment(){
				
				const data = {
					"clerkId": this.info.id,
					"commentScore": this.starNum,
					'commentDescribe': this.commentDescribe
				}
				addClerkComment(data)
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							uni.showToast({
								title: '评论发表成功',
								icon: "success"
							});
							wx.navigateBack()
						}
					})
			}
		},
		
		
		onShow() {
			
		},
		onLoad(option) {
			this.info = JSON.parse(option.json)
		    this.state = option.state
			if(this.state==0){
				this.starNum = 3
			}else{
				this.starNum = 5
			}
		},
		
	};
</script>


<style lang="scss">
	
	page{
		background-color: #FFFFFF;
	}
	
	.pages {
		background-color: #fff;

		.head-view {
			height: 115px;
			position: relative;
		}
		
		.image-view{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.image1{
			width: 70px;
			border-radius: 50%;
			height: 70px;
			border: 1px #DDDDDD solid;
		}

		.textname {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 8px;
			font-size: 14px;
			color: #333333;
		}

		.text1 {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			margin-top: 8px;
		}

		.star-view {
			margin: 15px;
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 50px;
padding-left: 20px;

			.text2 {
				font-size: 16px;
				color: #000000;
				margin-right: 20px;
			}
		}

		.edit-view {
			border: 1px solid #000000;
			height: 100px;
			margin-left: 24px;
			margin-right: 24px;
			
			.edit-text{
				padding: 10px;
				font-size: 14px;
			}
		}

		.btn-view {
			display: flex;
			flex-direction: row;
			margin-top: 20px;
			margin-bottom: 100px;
			justify-content: space-between;
			z-index: 10;

			.but-recharge-submit {
				display: flex;
				align-items: center;
				height: 42px;
				width: 280px;
				justify-content: center;

				image {
					width: 18px;
					margin-right: 15px;
				}
			}
		}
	}
</style>
