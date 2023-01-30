<template>
	<view class="product">
		<view class="product-img" v-if="productDetailList.productImg">
			<u-swiper
				:list="productDetailList.productImg"
				indicator
				:autoplay="true"
				radius="0"
				indicatorMode="dot"
				height="578rpx"
				@click="swiperClick"
			></u-swiper>
		</view>
		<view class="product-item">
			<view class="product-Information">
				<view class="product-name">
					<text class="name">{{ productDetailList.productName }}</text>
					<text class="serverNumber">{{ productDetailList.totalNumber }}人已选择</text>
				</view>
				<view class="product-tag">
					<view>
						<text style="color: #ff0000"
							>￥<span class="present-price">{{ productDetailList.salePrice }}</span></text
						>
						<text class="linePrice">{{ productDetailList.linePrice }}</text>
					</view>
					<view class="server-time">
						<u--image :src="'/static/detail/time-icon.png'" width="12" height="12"></u--image>
						<text>{{ '&nbsp;' + productDetailList.serverTime }}分钟</text>
					</view>
				</view>
				<view class="certification">
					<view class="certification-text">
						<u--image :src="'/static/detail/buy-icon.png'" width="56" height="37"></u--image>
					</view>
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
		</view>
		<view class="applicable-instructions">
			<text class="instructions-title">适用说明</text>
			<view class="instructions-suitExplain" v-for="(item, index) in productDetailList.suitExplain" :key="index">
				<text
					>{{ item.key }} <span class="instructions-item">{{ item.value }}</span></text
				>
			</view>
		</view>
		<view class="service-process" v-for="(item, inx) in productDetailList.productDetail" :key="inx">
			<u--image mode="widthFix" :src="item" width="100%" height=""></u--image>
		</view>
		<view class="" style="height: 120rpx"> </view>
		<view class="select-technician">
			<u-button text="选择技师" @click="selectTechnician"></u-button>
		</view>
	</view>
</template>
<script>
import { productDetailApi } from '@/api/product.js';
import { mapState, mapMutations } from 'vuex';
export default {
	props: {
		show: Boolean,
	},
	data() {
		return {
			productDetailList: [],
			productGuid: '',
		};
	},
	onLoad: function (option) {
		//option为object类型，会序列化上个页面传递的参数
		this.productGuid = option.productGuid;
		this.getProductDetail();
	},
	onPullDownRefresh() {
		this.getProductDetail();
	},
	methods: {
		...mapMutations(['setProductStatus']),
		selectTechnician() {
			this.setProductStatus(this.productGuid);
			uni.switchTab({
				url: '/pages/technician/list',
			});
		},
		async getProductDetail() {
			try {
				let res = await productDetailApi({ guid: this.productGuid });
				this.productDetailList = res.data;
			} catch (e) {
				this.failMessage(e);
				//TODO handle the exception
			} finally {
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 500);
			}
		},
	},
};
</script>
<style lang="scss">
.uni-page-head .uni-page-wrapper {
	height: 100% !important;
}
.product {
	display: flex;
	flex-direction: column;
	background: #f5f8fa;
	.product-img {
		width: 100%;
		height: 578rpx;
		::v-deep .u-swiper__wrapper__item__wrapper__image div {
			background-size: 100% 100% !important;
		}
		::v-deep .u-swiper {
			height: 100%;
		}
	}
	.product-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 304rpx;
		background: #ffffff;
		border-radius: 20rpx;
		opacity: 1;
		margin-top: 22rpx;
		.product-Information {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 28rpx;
			.product-name {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				height: 60rpx;
				align-items: center;
				.name {
					font-size: 40rpx;
					font-weight: bold;
					color: #333333;
				}
				.serverNumber {
					font-size: 20rpx;
					font-weight: 400;
					color: #999999;
				}
			}
			.product-tag {
				display: flex;
				justify-content: space-between;
				height: 50rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
				line-height: 50rpx;
				margin-top: 20rpx;
				.present-price {
					font-size: 44rpx;
					font-weight: bold;
					color: #ff0000;
				}
				.linePrice {
					// width: 27px;
					height: 40rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: #999999;
					line-height: 40rpx;
					margin: 0 10rpx;
					text-decoration: line-through; // 加划线
				}
				.server-time {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
				}
			}
		}
	}
	// 适用说明
	.applicable-instructions {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		// height: 212rpx;
		margin: 20rpx 0;
		background: #ffffff;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		padding: 28rpx 30rpx;
		.instructions-title {
			padding-bottom: 16rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}
		.instructions-suitExplain {
			margin-bottom: 12rpx;
			font-size: 28rpx;
			color: rgba(153, 153, 153, 1);
			font-weight: 400;
		}
		.instructions-item {
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			padding-left: 20rpx;
		}
	}
	// 服务流程
	.service-process {
		height: auto;
		::v-deep .u-image__image div {
			background-size: 100% 100% !important;
		}
	}
	// 选择技师按钮
	.select-technician {
		width: 100%;
		position: fixed;
		bottom: 0;
		height: 120rpx;
		overflow: hidden;
		line-height: 120rpx;
		background: rgba(255, 255, 255, 1);
		// background: #FE584A;
		text-align: center;
		// padding: 0 30rpx;
		.u-button--info {
			height: 88rpx;
			width: 690rpx;
			margin-top: 16rpx;
			margin-bottom: 16rpx;
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			color: #fff;
			border-radius: 44rpx;
			font-size: 32rpx;
		}
		@media screen and (width: 1600rpx) {
			::v-deepuni-button {
				margin-left: 0 !important;
			}
		}
	}
	.certification {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 0 25rpx;
		height: 74rpx;
		background: #fff8f8;
		border-radius: 19px 19px 19px 19px;
		margin-top: 46rpx;
		line-height: 74rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #333333;
		.certification-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 74rpx;
		}
		.certification-text {
			color: #fe584a;
			font-weight: bold;
			font-size: 32rpx;
			// background-size: 100% 100%;
			::v-deep .u-image__image div {
				background-size: 100% !important;
			}
		}
	}
}
</style>
