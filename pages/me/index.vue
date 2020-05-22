<template>
	<view class="me-page">
		<view v-if="userInfo.avatarUrl">
			<map class="small-map"
			:latitude="latitude" 
			:longitude="longitude" 
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
			132
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
	export default {
		data() {
			return {
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					latitude: 39.9085,
					longitude: 116.39747,
					iconPath: '../../static/img/location.png',
				}, {
					latitude: 39.90,
					longitude: 116.39,
					iconPath: '../../static/img/location.png',
				}, {
					latitude: 29.40268,
					longitude: 106.54041,
					iconPath: '../../static/img/location.png',
				}],
				punch: 236,
				integral: 0,
				punchList: [],
				showMap: false
			}
		},
		components: {
			sightItem,
			operateButton
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				const shareInfo = res.target.dataset.info
				const desc = shareInfo.desc
				const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
				return {
					title,
					imageUrl: shareInfo.imgList[0],
					path: `/pages/punchDetail/index?id=${shareInfo.id}`
				}
			}
		},
		onShow() {
		},
		created() {
			uni.hideShareMenu()
			if (this.userInfo.avatarUrl) {
				this.getPunchingList()
			}
		},
		computed: {
			userInfo() {
				console.log(this.$store.state,'===state')
				return this.$store.state.userInfo
			}
		},
		methods: {
			getUserInfo(e) {
				//用户信息
				console.log(e,465)
				uni.setStorageSync('userInfo', e.detail.userInfo)
				this.$store.commit('setUserInfo', e.detail.userInfo)
				uni.showToast({
					title: '授权成功',
					success:()=>{
						this.getPunchingList()
					}
				})
			},
			getPunchingList() {
				const userInfo = this.userInfo
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				setTimeout(()=>{
					this.punchList = [
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
			toLogin () {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			xxx() {
				uni.getUserInfo({
					success(e) {
						console.log(e,123)
					},
					fail(e) {
						console.log(e, 234)
					}
				})
			},
			aaa() {
				uni.authorize({
					//需要在manifest配置
					scope:'scope.userLocation',
					success(s) {
						console.log(s,'sss')
					},
					fail(e) {
						console.log(e, 'eee')
					}
				})
			}
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
