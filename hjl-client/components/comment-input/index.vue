<template>
	<view class="comment-input-wrap">
		<view v-if="!showCommentInput" class="no-blur">
			<view class="content" @click="showInput">给TA评论</view>
		</view>
		<view v-else class="comment-blur">
			<view class="mask" @click="closeInput" catchtouchmove="preventTouchMove"></view>
			<view class="content" :style='commentInputStyle'>
				<textarea 
				class="text-area"
				cursor-spacing="10" 
				:style="textareaStyle"  
				:placeholder="placeholder?placeholder:'写评论'" 
				v-model="commentWords"
				:show-confirm-bar="false"
				fixed
				auto-height
				:adjust-position="false"
				:focus="focus"
				@focus="focusComment"
				@blur="blurComment"
				/>
				<view class="send" :class="commentWords.length?'':'disabled'" @click="sendComment" v-if="hasLogin">发送</view>
				<operate-button class="comment-auth-btn" type="auth" v-else>发送</operate-button>
			</view>
		</view>
	</view>
</template>

<script>
	import operateButton from '@/components/operate-button/index.vue'
	export default {
		data() {
			return {
				showCommentInput: false,
				focus: false,
				commentWords: '',
				commentInputStyle:''
			}
		},
		props: {
			placeholder: {
				type: String,
				default: '写评论'
			}
		},
		components: {
			operateButton
		},
		computed: {
			hasLogin() {
				return this.$store.state.userInfo.avatarUrl
			},
		},
		methods: {
			showInput() {
				this.commentWords = ''
				this.showCommentInput = true
				this.focus = true
			},
			closeInput() {
				this.commentWords = ''
				this.showCommentInput = false
				this.$emit('cancelReply')
			},
			sendComment() {
				if (!this.$store.state.userInfo.avatarUrl) { 
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					setTimeout(()=>{
						uni.switchTab({
							url: '/pages/me/index',
						})
					},500)
				} else {
					if (!this.commentWords && this.commentWords!==0) return
					if (!this.commentWords.trim()) return
					this.showCommentInput = false
					const words = this.commentWords
					this.$emit('sendComment', words)
					this.commentWords = ''
				}
			},
			focusComment(e) {
				this.commentInputStyle= 'bottom: '+e.detail.height+'px;'
			},
			blurComment() {
				this.commentInputStyle = 'bottom: 0px;'; 
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment-input-wrap {
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		.no-blur {
			height: 60px;
			background-color: #f0f3fc;
			display: flex;
			align-items: center;
			.content {
				margin: 0 25px;
				border-radius: 40rpx;
				background-color: #fff;
				font-size: 24rpx;
				flex: 1;
				padding-left: 10px;
				line-height: 36px;
				color: #777;
			}
		}
		.comment-blur {
			position: fixed;
			bottom: 0;
			top: 0;
			right: 0;
			left: 0;
			.mask {
				position: absolute;
				bottom: 0;
				top: 0;
				right: 0;
				left: 0;
				background-color: rgba(0,0,0,0.4);
			}
			.content {
				background-color: #fff;
				display: flex;
				align-items: center;
				position: absolute;
				width: 100%;
				bottom: 0;
				box-sizing: border-box;
				padding: 15px 25px;
				.text-area {
					flex: 1;
				}
				.send {
					margin-left: 15px;
					padding: 0 30rpx;
					background-color: #0069d9;
					color: #fff;
					border-radius: 60rpx;
					&.disabled {
						background-color: #c1c1c1;
						color: #666;
					}
				}
			}
		}
	}
</style>
