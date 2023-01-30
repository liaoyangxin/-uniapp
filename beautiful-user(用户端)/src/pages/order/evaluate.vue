<template>
	<view>
		<view class="warp">
			<view class="main">
				<view class="main-title font-16">发表评价</view>
				<view class="main-product">
					<view class="main-product-content flex-no-horizontal" v-for="(item, index) in detail.product" :key="index">
						<view class="main-product-content-img flex-no-horizontal"><u--image :src="item.coverImg" width="60" height="60" radius="8"></u--image></view>
						<view class="main-product-content-namePrice">
							<view class="mpcn-name flex">
								<view class="name font-16">{{ item.productName }}</view>
								<view class="nums font-12">x{{ item.productNumber }}</view>
							</view>
							<view class="mpcn-price font-16">￥{{ item.productPrice }}</view>
						</view>
					</view>
					<view class="main-product-technician flex">
						<view class="main-product-technician-title font-14">服务技师</view>
						<view class="main-product-technician-name flex font-14">
							<view style="margin-right: 10rpx;"><u--image :src="detail.server.head" width="28" height="28" shape="circle"></u--image></view>
							{{ detail.server.name }}
						</view>
					</view>
				</view>
				<view class="main-evaluate flex-no-horizontal font-16">
					总分
					<u-rate v-model="score" active-color="rgba(255, 0, 0, 1)" inactive-color="#b2b2b2" allowHalf gutter="16" size="25" @change="rateChange"></u-rate>
					<text class="main-evaluate-text font-14">{{ rateText }}分</text>
				</view>
			</view>
			<view class="btn-box"><u-button class="btn-box-pay font-16" :loading="btnLoadingShow" type="primary" :text="btnText" @click="submitSocre"></u-button></view>
		</view>
	</view>
</template>

<script>
import { evaluateApi, orderDetailApi } from '../../api/order';
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			rateText: 5,
			btnLoadingShow: false,
			btnText: '立即提交',
			orderNo: '',
			score: 5,
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
					name: ''
				}
			}
		};
	},
	onLoad(option) {
		if (option.orderNo) {
			this.orderNo = option.orderNo;
		}
		this.getOrderDetail()
	},
	methods: {
		...mapMutations(['setEvaluate']),
		rateChange(e) {
			this.rateText = e;
		},
		// 评分
		async submitSocre() {
			try {
				this.btnLoadingShow = true;
				this.btnText = '请稍后...';
				await evaluateApi({
					orderNo: this.orderNo,
					score: this.score
				});
				this.btnLoadingShow = false;
				this.btnText = '提交成功';
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/order/list'
					});
				}, 800);
				this.setEvaluate(true)
				
			} catch (e) {
				this.failMessage({
					msg: e.msg
				});
				//TODO handle the exception
			}
		},
		async getOrderDetail() {
			try {
				const res = await orderDetailApi({
					orderNo: this.orderNo
				});
				this.detail = res.data;
			} catch (e) {
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
			border-bottom: 1rpx solid #f2f2f2;
			color: rgba(51, 51, 51, 1);
		}
		&-product {
			&-content {
				padding: 40rpx 0;
				flex: 1;
				&-img {
					flex: 0.2;
					justify-content: center;
				}
				&-namePrice {
					flex: 0.8;
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
						color: rgba(51, 51, 51, 1);
					}
				}
			}
			&-technician {
				padding-bottom: 36rpx;
				border-bottom: 1rpx solid #f2f2f2;
				margin-bottom: 38rpx;
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
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
		}
	}
}
</style>
<style>
page {
	background-color: rgba(248, 248, 248, 1);
}
</style>
