<template>
	<view class="user-recharge">
		<view class="user-recharge-header">
			<text class="p-b-10">可用保证金 （元）</text>
			<text class="font-28 font-bold ">{{ userAssetData.bond }}</text>
		</view>
		<view class="user-recharge-amount">
			<view class="user-recharge-amount-cell">
				<text class="user-recharge-title font-16 font-five-hundred">充值金额</text>
				<view class="user-recharge-amount-input flex-no-horizontal">
					<text>￥</text>
					<input type="text" v-model="price" placeholder-class="urai-pla" placeholder="手动输入充值金额" @input="priceChange" />
				</view>
				<view class="user-recharge-tab">
					<text v-for="(item, index) in amountList" :key="index" @click="check(item, index)" :class="[current == index ? 'activeStyle' : 'uncheckedStyle']">
						{{ item.name }}元
					</text>
				</view>
			</view>
		</view>
		<view class="payment-method">
			<text>支付方式</text>
			<view class="payment-method-weChat">
				<view class="flex">
					<u--image src="/static/user/icon-weChat.png" width="27" height="27"></u--image>
					<text class="font-14 p-l-10">微信支付</text>
				</view>
				<u--image src="/static/user/icon-selectHover.png" width="15" height="15"></u--image>
			</view>
		</view>
		<view class="btn">
			<button type="default" class="user-recharge-btn" @click="nowPay">立即充值</button>
			<view style="height: 30rpx;"></view>
		</view>
	</view>
</template>

<script>
import { weChatH5Pay, weChatH5config } from '../../utility/wechat.js';
import { createBalanceOrderApi, createEarnestMoneyOrderApi, payOrderApi } from '../../api/user.js';
import { userAssetApi } from '../../api/technician.js';
export default {
	data() {
		return {
			amountList: [{ name: 100 }, { name: 300 }, { name: 500 }, { name: 1000 }, { name: 2000 }, { name: 3000 }],
			current: 99999,
			checkboxValue1: [],
			// 基本案列数据
			checkboxList1: [
				{
					disabled: false
				}
			],
			price: '',
			userAssetData: {
				totalAssets: 0, //总资产
				incomeSharing: 0, //分享收入
				orderRevenue: 0, //订单收入
				rechargeIncome: 0, //余额
				bond: 0, //保证金
				allowWithdrawal: 0 //可提现金额
			}
		};
	},
	onLoad() {
		// weChatH5config();
		this.getGuaranteeBalance();
	},
	methods: {
		check(data, index) {
			this.price = data.name;
			this.current = index;
		},
		priceChange(value) {
			if (parseFloat(this.price) !== this.amountList[this.current]?.name) {
				this.current = 99999;
			}
		},
		async getGuaranteeBalance() {
			try {
				const res = await userAssetApi();
				this.userAssetData = res.data;
			} catch (e) {
				this.failMessage(e);
			}
		},
		async nowPay() {
			try {
				if (!this.price) {
					this.failMessage({
						msg: '请输入金额'
					});
					return;
				}
				uni.showLoading({
					title: '请稍后'
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 5000);
				//创建保证金订单
				const res = await createEarnestMoneyOrderApi({
					bondPrice: parseFloat(this.price)
				});

				// //创建余额订单
				// const res = await createBalanceOrderApi({
				// 	rechargePrice: parseFloat(this.price)
				// });

				//获取微信数据
				const payOrderRes = await payOrderApi({
					payNo: res.data.orderInfo.payNo
				});
				//微信支付
				const payRes = await weChatH5Pay(payOrderRes.data);
				uni.showLoading({
					title: '请稍后'
				});
				setTimeout(() => {
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/order/order-paySuccess?orderId=' + res.data.orderInfo.orderNo + '&price=' + res.data.orderInfo.price
					});
				}, 800);
			} catch (e) {
				this.failMessage(e);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.user-recharge {
	display: flex;
	flex-direction: column;
	background: rgba(248, 248, 248, 1);
	height: 100%;
	.user-recharge-header {
		display: flex;
		flex-direction: column;
		padding: 34rpx 54rpx 54rpx;
		color: rgba(255, 255, 255, 1);
		font-size: 28rpx;
		font-weight: 400;
		background: linear-gradient(180deg, #fd780f 0%, #fc891a 100%);
		.p-b-10 {
			padding-bottom: 10rpx;
		}
	}
	.user-recharge-amount {
		height: 538rpx;
		margin-top: -36rpx;
		border-radius: 20rpx;
		background: rgba(255, 255, 255, 1);
		.user-recharge-amount-cell {
			padding: 40rpx 28rpx;
			.user-recharge-amount-input {
				margin-top: 28rpx;
				border-radius: 16rpx;
				background-color: rgba(248, 248, 248, 1);
				height: 96rpx;
				text {
					margin: 0 12rpx 0 22rpx;
					font-size: 36rpx;
					font-weight: 500;
				}
				.urai-pla {
					font-size: 28rpx;
					color: rgba(153, 153, 153, 1);
				}
			}
			.u-input {
				margin: 28rpx 0;
				background: rgba(248, 248, 248, 1);
			}
			::v-deep .u-text__value--tips {
				color: rgba(0, 0, 0, 1) !important;
				z-index: 9999;
			}
			.user-recharge-tab {
				margin-top: 24rpx;
				display: flex;
				flex-wrap: wrap;
				width: 100%;
			}
			.activeStyle {
				width: 29%;
				height: 108rpx;
				display: inline-block;
				margin: 18rpx 12rpx;
				text-align: center;
				line-height: 112rpx;
				color: rgba(252, 123, 17, 1);
				border: 2rpx solid rgba(252, 123, 17, 1);
				background: rgba(255, 245, 240, 1);
				border-radius: 16rpx;
			}
			.uncheckedStyle {
				width: 29%;
				height: 108rpx;
				margin: 18rpx 12rpx;
				display: inline-block;
				text-align: center;
				line-height: 112rpx;
				color: rgba(51, 51, 51, 1);
				background: rgba(248, 248, 248, 1);
				border: 2rpx solid rgba(248, 248, 248, 1);
				border-radius: 16rpx;
			}
		}
	}
	.payment-method {
		// height: 218rpx;
		margin-top: 20rpx;
		border-radius: 20rpx;
		padding: 36rpx 30rpx;
		background: rgba(255, 255, 255, 1);
		.payment-method-weChat {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 28rpx 0;
		}
	}
	.btn {
		position: fixed;
		bottom: env(safe-area-inset-bottom);
		z-index: 99;
		width: 100%;
		.user-recharge-btn {
			width: 92%;
			display: block;
			height: 80rpx;
			line-height: 80rpx;
			color: rgba(255, 255, 255, 1);
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			border-radius: 40rpx;
		}
	}
}
</style>
