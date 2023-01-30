<template>
	<u-popup :show="show" :round="10" mode="bottom" @close="close" @open="open">
		<view class="technician">
			<view class="technician-item">
				<view class="technician-img">
					<u--image
						:showLoading="true"
						:src="detailData.headImg"
						width="80"
						height="80"
						radius="50%"
					></u--image>
				</view>
				<view class="technician-Information">
					<view class="technician-Information-item">
						<view class="technician-name">
							<text class="text">{{ detailData.name }}</text>
							<u--image src="/static/technician/photo-icon.png" width="24" height="24"></u--image>
						</view>
						<view class="score">
							<u-icon name="star-fill" color="#FF1F00" size="20"></u-icon>
							<span>{{ Number(detailData.score).toFixed(1) }}</span>
						</view>
					</view>
					<view class="personal-profile"
						><text>{{ detailData.userDesc }}</text></view
					>
				</view>
			</view>
			<view class="certification">
				<view class="certification-item">
					<u--image :src="'/static/detail/ren-icon.png'" width="24" height="24"></u--image>
					<text>实名认证</text>
				</view>
				<view class="certification-item">
					<u--image :src="'/static/detail/xin-icon.png'" width="24" height="24"></u--image>
					<text>爽约包退</text>
				</view>
				<view class="certification-item">
					<u--image :src="'/static/detail/zhengshu-icon.png'" width="24" height="24"></u--image>
					<text>资质证书</text>
				</view>
			</view>
		</view>
		<scroll-view :scroll-y="true" style="height: 540rpx" class="product">
			<view class="product-item" v-for="(item, index) in detailData.product" :key="index">
				<view class="product-img">
					<u--image
						:showLoading="true"
						:src="item.coverImg | setCdnImgSize('88')"
						width="156rpx"
						height="156rpx"
						radius="20rpx"
					></u--image>
				</view>
				<view class="product-Information">
					<view class="product-name">
						<text class="name">{{ item.productName }}</text>
					</view>
					<view class="product-tag">
						<view class="serverTime">
							<view class="serverNumber">{{ item.totalNumber }} 人已选择</view>
						</view>

						<view class="numberBoxStyle">
							<u--image
								:src="'/static/order/minus-icon.png'"
								width="48rpx"
								height="48rpx"
								radius="20rpx"
								@click="changeNumber(item, 'minus')"
							></u--image>
							<view class="p-l-10 p-r-10">
								{{ item.value || 0 }}
							</view>
							<u--image
								:src="'/static/order/plus-icon.png'"
								width="48rpx"
								height="48rpx"
								radius="20rpx"
								@click="changeNumber(item, 'plus')"
							></u--image>
							<!-- <u-number-box class="numberStyle" v-model="item.value" iconStyle="font-weight:bold !important;" :disabledInput="true" :min="0" button-size="22"></u-number-box> -->
						</view>
					</view>
					<view class="product-price flex-no-end">
						<view class="present-price flex-no-end">
							<text class="font-14 font-bold" style="height: 40rpx; line-height: 48rpx">￥</text>
							<text class="salePrice font-18 font-bold" style="height: 40rpx; line-height: 46rpx">{{
								item.salePrice
							}}</text>
						</view>
						<text class="original-price">￥{{ item.linePrice }}</text>
						<view class="flex-no-end font-12" style="color: rgba(153, 153, 153, 1)">
							<u--image
								src="/static/detail/time-icon.png"
								width="13"
								height="13"
								shape="circle"
								style="padding-right: 6rpx; padding-bottom: 2rpx"
							></u--image>
							{{ item.serverTime }}分钟
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="settlement-limit">
			<view class="settlement-pay">
				<text class="totalNumber">
					合计: ￥
					<span class="settlement">{{ totalAmount }}</span>
				</text>

				<text class="submit" @click="placeOrder">提交订单</text>
			</view>
		</view>
		sss
	</u-popup>
