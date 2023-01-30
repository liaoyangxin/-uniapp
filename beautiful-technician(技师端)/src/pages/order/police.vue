<template>
	<view style="margin: 0 30rpx;">
		<view class="top flex m-up-10">
			<view class="top-item flex-no-horizontal" @click="callPhone('110')">
				<u-image width="28" height="28" src="/static/tab/user-hover.png"></u-image>
				<view class="font-16">立即拨打110</view>
			</view>
			<view class="interval"></view>
			<view class="top-item flex-no-horizontal" @click="callPhone('10086')">
				<u-image width="28" height="28" src="/static/tab/user-hover.png"></u-image>
				<view class="font-16">立即拨打客服</view>
			</view>
		</view>
		<view class="middle">
			<view class="middle-item flex font-16">
				<view class="middle-item-title">当前订单</view>
				<view class="middle-item-text flex-no-horizontal">
					{{ detailData.orderNo }}
					<u-icon name="arrow-right" color="rgba(153, 153, 153, 1)" size="15"></u-icon>
				</view>
			</view>
			<view class="middle-item flex font-16">
				<view class="middle-item-title">客户姓名</view>
				<view class="middle-item-text flex-no-horizontal">{{ detailData.customerName }}</view>
			</view>
			<view class="middle-item flex font-16">
				<view class="middle-item-title">客户电话</view>
				<view class="middle-item-text flex-no-horizontal">{{ detailData.customerMobile }}</view>
			</view>
			<view class="middle-itemAddress font-16">
				<view class="middle-itemAddress-title">服务地址</view>
				<view class="middle-itemAddress-content">{{ address }}</view>
			</view>
		</view>
		<u-button class="btn font-16" type="primary" @click="submit">提交求助</u-button>
	</view>
</template>

<script>
import { getOrderDetailApi, createPoliceOrderApi } from '@/api/order.js';
export default {
	data() {
		return {
			detailData: {
				orderNo: '',
				customerName: '',
				customerMobile: '',
				server: {
					serverAddress: {
						city: '',
						guid: '',
						county: '',
						mobile: '',
						address: '',
						country: '',
						latitude: '',
						province: '',
						username: '',
						isDefault: 0,
						longitude: '',
						addressType: 0,
						houseNumber: ''
					}
				}
			}
		};
	},
	onLoad(e) {
		if (e.orderNo) {
			this.getDetailData(e.orderNo);
		}
	},
	computed: {
		address() {
			return (
				this.detailData.server.serverAddress.province +
				this.detailData.server.serverAddress.city +
				this.detailData.server.serverAddress.county +
				this.detailData.server.serverAddress.address +
				this.detailData.server.serverAddress.houseNumber
			);
		}
	},
	methods: {
		async getDetailData(orderNo) {
			try {
				const res = await getOrderDetailApi({
					orderNo
				});
				this.detailData = res.data;
			} catch (e) {
				this.failMessage(e);
			}
		},
		async submit() {
			try {
				const res = await createPoliceOrderApi({
					orderNo: this.detailData.orderNo,
					address: this.detailData.server.serverAddress
				});
				uni.navigateTo({
					url: '/pages/order/police-success?orderNo=' + res.data.seekHelpNo
				});
			} catch (e) {
				this.failMessage(e);
			}
		},
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
};
</script>

<style lang="scss" scoped>
page {
	background-color: rgba(244, 244, 244, 1);
}

.top {
	padding: 52rpx 30rpx;
	background: linear-gradient(180deg, rgba(255, 243, 233, 1) 0%, rgba(255, 255, 255, 1) 100%);
	border-radius: 20rpx;

	.top-item {
		color: rgba(51, 51, 51, 1);

		.font-16 {
			margin-left: 10rpx;
		}
	}

	.interval {
		background-color: rgba(241, 241, 241, 1);
		width: 2rpx;
		height: 50rpx;
	}
}
.middle {
	padding: 0 30rpx;
	border-radius: 16rpx;
	background-color: rgba(255, 255, 255, 1);
	&-item {
		padding: 30rpx 0;
		border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
		&-title {
			color: rgba(153, 153, 153, 1);
		}
		&-text {
			color: rgba(51, 51, 51, 1);
		}
	}
	&-itemAddress {
		padding: 30rpx 0;
		&-title {
			padding-bottom: 30rpx;
			color: rgba(153, 153, 153, 1);
		}
		&-content {
			color: rgba(51, 51, 51, 1);
		}
	}
}
.btn {
	margin-top: 80rpx;
	background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
	box-shadow: 0 6rpx 12rpx 2rpx rgba(253, 117, 15, 0.2);
	border-radius: 40rpx;
	border: 0;
	color: rgba(255, 255, 255, 1);
}
</style>
