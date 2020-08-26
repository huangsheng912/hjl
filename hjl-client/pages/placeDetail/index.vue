<template>
	<view class="place-detail bg-common">
		<view class="place-info bg-white pd-lr-15">
			<view class="fw">景点简介</view>
			<jyf-parser ref='article'></jyf-parser>
			<!-- <rich-text :nodes="html"></rich-text> -->
			<!-- <jyf-parser :html="html" ref="article"></jyf-parser>
			<view class="desc">{{sightInfo.introduce}}</view>
			<image class="sight-img" :src="sightInfo.pictures[0]" mode="scaleToFill"></image>
			<view class="desc"></view> -->
		</view>
		<view class="place-comment">
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
			</view>
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
				status: 'more'
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
					path: `/pages/placeDetail/index?id=${this.queryId}&name=${this.queryName}`,
					// imageUrl: '../../static/img/integral.png'
				}
			}
		},
		//上拉加载更多
		onReachBottom() {
			if ((this.pageNumber+1) * this.pageSize < this.total) {
				this.pageNumber++
				this.status = 'loading'
				this.getWordsPageList()
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
			this.getWordsPageList()
		},
		methods:{
			async getSightInfo() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const params = {
				 id: this.queryId,
				}
				const res = await rPost('', 'getPlaceById', params)
				if (res.result) {
					this.html = res.result.introduce
					this.$refs.article.setContent(res.result.introduce);
					this.sightInfo = res.result
				}
				uni.hideLoading()
			},
			async getWordsPageList() {
				const params = {
					pageNumber: this.pageNumber,
					pageSize: this.pageSize,
					scenicId: '',
					placeId: this.queryId,
					wxUserId: '',
					searchText: '',
					provinceCode: '',
					cityCode: ''
				}
				const res = await rPost('', 'wordsPageList', params)
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
					this.comments = this.comments.concat(list)
				}
			},
			toUrl() {
				// console.log(this.queryName,this.queryId,444,this.sightInfo)
				const {name, id ,address} = this.sightInfo
				const info = {
					name,
					id,
					address,
					provinceName: this.sightInfo.provinceName,
					cityName: this.sightInfo.cityName
				}
				this.$store.commit('setPunchInfo', info)
				uni.switchTab({
					url: '/pages/punch/index'
				})
			}
		}
		
	}
</script>

<style lang="less">
	.place-detail {
		.place-info {
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
		.place-img {
			width: 100%;
			height: 280rpx;
			margin: 10rpx 0;
			border-radius: 10rpx;
		}
		.place-comment {
			.fw {
				padding: 20rpx 30rpx;
				font-size: 32rpx;
				&.border-bt-1px:after {
					left: 30rpx;
					right: 30rpx;
				}
			}
			sight-item {
				.border-bt-1px:after {
					height: 0;
				}
			}
			.load-more {
				background-color: #fff;
			}
			.no-data {
				margin: 0;
				padding: 40rpx 0;
			}
		}
		.comment-bottom {
			overflow: hidden;
			color: #8f949a;
			.icon-heart-fill {
				color: f66b6f;
				margin: 0 10rpx 0 40rpx;
			}
		}
		.punch{
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: fixed;
			right: 30rpx;
			bottom: 100rpx;
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
			background-color: #fff;
			color: #71e1e8;
			box-shadow: 0 0 10rpx #8f949a;
			font-size: 24rpx;
			.icon-pinglun {
				color: #25d5e0;
				font-size: 36rpx;
				line-height: 1;
			}
		}
	}
</style>
