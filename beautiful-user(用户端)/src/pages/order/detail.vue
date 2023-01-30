<template>
	<view class="detail">
		<view class="warp" v-if="detailData">
			<view class="title m-b-10">
				<view
					class="title-content"
					:class="[
						detailData.orderStatus == 100 ||
						detailData.orderStatus == 1100 ||
						detailData.orderStatus == 1300
							? 'activeStatus'
							: 'uncheckedStyle',
					]"
				>
					{{ detailData.orderStatusTxt }}
				</view>
			</view>
			<view class="product m-b-10">
				<view class="product-top flex-no-horizontal" v-for="(item, index) in detailData.product" :key="index">
					<view class="product-top-img">
						<u--image :src="item.coverImg" width="60px" height="60px" radius="8px"></u--image>
					</view>
					<view class="product-top-nameAndPrice">
						<view class="product-top-nameAndPrice-name flex">
							<view class="ptnn-name font-16">
								{{ item.productName }}
							</view>
							<view class="ptnn-nums font-14"> x {{ item.productNumber }} </view>
						</view>
						<view class="flex">
							<view class="product-top-nameAndPrice-price font-16 flex-no-horizontal">
								<view class="m-r-5">
									<u--image src="/static/detail/time-icon.png" width="13" height="13"></u--image>
								</view>
								<view class="font-12">
									{{ detailData.server && detailData.server.serverTime }}分钟
								</view>
							</view>
							<view class="font-14 weight-400" style="color: rgba(185, 185, 185, 1)">
								￥{{ item.productPrice }}
							</view>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in showLabel" :key="index + 'label'">
					<view class="product-item flex">
						<view class="product-item-left font-14">
							{{ item.label }}
						</view>
						<view v-if="item.label === '服务技师'" class="product-item-right font-14 flex-no-horizontal">
							<view style="margin-right: 10rpx" v-if="detailData.server">
								<u--image :src="detailData.server.head" width="28px" height="28px" shape="circle">
								</u--image>
							</view>
							{{ detailData.server && detailData.server.name }}
						</view>
						<view
							v-else-if="item.label === '技师电话'"
							class="product-item-right font-14 flex"
							@click="callPhone(detailData.orderNo)"
						>
							致电技师<u-icon name="phone-fill" color="rgba(81, 81, 81, 1)" size="15"></u-icon>
						</view>
						<view
							v-else-if="item.label === '优惠券'"
							style="color: #ff1e00"
							class="product-item-right font-14"
						>
							- ¥ {{ item.value }}
						</view>
						<view v-else class="product-item-right font-14">
							{{ item.value }}
						</view>
					</view>
				</view>

				<u-divider :dashed="true" lineColor="rgba(178, 178, 178, 1)"></u-divider>
				<view class="product-item flex">
					<view class="product-item-left font-16 font-bold" style="color: rgba(51, 51, 51, 1)">
						费用总计
					</view>
					<view class="product-item-right font-16 font-bold" style="color: rgba(255, 30, 0, 1)">
						￥{{ detailData.payAmount }}
					</view>
				</view>
			</view>
			<view class="product">
				<view class="product-item flex">
					<view class="product-item-left font-14"> 订单编号 </view>
					<view class="product-item-right font-14">
						{{ detailData.orderNo }}
						<text class="copy" @click="paste(detailData.orderNo)">复制</text>
					</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14"> 下单时间 </view>
					<view class="product-item-right font-14">
						{{ detailData.createTime }}
					</view>
				</view>
				<view class="product-item flex" v-if="!noPhone.some(v => v === detailData.orderStatus)">
					<view class="product-item-left font-14"> 联系方式 </view>
					<view class="product-item-right font-14">
						{{ detailData.server && detailData.server.serverAddress.mobile }}
					</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14"> 预约时间 </view>
					<view class="product-item-right font-14">
						{{ detailData.server && detailData.server.yuYueTime }}
					</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14"> 下单人 </view>
					<view class="product-item-right font-14">
						{{ detailData.server && detailData.server.serverAddress.username }}
					</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14" v-if="detailData.server" style="min-width: 25%">
						服务地址
					</view>
					<view class="product-item-right font-14" style="width: 75%">
						{{ detailData.server && detailData.server.serverAddress.city }}
						{{ detailData.server && detailData.server.serverAddress.county }}
						{{ detailData.server && detailData.server.serverAddress.address }}
						{{ detailData.server && detailData.server.serverAddress.houseNumber }}
					</view>
				</view>
			</view>
		</view>
		<view class="" style="height: 120rpx"> </view>
		<view class="item-footer flex">
			<u-button
				class="item-footer-btn-cancelPay flex-no-horizontal font-16"
				shape="circle"
				:plain="true"
				v-if="detailData.orderStatus == 100"
				type="primary"
				text="取消支付"
				@click="cancelClick()"
			></u-button>
			<u-button
				class="item-footer-btn-pay font-16"
				shape="circle"
				type="primary"
				v-if="detailData.orderStatus == 100"
				text="立即支付"
				@click="nowPayClick()"
			></u-button>
			<u-button
				class="item-footer-btn-cancelPay font-16 flex-no-horizontal"
				shape="circle"
				:plain="true"
				type="primary"
				v-if="detailData.orderStatus == 1100"
				text="取消订单"
				@click="cancelClick"
			></u-button>
			<u-button
				class="item-footer-btn-cancel font-16 flex-no-horizontal"
				:class="[detailData.score == '0.0' ? 'item-footer-btn-cancelPay' : 'item-footer-btn-cancel']"
				shape="circle"
				:plain="true"
				type="primary"
				v-if="
					(detailData.orderStatus == 1500 && detailData.score == '0.0') ||
					(detailData.orderStatus == 500 && detailData.score == '0.0')
				"
				@click="toEvaluate"
				text="去评价"
			></u-button>
			<u-button
				class="item-footer-btn-cancel font-16"
				:class="[detailData.orderStatus == 1400 ? 'item-footer-btn-cancelStyle' : 'item-footer-btn-cancel']"
				shape="circle"
				:plain="true"
				type="primary"
				v-if="detailData.orderStatus !== 100"
				@click="orderAgain"
				text="再次下单"
			></u-button>
			<u-button
				class="item-footer-btn-pay font-16"
				shape="circle"
				:plain="true"
				type="primary"
				v-if="detailData.orderStatus == 1400"
				text="确认完成"
				@click="completeBtn()"
			></u-button>
		</view>
		<u-modal
			:show="modalShow"
			showCancelButton
			closeOnClickOverlay
			:content="modalContent"
			@confirm="confirmCancel"
			@cancel="modalShow = false"
			@close="modalShow = false"
		></u-modal>
	</view>
