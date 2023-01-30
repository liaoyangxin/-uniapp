<template>
	<view class="success">
		<view class="imgebox">
			<image class="img" src="../../../static/coupons/gift-box.png"></image>
			<view class="successFont">{{successFont}}</view>
			<view class="font">你已完成兑换</view>
			<view class="font">请在我的优惠券中查看</view>
		</view>
		<view class="buttonBox">
			<u-button shape="circle" color="linear-gradient(to right, #FD780F, #FD6313)" type="primary" @click="toPoupon">返回优惠券列表</u-button>
			<u-button shape="circle" color="#FD780F" :plain="true" :hairline="true" @click="toMain">返回首页</u-button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				successFont: '兑换成功'
			}
		},
		methods: {
			toPoupon(){
				uni.navigateTo({
					url: 'pages/order/coupon'
				})
			},
			toMain(){
				uni.navigateTo({
					url: 'pages/index/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.success{
		text-align: center;
		.imgebox{
			width: 100%;
			height: 688rpx;
			background: url("../../../static/coupons/bg.png") no-repeat right top;
			background-size: cover;
			.img{
				margin-top: 62rpx;
				width: 400rpx;
				height: 286rpx;
			}
			.successFont{
				color: #FD780F;
				font-size: 48rpx;
				font-weight: bold;
				margin-top: 62rpx;
				margin-bottom: 40rpx;
			}
			.font{
				ont-size: 32rpx;
				color: #333333;
			}
		}
		.buttonBox{
			margin-top: 162rpx;
			width: calc(100% - 60rpx);
			button{
				margin-left: 30rpx;
				margin-top: 24rpx;
			}
		}
	}
</style>