<template>
	<view class="nav-bar">
		<view class="status-bar" :style="{height: statusBarHeight}"></view>
		<view class="header-bar">
			<view class="left fl" @click="onClickLeft">
				<text class="iconfont icon-fanhui"></text>
			</view>
			{{title}}
		</view>
	</view>
</template>

<script>
	const  statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	export default {
		data() {
			return {
				statusBarHeight: statusBarHeight
			}
		},
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		methods: {
			onClickLeft() {
				this.$emit('handleBack')
			}
		}
	}
</script>

<style lang="less" scoped>
	.nav-bar {
		.header-bar {
			position: relative;
			width: 100%;
			height: 44px;
			line-height: 44px;
			text-align: center;
			background-color: #fff;
			font-size: 15px;
			.left {
				position: absolute;
				left: 10px;
				height: 100%;
				width: 30px;
				text-align: left;
				line-height: 44px;
				text {
					font-size: 36rpx;
					font-weight: 600;
					color: #000;
				}
			}
		}
	}
</style>
