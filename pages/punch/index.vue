<template>
	<view class="punch-page">
		<nav-bar @handleBack="handleBack('home')" :title="queryName || '打卡留言'"></nav-bar>
		<view class="punch-content">
			<textarea auto-height v-model="comment" placeholder="请输入留言" class="comment-input"/>
			<view class="upload-imgs">
				<preview-img :url="item" :urlList="imgs"  v-for="item in imgs" :key="item">
					<view class="del-img" @click.stop="deleteImg(item)">
						<text class="iconfont icon-close"></text>
					</view>
				</preview-img>
				<button v-show="showUpload" type="default" @click="chooseImg"><text class="iconfont icon-jia"></text></button>
			</view>
			<view v-if="queryName">
				<view class="location align-center">
					<text class="iconfont icon-dingwei"></text>{{queryName}}
				</view>
			</view>
			<view v-else>
				<view class="location align-center" @click="chooseLocation" v-show="addressName">
					<text class="iconfont icon-dingwei"></text>{{addressName}}
				</view>
			</view>
			<view class="pay-on-wall" v-if="queryName">
				<view class="choose-pay align-center">
					<text class="iconfont" :class="pay?'icon-kongjianxuanzhong':'icon-kongjianweixuan'" @click="pay=!pay"></text>付费上墙
				</view>
				<view class="pay-detail" v-if="pay">
					<!-- <view class="time">
						置顶时长
						<picker class="fr" :value="currentIndex" :range="durationArr" @change="selectDuration">
							<view class="serch-val">{{durationArr[currentIndex]}}</view>
						</picker>
					</view> -->
					<view class="time">置顶时长<text class="fr">60s</text></view>
					<view class="info-fee">信息服务费<text class="fr">￥ {{serviceMoney}}</text></view>
					<!-- <view class="integral">
						积分 (共10.00可用)
						<switch class="fr" color="#007aff" @change="switchChange"/>
					</view> -->
				</view>
			</view>
		</view>
		<view class="pay-wrap ">
			<view class="content pd-lr-15">
				<view class="count fl" v-if="queryName&&pay">合计：<text class="unit">￥</text> <text>{{serviceMoney}}</text></view>
				<button type="primary" class="fr" @click="submit" :disabled="!disbled">发布</button>
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
	import qqMap from '@/utils/qqmap-wx-jssdk.min.js';
	import previewImg from '@/components/preview-img/index.vue'
	import navBar from '@/components/nav-bar/index.vue'
	import { rPost, upload } from '@/utils/http.js'
	import { config, timeToMoney } from '@/config.js'
	import MD5 from '@/utils/md5.js'
	const appId = config.appId
	export default {
		data() {
			this.provinceData ={}  //省市枚举
			this.latitude = '' //纬度
			this.longitude = '' //经度
			this.provinceName = ''
			this.provinceCode = ''
			this.cityName = ''
			this.cityCode = ''
			this.cancelAuth = false //是否取消定位授权
			return {
				headerTitle: '打卡留言',
				openSetting: false,
				comment: '',
				imgs: [],
				addressName:'', //定位地址
				pay: false,  //是否付费上榜
				durationArr: [],
				currentIndex: 0,
				switch: false, //是否使用积分
			}
		},
		components: {
			previewImg,
			navBar
		},
		onLoad() {
			this.durationArr = Object.values(timeToMoney)
			this.provinceData = JSON.parse(uni.getStorageSync('province'))
			this.qqMap = new qqMap({
				key: 'UD2BZ-HS53R-OGGWT-WEZWV-RC2UJ-FVF33'
			})
		},
		onShow() {
			uni.hideTabBar()
			if ( !this.latitude && !this.longitude ) {
				this.getAuthSetting()
			}
		},
		computed: {
			queryName() {
				return this.$store.state.punchInfo.name ? this.$store.state.punchInfo.name : ''
			},
			disbled() {
				return this.comment && this.longitude && this.latitude && this.imgs.length
			},
			showUpload() {
				return this.imgs.length < 9
			},
			serviceMoney() {
				return '1元'
				/* const time = this.durationArr[this.currentIndex]
				for (let i in timeToMoney) {
					if (timeToMoney[i] === time) {
						return i
					}
				} */
			}
		},
		methods: {
			//回到首页，同时清空数据
			handleBack(page) {
				//置空状态，下次进入页面重新重新定位
				this.clear()
				uni.showTabBar()
				uni.switchTab({
					url: `/pages/${page}/index`,
				})
			},
			//获取定位授权情况，已授权
			getAuthSetting() {
				uni.getSetting({
					success:(res) => {
						console.log(res, 'getSetting')
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
				if (this.queryName) {
					this.geocoder()
				} else {
					uni.getLocation({
						type: 'gcj02',
						success:(res) => {
							console.log(res, 'getLocation-success')
							uni.showLoading({
									title: '获取定位中'
							});  
							this.latitude = res.latitude
							this.longitude = res.longitude
							this.reverseGeocoder()
						},
						fail:(e) => {
							uni.hideLoading(); 
							console.log(e, 'getLocation-fail')
						}
					})
				}
			},
			//景区打卡将地址转坐标
			geocoder() {
				const punchInfo = this.$store.state.punchInfo
				console.log(punchInfo, 456)
				this.qqMap.geocoder({
					address: punchInfo.provinceName + punchInfo.cityName + this.queryName,
					success: (data) => {
						console.log(data, 'geocoder--success')
						const res = data.result
						if (res && res.location) {
							this.latitude = res.location.lat
							this.longitude = res.location.lng
						}
					},
					fail(e) {
						console.log(e,'geocoder--fail')
						uni.showToast({
							title: '解析位置失败',
							icon: 'none',
						})
					}
				})
			},
			//通过经纬度解析地址
			reverseGeocoder(setName) {
				this.qqMap.reverseGeocoder({
					location: this.latitude+','+this.longitude,
					success: (data) => {
						console.log(data, 'reverseGeocoder')
						const res = data.result
						if (res) {
							//手动选择定位后取选择的地址名
							if (!setName) {
								this.addressName = res.address
							}
							this.provinceName = res.address_component.province
							this.provinceCode = this.provinceData[res.address_component.province]
							this.cityName = res.address_component.city
							this.cityCode = this.provinceData[res.address_component.city]
						}
						uni.hideLoading();  
					},
					fail(e) {
						console.log(e,'reverseGeocoder132456')
						this.addressName = ''
						uni.hideLoading(); 
						uni.showToast({
							title: '解析位置失败',
							icon: 'none',
						})
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
				if (this.queryName) return
				uni.chooseLocation({
					success: (res) => {
						console.log(res, 'choose')
						this.addressName = res.name
						this.latitude = res.latitude
						this.longitude = res.longitude
						this.reverseGeocoder(true)
					},
					fail: (e) => {
						console.log(e, 'chooseFail')
					}
				})
			},
			chooseImg() {
				console.log(this.$store.state.userInfo, '=====userInfo')
				if (this.$store.state.userInfo.avatarUrl) {
					uni.chooseImage({
						// sourceType: ['album'], //只允许从相册选择
						// sizeType: 'original', //只上传原图
						count: 9-this.imgs.length,
						success: async (file) => {
							// this.imgs = file.tempFilePaths
							console.log(file.tempFiles,88,file)
							uni.showLoading({
								title: '上传中...'
							})
							for (let i =0 ; i < file.tempFilePaths.length; i++) {
								try {
									const res = await upload('/upload/image', file.tempFilePaths[i])
									const response = JSON.parse(res)
									if (response.result) {
										this.imgs.push(response.result.url)
									}
								} catch(e) {
									console.log(e,'====error=====')
								}
							}
							uni.hideLoading()
						},
						fail(e) {
							console.log(e,222)
						}
					})
				} else {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					setTimeout(()=>{
						this.handleBack('me')
					},500)
				}
				
			},
			deleteImg(img) {
				const index = this.imgs.indexOf(img)
				if (index>-1) {
					this.imgs.splice(index,1)
				}
			},
			//选择上墙时间
			selectDuration(e) {
				this.currentIndex = e.detail.value
			},
			switchChange(e) {
				this.switch = e.detail.value
			},
			submit() {
				if (this.queryName) {
					this.newWordsOfPlace()
				} else {
					this.newWordsCustom()
				}
			},
			//景区、扫码打卡
			async newWordsOfPlace() {
				const params = {
					"placeId": this.$store.state.punchInfo.id,
					"content": this.comment,
					"open":true,
					"displayOnScreen": this.pay,
					"displaySeconds":0,
					"pictures": this.imgs,
					"longitude": this.longitude,
					"latitude": this.latitude
				}
				const res = await rPost('', 'newWordsOfPlace', params)
				if (res.result) {
					if (pay && res.result.billInfo) {
						const billInfo = res.result.billInfo
						const key = res.result.mchApiSecret
						const timeStamp = ''+new Date().getTime()
						const nonceStr = billInfo.nonce_str
						const payPackage = 'prepay_id='+billInfo.prepay_id
						const signType = 'MD5'
						const str = `appId=${appId}&nonceStr=${nonceStr}&package=${payPackage}&signType=MD5&timeStamp=${timeStamp}&key=${key}`
						const paySign = MD5(str).toUpperCase()
						wx.requestPayment({
							timeStamp,
							nonceStr,
							package: payPackage,
							signType,
							paySign,
							complete: (res) => {
								console.log(res, '---支付complete')
								const msg = res.errMsg == 'requestPayment:ok' ? '支付成功' : res.errMsg =='requestPayment:fail cancel'? '支付取消' : res.errMsg
								const icon = res.errMsg == 'requestPayment:ok' ? 'success' : 'none'
								uni.showToast({
									title: msg,
									icon: icon,
									mask: true,
								})
								setTimeout(()=>{
									this.handleBack('me')
								},500)
							}
						})
					} else {
						this.handleBack('me')
					}
				} else {
					uni.showToast({
						title: '打卡失败',
						icon: 'none'
					})
				}
			},
			//自由打卡
			async newWordsCustom() {
				uni.showLoading({
					title: '打卡中...'
				})
				const params = {
					"content": this.comment,
					"open": true,
					"provinceCode": this.provinceCode,
					"provinceName": this.provinceName,
					"cityCode": this.cityCode,
					"cityName": this.cityName,
					"longitude": this.longitude,
					"latitude": this.latitude,
					"punchPointName": this.addressName,
					"pictures": this.imgs
				}
				const res = await rPost('', 'newWordsCustom', params)
				uni.hideLoading()
				if (res.result) {
					this.handleBack('me')
				} else {
					uni.showToast({
						title: '打卡失败',
						icon: 'none'
					})
				}
			},
			clear() {
				this.addressName = ''
				this.imgs = []
				this.comment = ''
				this.longitude = ''
				this.latitude = ''
				this.pay = false
				this.switch = false
				this.money = 0
				this.cancelAuth = false
				this.$store.commit('setPunchInfo', {})
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
				position: relative;
				float: left;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 0;
				.del-img {
					position: absolute;
					width: 20px;
					height: 20px;
					top:0;
					right: 0;
					text-align: center;
					line-height: 20px;
					background-color: rgba(0,0,0,0.6);
					border-radius: 0 0 0 5px;
					text {
						color: #fff;
						font-size: 16px;
					}
				}
			}
			preview-img {
				&:nth-of-type(3n) /deep/ .preview-wrap {
					margin-right: 0
				}
			}
			button {
				float: left;
				width: 215rpx;
				height: 215rpx;
				line-height: 215rpx;
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
				margin-top: 10rpx;
				margin-bottom: 20rpx;
				line-height: 1.5;
				.iconfont {
					color: #00cedb;
					margin-right: 10rpx;
					font-size: 48rpx;
				}
				.icon-kongjianweixuan{
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
			.count {
				margin-top: 45rpx;
				text {
					color: #fa6564;
					font-size: 42rpx;
					font-weight: 600;
				}
				.unit {
					font-size: 24rpx;
				}
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
			z-index: 999;
			background-color: rgba(0,0,0,0.55);
			display: flex;
			justify-content: center;
			align-items: center;
			animation: modalShow 0.3s linear;
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
	@keyframes modalShow  {
		0%{
			transform: scale(1.2);
			opacity: 0.3;
		}
		100%{
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
