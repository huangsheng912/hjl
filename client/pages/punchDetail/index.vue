<template>
	<view class="punch-detail">
		<sight-item :sightInfo="sightInfo" isDetail @toFriendCircle="toFriendCircle"></sight-item>
		<view class="comment-list pd-lr-15" v-if="comments.length">
			<view class="comment-item flex" v-for="item in comments" :key="item.id">
				<image :src="item.userHeadImgUrl" mode="" class="avatar"></image>
				<view class="info border-bt-1px">
					<view class="info-item">
						<view class="comment-name">{{item.userName}}</view>
						<view class="comment-desc" @click="reply(item)">{{item.content}}</view>
					</view>
					<view class="comment-replys" v-if="item.totalComments" @click="toUrl(item)">
						{{item.totalComments? `共${item.totalComments}条评论`:''}}
					</view>
					<text class="comment-time">{{item.createDate}}</text>
				</view>
			</view>
			<load-more :status="status"></load-more>
		</view>
		<view class="no-data" v-else>暂无评论</view>
		<comment-input 
			@sendComment="sendComment" 
			ref="commentInput" 
			:placeholder="placeholder"
			@cancelReply="resetInput"
		></comment-input>
		<share-poster
			ref="sharePoster" 
			:cWidth="cWidth"
			:avatar="sightInfo.wxUserImg"
			:userName="sightInfo.wxNickName"
			:time="sightInfo.createDate"
			:desc="sightInfo.content"
			:imgSrc="sightInfo.pictures"
			:QrSrc="qrCode"
			@success="generateSuccess"
		></share-poster>
	</view>
</template>

<script>
	import sightItem from '@/components/sight-item/index.vue'
	import sharePoster from '@/components/share-poster/index.vue'
	import commentInput from '@/components/comment-input/index.vue'
	import loadMore from '@/components/load-more/index.vue'
	import { rPost } from '@/utils/http.js'
	export default {
		data() {
			this.pageNumber = 0
			this.pageSize = 5
			this.total = 0
			this.preCommentId = ''
			return {
				sightInfo:{},
				comments: [],
				cWidth: 375,
				qrCode: '', //小程序码
				placeholder: '',
				status: 'more',
				options: '' //测试
			}
		},
		components: {
			sightItem,
			sharePoster,
			commentInput,
			loadMore
		},
		//上拉加载更多
		onReachBottom() {
			if ((this.pageNumber+1) * this.pageSize < this.total) {
				this.pageNumber++
				this.status = 'loading'
				this.getComments(this.sightInfo.id)
			}
		},
		onLoad(options) {
			this.options = options
			const id = options.id || options.scene
			// console.log(options,'--options')
			this.getPunchDetail(id)
			this.getComments(id)
			this.generateCode(id)
			uni.getSystemInfo({
				complete:(r) => {
					this.cWidth = r.windowWidth
				}
			})
		},
		onShareAppMessage(res) {
			const desc = this.sightInfo.content
			const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
			return {
				title,
				imageUrl: this.sightInfo.pictures[0],
				path: `/pages/punchDetail/index?id=${this.sightInfo.id}`
			}
		},
		methods: {
			async getPunchDetail(id) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await rPost('', 'getWords', {id})
				if (res.result) {
					res.result.createDate = res.result.createDate.split(' ')[0]
					this.sightInfo = res.result
				}
				uni.hideLoading()
			},
			//获取评论列表
			async getComments(id) {
				const params = {
					pageNumber: this.pageNumber,
					pageSize: this.pageSize,
					wordsId: id,
					preCommentId: ''
				}
				const res = await rPost('', 'commentPageList', params)
				if (res.result) {
					const list  = res.result.list
					list.map(v => {
						v.totalComments = v.comments.length
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
			//生成页面小程序码
			async generateCode(id) {
				const params = {
					page: 'pages/punchDetail/index',
					scene: id,
					width: 280
				}
				const res = await rPost('', 'wxacode',params)
				if (res.result) {
					/* this.base64ToImg('jpeg', res.result.result).then(r=>{
						this.qrCode = r
					}) */
					this.qrCode = 'data:image/jpeg;base64,' + res.result.result
				}
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
						// console.log(s,1)
					},
					fail(e) {
						// console.log(e,2)
						uni.showToast({
							title: '生成图片失败',
							icon:'none'
						})
					}
				})
			},
			//回复某一条评论
			reply(item) {
				this.$refs.commentInput.showInput()
				this.placeholder = '回复@'+item.userName
				this.preCommentId = item.id
			},
			//重置评论框
			resetInput() {
				this.placeholder = ''
				this.preCommentId = ''
			},
			async sendComment(content) {
				const params = {
					wordsId: this.sightInfo.id,
					preCommentId: this.preCommentId,
					content
				}
				const res = await rPost('', 'newComment', params)
				if (res.result) {
					this.resetInput()
					this.pageNumber = 0
					this.comments = []
					this.getComments(this.sightInfo.id)
				} else {
					// console.log(res, '=====res====')
					uni.showToast({
						title: '评论失败： '+res.message,
						icon: 'none',
					})
				}
			},
			toUrl(item) {
				const data = JSON.stringify({
					userHeadImgUrl: item.userHeadImgUrl,
					userName: item.userName,
					content: item.content,
					createDate: item.createDate,
				})
				uni.navigateTo({
					url: `/pages/comment-detail/index?id=${this.sightInfo.id}&preId=${item.id}&data=${data}`
				})
			}
		}
	}
</script>

<style lang="less">
	.punch-detail {
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
					color: #8c91dc;
					font-size: 24rpx;
					padding: 10rpx 20rpx;
					margin-top: 10rpx;
				}
				.comment-time {
					font-size: 24rpx;
					color: #8e939c;
					line-height: 2.5;
				}
			}
		}
		/deep/.load-more {
			margin-bottom: 60px;
		}
	}
</style>
