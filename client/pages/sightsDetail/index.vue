<template>
	<view class="sights-detail bg-common bg-white pd-lr-15">
		<view class="sight-info">
			<view class="fw">景区简介</view>
			<jyf-parser ref='article'></jyf-parser>
			<!-- <rich-text :nodes="html"></rich-text> -->
			<!-- <jyf-parser :html="html" ref="article"></jyf-parser>
			<view class="desc">{{sightInfo.introduce}}</view>
			<image class="sight-img" :src="sightInfo.pictures[0]" mode="scaleToFill"></image>
			<view class="desc"></view> -->
		</view>
		<view class="fw">打卡景点</view>
		<view v-if="places.length">
			<view class="place-list" v-for="item in places" :key="item.id" >
				<image :src="item.pictures[0]" mode=""></image>
				<view class="place-info flex">
					<view class="info-title" @click="toDetail(item.id,item.name)">{{item.name}}</view>
					<view class="info-desc" @click="toDetail(item.id,item.name)">{{item.introduce}}</view>
				</view>
			</view>
			<load-more :status="status"></load-more>
		</view>
		<view v-else class="no-data">暂无打卡景点</view>
		<!-- <view class="sight-comment">
			<view class="fw bg-white border-bt-1px">留言</view>
			<block v-for="item in comments" :key="item.time">
				<sight-item :sightInfo="item" share :location="false"></sight-item>
			</block>
			<load-more :status="status" v-if="comments.length"></load-more>
			<view class="no-data bg-white" v-else>暂无数据</view>
		</view>
		<view class="punch flex" @click="toUrl">
			<text class="iconfont icon-pinglun"></text>
			打卡留言
		</view> -->
	</view>
</template>

<script>
	import previewImg from '@/components/preview-img/index.vue'
	import sightItem from '@/components/sight-item/index.vue'
	import {rPost} from '@/utils/http.js'
	import loadMore from '@/components/load-more/index.vue'
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		data() {
			this.pageNumber = 0
			this.pageSize = 5
			this.total = 0
			return {
				sightInfo: {},
				html: '',
				userInfo: '',
				comments: [],
				status: 'more',
				places: []
			}
		},
		components: {
			previewImg,
			sightItem,
			loadMore,
			jyfParser
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
					title: '慧景链',
					path: `/pages/sightsDetail/index?id=${this.queryId}&name=${this.queryName}`,
					// imageUrl: '../../static/img/integral.png'
				}
			}
		},
		//上拉加载更多
		onReachBottom() {
			if ((this.pageNumber+1) * this.pageSize < this.total) {
				this.pageNumber++
				this.status = 'loading'
				this.placePageList()
			}
		},
		onLoad(options) {
			// console.log(options,456)
			uni.setNavigationBarTitle({
				title: options.name
			})
			this.queryId = options.id
			this.queryName = options.name
			this.getSightInfo()
			this.placePageList()
		},
		methods:{
			//景区信息
			async getSightInfo() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const params = {
				 scenicId: this.queryId,
				}
				const res = await rPost('', 'getScenicInfo', params)
				if (res.result) {
					this.html = res.result.introduce
					this.$refs.article.setContent(res.result.introduce);
					this.sightInfo = res.result
				}
				uni.hideLoading()
			},
			//景区下景点列表
			async placePageList() {
				const params = {
					pageNumber: this.pageNumber,
					pageSize: this.pageSize,
					scenicId: this.queryId,
				}
				const res = await rPost('', 'placePageList', params)
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
					this.places = this.places.concat(res.result.list)
				}
			},
			toDetail(id, name) {
				uni.navigateTo({
					url:`/pages/placeDetail/index?id=${id}&name=${name}`,
				})
			},
		}
		
	}
</script>

<style lang="less">
	.sights-detail {
		.sight-info {
			padding-bottom: 40rpx;
			margin-bottom: 20rpx;
			rich-text {
				line-height: 1.5;
			}
		}
		.fw {
			margin-top: 10rpx;
			font-size: 32rpx;
		}
		.desc {
			line-height: 50rpx;
		}
		.sight-img {
			width: 100%;
			height: 280rpx;
			margin: 10rpx 0;
			border-radius: 10rpx;
		}
		.place-list {
			padding: 30rpx 0;
			display: flex;
			border-bottom: 6rpx solid #f7f9fd;
			image{
				width: 215rpx;
				height: 175rpx;
				border-radius: 5rpx;
				margin-right: 20rpx;
			}
			.place-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				// justify-content: space-around;
				.info-title {
					// font-size: 28rpx;
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
					-webkit-line-clamp: 3;
					overflow: hidden;
					color: #626262;
					line-height: 1.2;
					margin-top: 8rpx;
				}
			}
			&:first-of-type {
				padding-top: 10rpx;
			}
			&:last-of-type {
				border-bottom: none
			}
		}
		
	
	}
</style>
