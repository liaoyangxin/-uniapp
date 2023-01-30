<script>
import {
	weChatH5config,
	weChatH5ShareCircleOfFriends,
	weChatH5ShareFriend,
	weChatH5hideMenuItems,
} from '@/utility/wechat.js';
import store from './store/index.js';
import vconsole from 'vconsole';
export default {
	// onLaunch	当uni-app 初始化完成时触发（全局只触发一次）
	onLaunch: function (e) {
		// #ifdef H5
		function isWeChat() {
			let ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				//判断微信浏览器
				let style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = 'uni-page-head,.uni-page-head{display:none;}';
				document.getElementsByTagName('head').item(0).appendChild(style);
				if (uni.getStorageSync('ifShowConsole')) {
					const vConsole = new vconsole();
					// uni.setStorageSync('ifShowConsole', false);
				}
				if (store.state.userToken) {
					// if (window.location.search) {
					// 	window.location.href = window.location.origin + '/user/' + window.location.hash;
					// }
					weChatH5config();
					setTimeout(async function () {
						await weChatH5ShareCircleOfFriends();
						await weChatH5ShareFriend();
						await weChatH5hideMenuItems();
					}, 500);
				}
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
		sans-serif;
}
.flex-no-horizontal {
	display: flex;
	align-items: center;
}
.flex-no-end {
	display: flex;
	align-items: flex-end;
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
.m-15 {
	margin: 20rpx 30rpx;
}
.m-20 {
	margin: 40rpx;
}
.m-5 {
	margin: 0 10rpx;
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
.m-r-5 {
	margin-right: 10rpx;
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
.font-13 {
	font-size: 26rpx !important;
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
.font-30 {
	font-size: 60rpx;
}
.font-40 {
	font-size: 80rpx;
}
.weight-500 {
	font-weight: 500;
}
.weight-400 {
	font-weight: 400;
}
.font-bold {
	font-weight: bold;
}
.block {
	display: block;
}
.end {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	line-height: 80rpx;
}
</style>
