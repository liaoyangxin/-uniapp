<template>
	<view>
		<view class="logo flex-no-horizontal"
			><u--image
				:showLoading="true"
				:src="'/static/login/logo_loginLogo@2x.png'"
				width="120"
				height="113"
				@click="click"
			></u--image
		></view>
		<view class="name font-16">登录中...</view>
		<view class="loding-img flex-no-horizontal"
			><u--image :src="'/static/login/bg_login_loding.gif'" width="170" height="98"></u--image
		></view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { wechatH5LoginApi, wechatLoginApi, userInfoApi, inviteBind } from '@/api/user.js';
import {
	getUrlParms,
	weChatH5config,
	weChatH5ShareCircleOfFriends,
	weChatH5ShareFriend,
	weChatH5hideMenuItems,
} from '@/utility/wechat.js';
export default {
	data() {
		return {
			urlParms: null,
		};
	},
	onLoad() {
		this.urlParms = getUrlParms(window.location.href);
		this.codeSameOrNot();
	},
	...mapState({
		projectType: state => state.projectType,
	}),
	methods: {
		...mapMutations(['setUserToken', 'setSecretKey', 'setUserInfo']),
		async wechatH5loginFun() {
			try {
				if (!this.urlParms?.code) {
					return;
				}
				const res = await wechatLoginApi({
					code: this.urlParms.code,
				});
				this.setSecretKey(res.data.secret);
				this.setUserToken(res.data.token);
				//缓存登陆code
				uni.setStorageSync('loginCode', this.urlParms.code);
				const userInfoRes = await userInfoApi();
				this.setUserInfo(userInfoRes.data);
				weChatH5config();
				if (this.urlParms?.guid) {
					const shareRes = await inviteBind({
						inviterGuid: this.urlParms?.guid,
					});
				}
				if (!userInfoRes.data.isBindMobile) {
					uni.navigateTo({
						url: '/pages/login/bind-mobile-phone',
					});
					return;
				}
				if (!userInfoRes.data.isArtificer) {
					uni.navigateTo({
						url: userInfoRes.data.lastExamineId
							? '/pages/user/user-audit-success'
							: '/pages/user/user-audit',
					});
					return;
				}
				this.failMessage({
					msg: '登录成功',
				});
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/user/user',
					});
				}, 800);
				await weChatH5ShareCircleOfFriends();
				await weChatH5ShareFriend();
				await weChatH5hideMenuItems();
			} catch (e) {
				this.failMessage(e);
				//TODO handle the exception
			}
		},
		//判断code是否相同。
		async codeSameOrNot() {
			try {
				const cacheCode = uni.getStorageSync('loginCode') || '';
				if (this.urlParms?.code === cacheCode || this.$store.state.userToken) {
					this.failMessage({
						msg: '已登陆，正在跳转～',
					});
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/user/user',
						});
					}, 800);
					return;
				}
				this.wechatH5loginFun();
			} catch (e) {
				//TODO handle the exception
			}
		},
	},
};
</script>

<style lang="scss">
.logo {
	justify-content: center;
	margin-top: 180rpx;
}
.name {
	margin-bottom: 80rpx;
	color: rgba(51, 51, 51, 1);
	text-align: center;
}
.btn {
	padding: 0 68rpx;
	margin-bottom: 40rpx;
	.btn-wechat {
		border: 0;
		border-radius: 40rpx;
		background-color: rgba(107, 187, 42, 1);
	}
}
.footer {
	color: rgba(153, 153, 153, 1);
	text-align: center;
	&-text {
		margin: 0 5rpx;
		color: rgba(107, 187, 42, 1);
	}
}
.loding-img {
	justify-content: center;
}
</style>
