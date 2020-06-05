<script>
	import { rPost } from '@/utils/http.js'
	export default {
		//当uni-app 初始化完成时触发（全局只触发一次）
		onLaunch: function() {
			// this.updateUserInfo()
			console.log('App Launch')
			// uni.clearStorage()
		},
		//当 uni-app 启动，或从后台进入前台显示
		onShow: function() {
			console.log('App Show')
			this.getLogin()
			// this.checkSession()
		},
		//从前台进入后台
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//更新用户头像等信息
			updateUserInfo() {
				uni.getSetting({
					success (res){
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							uni.getUserInfo({
								success: function(res) {
									console.log(res,222)
									uni.setStorageSync('userInfo', res.userInfo)
								}
							})
						}
					}
				})
			},
			getLogin() {
				uni.login({
					provider: 'weixin',
					success: async (res) => {
						uni.setStorageSync('wxCode', res.code)
						if (res.code) {
							const loginRes = await rPost('', 'wxLogin', {code: res.code, referrer: ''})
							if (loginRes.result) {
								uni.setStorageSync('userId', loginRes.result.id)
								uni.setStorageSync('token', loginRes.result.sessionKey)
								uni.login({
									success(response) {
										uni.setStorageSync('wxCode', response.code);
									}
								})
							}
						}
					}
				})
			},
			checkSession() {
				uni.checkSession({
					success(s) {
						console.log(s,'sss')
					},
					fail:(e) => {
						this.getLogin()
						console.log(e,'eee')
					}
				})
			}
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	@import './common/common.css';
	@import './static/css/iconfont.css';
</style>
