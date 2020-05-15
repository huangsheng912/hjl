let BASE_URL = ''
if (process.env.NODE_ENV === 'development') {
	BASE_URL = 'http://192.168.1.53:8090' // 开发测试
} else {
	BASE_URL = 'https://www.baidu.com' // 生产环境
}
const config = {
	base_url: BASE_URL,
	appId: 'xxxx',
	appKey: 'xxx'
}
export { config }