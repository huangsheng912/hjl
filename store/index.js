import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		location: null,//定位信息
		openid: '',  //openid
		userInfo: uni.getStorageSync('userInfo') || {},
		punchName: ''
	},
	mutations: {
		setUserInfo(state, data) {
			console.log(data, 7897987)
			state.userInfo = data
		},
		setPunchName(state, data) {
			state.punchName = data
		}
	},
	actions: {
		
	}
})

export default store