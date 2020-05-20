<template>
	<view class="common-sight-item" v-show="sightInfo.time">
		<view class="user-info flex">
			<image class="user-avatar" :src="sightInfo.avatar" mode="scaleToFill"></image>
			<view class="info">
				<view class="user-name">{{sightInfo.name}}</view>
				<text class="time">{{sightInfo.time}}</text>
			</view>
			<operate-button v-if="share" :shareItem="sightInfo"><text class="iconfont icon-fenxiang"></text>分享</operate-button>
		</view>
		<view class="comment-desc" @click="toPunchDetail(sightInfo.id)">{{sightInfo.desc}}</view>
		<view class="comment-imgs border-bt-1px">
			<preview-img :url="img" :urlList="sightInfo.imgList"  v-for="img in sightInfo.imgList" :key="img"></preview-img>
		</view>
		<view class="comment-bottom">
			<view class="location fl" v-if="location">
				<text class="iconfont icon-dingwei"></text>{{sightInfo.city}}·{{sightInfo.place}}
			</view>
			<view class="fr">
				<text class="iconfont icon-heart-fill"></text>
				{{sightInfo.like}}
			</view>
			<view class="fr">
				<text class="iconfont icon-pinglun1"></text>
				{{sightInfo.comments}}
			</view>
		</view>
		<view class="share-wrap" v-if="isDetail">
			<view class="to-friends" @click="handleShare">
				<operate-button><text class="weixin"></text>发给朋友</operate-button>
			</view>
			<view class="to-circle" @click="toFriendCircle">
				<text class="friends-circle"></text>
				<text class="to-circle-text">发送至朋友圈</text>
			</view>
		</view>
	</view>
</template>

<script>
	import operateButton from '@/components/operate-button/index.vue'
	import previewImg from '@/components/preview-img/index.vue'
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
		methods: {
			handleShare() {
				console.log(this, 777888)
				this.$parent.shareInfo = this.sightInfo
				this.$emit('handleShare', this.sightInfo)
			},
			toFriendCircle() {
				this.$emit('toFriendCircle', this.sightInfo)
			},
			toPunchDetail(id) {
				uni.navigateTo({
					url:`/pages/punchDetail/index?id=${id}`,
				})
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
			}
			.info {
				flex: 1;
				.user-name {
					font-weight: 600;
					margin-top: 20rpx;
					line-height: 1;
				}
				.time {
					font-size: 22rpx;
					color: #8f949a;
				}
			}
			/deep/.operate-btn-wrap {
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
		 
		.comment-desc {
			font-size: 26rpx;
			line-height: 40rpx;
		}
		.comment-imgs {
			margin: 10rpx 0 8rpx;
			display: flex;
			flex-wrap: wrap;
			/* #ifdef MP-WEIXIN */
			// 小程序无效？？
			preview-img {
				/deep/.preview-wrap {
					width: 215rpx;
					height: 215rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
				}
			}
			/* preview-img:nth-of-type(3n) .preview-wrap {
				margin-right: 0
			} */
			/* #endif */
			/deep/.preview-wrap {
				width: 215rpx;
				height: 215rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				&:nth-of-type(3n) {
					margin-right: 0
				}
			}
		}
		.comment-bottom {
			overflow: hidden;
			font-size: 24rpx;
			color: #8e939c;
			.iconfont {
				margin-right: 8rpx;
			}
			.icon-heart-fill {
				margin-left: 30rpx;
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
