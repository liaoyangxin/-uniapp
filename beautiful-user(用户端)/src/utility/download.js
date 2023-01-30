import {
    updateApi,
} from '../api/index.js'


//网络图片预览
// arr = ['xxx','xxx']

export const previewImage = async function(arr) {

    uni.showLoading({
            title: '',
            mask: true
        })
        // const download = ((url) =>{
        // 	return new Promise((resolve,reject) =>{
        // 		uni.downloadFile({
        // 			url:url,
        // 			success:(res)=>{
        // 				console.log(res)
        // 				if(res.statusCode < 200 || res.statusCode >= 300){
        // 					reject('statusCode is not 200 series')
        // 				}else{
        // 					resolve(res.tempFilePath)
        // 				}

    // 			},
    // 			fail:(err)=>{
    // 				reject(err)
    // 				console.log(err)
    // 				uni.hideLoading()
    // 				uni.showToast({
    // 					title:'图片下载失败',
    // 					icon:'none'
    // 				})
    // 			}

    // 		})
    // 	})
    // })

    try {
        // let arrTempFilePath = []
        // for(let i = 0 ;i < arr.length;i++){
        // 	arrTempFilePath.push( await download(arr[i]) )
        // }
        uni.hideLoading()
        uni.previewImage({
            urls: arr,
            success: (res) => {

            },
            fail: (err) => {
                uni.showToast({
                    title: '查看图片失败',
                    icon: 'none'
                })
            }
        })
    } catch (e) {
        //TODO handle the exception
    }

};

export const appUpdate = async function() {

    const appInfo = () => {
        return new Promise((resolve, reject) => {
            plus.runtime.getProperty(plus.runtime.appid, (appRes) => {
                resolve(appRes)
            })
        })
    }
    try {
        const appRes = await appInfo()
        const updateRes = await updateApi({
            systemType: plus.os.name === 'Android' ? 1 : 2, // 安卓或ios
            versionName: appRes.version, // 版本名称
            version: appRes.versionCode // 应用版本号
                // systemType:1,
                // versionName:'1.0.2',
                // version:'102'
        })
        return updateRes
    } catch (e) {
        return e
            //TODO handle the exception
        console.log(e)
    }
};