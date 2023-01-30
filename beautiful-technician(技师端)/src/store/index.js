import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import { userInfoApi } from '@/api/user.js';

export default new Vuex.Store({
	state: {
		userInfo: uni.getStorageSync('userInfo') || {}, //用户信息
		userToken: uni.getStorageSync('userToken') || '', //用户token
		secretKey: uni.getStorageSync('secretKey') || '', //签名key
		fileImg: null,
		projectType: '/business/',
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
		//存储所选图片File对象
		setFileImg(state, data) {
			state.fileImg = data;
			console.log(data);
		},
		//删除用户信息
		deleteUserInfo(state) {
			console.log('进入删除token');
			state.userToken = '';
			state.userInfo = {};
			state.secretKey = '';
			uni.removeStorageSync('userInfo');
			uni.removeStorageSync('userToken');
			uni.removeStorageSync('secretKey');
			uni.removeStorageSync('loginCode');
			uni.removeStorageSync('ifShowConsole');
		},
	},
	actions: {
		async getUserInfo({ commit }) {
			try {
				const res = await userInfoApi();
				commit('setUserInfo', res.data);
				if (!res.data.isArtificer) {
					res.data.lastExamineId
						? uni.reLaunch({ url: '/pages/user/user-audit-success' })
						: uni.reLaunch({ url: '/pages/user/user-audit' });
				}
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
