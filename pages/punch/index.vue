<template>
	<view class="punch-page">
		<view class="punch-content pd-lr-15">
			<input type="text" v-model="comment" placeholder="请输入留言" class="comment-input"/>
			<view class="upload-imgs">
				<preview-img :url="item" :urlList="imgs"  v-for="item in imgs" :key="item"></preview-img>
				<button type="default" @click="chooseImg"><text class="iconfont icon-jia"></text></button>
			</view>
			<view class="location align-center">
				<text class="iconfont icon-dingwei"></text>{{city}}·{{place}}
			</view>
			<view class="pay-on-wall">
				<view class="choose-pay align-center">
					<text class="iconfont" :class="pay?'icon-success':'icon-quan'" @click="changePay"></text>付费上墙
				</view>
				<view class="pay-detail" v-if="pay">
					<view class="time">置顶时长<text class="fr">{{duration}}s</text></view>
					<view class="info-fee">信息服务费<text class="fr">￥ {{money}}</text></view>
					<view class="integral">
						积分 (共10.00可用)
						<switch class="fr" color="#007aff" @change="switchChange"/>
					</view>
				</view>
			</view>
		</view>
		<view class="pay-wrap ">
			<view class="content pd-lr-15">
				合计：<text class="unit">￥</text> <text>{{money}}</text>
				<button type="primary" class="fr" @click="submit">发布</button>
			</view>
		</view>
	</view>
</template>

<script>
	import previewImg from '@/components/preview-img/index.vue'
	export default {
		data() {
			return {
				comment: '',
				imgs: [],
				city: '重庆',
				place: 'xxx',
				pay: false,
				duration: '',
				money: 0,
				switch: false
			}
		},
		components: {
			previewImg
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			this.queryId = options.id
			this.queryName = options.name
		},
		methods: {
			chooseImg() {
				uni.chooseImage({
					sourceType: ['album'],
					sizeType: 'original',
					success: (file) => {
						this.imgs = file.tempFilePaths
						console.log(file.tempFiles,88)
					},
					fail(e) {
						console.log(e,222)
					}
				})
			},
			changePay(e) {
				this.pay = !this.pay
				// this.pay = e.detail.value[0] ? true : false
				this.duration =this.pay ? 25 : 0
				this.money = this.pay ? 19.9 : 0
			},
			switchChange(e) {
				this.switch = e.detail.value
			},
			submit() {
				uni.navigateTo({
					url:`/pages/payInfo/index?id=${this.queryId}&name=${this.queryName}`,
				})
			}
		}
	}
</script>

<style lang="less">
	.punch-page{
		.comment-input {
			margin: 50rpx 0 15rpx;
			font-size: 30rpx;;
			line-height: 44rpx;
			padding-left: 0;
		}
		.upload-imgs {
			overflow: hidden;
			.preview-wrap {
				float: left;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
			button {
				float: left;
				width: 195rpx;
				height: 195rpx;
				line-height: 195rpx;
				background-color: #f7f9fd;
				color: #b2bed9;
				.iconfont {
					font-size: 60rpx;
				}
				&::after {
					border: none;
				}
			}
		}
		.location {
			color: #00cedb;
			height: 70rpx;
			text {
				font-size: 32rpx;
				margin-right: 10rpx;
			}
		}
		.pay-on-wall {
			.choose-pay {
				margin-bottom: 20rpx;
				line-height: 1.5;
				.iconfont {
					color: #00cedb;
					margin-right: 10rpx;
					font-size: 52rpx;;
				}
				.icon-quan{
					color: #8e939c
				}
			}
			.pay-detail {
				margin: 10rpx 40rpx 0 56rpx;
				border-top: 1px solid #efeff2;
				view {
					height: 108rpx;
					line-height: 108rpx;
					border-bottom: 1px solid #efeff2;
				}
			}
		}
		.pay-wrap {
			position: fixed;
			width: 100%;
			bottom: 0;
			border-top: 1px solid #e5e6e6;
			.content {
				height: 162rpx;
				line-height: 162rpx;
				font-size: 26rpx;
			}
			text {
				color: #fa6564;
				font-size: 42rpx;
				font-weight: 600;
			}
			.unit {
				font-size: 24rpx;
			}
			button {
				background-color: #00cfdb;
				padding: 26rpx 76rpx;
				line-height: 1;
				margin-top: 45rpx;
				border-radius: 60rpx;
				font-size: 26rpx;
			}
		}
	}
</style>
