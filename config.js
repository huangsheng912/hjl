let BASE_URL = ''
if (process.env.NODE_ENV === 'development') {
	BASE_URL = 'https://hj.yuyanji360.com/jsonrpc'
	// BASE_URL = 'http://192.168.0.140:/jsonrpc' // 开发测试
} else {
	BASE_URL = 'https://hj.yuyanji360.com/jsonrpc' // 生产环境
}
const config = {
	base_url: BASE_URL,
	appId: 'wxd1c35bd99e8a7e28',
	appKey: 'xxx'
}
const timeToMoney = {
	'1':'2分钟',
	'2': '5分钟',
	"3": '10分钟'
}
export { config, timeToMoney }