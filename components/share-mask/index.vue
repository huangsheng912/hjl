<template>
	<view class="share-wrap" v-show="showShareBtn">
		<view class="share-mask" @click="showShareBtn=false"></view>
		<view class="btn-wrap">
			<view class="handle-btn flex">
				<view>
					<text class="iconfont icon-weixin" @click="handleShare"></text>
					<text class="share-test">分享给好友</text>
				</view>
				<view>
					<text class="iconfont icon-haibao3" @click="handleShare"></text>
					<text class="share-test">生成专享海报</text>
				</view>
			</view>
			<view class="cancel"  @click="showShareBtn=false">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showShareBtn: false
			}
		},
		methods: {
			handleShare() {
				console.log('share')
			},
		}
	}
</script>

<style lang="less">
	.share-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.share-mask {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,0.5);
		}
		.btn-wrap {
			background-color: #fff;
			position: absolute;
			width: 100%;
			bottom: 0;
			border-radius: 30rpx 30rpx 0 0;
		}
		.handle-btn view {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 140rpx;
			text {
				font-size: 24rpx;
				line-height: 1;
			}
			.iconfont {
				color: #08db6c;
				font-size: 60rpx;
				margin-bottom: 10rpx;
			}
		}
		.cancel {
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border-top: 1px solid #f0f3f9
		}
	}
</style>
