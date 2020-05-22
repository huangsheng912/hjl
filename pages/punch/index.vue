<template>
	<view class="punch-page">
		<nav-bar @handleBack="handleBack" :title="queryName || '打卡留言'"></nav-bar>
		<view class="punch-content">
			<input type="text" v-model="comment" placeholder="请输入留言" class="comment-input"/>
			<view class="upload-imgs">
				<preview-img :url="item" :urlList="imgs"  v-for="item in imgs" :key="item"></preview-img>
				<button type="default" @click="chooseImg"><text class="iconfont icon-jia"></text></button>
			</view>
			<view class="location align-center" @click="chooseLocation" v-show="addressName">
				<text class="iconfont icon-dingwei"></text>{{addressName}}
			</view>
			<view class="pay-on-wall">
				<view class="choose-pay align-center">
					<text class="iconfont" :class="pay?'icon-success':'icon-quan'" @click="changePay"></text>付费上墙
				</view>
				<view class="pay-detail" v-if="pay">
					<view class="time">置顶时长<text class="fr">{{duration}}s</text></view>
					<view class="info-fee">信息服务费<text class="fr">￥ {{money}}</text></view>
					<view class="integral">
						积分 (共10.00可用)
						<switch class="fr" color="#007aff" @change="switchChange"/>
					</view>
				</view>
			</view>
		</view>
		<view class="pay-wrap ">
			<view class="content pd-lr-15">
				合计：<text class="unit">￥</text> <text>{{money}}</text>
				<button type="primary" class="fr" @click="submit">发布</button>
			</view>
		</view>
		<view class="open-setting-modal" v-if="openSetting">
			<view class="content">
				<view class="border-bt-1px">"慧景链"即将打开设置页，请您在设置页选择允许使用位置信息</view>
				<button type="default" open-type="openSetting" @opensetting="handleSetting">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import amap from '@/utils/amap-wx.js';  
	import previewImg from '@/components/preview-img/index.vue'
	import navBar from '@/components/nav-bar/index.vue'
	export default {
		data() {
			return {
				headerTitle: '打卡留言',
				openSetting: false,
				comment: '',
				imgs: [],
				addressName:'', //定位地址
				latitude: '',		//纬度
				longitude: '',  //经度
				pay: false,
				duration: '',
				money: 0,
				switch: false,
			}
		},
		components: {
			previewImg,
			navBar
		},
		onShow() {
			uni.hideTabBar()
			if (!this.addressName) {
				this.amapPlugin = new amap.AMapWX({
						key: "6e567d4324ae2efdba7f37b02a30a719" 
				});
				this.getAuthSetting()
			}
		},
		computed: {
			queryName() {
				console.log(this.$store.state.punchName,999888777)
				return this.$store.state.punchName
			}
		},
		methods: {
			//回到首页，同时清空数据
			handleBack() {
				console.log('进入')
				uni.switchTab({
					url: '/pages/home/index',
					success:() => {
						console.log('完成')
						//置空定位，下次进入页面重新重新定位
						this.addressName = ''
						this.cancelAuth = false
						this.$store.commit('setPunchName', '')
						uni.showTabBar()
					}
				})
			},
			//获取定位授权情况，已授权
			getAuthSetting() {
				uni.getSetting({
					success:(res) => {
						console.log(res, 798,this.cancelAuth)
						if (res.authSetting['scope.userLocation']===false) {
							if (!this.cancelAuth) {
								this.showAuthModal()
							}
						} else {
							this.getLocation()
						}
					}
				})
			},
			//获取定位
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					success:(res) => {
						console.log(res, 'getLocation-success')
						uni.showLoading({
								title: '获取定位中'  
						});  
						this.latitude = res.latitude
						this.longitude = res.longitude
						this.amapPlugin.getRegeo({
								success: (data) => {
									console.log(data, 'getRegeo')
									/* const res = data[0].regeocodeData.addressComponent
									this.city = res.province //省
									const city = res.city || '' //市
									const district = res.district	//区
									const street = res.streetNumber.street + res.streetNumber.number //街道
									this.place = city + district + street */
									this.addressName = data[0].name;
									uni.hideLoading();  
								},
								fail(e) {
								}
						});
					},
					fail:(e) => {
						console.log(e, 'getLocation-fail')
					}
				})
			},
			//授权定位提示
			showAuthModal() {
				uni.showModal({
					title: "请开启定位",
					content: '请允许"慧景链"使用您的定位，方便为您提供更好服务。',
					confirmText: "开启定位",
					confirmColor: "#3CC51F",
					success:(res) => {
						console.log(res, 'res')
						if (res.confirm) {
							this.openSetting = true
						} else {
							this.cancelAuth = true
						}
					}
				})
			},
			//设置回调
			handleSetting(e) {
				this.openSetting = false
				console.log(e, 465)
				if (e.detail.authSetting['scope.userLocation']) {
					this.getLocation()
				} else {
					this.cancelAuth = true
				}
			},
			//打开地图选择定位
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						console.log(res, 'choose')
						this.addressName = res.name
						this.latitude = res.latitude
						this.longitude = res.longitude
					},
					fail: (e) => {
						console.log(e, 'chooseFail')
					}
				})
			},
			chooseImg() {
				uni.chooseImage({
					sourceType: ['album'],
					sizeType: 'original',
					success: (file) => {
						this.imgs = file.tempFilePaths
						console.log(file.tempFiles,88)
					},
					fail(e) {
						console.log(e,222)
					}
				})
			},
			changePay(e) {
				this.pay = !this.pay
				// this.pay = e.detail.value[0] ? true : false
				this.duration =this.pay ? 25 : 0
				this.money = this.pay ? 19.9 : 0
			},
			switchChange(e) {
				this.switch = e.detail.value
			},
			submit() {
				uni.navigateTo({
					url:`/pages/payInfo/index?name=${this.queryName}`,
				})
			}
		}
	}
