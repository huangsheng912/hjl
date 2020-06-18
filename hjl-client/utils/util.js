export function randomNum(len=32) {
	const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let randomStr = ''
	for (let i = 0; i < len; i++) {
		const index = Math.floor(Math.random()*str.length)
		randomStr += str[index]
	}
	return randomStr
}

function addZero(n) {
	return n < 10 ? '0' + n : n
}

export function formatTime(date) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = data.getHours()
	const minute = data.getMinutes()
	const second = data.getSeconds()
	return [year, month, day].map(addZero).join('-')
}

export function formatNum(num) {
	if (num < 10000) {
		return num
	} else if (num < 100000000) {
		return (num/10000).toFixed(1) + '万'
	} else {
		return (num/10000000).toFixed(1) + '亿'
	}
}