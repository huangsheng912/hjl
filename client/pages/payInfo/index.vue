<template>
	<view class="pay-info-page bg-common">
		<view class="pay-status">
			<text class="iconfont icon-success"></text>支付成功
		</view>
		<text class="tip">您的留言即将在大屏幕上置顶显示\n请注意大屏幕</text>
		<view class="status">
			<text>预计时间</text>
			<view class="time">{{time}}<text>s</text></view>
			<text>队列位置: {{position}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'success',
				time: 12,
				position: 2
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
		},
	}
</script>

<style lang="less">
	.pay-info-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		.pay-status {
			margin: 70rpx 0;
			color: #00cbd8;
			height: 120rpx;
			line-height: 120rpx;
			.iconfont {
				font-size: 66rpx;
				vertical-align: middle;
				margin-right: 20rpx;
			}
		}
		.tip {
			line-height: 50rpx;
			text-align: center;
		}
		.status {
			margin-top: 120rpx;;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 300rpx;
			height: 300rpx;
			border-radius: 50%;
			background-color: #fff;
			color: #8e939c;
			.time {
				font-weight: bold;
				font-size: 58rpx;
				color: #333;
				text {
					font-size: 54rpx;
				}
			}
		}
	}
</style>
