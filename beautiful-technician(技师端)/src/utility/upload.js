var CosAuth = require(
	'./cos-auth'); // 这里引用了 cos-auth.js，下载地址为 https://unpkg.com/cos-js-sdk-v5/demo/common/cos-auth.min.js 
import {
	updataUrlApi
} from '@/api/technician.js'
import Compressor from 'compressorjs';
var Hashes = require('jshashes')
var MD5 = new Hashes.MD5;

export const updataFileFun = async function(data) {
	try {
		uni.showLoading({
			title: '正在上传...'
		})
		let { name } = data
		const compressRes = await compressImg(data)
		//获取临时上传文件信息
		let res = await updataUrlApi({
			fileCate: 'artificerImg'
		})
		let Signature = CosAuth({
			SecretId: res.data.secretId,
			SecretKey: res.data.secretKey,
			Method: 'POST',
			Pathname: '/',
		})
		let keyData = (uni.getStorageSync("userToken") || '') + (new Date().getTime()).toString() + parseInt(
			Math.random() * (999999 - 100000 + 1) + 100000, 10)
		let key = res.data.prefixPath + '/' + MD5.hex(keyData) + name
		let uploadFileRes = await uni.uploadFile({
			url: res.data.host,
			name: 'file',
			file: compressRes,
			formData: {
				'key': key,
				'success_action_status': 200,
				'Signature': Signature,
				'x-cos-security-token': res.data.token
			},
		})
		if (uploadFileRes.statusCode < 200 || uploadFileRes.statusCode > 300) {
			uni.hideLoading()
			return Promise.reject({
				errMsg: 'statusCode is not 200 series'
			})
		} else {
			uni.hideLoading()
			console.log(key)
			return key
		}
	} catch (e) {
		uni.hideLoading()
		return Promise.reject(e)
	}
}

//压缩图片
function compressImg(file) {
	return new Promise((resolve, reject) => {
		new Compressor(file, {
			maxWidth: 1200,
			maxHeight: 1200,
			success(res) {
				resolve(res)
			},
			error(err) {
				reject(err)
			}
		})
	})
};
