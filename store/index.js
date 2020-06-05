import Vue from 'vue';
import Vuex from 'vuex';

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
		
	}
})

export default store