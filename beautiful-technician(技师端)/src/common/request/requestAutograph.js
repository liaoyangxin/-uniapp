import store from '@/store/index.js'
var Hashes = require('jshashes')
var MD5 = new Hashes.MD5;
var Hash = new Hashes.SHA1;
export const autographFun = (configData) => {
	let config = configData
	let signData;
	let queryData = {
		app_guid: config.urlSuffix.app_guid,
		app_type: config.urlSuffix.app_type,
		token: config.urlSuffix.token
	}
	let queryMd5 = MD5.hex(JSON.stringify(queryData))
	if (config.method === 'POST') {
		let dataMd5 = config.data ? MD5.hex(JSON.stringify(config.data)) : ''
		signData = config.method + '\n' + dataMd5 + '\n' + queryMd5 + '\n' + 'application/json' + '\n' + config
			.urlSuffix.expires + '\n' + config.urlSuffix.noncestr + '\n' + '/' + (config.url.toLowerCase())
	} else {
		signData = config.method + '\n' + queryMd5 + '\n' + config.urlSuffix.expires + '\n' + config.urlSuffix
			.noncestr + '\n' + '/' + (config.url.toLowerCase())
	}
	//签名key
	let secretKey = store.state.secretKey || store.state.touristSecretKey || ''
	return Hash.b64_hmac(secretKey, signData)
}