</script>

<style lang="less">
	.punch-page{
		.punch-content {
			padding: 15rpx 30rpx 0;
		}
		.comment-input {
			margin-bottom: 15rpx;
			font-size: 30rpx;;
			line-height: 44rpx;
			padding-left: 0;
		}
		.upload-imgs {
			overflow: hidden;
			.preview-wrap {
				float: left;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
			button {
				float: left;
				width: 195rpx;
				height: 195rpx;
				line-height: 195rpx;
				background-color: #f7f9fd;
				color: #b2bed9;
				.iconfont {
					font-size: 60rpx;
				}
				&::after {
					border: none;
				}
			}
		}
		.location {
			color: #00cedb;
			height: 70rpx;
			text {
				font-size: 32rpx;
				margin-right: 10rpx;
			}
		}
		.pay-on-wall {
			.choose-pay {
				margin-bottom: 20rpx;
				line-height: 1.5;
				.iconfont {
					color: #00cedb;
					margin-right: 10rpx;
					font-size: 52rpx;;
				}
				.icon-quan{
					color: #8e939c
				}
			}
			.pay-detail {
				margin: 10rpx 40rpx 0 56rpx;
				border-top: 1px solid #efeff2;
				view {
					height: 108rpx;
					line-height: 108rpx;
					border-bottom: 1px solid #efeff2;
				}
			}
		}
		.pay-wrap {
			position: fixed;
			width: 100%;
			bottom: 0;
			border-top: 1px solid #e5e6e6;
			.content {
				height: 162rpx;
				line-height: 162rpx;
				font-size: 26rpx;
			}
			text {
				color: #fa6564;
				font-size: 42rpx;
				font-weight: 600;
			}
			.unit {
				font-size: 24rpx;
			}
			button {
				background-color: #00cfdb;
				padding: 26rpx 76rpx;
				line-height: 1;
				margin-top: 45rpx;
				border-radius: 60rpx;
				font-size: 26rpx;
			}
		}
		.open-setting-modal {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: rgba(0,0,0,0.6);
			display: flex;
			justify-content: center;
			align-items: center;
			.content {
				width: 520rpx;
				background-color: #fff;
				border-radius: 20rpx;
				overflow: hidden;
				view {
					padding: 28rpx 40rpx;
				}
				button {
					background-color: #fff;
					color: #e64340;
					line-height: 2.2;
					&::after {
						border: none;
					}
				}
			}
		}
	}
</style>
