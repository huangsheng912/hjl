<template>
	<view class="common-sight-item" v-show="sightInfo.createDate" @click="toPunchDetail(sightInfo.id)">
		<view class="user-info flex">
			<view class="user-avatar border-1px">
				<image class="user-img" :src="sightInfo.wxUserImg" mode="scaleToFill"></image>
			</view>
			<view class="info" >
				<view class="user-name">{{sightInfo.wxNickName}}</view>
				<text class="time">{{sightInfo.createDate}}</text>
			</view>
			<operate-button class="share-btn" v-if="share" :shareItem="sightInfo"><text class="iconfont icon-fenxiang"></text>分享</operate-button>
		</view>
		<view class="comment-desc">
			<text v-if="isDetail">{{sightInfo.content}}</text>
			<text v-else>{{desc}}<text class="all" v-if="desc.length>120">全文</text></text>
		</view>
		<view class="comment-imgs border-bt-1px">
			<preview-img class="preview-img" :url="img" :urlList="sightInfo.pictures"  v-for="img in sightInfo.pictures" :key="img"></preview-img>
		</view>
		<view class="comment-bottom">
			<view class="location fl view" v-if="location" @click.stop="showMap">
				<text class="iconfont icon-dingwei"></text>{{sightInfo.punchPointName || sightInfo.scenicName}}
			</view>
			<view class="fr view" @click.stop="changeLike" v-if="hasLogin">
				<text class="iconfont" :class="ilike?'icon-heart-fill':'icon-heart'"></text>
				{{formatNum(likes)}}
			</view>
			<operate-button class="fr auth-btn" type="auth" v-else>
				<text class="iconfont" :class="ilike?'icon-heart-fill':'icon-heart'"></text>
				{{formatNum(likes)}}
			</operate-button>
			<view class="fr view">
				<text class="iconfont icon-pinglun1"></text>
				{{formatNum(sightInfo.comments)}}
			</view>
		</view>
		<view class="share-wrap" v-if="isDetail">
			<view class="to-friends" @click.stop="handleShare">
				<operate-button><text class="weixin"></text>发给朋友</operate-button>
			</view>
			<view class="to-circle" @click.stop="toFriendCircle">
				<text class="friends-circle"></text>
				<text class="to-circle-text">发送至朋友圈</text>
			</view>
		</view>
	</view>
</template>

<script>
	import operateButton from '@/components/operate-button/index.vue'
	import previewImg from '@/components/preview-img/index.vue'
	import { rPost } from '@/utils/http.js' 
	import { formatNum } from '@/utils/util.js'
	export default {
		props: {
			sightInfo:{
				type: Object,
				default: ()=>{}
			},
			share: {
				type: Boolean,
				default: false
			},
			location: {
				type: Boolean,
				default: true
			},
			isDetail: {
				type: Boolean,
				default: false
			}
		},
		components: {
			operateButton,
			previewImg
		},
		computed: {
			desc() {
				const desc = this.sightInfo.content
				if (desc&&desc.length> 120) {
					return desc.slice(0,120)+'...'
				}
				return desc
			},
			hasLogin() {
				return this.$store.state.userInfo.avatarUrl
			},
		},
		data() {
			return {
				ilike: false,
				likes: 0
			}
		},
		watch:{
			'sightInfo': {
				immediate: true,
				handler: function(){
					this.ilike = this.sightInfo.ilike
					this.likes = this.sightInfo.likes
				}
				
			}
		},
		methods: {
			formatNum(num) {
				return formatNum(num)
			},
			changeLike() {
				this.likes = this.ilike ? this.likes-1 : this.likes +1
				this.ilike = !this.ilike
				rPost('', 'changeLike', {wordsId: this.sightInfo.id})
			},
			handleShare() {
				// console.log(this, 777888)
				this.$parent.shareInfo = this.sightInfo
				this.$emit('handleShare', this.sightInfo)
			},
			toFriendCircle() {
				this.$emit('toFriendCircle', this.sightInfo)
			},
			toPunchDetail(id) {
				if (!this.isDetail) {
					this.$store.commit('setCurrentSightId', id)
					uni.navigateTo({
						url:`/pages/punchDetail/index?id=${id}`,
					})
				}
			},
			showMap() {
				const info = this.sightInfo
				const name = info.punchPointName || info.scenicName
				uni.openLocation({
						latitude: info.latitude,
						longitude: info.longitude,
						name: name,
						address: info.cityName + name,
						success: function (res) {
								// console.log('success'+res);
						}
				});
			},
			login() {
				console.log(55)
			}
		}
	}
</script>

<style lang="less" scoped>
	.common-sight-item {
		padding: 20rpx 30rpx 10rpx;
		border-bottom: 5rpx solid #f7f9fd;
		background-color: #fff;
		.user-info {
			.user-avatar {
				width: 86rpx;
				height: 86rpx;
				border-radius: 50%;
				margin-right: 20rpx;
				margin-bottom: 14rpx;
				overflow: hidden;
				.user-img {
					width: 100%;
					height: 100%;
				}
			}
			.info {
				flex: 1;
				.user-name {
					font-weight: bold;
					font-size: 30rpx;
					margin-top: 12rpx;
					line-height: 1;
				}
				.time {
					font-size: 24rpx;
					font-weight: 500;
					color: #8e939c;
				}
			}
			/* /deep/.operate-btn-wrap {
				button {
					line-height: 98rpx;
					color: #8e939c!important;
					font-size: 24rpx;
					text {
						margin-right: 15rpx;
					}
				}
			} */
		}
		 
		.comment-desc {
			font-size: 28rpx;
			line-height: 36rpx;
			font-weight: 300;
			overflow: hidden;
			.all {
				color: #00cedb
			}
		}
		.comment-imgs {
			margin-top: 12rpx;
			display: flex;
			flex-wrap: wrap;
		}
		.comment-bottom {
			overflow: hidden;
			font-size: 24rpx;
			color: #8e939c;
			height: 68rpx;
			padding: 20rpx 0;
			box-sizing: border-box;
			position: relative;
			.auth-btn {
				/deep/.button {
					line-height: 28rpx;
					font-size: 28rpx;
				}
			}
			.view{
				line-height: 1;
				font-size: 24rpx;
			}
			.iconfont {
				margin-right: 8rpx;
			}
			.icon-heart-fill,.icon-heart {
				margin-left: 30rpx;
			}
			.icon-heart-fill {
				color: #fa6464;
			}
		}
		.share-wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			.weixin,.friends-circle {
				display: inline-block;
				width: 36rpx;
				height: 36rpx;
				background-repeat: no-repeat;
				background-size: cover;
				margin-right: 15rpx;
			}
			.weixin {
				background-image: url(../../static/img/we-chat.png);
			}
			.to-circle {
				line-height: 1;
				padding-left: 25rpx;
				border-left: 1px solid #dedfe3;
				display: flex;
				align-items: center;
				.friends-circle {
					background-image: url(../../static/img/friends-circle.png);
				}
				.to-circle-text {
					color: #0fdd88;
					font-size: 26rpx;
				}
			}
		}
	}
</style>
