<template>
	<view class="foot-print">
		<image class="foot-map" :src="footSrc" mode="scaleToFill"></image>
		<!-- <uni-ec-canvas 
			class="uni-ec-canvas foot-map"
			id="uni-ec-canvas"
			ref="uni-ec-canvas"
			canvas-id="uni-ec-canvas"
			:ec="ec"
	 ></uni-ec-canvas> -->
		<view class="foot-print-list">
			<view class="foot-print-item" v-for="item in footPrints" :key="item.time">
				<view class="time">{{item.time}}</view>
				<view class="item-content">
					<view class="desc">{{item.desc}}</view>
					<view class="img-list" >
						<image :src="img" mode="" v-for="(img,i) in item.imgs" :key="i"></image>
					</view>
					<view class="item-bottom">
						<text class="iconfont icon-dingwei"></text> {{item.city}}·{{item.place}}
						<view class="fr"><text class="iconfont icon-heart-fill"></text>{{item.like}}</view>
						<view class="fr">
							<operate-button>
								<text class="iconfont icon-icon-test"></text>
							</operate-button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import operateButton from '@/components/operate-button/index.vue'
	export default {
		data() {
			return {
				footSrc: '../../static/img/footPrint.png',
				footPrints:[],
			}
		},
		components: {
			operateButton
		},
		onLoad() {
			const userInfo = uni.getStorageSync('userInfo')
			if (!userInfo) {
				uni.navigateTo({
					url:'/pages/login/index'
				})
			}
		},
		async created() {
			await this.getFootPrints()
		},
		onShareAppMessage(res) {
			return {
				title: '慧景链',
				path: '/pages/home/index'
			}
		}, 
		methods: {
			getFootPrints() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				setTimeout(()=>{
					this.footPrints = [
						{
							time: '2020年6月22日',
							desc: '​实际上，微信官方是没有对外暴露过如此调用的，此类 API 最初是提供给腾讯内部一些业务使用，很多外部开发者发现了之后，依葫芦画瓢地使用了，逐渐成为微信中网页的事实标准。2015年初，微信发布了一整套网页开发工具包，称之为 JS-SDK，开放了拍摄、录音、语音识别、二维码、地图、支付、分享、卡券等几十个API。给所有的 Web 开发者打开了一扇全新的窗户，让所有开发者都可以使用到微信的原生能力，去完成一些之前做不到或者难以做到的事情。',
							imgs: [
								'../../static/img/myFootPrint.png',
								'../../static/img/myFootPrint.png',
								'../../static/img/myFootPrint.png',
							],
							city: '重庆市',
							place: '洪崖洞',
							like: 260
						},
						{
							time: '2020年6月2日',
							desc: '​实际上，微信官方是没有对外暴露过如此调用的，此类 API 最初是提供给腾讯内部一些业务使用，很多外部开发者发现了之后，依葫芦画瓢地使用了，逐渐成为微信中网页的事实标准。2015年初，微信发布了一整套网页开发工具包，称之为 JS-SDK，开放了拍摄、录音、语音识别、二维码、地图、支付、分享、卡券等几十个API。给所有的 Web 开发者打开了一扇全新的窗户，让所有开发者都可以使用到微信的原生能力，去完成一些之前做不到或者难以做到的事情。',
							imgs: [
								'../../static/img/myFootPrint.png',
								'../../static/img/myFootPrint.png',
							],
							city: '重庆市',
							place: '洪崖洞',
							like: 250
						},
						{
							time: '2020年5月22日',
							desc: '​实际上，微信官方是没有对外暴露过如此调用的，此类 API 最初是提供给腾讯内部一些业务使用，很多外部开发者发现了之后，依葫芦画瓢地使用了，逐渐成为微信中网页的事实标准。2015年初，微信发布了一整套网页开发工具包，称之为 JS-SDK，开放了拍摄、录音、语音识别、二维码、地图、支付、分享、卡券等几十个API。给所有的 Web 开发者打开了一扇全新的窗户，让所有开发者都可以使用到微信的原生能力，去完成一些之前做不到或者难以做到的事情。',
							imgs: [
								'../../static/img/myFootPrint.png',
								'../../static/img/myFootPrint.png',
								'../../static/img/myFootPrint.png',
							],
							city: '重庆市',
							place: '洪崖洞',
							like: 260
						}
					]
					uni.hideLoading()
				},1500)
			}
		}
	}
</script>

<style lang="less">
	.foot-print {
		.foot-map {
			height: 380rpx;
			width: 100%;
			display: block;
		}
		.foot-print-list {
			padding: 30rpx;
		}
		.foot-print-item {
			margin-bottom: 30rpx;
			.time {
				font-weight: 600;
				line-height: 34rpx;
				margin-bottom: 10rpx;
				&::before {
					content: '';
					display: inline-block;
					width: 12rpx;
					height: 12rpx;
					margin-bottom: 4rpx;
					margin-right: 20rpx;
					border-radius: 50%;
					background-color: #0dbcda;
				}
			}
			.item-content {
				position: relative;
				padding-left: 30rpx;
				&::before {
					content: '';
					position: absolute;
					left:4rpx;
					top:0;
					height: 250rpx;
					width: 2rpx;
					margin-right: 30rpx;
					background: linear-gradient(180deg, #cfd8e9, #fff);
				}
				.desc {
					line-height: 46rpx;
				}
				.img-list {
					image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 5rpx;
						margin-right:20rpx;
						margin-bottom: 20rpx;
						&:last-child {
							margin-rigth: 0;
						}
					}
				}
				.item-bottom {
					color: #8e949c;
					font-size: 24rpx;
					.iconfont {
						margin-right: 8rpx;
					}
					.icon-heart-fill {
						margin-left: 35rpx;
						color: #fa6464;
					}
					.icon-icon-test {
						color: #8e949c;
						line-height: 1.8;
					}
				}
			}
		}
	}
</style>
