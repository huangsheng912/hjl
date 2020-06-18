<template>
	<view class="login-page flex">
		<view class="img-wrap">
			<image src="../../static/img/meActive.png" mode="scaleToFill"></image>
		</view>
		<view class="tip">慧景链申请获取你的用户信息</view>
		<operate-button type="auth">授权登录</operate-button>
		<!-- <button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">授权登录</button> -->
	</view>
</template>

<script>
	import operateButton from '@/components/operate-button/index.vue'
	export default {
		components: {
			operateButton
		},
		methods: {
			getUserInfo(e) {
				//用户信息
				// console.log(e,465)
				uni.setStorageSync('userInfo', e.detail.userInfo)
				this.$store.commit('setUserInfo', e.detail.userInfo)
				uni.showToast({
					title: '授权成功',
					success() {
						uni.navigateBack()
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.login-page {
		align-items: center;
		flex-direction: column;
		height: 100%;
		.img-wrap {
			width: 200rpx;
			height: 200rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-top: 200rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.tip {
			font-size: 40rpx;
			margin: 50rpx 0;
		}
		/* #ifdef MP-WEIXIN */
		operate-button /deep/.operate-btn-wrap button {
			line-height: 2.5;
			background-color: #007aff !important;
			color: #fff!important;
			padding: 0 48rpx;
		}
		/* #endif */
		/deep/.operate-btn-wrap button {
			line-height: 2.5;
			background-color: #007aff !important;
			color: #fff!important;
			padding: 0 48rpx;
		}
	}
</style>
