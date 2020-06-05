<template>
	<view class="me-page">
		<view v-if="userInfo.avatarUrl">
			<map class="small-map"
			:markers="covers" 
			:enable-overlooking="true" 
			:include-points="covers"
			:enable-satellite="true"
			:style="{transform: !showMap?'translateX(0)':'translateX(-100%)'}"
			></map>
			<view class="my-info" :style="{transform: !showMap?'translateX(0)':'translateX(-100%)'}">
				<cover-image class="show-big-map" src="../../static/img/show-big-map.png" mode="scaleToFill" @click="showMap=true"></cover-image>
				<cover-image class="my-avatar" :src="userInfo.avatarUrl" mode="scaleToFill"></cover-image>
				<text class="user-name">{{userInfo.nickName}}</text>
				<view class="punch-info">
					<text>{{punch}} 足迹</text>
					<text>{{integral}} 积分</text>
				</view>
			</view>
			
			<view class="punch-item" :style="{transform: !showMap?'translateX(0)':'translateX(-100%)'}">
				<block v-for="item in punchList" :key="item.id">
					<sight-item :sightInfo="item" share ></sight-item>
				</block>
			</view>
			<load-more :status="status" v-if="punchList.length"></load-more>
			<view class="no-data" v-else>暂无数据</view>
			<!--<button type="default" @click="xxx">xxx</button>
			<button type="default" @click="aaa">aaa</button> -->
			<view class="mask-map" :style="{transform: showMap?'translateX(0)':'translateX(-100%)'}">
				<view class="mask" @click="showMap=false"></view>
				<map
				class="big-map"
				:latitude="latitude"
				:longitude="longitude" 
				:markers="covers" 
				:enable-overlooking="true" 
				:include-points="covers"
				:enable-satellite="true"
				></map>
			</view>
			
		</view>
		<view v-else class="no-login flex">
			<view class="img-wrap">
				<image src="../../static/img/meActive.png" mode="scaleToFill"></image>
			</view>
			<view class="tip">慧景链申请获取你的用户信息</view>
			<operate-button type="auth" @getUserInfo="getUserInfo">授权登录</operate-button>
		</view>
	</view>
</template>

