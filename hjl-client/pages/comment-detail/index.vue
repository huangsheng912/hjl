<template>
	<view class="comment-detail">
		<view class="comment-main">
			<view class="comment-item flex">
				<image :src="commentInfo.userHeadImgUrl" class="avatar"></image>
				<view class="info">
					<view class="info-item">
						<view class="comment-name">{{commentInfo.userName}}</view>
						<view class="comment-desc">{{commentInfo.content}}</view>
					</view>
					<text class="comment-time">{{commentInfo.createDate}}</text>
				</view>
			</view>
		</view>
		<view class="comment-reply">
			<view class="comment-item flex border-bt-1px" v-for="item in comments" :key="item.id">
				<image :src="item.userHeadImgUrl" class="avatar"></image>
				<view class="info">
					<view class="info-item">
						<view class="comment-name">{{item.userName}}</view>
						<view class="comment-desc" @click="reply(item)">{{item.content}}</view>
					</view>
					<text class="comment-time">{{item.createDate}}</text>
				</view>
			</view>
		</view>
		<load-more :status="status" v-if="comments.length"></load-more>
		<comment-input @sendComment="sendComment"></comment-input>
		<share-poster
	</view>
</template>

<script>
	import commentInput from '@/components/comment-input/index.vue'
	import loadMore from '@/components/load-more/index.vue'
	import { rPost } from '@/utils/http.js'
	export default {
		data() {
			this.pageNumber = 0
			this.pageSize = 8
			this.total = 0
			return {
				commentInfo: {},
				comments: [],
				placeholder: '',
				status: 'more'
			}
		},
		components: {
			commentInput,
			loadMore
		},
		//上拉加载更多
		onReachBottom() {
			if ((this.pageNumber+1) * this.pageSize < this.total) {
				this.pageNumber++
				this.status = 'loading'
				this.getComments(this.id, this.preId)
			}
		},
		onLoad(options) {
			this.id = options.id
			this.preId = options.preId
			this.commentInfo = JSON.parse(options.data)
			this.getComments(options.id,options.preId)
		},
		methods: {
			async getComments(id,preId) {
				const params = {
					pageNumber: this.pageNumber,
					pageSize: this.pageSize,
					wordsId: id,
					preCommentId: preId
				}
				const res = await rPost('', 'commentPageList', params)
				if (res.result) {
					const list  = res.result.list
					this.total = res.result.totalCount
					if ((this.pageNumber+1) * this.pageSize < this.total) {
						this.status = 'more'
					} else {
						this.status = 'no-more'
					}
					this.comments = this.comments.concat(list)
				}
			},
			//回复某一条评论
			reply(item) {
				this.$refs.commentInput.showInput()
				this.placeholder = '回复@'+item.userName
			},
			//重置评论框
			resetInput() {
				this.placeholder = ''
			},
			async sendComment(content) {
				const params = {
					wordsId: this.id,
					preCommentId: this.preId,
					content
				}
				const res = await rPost('', 'newComment', params)
				if (res.result) {
					this.pageNumber = 0
					this.comments = []
					this.getComments(this.id,this.preId)
				}
			}
		}
	}
</script>

<style lang="less">
	.comment-detail {
		.comment-main,.comment-reply { 
			.comment-item {
				padding: 20rpx 30rpx 10rpx 30rpx;
			}
		}
		.comment-reply {
			background-color: #f0f0f0;
		}
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
			.comment-time {
				font-size: 24rpx;
				color: #8e939c;
				line-height: 2.5;
			}
		}
		/deep/.load-more {
			margin-bottom: 60px;
		}
	}
</style>
