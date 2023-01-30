<template>
	<view class="pay">
		<view class="pay-success">
			<u--image :src="'/static/order/succse-icon.png'" width="60" height="60" radius="8"></u--image>
			<text class="pay-success-text">支付成功</text>
			<text class="pay-success-price">￥{{ totalPrice }}</text>
			<text class="pay-success-orderNo">订单编号 :{{ orderNo }}</text>
		</view>
		<view class="btn-box m-t-10">
			<u-button
				class="btn-box-pay font-16"
				type="primary"
				v-if="orderNo"
				text="返回查看详情"
				@click="nowPayClick"
			></u-button>
			<u-button
				class="btn-box-detail font-16 m-t-20"
				type="primary"
				v-if="orderNo"
				text="返回首页"
				@click="backPage"
			></u-button>
			<u-button class="btn-box-pay font-16" type="primary" v-else text="个人中心" @click="userClick"></u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			totalPrice: '',
			orderNo: '',
		};
	},
	onLoad(options) {
		this.orderNo = options.orderNo;
		this.totalPrice = options.totalPrice;
	},
	onHide(options) {},
	methods: {
		nowPayClick() {
			uni.reLaunch({
				url: `/pages/order/detail?orderNo=${this.orderNo}`,
			});
		},
		userClick() {
			uni.reLaunch({
				url: '/pages/user/user',
			});
		},
		// 返回首页
		backPage() {
			uni.switchTab({
				url: '/pages/index/index',
			});
		},
	},
};
</script>

<style lang="scss">
.pay {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.pay-success {
		display: flex;
		flex-direction: column;
		text-align: center;
		padding-top: 240rpx;
		::v-deep .u-image {
			margin: 0 auto !important;
		}
		&-orderNo {
			color: rgba(153, 153, 153, 1);
			font-size: 32rpx;
			padding-top: 56rpx;
			font-weight: 400;
		}
		&-text {
			font-weight: 400;
			font-size: 18px;
			padding: 42rpx 0 10rpx 0;
		}
		&-price {
			color: rgba(51, 51, 51, 1);
			font-size: 48rpx;
			font-weight: bold;
		}
	}
}
.btn-box {
	margin-top: 220rpx;
	padding: 0 40rpx;
	::v-deep.u-button__text {
		font-size: 32rpx !important;
	}
	.btn-box-pay {
		height: 80rpx;
		background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
		border-radius: 40rpx;
		border: none;
	}
	&-detail {
		margin: 40rpx 0;
		background: rgba(255, 255, 255, 1);
		border-radius: 20px 20px 20px 20px;
		border: 1px solid rgba(253, 120, 15, 1);
		color: rgba(51, 51, 51, 1);
	}
}
</style>