<script>
	import sightItem from '@/components/sight-item/index.vue'
	import operateButton from '@/components/operate-button/index.vue'
	import { rPost } from '@/utils/http.js'
	import loadMore from '@/components/load-more/index.vue'
	export default {
		data() {
			this.pageNumber = 0
			this.pageSize = 6
			this.total = 0
			return {
				latitude: 39.909,
				longitude: 116.39742,
				covers: [],
				punch: 0,
				integral: 0,
				punchList: [],
				showMap: false,
				status: 'more'
			}
		},
		components: {
			sightItem,
			operateButton,
			loadMore
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				const shareInfo = res.target.dataset.info
				const desc = shareInfo.content
				const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
				return {
					title,
					imageUrl: shareInfo.pictures[0],
					path: `/pages/punchDetail/index?id=${shareInfo.id}`
				}
			}
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
			uni.showTabBar()
			if (this.userInfo.avatarUrl) {
				this.clear()
				this.getPunchingList()
				this.getUserFootprint()
			}
		},
		onLoad() {
			uni.hideShareMenu()
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		methods: {
			//授权登录
			getUserInfo(e) {
				console.log(e,465)
				const userInfo = e.detail.userInfo
				if (!userInfo) return
				uni.setStorageSync('userInfo', userInfo)
				this.$store.commit('setUserInfo', userInfo)
				uni.showToast({
					title: '授权成功',
					success:() => {
						this.getPunchingList()
						this.getUserFootprint()
					}
				})
				uni.login({
					success: (res) => {
						if (res.code) {
							this.login(res.code)
						}
					}
				})
				/* uni.checkSession({
					success: () => {
						console.log('session有效')
						this.login()
					},
					fail: () => {
						console.log('session过期')
						uni.login({
							success: (res) => {
								if (res.code) {
									uni.setStorageSync('wxCode', res.code);
									this.login()
								} else {
									console.log('获取用户登录态失败！' + res.errMsg);
								}
							},
							fail: function() {
								uni.showToast({
										title: '微信登录失败',
										icon: 'none'
								})
							}
						})
					}
				}) */
			},
			
			async login(code) {
				const params = {
					code,
					/* encryptedData: e.detail.encryptedData,
					iv: e.detail.iv, */
					referrer: ''
				}
				const loginRes = await rPost('', 'wxLogin', params)
				if (loginRes.result) {
					//e457d8520bb94ad7a726bc08f6519130
					uni.login({
						success(response) {
							uni.setStorageSync('wxCode', response.code);
						}
					})
					uni.setStorageSync('userId', loginRes.result.id)
					uni.setStorageSync('token', loginRes.result.sessionKey)
					const userInfo = uni.getStorageSync('userInfo')
					const data = {
						"userId": loginRes.result.id,
						"userName": userInfo.nickName,
						"headImgUrl": userInfo.avatarUrl
					}
					//更新用户名字，头像
					const res = await rPost('', 'updateWxUser', data)
					if (res.result) {
						console.log(res.result, 'updateWxUser')
					} else {
						
					}
				}
				
			},
			
			async getPunchingList() {
				const params = {
				 "pageNumber": this.pageNumber,
					"pageSize": this.pageSize,
					"scenicId": "",
					"placeId": "",
					"wxUserId": uni.getStorageSync('userId'),
					"provinceCode": "",
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
						if (v.latitude && v.longitude) {
							this.covers.push({
								latitude: v.latitude,
								longitude: v.longitude,
								iconPath: '../../static/img/location.png',
							})
						}
					})
					this.total = res.result.totalCount
					if ((this.pageNumber+1) * this.pageSize < this.total) {
						this.status = 'more'
					} else {
						this.status = 'no-more'
					}
					this.punchList = this.punchList.concat(list)
				}
				uni.hideLoading()
			},
			async getUserFootprint() {
				const res = await rPost('', 'getUserFootprint',{userId: uni.getStorageSync('userId')})
				if (res.result) {
					this.punch = res.result.footprint
				}
			},
			//重置查询条件
			clear() {
				this.pageNumber = 0
				this.total = 0
				this.punchList = []
			},
		}
	}
</script>

<style lang="less">
	.me-page {
		.small-map {
			width: 100%;
			height: 425rpx;
		}
		.my-info {
			position: absolute;
			top: 348rpx;
			left: 0;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.show-big-map {
				position: absolute;
				left: 20rpx;
				top: -5rpx;
				width: 60rpx;
				height: 60rpx;
			}
			.my-avatar {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}
			.user-name {
				// font-size: 24rpx;
			}
			.punch-info {
				font-size: 24rpx;
				line-height: 1;
				width: 100%;
				text {
					display: inline-block;
					width: 50%;
					box-sizing: border-box;
				}
				text:first-of-type {
					text-align: right;
					padding-right: 30rpx;
					border-right: 1px solid #c7c7c7;
				}
				text:last-of-type {
					text-align: left;
					padding-left: 30rpx;
				}
			}
		}
		.punch-item {
			margin-top: 180rpx;
			border-top: 5rpx solid #f8f7fc;
			preview-img {
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
		.mask-map {
			position: fixed;
			bottom: 0;
			left: 0;
			top: 0;
			right: 0;
			display: flex;
			align-items: center;
			.mask {
				position: absolute;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,0.7);
			}
			map {
				width: 100%;
				height: 800rpx;
			}
		}
		.no-login {
			align-items: center;
			flex-direction: column;
			height: 100%;
			.img-wrap {
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-top: 200rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.tip {
				font-size: 40rpx;
				margin: 50rpx 0;
			}
			operate-button /deep/.operate-btn-wrap button {
				line-height: 2.5;
				background-color: #007aff !important;
				color: #fff!important;
				padding: 0 48rpx;
			}
		}
	}
</style>
