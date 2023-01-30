<template>
	<view>
		<view class="wrap">
			<view class="item flex"><input v-model="phone" type="text" placeholder="请输入手机号" /></view>
			<view class="item flex">
				<input v-model="code" type="text" placeholder="请输入验证码" />
				<view class="time font-14" @click="getCode">{{ tips }}</view>
			</view>
		</view>
		<view class="btn-box"><u-button class="btn-box-pay font-16" :loading="btnLoadingShow" type="primary" :text="btnText" @click="nowLoginClick"></u-button></view>
		<view class="footer flex-no-horizontal">
			<u--image :src="'/static/user/icon-select.png'" width="18" height="18" v-if="!ifAgreement" @click="ifAgreement = !ifAgreement"></u--image>
			<u-icon name="checkmark-circle-fill" color="rgba(88, 193, 76, 1)" size="18" v-else @click="ifAgreement = !ifAgreement"></u-icon>
			<text class="footer-text font-14 m-l-10">注册即同意</text>
			<text class="footer-agreement font-14" @click="agreementClick(SoftwareAgreement)">《用户使用协议》</text>
			<text class="footer-text font-14">、</text>
			<text class="footer-agreement font-14" @click="agreementClick(PrivacyAgreement)">《隐私政策》</text>
		</view>

		<!-- 验证码组件 -->
		<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"></u-code>

		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { sendCodeApi, userInfoApi, bindPhoneApi } from '@/api/user.js';
import { mapMutations } from 'vuex';
import { weChatH5config, weChatH5ShareCircleOfFriends, weChatH5ShareFriend, weChatH5hideMenuItems } from '@/utility/wechat.js';
export default {
	data() {
		return {
			phone: '',
			code: '',
			btnLoadingShow: false,
			btnText: '登录',
			tips: '获取验证码',
			seconds: 59,
			ifAgreement: false
		};
	},
	methods: {
		...mapMutations(['setUserInfo']),
		async nowLoginClick() {
			try {
				if (this.code === '') {
					uni.$u.toast('请输入验证码');
					return;
				}
				if (!this.ifAgreement) {
					uni.$u.toast('请同意协议');
					return;
				}
				this.btnLoadingShow = true;
				this.btnText = '请稍后...';
				const res = await bindPhoneApi({
					mobile: this.phone,
					code: this.code
				});
				const userInfoRes = await userInfoApi();
				this.setUserInfo(userInfoRes.data);
				weChatH5config();
				uni.$u.toast('绑定成功');
				if (!userInfoRes.data.isArtificer) {
					this.failMessage({
						msg: '未认证，请先认证'
					});
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/user/user-audit'
						});
					}, 800);
					return;
				}
				this.btnLoadingShow = false;
				this.btnText = '登录';
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/user/user'
					});
				}, 800);
				await weChatH5ShareCircleOfFriends();
				await weChatH5ShareFriend();
				await weChatH5hideMenuItems();
			} catch (e) {
				this.btnLoadingShow = false;
				this.btnText = '登录';
				this.failMessage(e);
			}
		},
		codeChange(text) {
			this.tips = text;
		},
		async getCode() {
			try {
				if (this.$refs.uCode.canGetCode) {
					if (this.phone === '' && this.phone.length !== 11) {
						uni.$u.toast('请输入正确的手机号');
						return;
					}
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					});
					const res = await sendCodeApi({
						mobile: this.phone
					});
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e);
			} finally {
				uni.hideLoading();
			}
		},
		end() {},
		start() {
			// uni.$u.toast('倒计时开始');
		},
		agreementClick(url){
			uni.navigateTo({
				url:'/pages/rostering/webView?url=' + url
			})
		}
	}
};
</script>

<style lang="scss">
.wrap {
	padding: 10rpx 24rpx;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	background-color: rgba(255, 255, 255, 1);
	.item {
		padding: 30rpx 0;
		border-bottom: 2rpx solid rgba(241, 241, 241, 1);
		&-title {
			color: rgba(51, 51, 51, 1);
		}
		.time {
			color: rgba(107, 187, 42, 1);
		}
	}
}
.btn-box {
	padding: 20rpx 60rpx;
	margin-top: 200rpx;
	&-pay {
		border: 0;
		border-radius: 40rpx;
		background-color: rgba(107, 187, 42, 1);
	}
}
.footer {
	margin-top: 20rpx;
	justify-content: center;
	&-text {
		color: rgba(153, 153, 153, 1);
	}
	&-agreement {
		margin: 0 5rpx;
		color: rgba(107, 187, 42, 1);
	}
}
</style>
