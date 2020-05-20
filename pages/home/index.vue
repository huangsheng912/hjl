<template>
	<view class="home-page">
		<area-search @change="changeArea"></area-search>
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
				<sight-item :sightInfo="item" share ></sight-item>
			</block>
		</view>
	</view>
</template>

<script>
	import areaSearch from '@/components/area-search/index.vue'
	import sightItem from '@/components/sight-item/index.vue'
	export default {
		data() {
			return {
				sights: []
			}
		},
		components:{
			areaSearch,
			sightItem,
		},
		onShareAppMessage(res) {
			console.log(res,'===res')
			if (res.from === 'button') {// 来自页面内分享按钮
				const shareInfo = res.target.dataset.info
				const desc = shareInfo.desc
				const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
				return {
					title,
					imageUrl: shareInfo.imgList[0],
					path: `/pages/punchDetail/index?id=${shareInfo.id}`
				}
			} else {
				return {
					title: '慧景链456798',
					path: '/pages/home/index',
					imageUrl: '../../static/img/integral.png'
				}
			}
			
		},
		created() {
			this.getPunchingList()
		},
		methods: {
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
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005141542597627.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_2020051901022499206.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005062123407084.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005062122536742.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153402869.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153427549.jpg',
								'http://pic.5tu.cn/uploads/allimg/201508/010P0000240Y4Z6091-1.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153383899.jpg',
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
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005062122536742.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153402869.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153427549.jpg',
								'http://pic.5tu.cn/uploads/allimg/201508/010P0000240Y4Z6091-1.jpg',
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
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005062122536742.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153402869.jpg',
								'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153427549.jpg',
								'http://pic.5tu.cn/uploads/allimg/201508/010P0000240Y4Z6091-1.jpg',
							],
							like: 234,
							comments: 223,
							city: '丽江市',
							place: '玉龙雪山'
						}
					]
					uni.hideLoading()
				},1500)
			},
			changeArea(e) {
				console.log(e)
				
			},
			shareByButton() {
				return new Promise((resolve, reject) => {
					setTimeout(()=>{
						const desc = this.shareInfo.desc
						const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
						const result = {
							title,
							path: `/pages/punchDetail/index?id=${this.shareInfo.id}`,
							imageUrl: this.shareInfo.imgList[0]
						}
						resolve(result)
					},500)
				})
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
