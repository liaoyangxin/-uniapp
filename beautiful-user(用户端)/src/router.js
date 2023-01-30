// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import store from './store/index.js';
import {
	weChatH5ShareCircleOfFriends,
	weChatH5ShareFriend,
	weChatH5hideMenuItems
} from './utility/wechat.js';
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});

const weChatH5configFun = async function(type) {
	try {
		await weChatH5ShareCircleOfFriends(type)
		await weChatH5ShareFriend(type)
		await weChatH5hideMenuItems()
	} catch (e) {
		//TODO handle the exception
		console.log(e)
	}
}
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if (!store.state.userToken) {
		if ((to.path !== '/pages/login/login' || to.path !== '/pages/index/webView')) {
			next();
		} else {
			next('/pages/login/login')
		}
	} else {
		weChatH5configFun()
		// to.path === '/pages/user/user-share' ? weChatH5configFun('/user/') : weChatH5configFun('/business/')
		next();
	}
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('跳转结束')

})

export {
	router,
	RouterMount
}
