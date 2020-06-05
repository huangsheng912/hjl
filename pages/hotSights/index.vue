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
						<view class="fr"><text class="iconfont icon-chakan"></text> {{item.views}} </view>
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
			changeArea(e) {
				console.log(e)
				
			},
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
				console.log(e)
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
				const place = this.sights.filter(v=>v.id===id)[0]
				const placeId = place.placeList ? place.placeList[0].id : ''
				const placeName = place.placeList ? place.placeList[0].name : ''
				if (placeId) {
					this.addViewTimes(id)
					uni.navigateTo({
						url:`/pages/sightsDetail/index?id=${placeId}&name=${placeName}`,
					})
				} else {
					uni.showToast({
						title: '该景区暂无打卡点',
						icon: 'none'
					})
				}
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
			.info-title {
				font-size: 30rpx;
			}
			.info-bottom {
				.fr:last-of-type {
					margin-right: 44rpx;
					.iconfont {
						margin-right: 5rpx;
					}
					.icon-heart-fill {
						color: #fa6464;
					}
				}
			}
		}
	}
</style>
