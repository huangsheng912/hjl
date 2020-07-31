import {config} from '../config.js'

export function get(url, data) {
	return request(url, data)
}

export function post(url, data) {
	return request(url, data, 'POST')
}

export function rPost(url, method, data=[]) {
	const params = {
		jsonrpc: "2.0",
		method: method,
		params: data,
		id: Math.floor(Math.random()*1000)
	}
	return request(url, params, 'POST')
}

export function upload(url,filePath, name='file') {
	return new Promise((resolve,reject) => {
		uni.uploadFile({
			url: config.base_url + url,
			header: {
				'content-type': 'multipart/form-data'
			},
			filePath,
			name,
			success: (res) => {
				if (res.data.error) {
					resolve(res.data.error)
				} else {
					resolve(res.data)
				}
			},
			fail: (err) => {
				reject(err)
				showError(err.message)
			}
		})
	})
}

function request(url, data, method='GET') {
	return new Promise((resolve,reject) => {
		uni.request({
			url: config.base_url + url,
			header: {
				'content-type': 'application/json',
				'Session-Key': uni.getStorageSync('token')
			},
			method,
			data,
			success: (res) => {
				if (res.data.error) {
					resolve(res.data.error)
				} else {
					resolve(res.data)
				}
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
