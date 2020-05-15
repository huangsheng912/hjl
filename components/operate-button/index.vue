<template>
	<view class="operate-btn-wrap">
		<button v-if="type==='share'" type="default" open-type="share" >
			<slot></slot>
		</button>
		<button v-else type="default" open-type="getUserInfo" @getuserinfo="getUserInfo" >
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		props: {
			type:{
				type: String,
				default: 'share'
			}
		},
		methods: {
			getUserInfo(e) {
				//用户信息
				console.log(e,465)
				if (e.detail.userInfo) {
					uni.setStorageSync('userInfo', e.detail.userInfo)
					uni.showToast({
						title: '授权成功',
						success() {
							uni.navigateBack()
						}
					})
				}
				
			},
		}
		
	}
</script>

<style lang="less" scoped>
	.operate-btn-wrap {
		button {
			padding: 0;
			text-align: left;
			color: #333!important;
			background: transparent!important;
			line-height: 0;
			&::after {
				border: none;
			}
		}
	}
</style>
