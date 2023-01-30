//banner图 跳转控制


import store from '../store/index.js'
export const jump = function(item) {
	if (!item) {
		console.log('跳转失败')
		return
	}
	if (item.indexOf('http') != -1) {
		window.location.href = item
		// uni.navigateTo({
		// 	url: '/pages/index/webView?url=' + item
		// })
	} else {
		uni.navigateTo({
			url: item
		})
	}
}
// export const jump = function (item) {
// 	console.log(item,"item")
// 	if (!item) {
// 		console.log('跳转失败')
// 		return
// 	}

// 	if(item.indexOf('http') != -1){
// 		let url = ''
// 		if (store.state.userToken) {
// 			if (item.jump.indexOf('#') > -1) {
// 				url = `${item.jump.split('#')[0]}?token=${store.state.userToken}#${item.jump.split('#')[1]}`
// 			} else {
// 				url = `${item.jump}?token=${store.state.userToken}`
// 			}
// 		} else {
// 			url = item.jump
// 		}
// 		uni.navigateTo({
// 			url:'/pages/index/outerChain?url=' + url + '&title=' + item.title,
// 			fail: (err) => {
// 				console.log('跳转失败',err)
// 			}
// 		})
// 	}else{
// 		uni.navigateTo({
// 			url:item.jump
// 		})
// 	}

// };
