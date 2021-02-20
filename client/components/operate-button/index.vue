<template>
	<view class="operate-btn-wrap">
		<button class="button" v-if="type==='share'" type="default" open-type="share" :data-info="shareItem" catchtap="xxx">
			<slot></slot>
		</button>
		<button class="button" :style="myStyle" v-else type="default" open-type="getUserInfo" @getuserinfo="getUserInfo" catchtap="xxx">
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
			},
			// myStyle: String,
			shareItem: {
				type: Object,
				default: ()=>{}
			}
		},
		mounted() {
			console.log(this.myStyle,999)
		},
		methods: {
			async getUserInfo(e) {
				const userInfo = e.detail.userInfo
				if (!userInfo) {
					console.log('获取userInfo失败')
					return
				}
				uni.login({
					success: async (res) => {
						try {
							await this.$store.dispatch('login',{code: res.code, userInfo})
							this.$emit('getUserInfoCb')
						}catch(e) {
							console.log(e,'授权登录异常')
						}
					}
				})
			},
			xxx() {
				//阻止冒泡
			}
		}
		
	}
</script>

<style lang="less" scoped>
	.operate-btn-wrap {
		.button {
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
