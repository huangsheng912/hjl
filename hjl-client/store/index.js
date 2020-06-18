import Vue from 'vue';
import Vuex from 'vuex';
import { rPost } from '@/utils/http.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		userInfo: uni.getStorageSync('userInfo') || {},
		punchInfo: {},
		currentSightId: ''
	},
	mutations: {
		setUserInfo(state, data) {
			state.userInfo = data
		},
		setPunchInfo(state, data) {
			state.punchInfo = data
		},
		setCurrentSightId(state, data) {
			state.currentSightId = data
		}
	},
	actions: {
		async login({commit}, {code, userInfo}) {
			
			const params = {
				code,
				/* encryptedData: e.detail.encryptedData,
				iv: e.detail.iv, */
				referrer: ''
			}
			const loginRes = await rPost('', 'wxLogin', params)
			if (loginRes.result) {
				//e457d8520bb94ad7a726bc08f6519130
				uni.login({
					success(response) {
						uni.setStorageSync('wxCode', response.code);
					}
				})
				uni.setStorageSync('userId', loginRes.result.id)
				uni.setStorageSync('token', loginRes.result.sessionKey)
				if (userInfo) {
					const data = {
						"userId": loginRes.result.id,
						"userName": userInfo.nickName,
						"headImgUrl": userInfo.avatarUrl
					}
					//更新用户名字，头像
					const res = await rPost('', 'updateWxUser', data)
					if (res.result) {
						uni.setStorageSync('userInfo', userInfo)
						commit('setUserInfo', userInfo)
						uni.showToast({
							title: '授权成功'
						})
					} else {
						uni.showToast({
							title: '服务异常',
							icon:'none'
						})
					}
				}
				console.log(234)
			}
		}
	}
})

export default store