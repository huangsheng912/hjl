<template>
	<view class="punch-detail">
		<sight-item :sightInfo="sightInfo" isDetail @toFriendCircle="toFriendCircle"></sight-item>
		<view class="comment-list pd-lr-15">
			<view class="comment-item flex" v-for="item in comments" :key="item.id">
				<image :src="item.avatar" mode="" class="avatar"></image>
				<view class="info border-bt-1px">
					<view class="info-item">
						<view class="comment-name">{{item.name}}</view>
						<view class="comment-desc">{{item.comment}}</view>
					</view>
					<view class="comment-replys" >
						<block v-for="reply in item.reply" :key="reply.id">
							<view class="reply-item" >
								<text>{{reply.name}}:</text>{{reply.comment}}
							</view>
						</block>
					</view>
					<text class="comment-time">{{item.time}}</text>
				</view>
			</view>
		</view>
		<share-poster
			ref="sharePoster" 
			:cWidth="cWidth"
			:avatar="sightInfo.avatar"
			:userName="sightInfo.name"
			:time="sightInfo.time"
			:desc="sightInfo.desc"
			:imgSrc="sightInfo.imgList"
			QrSrc="../../static/img/qrCode.jpg"
			@success="generateSuccess"
		></share-poster>
	</view>
</template>

<script>
	import sightItem from '@/components/sight-item/index.vue'
	import sharePoster from '@/components/share-poster/index.vue'
	export default {
		data() {
			return {
				sightInfo:{},
				comments: [],
				cWidth: 375,
			}
		},
		components: {
			sightItem,
			sharePoster
		},
		onLoad(options) {
			console.log(options,'--options')
			this.getPunchDetail(options.id)
			uni.getSystemInfo({
				complete:(r) => {
					this.cWidth = r.windowWidth
				}
			})
		},
		onShareAppMessage(res) {
			const desc = this.sightInfo.desc
			const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
			return {
				title,
				imageUrl: this.sightInfo.imgList[0],
				path: `/pages/punchDetail/index?id=${this.sightInfo.id}`
			}
		},
		methods: {
			getPunchDetail(id) {
				const userInfo = uni.getStorageSync('userInfo')
				this.userInfo = userInfo
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				setTimeout(()=>{
					this.sightInfo = {
						id:1,
						avatar: userInfo.avatarUrl,
						name: userInfo.nickName||'这是一个名字',
						time: '2020-04-13',
						desc: '请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志,请另行在小程序开发工具的控制台查看前端运行日志',
						imgList: [
							'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005062122536742.jpg',
							'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153402869.jpg',
							'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153427549.jpg',
							'http://pic.5tu.cn/uploads/allimg/201508/010P0000240Y4Z6091-1.jpg',
							'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153402869.jpg',
						],
						like: 236,
						comments: 222,
						city: '丽江市',
						place: '玉龙雪山'
					}
					this.comments = [
						{
							id: 1,
							avatar: userInfo.avatarUrl,
							name: userInfo.nickName||'这是一个名字',
							time: '5-15 16:48',
							comment: '这是一条评论这是一条评论这是一条评论这是一条评论',
							reply: [
								{
									name: userInfo.nickName||'这是一个名字',
									comment: '这是一条评论这是一条评论这是一条评论这是一条评论'	
								},
								{
									name: userInfo.nickName||'这是一个名字',
									comment: '这是一条评论这是一条评论这是一条评论这是一条评论'	
								}
							]
						},
						{
							id:2,
							avatar: userInfo.avatarUrl,
							name: userInfo.nickName||'这是一个名字',
							time: '5-15 16:48',
							comment: '这是一条评论这是一条评论这是一条评论这是一条评论',
							reply: [
								{
									id: 1,
									name: userInfo.nickName||'这是一个名字',
									comment: '这是一条评论这是一条评论这是一条评论这是一条评论'	
								},
								{
									id: 2,
									name: userInfo.nickName||'这是一个名字',
									comment: '这是一条评论这是一条评论这是一条评论这是一条评论'	
								}
							]
						}
					]
					uni.hideLoading()
				},1500)
			},
			//生成海报，发送朋友圈
			toFriendCircle() {
				this.$refs.sharePoster.generatePoster()
			},
			//canvas海报转图片完成回调
			generateSuccess(path) {
				uni.previewImage({
					current: path,
					urls:	[path],
					success(s) {
						console.log(s,1)
					},
					fail(e) {
						console.log(e,2)
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.punch-detail {
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
		.share-wrap {
			operate-button /deep/.operate-btn-wrap {
				button {
					color: #0fdd88!important;
					font-size: 26rpx;
					line-height: 1;
					display: flex;
					align-items: center;
					padding-right: 25rpx;
				}
			}
		}
		.comment-list {
			padding: 20rpx 30rpx;
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background-color: red;
				margin-right: 25rpx;
			}
			.info {
				flex: 1;
				padding: 6rpx 0;
				.comment-name {
					font-size: 24rpx;
					line-height: 40rpx;
					color: #626366;
				}
				.comment-desc {
					font-size: 26rpx;
					line-height: 40rpx;
				}
				.comment-replys {
					background-color: #f0f3f9;
					border-radius: 10rpx;
					font-size: 26rpx;
					padding: 20rpx;
					margin-top: 10rpx;
					view {
						line-height: 1.5;
					}
					text {
						color: #00cedb;
						margin-right: 10rpx;
					}
				}
				.comment-time {
					font-size: 24rpx;
					color: #8e939c;
					line-height: 2.5;
				}
			}
			
		}
	}
</style>
