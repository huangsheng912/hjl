<template>
	<view class="sights-detail bg-common">
		<view class="sight-info bg-white pd-lr-15">
			<view class="fw">景点简介</view>
			<view class="desc">前端运行日志，请另行在小程序开发工具的控制台查看前端运行日志，请另行在小程序开发工具的控制台查看前端运行日志，请另行在小程序开发工具的控制台查看。前端运行日志，请另行在小程序开发工具的控制台查看。</view>
			<image class="sight-img" src="../../static/img/me-bg.png" mode="scaleToFill"></image>
			<view class="desc">前端运行日志，请另行在小程序开发工具的控制台查看前端运行日志，请另行在小程序开发工具的控制台查看前端运行日志，请另行在小程序开发工具的控制台查看。前端运行日志，请另行在小程序开发工具的控制台查看。</view>
			<image class="sight-img" src="../../static/img/me-bg.png" mode="scaleToFill"></image>
		</view>
		<view class="sight-comment">
			<view class="fw bg-white border-bt-1px">评论</view>
			<block v-for="item in comments" :key="item.time">
				<sight-item :sightInfo="item" share :location="false"></sight-item>
			</block>
		</view>
		<view class="punch flex" @click="toUrl">
			<text class="iconfont icon-pinglun"></text>
			打卡留言
			</view>
	</view>
</template>

<script>
	import previewImg from '@/components/preview-img/index.vue'
	import sightItem from '@/components/sight-item/index.vue'
	export default {
		data() {
			return {
				userInfo: '',
				comments: []
			}
		},
		components: {
			previewImg,
			sightItem
		},
		onShareAppMessage(res) {
			console.log(res,'===res')
			if (res.from === 'button') {// 来自页面内分享按钮
				const shareInfo = res.target.dataset.info
				const desc = shareInfo.desc
				const title = desc.length > 16 ? desc.substring(0,16)+'...' : desc
				return {
					title,
					imageUrl: shareInfo.imgList[0],
					path: `/pages/punchDetail/index?id=${shareInfo.id}`
				}
			} else {
				return {
					title: '慧景链',
					path: `/pages/sightsDetail/index?id=${this.queryId}&name=${this.queryName}`,
					imageUrl: '../../static/img/integral.png'
				}
			}
		},
		onLoad(options) {
			console.log(options,456)
			uni.setNavigationBarTitle({
				title: options.name
			})
			this.queryId = options.id
			this.queryName = options.name
		},
		created() {
			console.log(this.queryId, 'queryId')
			const userInfo = uni.getStorageSync('userInfo')
			this.userInfo = userInfo
			this.comments = [
				{
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
					like: 236,
					comments: 222,
					city: 132
				},
				{
					avatar: userInfo.avatarUrl,
					name: userInfo.nickName,
					time: '2020-04-12',
					desc: '请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志,请另行在小程序开发工具的控制台查看前端运行日志',
					imgList: [
						'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005062122536742.jpg',
						'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153402869.jpg',
						'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153427549.jpg',
					],
					like: 236,
					comments: 222,
				},
				{
					avatar: userInfo.avatarUrl,
					name: userInfo.nickName,
					time: '2020-04-12',
					desc: '请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志,请另行在小程序开发工具的控制台查看前端运行日志',
					imgList: [],
					like: 236,
					comments: 222,
				},
				{
					avatar: userInfo.avatarUrl,
					name: userInfo.nickName,
					time: '2020-04-11',
					desc: '请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志请另行在小程序开发工具的控制台查看前端运行日志,请另行在小程序开发工具的控制台查看前端运行日志',
					imgList: [
						'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005062122536742.jpg',
						'http://pic.5tu.cn/uploads/allimg/202005/pic_5tu_thumb_202005022153402869.jpg',
					],
					like: 236,
					comments: 222,
				},
				
			]
		},
		methods:{
			toUrl() {
				console.log(this.queryName,this.queryId,444)
				this.$store.commit('setPunchName', this.queryName,)
				uni.switchTab({
					url: '/pages/punch/index'
				})
			}
		}
		
	}
</script>

<style lang="less">
	.sights-detail {
		.sight-info {
			padding-bottom: 40rpx;
			margin-bottom: 20rpx;
		}
		.fw {
			margin-top: 10rpx;
		}
		.desc {
			line-height: 50rpx;
		}
		.sight-img {
			width: 100%;
			height: 280rpx;
			margin: 10rpx 0;
			border-radius: 10rpx;
		}
		.sight-comment {
			.fw {
				padding: 20rpx 30rpx;
				&.border-bt-1px:after {
					left: 30rpx;
					right: 30rpx;
				}
			}
			sight-item {
				.border-bt-1px:after {
					height: 0;
				}
			}
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
		.comment-bottom {
			overflow: hidden;
			color: #8f949a;
			.icon-heart-fill {
				color: f66b6f;
				margin: 0 10rpx 0 40rpx;
			}
		}
		.punch{
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: fixed;
			right: 30rpx;
			bottom: 100rpx;
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
			background-color: #fff;
			color: #71e1e8;
			box-shadow: 0 0 10rpx #8f949a;
			font-size: 24rpx;
			.icon-pinglun {
				color: #25d5e0;
				font-size: 36rpx;
				line-height: 1;
			}
		}
	}
</style>