</template>
<script>
import { technicianDetailApi } from '@/api/technician.js';
import { addPrecision, mulPrecision } from '@/utility/accuracy.js';
// import uText from '../../../uni_modules/uview-ui/components/u--text/u--text.vue';
import { mapMutations } from 'vuex';
export default {
	// components: { uText },
	props: {
		show: Boolean,
		_technicianGuid: String,
	},

	watch: {
		show: {
			handler(newVal) {
				console.log(newVal, '11');
			},
		},
	},
	data() {
		return {
			detailData: {},
		};
	},
	computed: {
		totalAmount() {
			let amount = 0;
			this.detailData?.product?.forEach(item => {
				amount = addPrecision(amount, mulPrecision(item.value || 0, item.salePrice * 1));
			});
			return amount;
		},
	},
	onLoad() {
		this.getdetail();
		this.delProductDetail(); //清空
	},
	methods: {
		...mapMutations(['setProductDetail', 'delProductDetail', 'delSelectTravel']),
		open() {
			this.getdetail();
		},
		close() {
			this.$emit('closePopup', false);
		},
		// 技师详情数据
		async getdetail() {
			try {
				let res = await technicianDetailApi({ guid: this._technicianGuid });
				this.detailData = res.data;
			} catch (e) {
				this.failMessage({
					msg: e.msg,
				});
			}
		},
		changeNumber(item, type) {
			this.detailData.product = this.detailData.product.map(v => {
				if (v.guid === item.guid) {
					if (type === 'minus') {
						v.value = v.value ? v.value - 1 : 0;
					} else {
						v.value = v.value ? v.value + 1 : 1;
					}
				}
				return v;
			});
		},
		// 提交订单
		placeOrder() {
			this.delSelectTravel();
			this.detailData.totalAmount = this.totalAmount;
			this.detailData.technicianGuid = this._technicianGuid;
			let orderParams = JSON.parse(JSON.stringify(this.detailData));
			orderParams.product = orderParams.product.filter(item => item.value);

			if (orderParams.product.some(item => item.value)) {
				this.setProductDetail(orderParams);
				uni.navigateTo({
					url: '../order/submit-order?debug=1',
				});
				// this.close()
			} else {
				this.failMessage({
					msg: '请选择服务项目',
				});
			}
		},
	},
};
</script>
<style lang="scss">
.uicon-close {
	top: -20rpx !important;
	right: 0;
}
.numberStyle {
	display: flex;
	align-items: center;
	::v-deep .u-number-box__minus {
		display: flex;
		align-items: center;
		width: 44rpx;
		border-radius: 50%;
		background: #fff !important;
		border: 2rpx solid #b4b4b4;

		.u-icon__icon {
			height: 5rpx;
			border-radius: 30%;
			background: #b4b4b4;
			font-size: 20rpx !important;
			color: #b4b4b4 !important;
			font-weight: bolder !important;
		}
	}

	::v-deep .u-number-box__plus {
		display: flex;
		align-items: center;
		width: 44rpx;
		border-radius: 50%;
		background: linear-gradient(180deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%) !important;
		border: 2rpx solid rgba(253, 120, 15, 1);
		// color: rgba(255, 255, 255, 1) !important;
		.u-icon__icon {
			height: 3rpx;
			background: rgba(255, 255, 255, 1);
			font-weight: bolder !important;
			font-size: 22rpx !important;
			color: rgba(255, 255, 255, 1) !important;
		}
	}
	::v-deep .u-number-box__input {
		background: none !important;
	}
}
::v-deep .u-popup__content {
	background: #f5f8fa;
}
.technician {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: #fff;
	border-radius: 20rpx;
	opacity: 1;
	border: 2rpx solid #ff7343;
	margin: 32rpx 30rpx 12rpx 30rpx;
	padding: 22rpx 28rpx 20rpx 28rpx;
	.technician-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		.technician-img {
			margin-right: 30rpx;
		}
		.technician-Information {
			display: flex;
			flex: 1;
			flex-direction: column;
			&-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				.score {
					display: flex !important;
					width: 200rpx;
					flex-wrap: nowrap;
					justify-content: flex-end;
					font-size: 28rpx;
					font-weight: 500;
					color: rgba(255, 29, 0, 1);
				}
				.technician-name {
					display: flex;
					justify-content: start;
					flex-direction: row;
					align-items: center;
					.text {
						max-width: 200rpx;
						overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
						text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
						white-space: nowrap;
					}
				}
			}
			.personal-profile {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				word-wrap: break-word;
				white-space: normal !important;
				//显示4行
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;
			}
		}
	}
	.certification {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 18rpx;
		width: 100%;
		height: 74rpx;
		background: rgba(255, 248, 248, 1);
		border-radius: 38rpx;
		line-height: 74rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		&-item {
			display: flex;
			align-items: center;
		}
	}
}
.product-item {
	display: flex;
	padding: 22rpx 18rpx;
	background: #ffffff;
	border-radius: 20rpx;
	opacity: 1;
	background: #fff;
	margin: 20rpx 30rpx;
	align-items: center;
	.product-Information {
		width: calc(100% - 180rpx);
		display: flex;
		flex-direction: column;
		// padding:12rpx 0 ;
		.product-name {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			height: 55rpx;
			padding-bottom: 8rpx;
			.name {
				max-width: 200rpx;
				padding-right: 14rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
		}
		.product-price {
			display: flex;
			flex-direction: row;
			justify-content: start;
			height: 50rpx;
			align-items: flex-end;

			.present-price {
				height: 40rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(255, 0, 0, 1);
			}
			.original-price {
				height: 40rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				line-height: 52rpx;
				margin: 0 10rpx;
				text-decoration: line-through; // 加划线
				// -webkit-background-clip: text;
			}
			.u-button--primary {
				display: flex;
				justify-content: flex-end;
				margin-right: 12rpx;
				width: 138rpx;
				height: 52rpx;
				background: linear-gradient(90deg, #fe564a 0%, #ff7642 100%);
				border-color: #fe564a;
			}
		}
		.product-tag {
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			height: 55rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			line-height: 50rpx;
			.serverTime {
				display: flex;
				align-items: flex-end;
				height: 50rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
			.serverNumber {
				display: flex;
				margin-left: 10rpx;
				height: 48rpx;
				font-size: 22rpx;
				font-weight: 400;
				color: #999999;
			}
			.numberBoxStyle {
				display: flex;
			}
		}
	}
	.product-img {
		width: 180rpx;
		display: flex;
	}
}
.settlement-limit {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	padding-bottom: 50rpx;
	height: 128rpx;
	background: rgba(255, 255, 255, 1);
	z-index: 9999;
	.settlement-pay {
		flex: 1;
		display: flex;
		justify-content: space-around;
		margin: 16rpx 30rpx 16rpx 30rpx;
		line-height: 90rpx;
		background: url(../../../static/button/pay-icon@2x.png) no-repeat;
		background-size: 100% 100%;
		.totalNumber {
			flex: 0.55;
			font-size: 28rpx;
			font-weight: 500;
			color: #ff0000;
			padding-left: 54rpx;
			line-height: 88rpx;
			.settlement {
				font-size: 44rpx;
				font-weight: bold;
				color: #ff0000;
			}
		}

		.submit {
			flex: 0.45;
			height: 88rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #ffffff;
			text-align: center;
			line-height: 88rpx;
		}
	}
}
</style>
