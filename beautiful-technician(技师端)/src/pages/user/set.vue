<template>
	<view>
		<view class="wrap">
			<view class="item flex" @click="agreementClick(SoftwareAgreement)">
				<view class="item-title font-14">软件使用许可协议</view>
				<u-icon name="arrow-right" color="rgba(153, 153, 153, 1)" size="15"></u-icon>
			</view>
			<view class="item flex" @click="agreementClick(PrivacyAgreement)">
				<view class="item-title font-14">隐私政策</view>
				<u-icon name="arrow-right" color="rgba(153, 153, 153, 1)" size="15"></u-icon>
			</view>
			<view class="item flex" @click="versionClick">
				<view class="item-title font-14">版本号：v1.0.1</view>
				<u-icon name="arrow-right" color="rgba(153, 153, 153, 1)" size="15"></u-icon>
			</view>
		</view>
		<view class="btn-box m-t-10"
			><u-button
				class="btn-box-pay font-16"
				:loading="btnLoadingShow"
				type="primary"
				:text="btnText"
				@click="loginOutClick"
			></u-button
		></view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			btnLoadingShow: false,
			btnText: '退出登录',
			num: 0,
		};
	},
	methods: {
		...mapMutations(['deleteUserInfo']),
		loginOutClick() {
			this.btnLoadingShow = true;
			this.btnText = '请稍后...';
			this.deleteUserInfo();
			setTimeout(() => {
				this.btnLoadingShow = false;
				this.btnText = '成功退出';
				uni.navigateBack();
			}, 800);
		},
		versionClick() {
			try {
				if (this.num < 10) {
					this.num++;
					return;
				}
				this.failMessage({
					msg: '正在开启debugger模式~',
				});
				setTimeout(() => {
					uni.setStorageSync('ifShowConsole', true);
					this.num = 0;
					window.location.href = window.location.href;
				}, 800);
			} catch (e) {
				//TODO handle the exception
			}
		},
		agreementClick(url) {
			uni.navigateTo({
				url: '/pages/rostering/webView?url=' + url,
			});
		},
	},
};
</script>

<style lang="scss">
page {
	background-color: rgba(248, 248, 248, 1);
}
.wrap {
	padding: 10rpx 24rpx;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	background-color: rgba(255, 255, 255, 1);
	.item {
		padding: 15rpx 0;
		&-title {
			color: rgba(51, 51, 51, 1);
		}
	}
}
.btn-box {
	padding: 20rpx 30rpx;
	&-pay {
		border: 0;
		border-radius: 40rpx;
		background-color: rgba(107, 187, 42, 1);
	}
}
</style>
