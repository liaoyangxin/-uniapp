import WX from 'jweixin-module';
import { getWeChatJSconfigApi } from '../api/user.js';
import store from '../store/index.js';
export const weChatH5Pay = function (data) {
	return new Promise((resove, reject) => {
		const WXPayData = {
			nonceStr: data.nonceStr,
			package: data.package,
			paySign: data.paySign,
			signType: data.signType,
			timestamp: data.timeStamp,
		};
		WX.chooseWXPay({
			...WXPayData,
			success: function (wxPayRes) {
				resove(wxPayRes);
			},
			fail: function (wxPayErr) {
				reject(wxPayErr);
			},
			cancel: function () {
				reject({
					msg: '取消支付',
				});
			},
		});
	});
};

export const weChatH5config = async function () {
	try {
		const res = await getWeChatJSconfigApi({
			url: window.location.href.split('#')[0],
		});
		let { debug, appId, timestamp, nonceStr, signature, jsApiList } = res.data;

		WX.config({
			debug, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
			appId, // 必填，公众号的唯一标识
			timestamp, // 必填，生成签名的时间戳
			nonceStr, // 必填，生成签名的随机串
			signature, // 必填，签名
			jsApiList, // 必填，需要使用的 JS 接口列表
		});
	} catch (e) {
		uni.showToast({
			title: e?.msg || e?.errMsg || '获取config失败~',
			icon: 'none',
		});
	}
};

export const weChatH5ShareFriend = async type => {
	return new Promise((resove, reject) => {
		const link = window.location.origin + type;
		let Guid = store.state.userInfo?.userInfoGuid ? '?guid=' + store.state.userInfo?.userInfoGuid + '#/' : '';
		console.log(link + Guid);
		WX.ready(function () {
			WX.updateAppMessageShareData({
				title: '美优到家', // 分享标题
				desc: '一家极速上门服务直约平台，提供专业，正规，安全，快捷的24小时上门服务。', // 分享描述
				link: link + Guid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
				imgUrl: 'https://m.hellobike.com/resource/helloyun/13459/_zZAz_2546.jpg_wh300.jpg', // 分享图标
				success: function (res) {
					// 设置成功
					resove(res);
				},
				fail: function (err) {
					resove();
				},
			});
		});
	});
};

export const weChatH5ShareCircleOfFriends = async type => {
	return new Promise((resove, reject) => {
		const link = window.location.origin + type;
		let Guid = store.state.userInfo?.userInfoGuid ? '?guid=' + store.state.userInfo?.userInfoGuid + '#/' : '';
		console.log(link + Guid);
		WX.ready(function () {
			WX.updateTimelineShareData({
				title: '美优到家', // 分享标题
				link: link + Guid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
				imgUrl: 'https://m.hellobike.com/resource/helloyun/13459/_zZAz_2546.jpg_wh300.jpg', // 分享图标
				success: function (res) {
					// 设置成功
					resove(res);
				},
				fail: function (err) {
					resove();
				},
			});
		});
	});
};

export const weChatH5hideMenuItems = async () => {
	return new Promise((resove, reject) => {
		WX.ready(function () {
			WX.hideAllNonBaseMenuItem();
			WX.showMenuItems({
				menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'],
				success: function (res) {
					// 设置成功
					resove(res);
				},
				fail: function (err) {
					resove();
				},
			});
		});
	});
};

export const weChatH5GetLocation = async () => {
	return new Promise((resove, reject) => {
		WX.ready(function () {
			WX.getLocation({
				type: 'gcj02', // 默认为wgs84的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入'gcj02'
				success: function (res) {
					resove(res);
				},
				fail: function (err) {
					weChatH5config();
					reject({
						msg: '获取地理位置失败～请重试',
					});
				},
				cancel: function () {
					reject({
						msg: '用户取消授权~',
					});
				},
			});
		});
	});
};

export const weChatH5OpenLocation = async (latitude, longitude) => {
	return new Promise((resove, reject) => {
		WX.ready(function () {
			WX.openLocation({
				latitude,
				longitude,
				success: function (res) {
					resove(res);
				},
				fail: function (err) {
					reject(err);
				},
				cancel: function () {
					reject({
						msg: '用户取消授权~',
					});
				},
			});
		});
	});
};

export const getUrlParms = function (url) {
	// 通过 ? 分割获取后面的参数字符串
	let urlStr = url.split('?')[1];
	if (!urlStr) return null;
	// 创建空对象存储参数
	let obj = {};
	// 再通过 & 将每一个参数单独分割出来
	let paramsArr = urlStr.split('&');
	for (let i = 0, len = paramsArr.length; i < len; i++) {
		// 再通过 = 将每一个参数分割为 key:value 的形式
		let arr = paramsArr[i].split('=');
		obj[arr[0]] = arr[1];
	}
	return obj;
};

//地址正则
export const addressRegular =
	'(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)?(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)?(?<county>[^(区|市|县|旗|岛)]+区|.*?市|.*?县|.*?旗|.*?岛)?(?<address>.*)';
