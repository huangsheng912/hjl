<template>
	<view class="hot-sights">
		<area-search @change="changeArea"></area-search>
		<view v-if="sights.length">
			<view class="sight-list" v-for="item in sights" :key="item.id" >
				<image :src="item.pictures[0]" mode=""></image>
				<view class="sight-info flex">
					<view class="info-title" @click="toDetail(item.id,item.scenicName)">{{item.scenicName}}</view>
					<view class="info-desc" @click="toDetail(item.id,item.scenicName)">{{item.introduce}}</view>
					<view class="info-bottom">
						<text class="iconfont icon-chakan"></text> {{item.views}}
						<!-- <view class="fr" @click="toggleLike(item.id)"><text class="iconfont" :class="item.isLike?'icon-heart-fill':'icon-heart'"></text> {{item.like}}</view> -->
					</view>
				</view>
			</view>
			<load-more :status="status"></load-more>
		</view>
		<view v-else class="no-data">暂无数据</view>
	</view>
</template>

<script>
	import areaSearch from '@/components/area-search/index.vue'
	import loadMore from '@/components/load-more/index.vue'
	import {rPost} from '@/utils/http.js'
	export default {
		data() {
			this.pageNumber = 0
			this.pageSize = 8
			this.total = 0
			this.searchVal = ''
			return {
				sights: [],
				status: 'more'
			}
		},
		components:{
			areaSearch,
			loadMore
		},
		//上拉加载更多
		onReachBottom() {
			if ((this.pageNumber+1) * this.pageSize < this.total) {
				this.pageNumber++
				this.status = 'loading'
				this.getPunchingList()
			}
		},
		onLoad() {
			this.getHotSights()
		},
		methods: {
			async getHotSights() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const params = {
				 "pageNumber": this.pageNumber,
					"pageSize": this.pageSize,
					"provinceCode": this.provinceCode,
					"searchText": this.searchVal
				}
				const res = await rPost('', 'hotScenicPageList', params)
				if (res.result) {
					this.total = res.result.totalCount
					if ((this.pageNumber+1) * this.pageSize < this.total) {
						this.status = 'more'
					} else {
						this.status = 'no-more'
					}
					res.result.list.map(v=>{
						v.introduce = v.introduce.replace(/<\/?.+?>/g, "")
					})
					this.sights = this.sights.concat(res.result.list)
				}
				uni.hideLoading()
			},
			changeArea(e) {
				// console.log(e)
				this.provinceCode = e.code
				this.searchVal = e.val
				this.clear()
				this.getHotSights()
			},
			//重置查询条件
			clear() {
				this.pageNumber = 0
				this.total = 0
				this.sights = []
			},
			toggleLike(id) {
				this.sights.forEach(v => {
					if (v.id === id) {
						v.isLike = !v.isLike
					}
				})
			},
			toDetail(id, name) {
				this.addViewTimes(id)
				uni.navigateTo({
					url:`/pages/sightsDetail/index?id=${id}&name=${name}`,
				})
			},
			//增加浏览次数
			addViewTimes(id) {
				rPost('', 'recordViews', {scenicId: id})
			},
		}
	}
</script>

<style lang="less">
	.hot-sights {
		.sight-list {
			padding: 30rpx;
			display: flex;
			border-bottom: 6rpx solid #f7f9fd;
			image{
				width: 215rpx;
				height: 175rpx;
				border-radius: 5rpx;
				margin-right: 20rpx;
			}
			.sight-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.info-title {
					font-size: 30rpx;
					line-height: 40rpx;
					font-weight: bold;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.info-desc {
					font-size: 26rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					color: #626262;
					line-height: 1.2;
				}
				.info-bottom {
					font-size: 24rpx;
					color: #8e939c;
					text-align: right;
					.iconfont {
						margin-right: 5rpx;
					}
				}
			}
			&:last-of-type {
				border-bottom: none
			}
		}
	}
</style>
