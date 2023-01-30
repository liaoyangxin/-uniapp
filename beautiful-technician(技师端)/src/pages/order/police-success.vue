<template>
	<view>
		<view class="main">
			<view class="main-icon flex-no-horizontal">
				<u-icon name="checkmark-circle-fill" color="rgba(107, 187, 42, 1)" size="58"></u-icon>
			</view>
			<view class="main-title font-16 font-bold">
				报警单号：{{policeId}}
			</view>
			<view class="main-subhead">
				已提交求助成功，我们将第一时间与您取得
				联系。
			</view>
			<view class="main-subhead" style="color: rgba(153, 153, 153, 1);">
				如果您遇到更紧急情况，请第一时间拨打报
				警电话
			</view>
		</view>
		<view class="btn-box">
			<u-button class="btn btn-police font-16" type="primary" @click="callPhone('110')">立即拨打110</u-button>
			<u-button class="btn font-16" type="primary" @click="callPhone('10086')">立即拨打客服</u-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				policeId:''
			};
		},
		onLoad(e) {
			if(e.orderNo){
				this.policeId = e.orderNo
			}
		},
		methods:{
			async callPhone(value) {
				try {
					const res = await uni.makePhoneCall({
						phoneNumber: value //仅为示例
					});
				} catch (e) {
					this.failMessage(e);
				}
			}
		}
	}
</script>

<style lang="scss">
	.main {
		margin: 200rpx 108rpx 108rpx;

		&-icon {
			justify-content: center;
		}

		&-title {
			margin: 40rpx 0 0;
			color: rgba(51, 51, 51, 1);
			text-align: center;
		}

		&-subhead {
			margin-top: 24rpx;
			color: rgba(51, 51, 51, 1);
			line-height: 50rpx;
		}
	}

	.btn-box {
		margin: 0 30rpx;

		.btn {
			margin-top: 36rpx;
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			box-shadow: 0 6rpx 12rpx 2rpx rgba(253, 117, 15, 0.2);
			border-radius: 40rpx;
			border: 0;
			color: rgba(255, 255, 255, 1);
		}

		.btn-police {
			background: rgba(255, 255, 255, 1);
			border: 2rpx solid rgba(253, 120, 15, 1);
			color: rgba(51, 51, 51, 1);
		}
	}
</style>
