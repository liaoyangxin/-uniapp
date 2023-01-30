<template>
	<view>
		<view class="warp">
			<view class="main">
				<view class="main-title font-16">订单评价</view>
				<view class="main-product">
					<view class="main-product-content flex" v-for="(item,index) in detail.product" :key="index">
						<view class="main-product-content-img flex-no-horizontal">
							<u--image :src="item.productImg[0] | setCdnImgSize" v-if="item.productImg[0]" width="60" height="60" radius="8"></u--image>
						</view>
						<view class="main-product-content-namePrice">
							<view class="mpcn-name flex">
								<view class="name font-16">{{item.productName}}</view>
								<view class="nums font-12">x{{item.productNumber}}</view>
							</view>
							<view class="mpcn-price font-14">￥{{item.productPrice}}</view>
						</view>
					</view>
					<view class="main-product-technician flex">
						<view class="main-product-technician-title font-14">服务技师</view>
						<view class="main-product-technician-name flex font-14">
							<view style="margin-right: 10rpx;">
								<u--image :src="detail.server.head" width="28" height="28" shape="circle"></u--image>
							</view>
							{{detail.server.name}}
						</view>
					</view>
				</view>
				<view class="main-evaluate flex-no-horizontal font-16">
					总分
					<u-rate v-model="rateNum" readonly active-color="rgba(255, 0, 0, 1)" inactive-color="#b2b2b2" allowHalf gutter="16" size="25" @change="rateChange"></u-rate>
					<text class="main-evaluate-text font-14">{{ rateText }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getOrderDetailApi,getOrderRateApi } from '../../api/order';
export default {
	data() {
		return {
			rateText: '非常好',
			orderNo: '',
			rateNum: 5,
			detail: {
				product: [
					{
						productName: '',
						productPrice: '',
						productNumber: '',
						productImg: []
					}
				],
				server: {
					head: '',
					name:''
				}
			}
		};
	},
	onLoad(option) {
		if(option.orderNo){
			this.orderNo = option.orderNo;
			this.getOrderDetail()
			this.getOrderRate()
		}
	},
	methods: {
		rateChange(e) {
			switch (e) {
				case 1:
					this.rateText = '非常差';
					break;
				case 2:
					this.rateText = '差';
					break;
				case 3:
					this.rateText = '一般';
					break;
				case 4:
					this.rateText = '好';
					break;
				case 5:
					this.rateText = '非常好';
					break;
				default:
					break;
			}
		},
		async getOrderDetail() {
			try {
				const res = await getOrderDetailApi({
					orderNo: this.orderNo
				});
				this.detail = res.data
			} catch (e) {
				this.failMessage(e);
			}
		},
		async getOrderRate(){
			try{
				const res = await getOrderRateApi({
					orderNo: this.orderNo
				})
				this.rateNum = res.data.score
				this.rateChange(parseFloat(res.data.score))
			}catch(e){
				this.failMessage(e);
			}
		}
	}
};
</script>

<style lang="scss">
.warp {
	padding: 20rpx 30rpx;
	.main {
		padding: 30rpx 24rpx;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 1);
		&-title {
			padding-bottom: 30rpx;
			margin-bottom: 10rpx;
			border-bottom: 2rpx solid rgba(242,242,242,1);
			color: rgba(51, 51, 51, 1);
		}
		&-product {
			&-content {
				padding-top: 30rpx;
				flex: 1;
				&-img {
					flex: 0.2;
					justify-content: center;
				}
				&-namePrice {
					flex: 0.78;
					.mpcn-name {
						margin-bottom: 24rpx;
						.name {
							color: rgba(51, 51, 51, 1);
						}
						.nums {
							color: rgba(185, 185, 185, 1);
						}
					}
					.mpcn-price {
						color: rgba(185, 185, 185, 1);
					}
				}
			}
			&-technician {
				padding: 30rpx 0;
				margin-bottom: 30rpx;
				border-bottom: 2rpx solid rgba(242,242,242,1);
				&-title {
					color: rgba(153, 153, 153, 1);
				}
				&-name {
					color: rgba(51, 51, 51, 1);
				}
			}
		}
		&-evaluate {
			color: rgba(51, 51, 51, 1);
			&-text {
				color: rgba(51, 51, 51, 1);
			}
		}
	}
	.btn-box {
		margin-top: 60rpx;
		&-pay {
			border: 0;
			border-radius: 40rpx;
			background-color: rgba(107, 187, 42, 1);
		}
	}
}
</style>
<style>
page {
	background-color: rgba(248, 248, 248, 1);
}
</style>
