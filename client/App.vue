<script>
	import { rPost } from '@/utils/http.js'
	export default {
		//当uni-app 初始化完成时触发（全局只触发一次）
		onLaunch: function() {
			// this.updateUserInfo()
			console.log('App Launch')
			this.checkUpdate()
			// uni.clearStorage()
		},
		//当 uni-app 启动，或从后台进入前台显示
		onShow: function() {
			console.log('App Show')
			uni.login({
				success: (res) => {
					this.$store.dispatch('login', {code: res.code})
				}
			})
			// this.getLogin()
			// this.checkSession()
		},
		//从前台进入后台
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//检查更新
			checkUpdate() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate((res) => {
				  // 请求完新版本信息的回调
				  // console.log(res);
					if (res.hasUpdate) {
						uni.showModal({
							title: '更新提示',
							content: '检测到新版本，是否下载新版本并重启小程序',
							success: (res) => {
								if(res.confirm){
								 // 用户确定更新小程序，小程序下载和更新静默进行
									this.downLoadAndUpdate(updateManager)
								}
						  }
					  })
					}
				});
			},
			// 下载小程序最新版本并重启
			downLoadAndUpdate(updateManager){
				uni.showLoading()
				// 静默下载更新小程序新版本，onUpdateReady：当新版本下载完成回调
				updateManager.onUpdateReady(function(){
					uni.hideLoading()
					// applyUpdate：强制当前小程序应用新版本并重启
					updateManager.applyUpdate()
				})
				// onUpdateFailed：当新版本下载失败回调
				updateManager.onUpdateFailed(function (res) {
				  // 新的版本下载失败
					uni.showModal({
						title: '自动更新失败',
						content: '请删除当前小程序，重新搜索打开',
					})
				});
			},
			//更新用户头像等信息
			updateUserInfo() {
				uni.getSetting({
					success (res){
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							uni.getUserInfo({
								success: function(res) {
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
