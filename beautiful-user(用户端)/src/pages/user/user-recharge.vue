<template>
	<view class="user-recharge">
		<view class="user-recharge-header">
			<text class="p-b-10">可用余额 （元）</text>
			<text class="font-28 font-bold">{{ rechargeIncome }}</text>
		</view>
		<view class="user-recharge-amount">
			<view class="user-recharge-amount-cell">
				<text class="user-recharge-title font-16 font-five-hundred">充值金额</text>
				<view class="u-demo-block__content">
					<u-input type="text" v-model="price" placeholder="手动输入充值金额"
						><u--text text="￥" color="" slot="prefix" margin="0 3px 0 0" type="tips"></u--text
					></u-input>
				</view>
				<view class="user-recharge-tab">
					<text
						v-for="(item, index) in amountList"
						:key="index"
						@click="check(item, index)"
						:class="[current == index ? 'activeStyle' : 'uncheckedStyle']"
					>
						{{ item.name }}元
					</text>
				</view>
			</view>
		</view>
		<view class="payment-method">
			<text>支付方式</text>
			<view class="payment-method-weChat">
				<view class="flex">
					<u--image :src="'/static/order/icon-wechatPay.png'" width="15" height="15"></u--image>
					<text class="font-14 p-l-10">微信支付</text>
				</view>
				<u--image :src="'/static/user/icon-selectHover.png'" width="15" height="15"></u--image>
			</view>
		</view>
		<button type="default" class="user-recharge-btn" @click="nowPay">立即充值</button>
	</view>
</template>

<script>
import { weChatH5Pay, weChatH5config } from '@/utility/wechat.js';
import { createBalanceOrderApi, createEarnestMoneyOrderApi, payOrderApi, userRecharge } from '../../api/user.js';
export default {
	data() {
		return {
			amountList: [{ name: 100 }, { name: 300 }, { name: 500 }, { name: 1000 }, { name: 2000 }, { name: 3000 }],
			current: 99999,
			checkboxValue1: [],
			// 基本案列数据
			checkboxList1: [
				{
					disabled: false,
				},
			],
			price: '',
			rechargeIncome: 'ss',
		};
	},
	onLoad(item) {
		this.rechargeIncome = item.rechargeIncome;
		// weChatH5config()
	},
	methods: {
		check(data, index) {
			this.price = data.name;
			this.current = index;
		},
		async nowPay() {
			let orderNo = '';
			try {
				uni.showLoading({
					title: '请稍后',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 5000);
				//创建余额订单
				const res = await userRecharge({
					rechargePrice: parseFloat(this.price),
				});
				orderNo = res.data.orderInfo.orderNo;
				//获取微信数据
				const payOrderRes = await payOrderApi({
					payNo: res.data.orderInfo.payNo,
				});
				//微信支付
				const payRes = await weChatH5Pay(payOrderRes);
				// console.log(payRes,"payRes")
				setTimeout(() => {
					uni.reLaunch({
						url: `/pages/order/pay-success?orderNo=${res.data.orderInfo.orderNo}&totalPrice=${this.price}?debug=1`,
					});
				}, 500);
			} catch (e) {
				this.failMessage({
					msg: e.msg,
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.user-recharge {
	display: flex;
	flex-direction: column;
	background: rgba(248, 248, 248, 1);
	height: 100%;
	&-header {
		display: flex;
		flex-direction: column;
		height: 104rpx;
		padding: 36rpx 52rpx 48rpx 52rpx;
		color: rgba(255, 255, 255, 1);
		font-size: 28rpx;
		font-weight: 400;
		background: linear-gradient(180deg, #fd780f 0%, #fc891a 100%);
	}
	&-amount {
		height: 538rpx;
		margin-top: -20rpx;
		border-radius: 20rpx;
		background: rgba(255, 255, 255, 1);
		&-cell {
			padding: 40rpx 28rpx;
			.u-input {
				margin: 28rpx 0;
				background: rgba(248, 248, 248, 1);
			}
			::v-deep .u-text__value--tips {
				color: rgba(0, 0, 0, 1) !important;
				z-index: 9999;
			}
			.user-recharge-tab {
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
		&-weChat {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 28rpx 0;
		}
	}
	.user-recharge-btn {
		position: fixed;
		width: 92%;
		bottom: 0;
		display: block;
		margin: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: rgba(255, 255, 255, 1);
		background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
		border-radius: 40rpx;
	}
}
</style>
