<template>
	<view class="home-page">
		<area-search @change="changeArea"></area-search>
		<button type="default" @click="publish">生成海报</button>
		<share-poster 
			ref="sharePoster" 
			:width=this.width
			:avatar=shareInfo.avatar
			:userName=shareInfo.name
			:time=shareInfo.time
			:desc=shareInfo.desc
			:imgSrc=shareInfo.imgList
			QrSrc="../../static/img/qrCode.jpg"
			@success="generateSuccess"
		></share-poster>
		<view class="home-swiper">
			<swiper 
			:indicator-dots="true" 
			:autoplay="true" 
			:interval="3000" 
			:duration="1000"
			circular="true"
			>
				<swiper-item>
					<view class="swiper-item bg-red">1</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item bg-blue">2</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item bg-yellow">3</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="quick-entry">
			<view class="entry-item">
				<view class="img-wrap">
					<image src="../../static/img/punch.png" mode=""></image>
				</view>
				<text>扫码打卡</text>
			</view>
			<view class="entry-item" @click="toUrl('hotSights')">
				<view class="img-wrap">
					<image src="../../static/img/hot-sight.png" mode=""></image>
				</view>
				<text>热门景区</text>
			</view>
			<view class="entry-item">
				<view class="img-wrap">
					<image src="../../static/img/integral.png" mode=""></image>
				</view>
				<text>领取积分</text>
			</view>
			<view class="entry-item">
				<view class="img-wrap">
					<image src="../../static/img/exchange.png" mode=""></image>
				</view>
				<text>积分兑换</text>
			</view>
		</view>
		<view class="recommend-route">
			<view class="title"><text>正在打卡</text></view>
			<block v-for="item in sights" :key="item.id">
				<sight-item :sightInfo="item" share></sight-item>
			</block>
		</view>
	</view>
</template>

<script>
	import areaSearch from '@/components/area-search/index.vue'
	import sightItem from '@/components/sight-item/index.vue'
	import sharePoster from '@/components/share-poster/index.vue'
	export default {
		data() {
			return {
				sights: [],
				shareInfo: {}
			}
		},
		components:{
			areaSearch,
			sightItem,
			sharePoster
		},
		created() {
			this.getPunchingList()
		},
		methods: {
			publish() {
				this.$refs.sharePoster.generatePoster()
			},
			generateSuccess(path) {
				uni.previewImage({
					current: path,
					urls:	[path],
					success(s) {
						console.log(s,1)
					},
					fail(e) {
						console.log(e,2)
					}
				})
			},
			getPunchingList() {
				const userInfo = uni.getStorageSync('userInfo')
				this.userInfo = userInfo
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				setTimeout(()=>{
					this.sights = [
						{
							id:1,
							avatar: userInfo.avatarUrl,
							name: userInfo.nickName,
							time: '2020-04-13',
							desc: '请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志,请另行在小程序开发工具的控制台查看前端运行日志',
							imgList: [
								'https://www.nuls.io/wp-content/uploads/2019/06/reaper.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/1562305343608.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/06/ViVi-zhou.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/WechatIMG212.jpeg',
								'https://www.nuls.io/wp-content/uploads/2019/06/reaper.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/1562305343608.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/06/ViVi-zhou.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/WechatIMG212.jpeg',
							],
							like: 236,
							comments: 222,
							city: '丽江市',
							place: '玉龙雪山'
						},
						{
							id:2,
							avatar: userInfo.avatarUrl,
							name: userInfo.nickName,
							time: '2020-04-13',
							desc: '请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志,请另行在小程序开发工具的控制台查看前端运行日志',
							imgList: [
								'https://www.nuls.io/wp-content/uploads/2019/06/reaper.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/1562305343608.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/06/ViVi-zhou.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/WechatIMG212.jpeg',
							],
							like: 26,
							comments: 22,
							city: '丽江市',
							place: '玉龙雪山'
						},
						{
							id:3,
							avatar: userInfo.avatarUrl,
							name: userInfo.nickName,
							time: '2020-04-13',
							desc: '请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志,请另行在小程序开发工具的控制台查看前端运行日志',
							imgList: [
								'https://www.nuls.io/wp-content/uploads/2019/06/reaper.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/1562305343608.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/06/ViVi-zhou.jpg',
								'https://www.nuls.io/wp-content/uploads/2019/07/WechatIMG212.jpeg',
							],
							like: 234,
							comments: 223,
							city: '丽江市',
							place: '玉龙雪山'
						}
					]
					this.shareInfo = this.sights[0]
					uni.hideLoading()
				},1500)
			},
			changeArea(e) {
				console.log(e)
				
			},
			toUrl(path) {
				uni.navigateTo({
					url:`/pages/${path}/index`,
				})
			},
			toDetail(id, name) {
				uni.navigateTo({
					url:`/pages/sightsDetail/index?id=${id}&name=${name}`,
				})
			}
		}
	}
</script>

<style lang="less">
	.home-page {
		.home-swiper {
			.swiper {
				height: 300rpx;
			}
			.swiper-item {
				height: 300rpx;
				line-height: 300rpx;
				text-align: center;
			}
		}
		.quick-entry {
			display: flex;
			height: 220rpx;
			border-bottom: 20rpx solid #f7f9fd;
			margin-bottom: 10rpx;
			.entry-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.img-wrap {
					width: 104rpx;
					height: 104rpx;
					margin-bottom: 20rpx;
					border-radius: 50%;
					overflow: hidden;
					image {
						width: 100%;
						height: 100%;
					}
				}
				text {
					font-size: 24rpx;
					color: #333;
				}
			}
		}
		.recommend-route {
			.title {
				height: 108rpx;
				line-height: 108rpx;
				font-size: 34rpx;
				border-bottom: 2rpx solid #f7f9fd;
				text {
					padding-left: 30rpx;
				}
			}
			preview-img {
				/deep/.preview-wrap {
					width: 215rpx;
					height: 215rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
				}
				&:nth-of-type(3n) /deep/ .preview-wrap {
					margin-right: 0
				}
			}
			operate-button /deep/.operate-btn-wrap {
				button {
					line-height: 98rpx;
					color: #8e939c!important;
					font-size: 24rpx;
					text {
						margin-right: 15rpx;
					}
				}
			}
		}
	}
</style>
