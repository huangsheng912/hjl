<template>
	<view class="me-page">
		<image class="logo-bg" src="../../static/img/me-bg.png" mode="scaleToFill"></image>
		<view class="position-wrap">
			<view class="user-info flex">
				<view class="user-img">
					<image :src="userInfo?userInfo.avatarUrl:'../../static/img/me.png'" mode="scaleToFill"></image>
				</view>
				<view v-if="userInfo">
					<text class="user-name">{{userInfo.nickName}}</text>
					<text class="user-id">ID: {{userInfo.id}}</text>
				</view>
				<view v-else class="login" @click="toUrl('login')">点击登录</view>
			</view>
			<view class="count-wrap flex">
				<view class="count-item">
					<view>236</view> 
					<text>景区</text>
				</view>
				<view class="count-item">
					<view>4024</view> 
					<text>留言</text>
				</view>
				<view class="count-item">
					<view>6839</view> 
					<text>积分</text>
				</view>
			</view>
		</view>
		<view class="handle-wrap pd-lr-15">
			<view class="handle-item">
				<operate-button>
					<text class="icon icon1" ></text>分享<text class="iconfont icon-zhankai fr"></text>
				</operate-button>
				<!-- <button class="share-btn" open-type="share">
					<text class="icon icon1" ></text>分享<text class="iconfont icon-zhankai fr"></text>
				</button> -->
			</view>
			<view class="handle-item" @click="bindPhone">
				<text class="icon icon2"></text>绑定手机<text class="iconfont icon-zhankai fr"></text>
			</view>
			<view class="handle-item" @click="verified">
				<text class="icon icon3"></text>实名认证<text class="iconfont icon-zhankai fr"></text>
			</view>
			<view class="handle-item">
				<text class="icon icon4"></text>关于<text class="iconfont icon-zhankai fr"></text>
			</view>
		</view>
		<!-- <button type="default" open-type="getUserInfo" @getuserinfo="getUserInfo">授权</button>
		<button type="default" @click="xxx">xxx</button>
		<button type="default" @click="aaa">aaa</button> -->
	</view>
</template>

<script>
	import operateButton from '@/components/operate-button/index.vue'
	export default {
		options: {  
		  styleIsolation: 'shared'  
		},
		data() {
			return {
				userInfo: ''
			}
		},
		components: {
			operateButton
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			console.log(uni.getStorageSync('userI'),7788)
			console.log(uni.getStorageSync('userInfo'),'uu')
		},
		created() {
			// this.userInfo = uni.getStorageSync('userInfo')
			// console.log(uni.getStorageSync('userI'),7788)
			// console.log(uni.getStorageSync('userInfo'),'uu')
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			      console.log(res.target)
			    }
			    return {
			      title: '慧景链',
			      path: '/pages/home/index'
			    }
		}, 
		methods: {
			bindPhone() {
				if (!this.userInfo) {
					this.toUrl('login')
				} else {
					
				}
			},
			verified() {
				if (!this.userInfo) {
					this.toUrl('login')
				} else {
					
				}
			},
			toUrl(path) {
				uni.navigateTo({
					url:`/pages/${path}/index`
				})
			},
			getUserInfo(e) {
				//用户信息
				console.log(e,465)
			},
			xxx() {
				uni.getUserInfo({
					success(e) {
						console.log(e,123)
					},
					fail(e) {
						console.log(e, 234)
					}
				})
			},
			aaa() {
				uni.authorize({
					//需要在manifest配置
					scope:'scope.userLocation',
					success(s) {
						console.log(s,'sss')
					},
					fail(e) {
						console.log(e, 'eee')
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.me-page {
		.logo-bg {
			width: 100%;
			height: 425rpx;
		}
		.position-wrap {
			position: absolute;
			top: 220rpx;
			width: 100%;
			padding: 0 15rpx;
			box-sizing: border-box;
		}
		.user-info {
			.user-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				margin: 0 20rpx 30rpx 15rpx;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.user-name {
				display: block;
				font-size: 36rpx;
				color: #fff;
				margin: 26rpx 0 10rpx;
				line-height: 1;

			}
			.user-id {
				font-size: 24rpx;
				color: #fff;
			}
			.login {
				font-size: 38rpx;
				padding-top: 12px;
				color: #fff;
			}
		}
		.count-wrap {
			height: 140rpx;
			border-radius: 10rpx;
			background-color: #fff;
			box-shadow: 0 4rpx 4rpx #f6f7f7;
			.count-item {
				flex: 1;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				view {
					font-weight: 600;
					font-size: 32rpx;
				}
				text {
					color: #687a95;
					font-size: 24rpx;
				}
			}
		}
		.handle-wrap {
			margin-top: 100rpx;
			.handle-item {
				height: 116rpx;
				line-height: 116rpx;
				font-size: 32rpx;
				color: #333;
				/deep/.operate-btn-wrap {
					button {
						height: 116rpx;
						line-height: 116rpx;
						font-size: 32rpx;
					}
				}
				.icon {
					margin-right: 18rpx;
					display: inline-block;
					width: 42rpx;
					height: 44rpx;
					vertical-align: middle;
					background-repeat: no-repeat;
					background-size: cover;
					background-image: url(../../static/img/icon1.png);
					&.icon2 {
						background-image: url(../../static/img/icon2.png);
					}
					&.icon3 {
						background-image: url(../../static/img/icon3.png);
					}
					&.icon4 {
						background-image: url(../../static/img/icon4.png);
					}
				}
				.fr {
					font-size: 24rpx;
				}
			}
		}
	}
</style>