</template>

<script>
import { orderListApi, cancelOrder, detailOrder, getVirtualNumberApi } from '@/api/order.js';
import { weChatH5Pay, weChatH5config } from '@/utility/wechat';
import { payOrderApi, userAssets, userFinish } from '@/api/user.js';
export default {
	data() {
		return {
			btnLoadingShow: false,
			modalShow: false,
			modalContent: '您确定要取消订单吗？',
			detailData: {},
			detailLabel: [
				{
					label: '服务技师',
					value: '',
					style: '',
				},
				{
					label: '出行方式',
					value: '',
					style: '',
				},
				{
					label: '技师电话',
					value: '',
					style: '',
				},
				{
					label: '出行距离',
					value: '',
					style: '',
				},
				{
					label: '服务时长',
					value: '',
					style: '',
				},
				{
					label: '项目费用',
					value: '',
					style: '',
				},
				{
					label: '出行费用',
					value: '',
					style: '',
				},
				{
					label: '优惠券',
					value: '',
					style: '',
				},
			],
			// 订单详情中不显示联系方式的code
			noPhone: [100, 300, 400],
		};
	},
	onLoad: function (option) {
		this.getDetail(option.orderNo);
		// weChatH5config()
	},
	onPullDownRefresh() {
		this.getDetail(this.detailData?.orderNo);
	},
	computed: {
		showLabel() {
			let arr = [];
			const noPhoneCode = [100, 300, 400];
			const haveIt = noPhoneCode.some(v => v === this.detailData.orderStatus);
			if (haveIt) {
				this.detailLabel.forEach(item => {
					if (item.label !== '技师电话') {
						arr.push(item);
					}
				});
			} else {
				arr = this.detailLabel;
			}
			return arr;
		},
	},
	methods: {
		// 获取详情数据
		async getDetail(orderNo) {
			try {
				let res = await detailOrder({
					orderNo: orderNo,
				});
				this.detailData = res.data;
				this.detailLabel = [
					{
						label: '服务技师',
						value: '',
					},
					{
						label: '出行方式',
						value: this.detailData.traffic.trafficTypeName || '',
					},
					{
						label: '技师电话',
						value: this.detailData.orderNo || '',
					},
					{
						label: '出行距离',
						value: this.detailData.traffic.distance || '',
					},
					{
						label: '服务时长',
						value: (this.detailData.server.serverTime || '') + '分钟',
					},
					{
						label: '项目费用',
						value: '¥ ' + (this.detailData.productAmount || ''),
					},
					{
						label: '出行费用',
						value: '¥ ' + (this.detailData.traffic.trafficFee || ''),
					},
					{
						label: '优惠券',
						value: this.detailData.coupon.amount || '',
					},
				];
			} catch (e) {
				this.failMessage({
					msg: e.msg,
				});
				//TODO handle the exception
			} finally {
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 500);
			}
		},
		// 去支付
		async nowPayClick() {
			try {
				uni.showLoading({
					title: '请稍后',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 2000);
				//获取支付数据
				const payOrderRes = await payOrderApi({
					payNo: this.detailData.payInfo.payNo,
				});
				let payRes = await weChatH5Pay(payOrderRes);
				setTimeout(() => {
					this.btnLoadingShow = false;
					this.btnText = '支付成功';
				}, 800);
				setTimeout(() => {
					uni.reLaunch({
						url: `/pages/order/pay-success?orderNo=${this.detailData.orderNo}&totalPrice=${this.detailData.productAmount}`,
					});
				}, 800);
			} catch (e) {
				//TODO handle the exception
				if (e.errMsg === 'requestPayment:fail cancel') {
					this.failMessage({
						msg: '取消支付',
					});
				} else {
					this.failMessage(e);
				}
			}
		},
		// 确认完成
		async completeBtn() {
			let res = await userFinish({
				orderNo: this.detailData.orderNo,
			});
			this.failMessage({
				msg: '操作成功',
			});
			this.getDetail(this.detailData?.orderNo);
		},
		// 去评价
		toEvaluate() {
			uni.navigateTo({
				url: `./evaluate?orderNo=${this.detailData.orderNo}`,
			});
			this.getDetail(this.detailData?.orderNo);
		},
		// 再次下单
		orderAgain() {
			uni.switchTab({
				url: '/pages/technician/list',
			});
		},
		// 取消二次确认
		async cancelClick() {
			this.modalShow = true;
		},
		async confirmCancel() {
			try {
				this.modalShow = false;
				let res = await cancelOrder({
					orderNo: this.detailData.orderNo,
				});
				this.getDetail(this.detailData?.orderNo);
			} catch (error) {
				this.failMessage(error);
			}
		},
		async callPhone(orderNo) {
			let platform = uni.getSystemInfoSync().platform;
			try {
				// 虚拟号
				const virtualRes = await getVirtualNumberApi({
					orderNo: orderNo,
					userType: 1,
				});
				await uni.makePhoneCall({
					phoneNumber: virtualRes.data.middleNumber,
				});
			} catch (e) {
				this.failMessage({
					msg: e.msg,
				});
			}
		},
		// 复制单号
		paste(val) {
			uni.setClipboardData({
				data: val,
			});
		},
	},
};
</script>
<style>
page {
	background-color: rgba(248, 248, 248, 1);
}
</style>
<style lang="scss">
.detail {
	position: relative;

	.warp {
		padding: 20rpx 30rpx;

		.activeStatus {
			color: rgba(253, 120, 15, 1);
		}

		.uncheckedStyle {
			color: rgba(107, 187, 42, 1);
		}

		.title {
			padding: 28rpx 24rpx;
			border-radius: 20rpx;
			background-color: rgba(255, 255, 255, 1);

			.title-content {
				font-size: 40rpx;
				// color: rgba(73, 145, 154, 1);
			}

			.title-subhead {
				color: rgba(102, 102, 102, 1);
			}
		}

		.product {
			padding: 8rpx 24rpx;
			border-radius: 20rpx;
			background-color: rgba(255, 255, 255, 1);

			.product-top {
				margin: 20rpx 0;
				flex: 1;

				&-img {
					margin-right: 20rpx;
					flex: 0.2;
				}

				&-nameAndPrice {
					flex: 0.8;

					&-name {
						margin-bottom: 24rpx;

						.ptnn-name {
							color: rgba(51, 51, 51, 1);
						}

						.ptnn-nums {
							color: rgba(185, 185, 185, 1);
						}
					}

					&-price {
						color: rgba(51, 51, 51, 1);
					}
				}
			}

			.product-item {
				margin: 24rpx 0;

				&-left {
					color: rgba(153, 153, 153, 1);
				}

				&-right {
					display: flex;
					justify-content: flex-end;
					color: rgba(51, 51, 51, 1);
					text-align: end;
				}
			}
		}
	}

	.item-footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		height: 128rpx;
		background: rgba(255, 255, 255, 1);
		text-align: center;
		z-index: 9999;

		.item-footer-btn-cancel {
			width: 690rpx;
			height: 80rpx;
			border-radius: 40rpx;
			color: rgba(253, 120, 15, 1);
			border: 2rpx solid rgba(253, 120, 15, 1);
			margin: 0 16rpx;

			::v-deep .u-button__text {
				font-size: 32rpx !important;
			}
		}

		.item-footer-btn-pay {
			width: 690rpx;
			height: 80rpx;
			border-radius: 40rpx;
			color: rgba(255, 255, 255, 1);
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			border: 2rpx solid rgba(253, 120, 15, 1);
			margin: 0 20rpx 0 20rpx;

			::v-deep .u-button__text {
				font-size: 32rpx !important;
			}
		}

		.item-footer-btn-cancelPay {
			width: 330rpx;
			height: 80rpx;
			background: rgba(255, 255, 255, 1);
			color: rgba(153, 153, 153, 1);
			border-radius: 40rpx;
			border: 2rpx solid rgba(153, 153, 153, 1);
			margin: 0 16rpx;

			::v-deep .u-button__text {
				font-size: 32rpx !important;
			}
		}

		.item-footer-btn-cancelStyle {
			width: 330rpx;
			height: 80rpx;
			border-radius: 40rpx;
			color: rgba(253, 120, 15, 1);
			border: 2rpx solid rgba(253, 120, 15, 1);
			margin: 0 16rpx;

			::v-deep .u-button__text {
				font-size: 32rpx !important;
			}
		}
	}

	.btn-box {
		padding: 20rpx 30rpx;

		&-pay {
			border: 0;
			border-radius: 40rpx;
			background-color: rgba(76, 201, 141, 1);
		}
	}
}

.copy {
	margin-left: 14rpx;
	font-size: 16rpx;
	color: #515151;
	padding: 4rpx 8rpx;
	border-radius: 14px;
	border: 1px solid #999999;
}
</style>
