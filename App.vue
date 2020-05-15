<script>
	export default {
		//当uni-app 初始化完成时触发（全局只触发一次）
		onLaunch: function() {
			console.log('App Launch')
			// uni.clearStorage()
		},
		//当 uni-app 启动，或从后台进入前台显示
		onShow: function() {
			console.log('App Show')
			// this.getLogin()
			this.checkSession()
		},
		//从前台进入后台
		onHide: function() {
			console.log('App Hide')
		},
		onShareAppMessage() {
			return {
			  title: '这是分享的标题',
			  path: '/pages/me/index'
			}
		},
		methods: {
			getLogin() {
				uni.login({
					success: (res) => {
						console.log(res,777)
						if (res.code) {
							
						}
					}
				})
			},
			checkSession() {
				uni.checkSession({
					success(s) {
						console.log(s,'sss')
					},
					fail(e) {
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
