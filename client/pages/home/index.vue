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
				<swiper-item v-for="item in banners" :key="item">
					<view class="swiper-item">
						<image :src="item" mode=""></image>
					</view>
				</swiper-item>
				<!-- <swiper-item>
					<view class="swiper-item">
						<image src="../../static/img/banner01.jpg" mode=""></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<image src="../../static/img/banner02.jpg" mode=""></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<image src="../../static/img/banner03.jpg" mode=""></image>
					</view>
				</swiper-item> -->
			</swiper>
		</view>
		<view class="quick-entry">
			<view class="entry-item" @click="scanCode">
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
				<text class="tx-gray">领取积分</text>
			</view>
			<view class="entry-item">
				<view class="img-wrap">
					<image src="../../static/img/exchange.png" mode=""></image>
				</view>
				<text class="tx-gray">积分兑换</text>
			</view>
		</view>
		<view class="recommend-route">
			<view class="title">广场</view>
			<block v-for="item in sights" :key="item.id">
				<sight-item :sightInfo="item" share ></sight-item>
			</block>
		</view>
		<load-more :status="status" v-if="sights.length"></load-more>
		<view class="no-data" v-else>暂无数据</view>
	</view>
</template>

<script>
	import areaSearch from '@/components/area-search/index.vue'
	import sightItem from '@/components/sight-item/index.vue'
	import loadMore from '@/components/load-more/index.vue'
	import { rPost } from '@/utils/http.js'
	export default {
		data() {
			this.pageNumber = 0
			this.pageSize = 5
			this.total = 0
			this.searchVal = ''
			this.provinceCode = ''
			return {
				sights: [],
				status: 'more',
				banners: []
			}
		},
		components:{
			areaSearch,
			sightItem,
			loadMore
		},
		onShareAppMessage(res) {
			// console.log(res,'===res')
			if (res.from === 'button') {// 来自页面内分享按钮
				const shareInfo = res.target.dataset.info
				// console.log(shareInfo,88)
				const desc = shareInfo.content
				const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
				return {
					title,
					imageUrl: shareInfo.pictures[0],
					path: `/pages/punchDetail/index?id=${shareInfo.id}`
				}
			} else {
				return {
					title: '慧景链',
					path: '/pages/home/index',
					imageUrl: '../../static/img/integral.png'
				}
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.clear()
			this.getPunchingList()
		},
		//上拉加载更多
		onReachBottom() {
			if ((this.pageNumber+1) * this.pageSize < this.total) {
				this.pageNumber++
				this.status = 'loading'
				this.getPunchingList()
			}
		},
		onShow() {
			this.updatePunchingList()
			uni.showTabBar()
		},
		onLoad() {
			this.getBanner()
			this.getPunchingList()
		},
		methods: {
			//轮播图
			async getBanner() {
				const res = await rPost('', 'getBanner',{})
				if (res.result) {
					this.banners = res.result
				}
			},
			//正在打卡
			async getPunchingList() {
				const params = {
				 "pageNumber": this.pageNumber,
					"pageSize": this.pageSize,
					"scenicId": "",
					"placeId": "",
					"wxUserId": "",
					"provinceCode": this.provinceCode,
					"cityCode": "",
					"searchText": this.searchVal
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await rPost('', 'wordsPageList',params)
				if (res.result) {
					const list = res.result.list
					list.map(v => {
						v.createDate = v.createDate.split(' ')[0]
					})
					this.total = res.result.totalCount
					if ((this.pageNumber+1) * this.pageSize < this.total) {
						this.status = 'more'
					} else {
						this.status = 'no-more'
					}
					this.sights = this.sights.concat(list)
				}
				uni.hideLoading()
				uni.stopPullDownRefresh()
			},
			//从详情回来更新该条信息的评论和点赞
			async updatePunchingList() {
				const id = this.$store.state.currentSightId
				if(id) {
					const params = {
					 "pageNumber": 0,
						"pageSize": (this.pageNumber +1) *this.pageSize,
						"scenicId": "",
						"placeId": "",
						"wxUserId": "",
						"provinceCode": this.provinceCode,
						"cityCode": "",
						"searchText": this.searchVal
					}
					const res = await rPost('', 'wordsPageList',params)
					if (res.result) {
						const list = res.result.list
						list.map((v,i) => {
							v.createDate = v.createDate.split(' ')[0]
							if (id === v.id) {
								this.sights.splice(i, 1 , v)
							}
						})
					}
				}
			},
			changeArea(e) {
				// console.log(e)
				this.provinceCode = e.code
				this.searchVal = e.val
				this.clear()
				this.getPunchingList()
			},
			//重置查询条件
			clear() {
				this.pageNumber = 0
				this.total = 0
				this.sights = []
			},
			scanCode() {
				uni.scanCode({
				    success: function (res) {
							// console.log(res,'5444')
							if (res.path) {
								uni.navigateTo({
									url: res.path
								})
							}
				    }
				});
			},
			toUrl(path) {
				uni.navigateTo({
					url:`/pages/${path}/index`,
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
				image {
					width: 100%;
					height: 100%;
				}
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
				// justify-content: center;
				align-items: center;
				height: 218rpx;
				.img-wrap {
					width: 104rpx;
					height: 104rpx;
					margin-top: 36rpx;
					margin-bottom: 20rpx;
					border-radius: 50%;
					overflow: hidden;
					image {
						width: 100%;
						height: 100%;
					}
				}
				text {
					font-size: 26rpx;
					color: #333;
					line-height: 1;
					&.tx-gray {
						color: #c0c0c0;
					}
				}
			}
		}
		.recommend-route {
			.title {
				height: 108rpx;
				line-height: 108rpx;
				font-size: 36rpx;
				font-weight: bold;
				border-bottom: 5rpx solid #f7f9fd;
				padding-left: 30rpx;
				
			}
		}
	}
</style>
