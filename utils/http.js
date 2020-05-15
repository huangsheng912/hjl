import {config} from '../config.js'

export function get(url, data) {
	return request(url, data)
}

export function post(url, data) {
	return request(url, data, 'POST')
}

function request(url, data, method='GET') {
	return new Promise((resolve,reject) => {
		uni.request({
			url: config.base_url + url,
			header: {
				'content-type': 'application/json',
				'token': uni.getStorageSync('token')
			},
			method,
			data,
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err)
				showError(err.message)
			}
		})
	})
}

function showError(msg) {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 2000
	})
}