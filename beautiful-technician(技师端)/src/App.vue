<script>
import {
	weChatH5config,
	weChatH5ShareCircleOfFriends,
	weChatH5ShareFriend,
	weChatH5hideMenuItems,
	getUrlParms,
} from '@/utility/wechat.js';
import store from './store/index.js';
import { userInfoApi } from './api/user.js';
import vconsole from 'vconsole';
export default {
	onLaunch: function () {
		console.log('App Launch');
		// #ifdef H5
		async function isWeChat() {
			try {
				let ua = window.navigator.userAgent.toLowerCase();
				//判断微信浏览器
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					let style = document.createElement('style');
					style.type = 'text/css';
					style.innerHTML = 'uni-page-head,.uni-page-head{display:none;}';
					document.getElementsByTagName('head').item(0).appendChild(style);
					if (uni.getStorageSync('ifShowConsole')) {
						const vConsole = new vconsole();
					}
					const urlParms = getUrlParms(window.location.href);
					if (urlParms?.token) {
						store.commit('setUserToken', urlParms?.token);
						store.commit('setSecretKey', urlParms?.secretKey);
					}
					if (store.state.userToken) {
						// if (window.location.search) {
						// 	window.location.href =
						// 		window.location.origin + store.state.projectType + window.location.hash;
						// }
						weChatH5config();
						setTimeout(async function () {
							await weChatH5ShareCircleOfFriends(store.state.projectType);
							await weChatH5ShareFriend(store.state.projectType);
							await weChatH5hideMenuItems();
						}, 500);
						const res = await userInfoApi();
						if (!res.data.isArtificer) {
							res.data.lastExamineId
								? uni.reLaunch({ url: '/pages/user/user-audit-success' })
								: uni.reLaunch({ url: '/pages/user/user-audit' });
						}
					}
				}
			} catch (e) {
				//TODO handle the exception
			}
		}
		isWeChat();
		// #endif
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	},
};
</script>

<style lang="scss">
/*每个页面公共css */
//uview ui
@import 'uview-ui/index.scss';
page {
	height: 100%;
	// background-color: #000000;
	max-width: 750px;
	margin: auto;
}
.uni-body {
	font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
		sans-serif !important;
}
.flex-no-horizontal {
	display: flex;
	align-items: center;
}
.flex {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.tab-horizontal {
	/*  #ifndef H5 */
	padding-bottom: env(safe-area-inset-bottom);
	/*  #endif  */

	/*  #ifdef H5 */
	padding-bottom: 20rpx;
	/*  #endif  */
	background-color: #ffffff;
}
.p-10 {
	padding: 20rpx;
}
.p-20 {
	padding: 40rpx;
}
.p-row-10 {
	padding: 0 20rpx;
}
.p-row-20 {
	padding: 0 40rpx;
}
.p-up-10 {
	padding: 20rpx 0;
}
.p-up-20 {
	padding: 40rpx 0;
}
.p-l-10 {
	padding-left: 20rpx;
}
.p-l-20 {
	padding-left: 40rpx;
}
.p-r-10 {
	padding-right: 20rpx;
}
.p-r-20 {
	padding-right: 40rpx;
}
.p-t-10 {
	padding-top: 20rpx;
}
.p-t-20 {
	padding-top: 40rpx;
}
.p-b-10 {
	padding-bottom: 20rpx;
}
.p-b-20 {
	padding-bottom: 40rpx;
}
.m-10 {
	margin: 20rpx;
}
.m-20 {
	margin: 40rpx;
}
.m-row-10 {
	margin: 0 20rpx;
}
.m-row-20 {
	margin: 0 40rpx;
}
.m-up-10 {
	margin: 20rpx 0;
}
.m-up-20 {
	margin: 40rpx 0;
}
.m-l-10 {
	margin-left: 20rpx;
}
.m-l-20 {
	margin-left: 40rpx;
}
.m-r-10 {
	margin-right: 20rpx;
}
.m-r-20 {
	margin-right: 40rpx;
}
.m-t-10 {
	margin-top: 20rpx;
}
.m-t-20 {
	margin-top: 40rpx;
}
.m-b-10 {
	margin-bottom: 20rpx;
}
.m-b-20 {
	margin-bottom: 40rpx;
}
.font-10 {
	font-size: 20rpx;
}
.font-12 {
	font-size: 24rpx;
}
.font-14 {
	font-size: 28rpx;
}
.font-16 {
	font-size: 32rpx;
}
.font-18 {
	font-size: 36rpx;
}
.font-28 {
	font-size: 56rpx;
}
.font-bold {
	font-weight: bold;
}
.font-five-hundred {
	font-weight: 500;
}
.align-center {
	text-align: center;
}
</style>
