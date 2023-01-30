import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		productStatus: '',
		userInfo: uni.getStorageSync('userInfo') || {}, //用户信息
		userToken: uni.getStorageSync('userToken') || '', //用户token
		secretKey: uni.getStorageSync('secretKey') || '', //签名key
		selectAddress: null, //所选地址
		selectTravel: null, //所选出行方式
		followStatus: null,
		productDetail: null, //下单项目信息
		isEvaluate: false,
	},
	getters: {},
	mutations: {
		//存储用户信息
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo;
			uni.setStorageSync('userInfo', userInfo);
		},

		//存储用户token
		setUserToken(state, token) {
			state.userToken = token;
			uni.setStorageSync('userToken', token);
		},
		//存储用户签名key
		setSecretKey(state, data) {
			state.secretKey = data;
			uni.setStorageSync('secretKey', data);
		},
		//删除用户信息
		deleteUserInfo(state) {
			console.log('进入删除token');
			state.userToken = '';
			state.userInfo = {};
			state.secretKey = '';
			// state.followStatus = "";
			uni.removeStorageSync('userInfo');
			uni.removeStorageSync('userToken');
			uni.removeStorageSync('secretKey');
			uni.removeStorageSync('loginCode');
			uni.removeStorageSync('ifShowConsole');
		},
		//通过项目状态
		setProductStatus(state, data) {
			state.productStatus = data;
		},
		//存储所选地址
		setSelectAddress(state, data) {
			state.selectAddress = data;
		},
		//所选出行方式
		setSelectTravel(state, data) {
			state.selectTravel = data;
		},
		delSelectTravel(state, data) {
			state.selectTravel = '';
		},
		// 下单项目信息
		setProductDetail(state, data) {
			state.productDetail = data;
		},
		// 评分
		setEvaluate(state, data) {
			state.isEvaluate = data;
		},
		// 评分
		delEvaluate(state, data) {
			state.isEvaluate = data;
		},
		// 清空下单信息
		delProductDetail(state, data) {
			state.productDetail = '';
		},
		// 关注状态
		setFollowStatus(state, data) {
			state.followStatus = data;
		},
		//清楚产品id
		deleteProductId(state) {
			state.productStatus = '';
		},
	},
	actions: {
		async getUserInfo({ commit }) {
			try {
				const res = await userInfo();
				commit('setUserInfo', res.data);
			} catch (e) {
				console.log(e);
				uni.showToast({
					title: e.data || e.message,
					icon: 'none',
				});
			}
		},
	},
	modules: {},
});
