<template>
	<view>
		<view class="logo flex-no-horizontal"><u--image :showLoading="true" :src="'/static/login/logo_loginLogo@2x.png'" width="120" height="113" @click="click"></u--image></view>
		<view class="name font-16">美优到家专业服务平台</view>
		<view class="btn"><u-button class="btn-wechat font-16" :loading="btnLoadingShow" type="primary" :text="btnText" @click="loginClick"></u-button></view>
		<view class="footer flex-no-horizontal font-14">
			<u--image :src="'/static/user/icon-select.png'" width="18" height="18" v-if="!ifAgreement" @click="ifAgreement = !ifAgreement"></u--image>
			<u-icon name="checkmark-circle-fill" color="rgba(88, 193, 76, 1)" size="18" v-else @click="ifAgreement = !ifAgreement"></u-icon>
			<text style="margin-left: 10rpx;"></text>
			注册即同意
			<text class="footer-text" @click="userAgreementClick(UserAgreement)">《用户使用协议》</text>
			、
			<text class="footer-text" @click="userAgreementClick(PrivacyAgreement)">《隐私政策》</text>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { wechatH5LoginApi, wechatLoginApi, userInfoApi } from '@/api/user.js';
import { getUrlParms } from '@/utility/wechat.js';
export default {
	data() {
		return {
			btnLoadingShow: false,
			btnText: '微信授权',
			urlParms: null,
			ifAgreement:false,
		};
	},
	onLoad() {
		// this.urlParms = getUrlParms(window.location.href);
		// this.wechatH5loginFun();
	},
	methods: {
		...mapMutations(['setUserToken', 'setSecretKey', 'setUserInfo']),
		userAgreementClick(item){
			
			uni.navigateTo({
				url: '/pages/index/webView?url=' + item
			})
		},
		
		async loginClick() {
			try {
				if(!this.ifAgreement){
					this.failMessage({
						msg:'请先同意协议'
					});
					return
				}
				this.btnLoadingShow = true;
				this.btnText = '请稍后...';
				let urlStr = window.location.href.split('#');
				const res = await wechatH5LoginApi({
					notifyUrl: urlStr[0] + '#/pages/login/login-transition'
				});
				window.location.href = res.data.loginUrl;
				this.btnLoadingShow = false;
				this.btnText = '授权成功';
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e);
			}
		},
		async wechatH5loginFun() {
			try {
				if (!this.urlParms?.code) {
					return;
				}
				const res = await wechatLoginApi({
					code: this.urlParms.code
				});
				this.setSecretKey(res.data.secret);
				this.setUserToken(res.data.token);
				const userInfoRes = await userInfoApi();
				this.setUserInfo(userInfoRes.data);
				if (!userInfoRes.data.isBindMobile) {
					uni.navigateTo({
						url: '/pages/login/bind-mobile-phone'
					});
					return;
				}
				this.failMessage({
					msg: '登录成功'
				});
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/user/user'
					});
				}, 800);
			} catch (e) {
				this.failMessage(e);
				//TODO handle the exception
			}
		}
	}
};
</script>

<style lang="scss">
.logo {
	justify-content: center;
	margin-top: 180rpx;
}
.name {
	margin-bottom: 180rpx;
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
	justify-content: center;
	&-text {
		margin: 0 5rpx;
		color: rgba(107, 187, 42, 1);
	}
}
</style>
