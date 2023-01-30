<template>
	<view>
		<view class="wrap">
			<view class="icon flex-no-horizontal"><u-icon name="checkmark-circle-fill" color="rgba(107, 187, 42, 1)" size="88"></u-icon></view>
			<view class="text font-18">支付成功</view>
			<view class="price font-bold">￥{{price}}</view>
			<view class="subhead font-16">订单编号：{{orderId}}</view>
			<view class="btn-box">
				
				<u-button class="btn-hover" type="primary" v-if="time">{{ time ? time : '' }} 返回查看用户详情</u-button>
				<u-button class="btn" type="primary" v-else @click="toBack">{{ time ? time : '' }} 返回查看用户详情</u-button>
			</view>
			<!-- 有用，不显示而已。 -->
			<u-count-down :time="6000" format="ss" @change="countDownChang">
				<text class="time">5</text>
			</u-count-down>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			time: 5,
			orderId:'',
			price:''
		};
	},
	onLoad(e) {
		if(e){
			this.orderId = e.orderId
			this.price = e.price
		}
	},
	methods: {
		countDownChang(e) {
			this.time = e.seconds;
		},
		toBack(){
			uni.switchTab({
				url:'/pages/user/user'
			})
		},
	}
};
</script>

<style lang="scss">
.wrap {
	.icon {
		margin-top: 120rpx;
		justify-content: center;
	}
	.text {
		margin: 30rpx 0 12rpx 0;
		text-align: center;
		color: rgba(51, 51, 51, 1);
	}
	.price {
		text-align: center;
		font-size: 48rpx;
	}
	.subhead {
		margin-top: 56rpx;
		text-align: center;
		color: rgba(153, 153, 153, 1);
	}
	.time{
		color: rgba(255, 255, 255, 1);
	}
	.btn-box {
		padding: 20rpx 100rpx;
		margin-top: 200rpx;
		.btn {
			border: 0;
			border-radius: 40rpx;
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
		}
		.btn-hover{
			border-radius: 40rpx;
			background-color: rgba(235, 235, 235, 1);
			border: 0;
			color: rgba(153, 153, 153, 1);
		}
	}
}
</style>
