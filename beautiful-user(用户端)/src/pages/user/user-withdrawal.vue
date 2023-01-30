<template>
	<view class="withdrawal-page">
		<view class="withdrawal-page-to">
			<text class="p-r-10">提现至 :</text>
			<u-icon name="weixin-circle-fill" color="rgba(40, 196, 69, 1)" width="26" height="26" size="26"></u-icon>
			<text>微信余额</text>
		</view>
		<view class="withdrawal-page-item">
			<view class="withdrawal-item-title">
				<text class="p-r-10">可提现金额:</text>
				<text>890.22 元</text>
			</view>
			<view class="withdrawal-item-input">
				<u--input
					placeholder="请输入提现金额"
					prefixIcon="￥"
					border="bottom"
					:customStyle="{ marginLeft: '-10px', height: '100rpx' }"
					clearable
					prefixIconStyle="font-size: 26px;color: rgba(0, 0, 0, 1) padding:0"
				></u--input>
			</view>
			<text class="withdrawal-item-text"> 注：每周只能提现一次，提现金额须为整数且大于100 </text>
		</view>
		<view class="withdrawal-page-btn">
			<u-button type="primary" text="提现" color="rgba(107, 187, 42, 1)"></u-button>
		</view>
	</view>
</template>
<script></script>
<style lang="scss" scoped>
.withdrawal-page {
	display: flex;
	flex-direction: column;
	padding: 18rpx 30rpx;
	background: rgba(245, 248, 250, 1);

	.withdrawal-page-to {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		height: 128rpx;
		padding: 0 28rpx;
		border-radius: 20rpx;
		background: rgba(255, 255, 255, 1);
		color: rgba(0, 0, 0, 1);
		font-size: 28rpx;
		font-weight: 500;
	}
	.withdrawal-page-item {
		height: 300rpx;
		background: rgba(255, 255, 255, 1);
		margin: 20rpx 0;
		padding: 0 28rpx;
		.withdrawal-item-title {
			padding: 28rpx 0;
			font-weight: 400;
		}
		.withdrawal-item-text {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			color: rgba(226, 226, 226, 1);
		}
	}
	.withdrawal-page-btn {
		.u-button {
			border-radius: 40rpx;
		}
		::v-deep .u-button__text {
			font-size: 32rpx !important;
		}
	}
}
</style>
