<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回
		顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :auto="false">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item m-15" v-for="(item, index) in dataList" :key="index">
				<view class="item-title flex m-b-10" @click="toDetail(item)">
					<view
						class="item-title-status font-16"
						:class="[item.orderStatus == 100 || item.orderStatus == 1100 || item.orderStatus == 1300 ? 'activeStatus' : 'uncheckedStyle']"
					>
						{{ item.orderStatusTxt }}
					</view>
					<view class="item-title-technician flex-no-horizontal font-14" v-if="item.technician">
						服务技师：{{ item.technician.name }}
						<view style="margin-left: 10rpx;"><u--image :src="item.technician.head" width="28px" height="28px" shape="circle"></u--image></view>
					</view>
				</view>
				<view class="item-main flex-no-horizontal m-b-10" v-for="(member, idx) in item.product" :key="idx" @click="toDetail(item)">
					<view class="item-main-goodsImg"><u--image :src="member.coverImg" width="60px" height="60px" radius="8px"></u--image></view>
					<view class="item-main-goods">
						<view class="item-main-goods-name flex">
							<view class="imgn-name font-16">{{ member.productName }}</view>
							<view class="imgn-nums font-12">×{{ member.productNumber }}</view>
						</view>
						<view class="item-main-goods-time  flex-no-horizontal">
							<view class="m-r-5"><u--image src="/static/detail/time-icon.png" width="13" height="13"></u--image></view>
							<view>
								<text class="tags-item font-12" style="width: 20%;">{{ item.serverTimeLen }}分钟</text>
							</view>
						</view>
					</view>
				</view>
				<view class="item-price flex font-16 m-b-10">
					<view class="item-price-time font-14">预约时间：{{ item.yuYueTime }}</view>
					<view class="item-price-amount">
						总额：
						<text class="item-price-orderAmount">￥{{ item.amount }}</text>
					</view>
				</view>
				<view class="item-footer flex-no-horizontal">
					<u-button
						class="item-footer-btn-cancelPay flex-no-horizontal font-14"
						shape="circle"
						:plain="true"
						v-if="item.orderStatus == 100"
						type="primary"
						text="取消支付"
						@click="cancelClick(item.orderNo)"
					></u-button>
					<u-button
						class="item-footer-btn-pay flex-no-horizontal font-14"
						shape="circle"
						type="primary"
						v-if="item.orderStatus == 100"
						text="立即支付"
						@click="payClick(item)"
					></u-button>
					<u-button
						class="item-footer-btn-again flex-no-horizontal font-14"
						shape="circle"
						:plain="true"
						type="primary"
						v-if="(item.orderStatus == 1500 && item.score == '0.0') || (item.orderStatus == 500 && item.score == '0.0')"
						text="立即评价"
						@click="toEvaluate(item)"
					></u-button>
					<u-button
						class="item-footer-btn-pay flex-no-horizontal font-14"
						shape="circle"
						:plain="true"
						type="primary"
						v-if="item.orderStatus == 1400"
						text="确认完成"
						@click="completeBtn(item)"
					></u-button>
					<!-- <u-button class="item-footer-btn-again flex-no-horizontal font-14" shape="circle" :plain="true" type="primary" v-if="item.orderStatus==1300" text="查看订单" @click="toDetail(item)"></u-button> -->
					<u-button
						class="item-footer-btn-cancelPay flex-no-horizontal font-14"
						shape="circle"
						:plain="true"
						type="primary"
						v-if="item.orderStatus == 1100"
						text="取消订单"
						@click="cancelClick(item.orderNo)"
					></u-button>
					<u-button
						class="item-footer-btn-again flex-no-horizontal font-14"
						style="margin-left: 10px"
						shape="circle"
						:plain="true"
						type="primary"
						v-if="item.orderStatus !== 100"
						@click="orderAgain"
						text="再次下单"
					></u-button>
				</view>
			</view>
		</z-paging>
		<!-- <u-popup :show="show" mode="bottom" :overlay="true" @close="close" @open="open" closeable :round="10">
			<view class="toPay">
				<text class="toPay-item">去支付</text>
				<text class="toPay-amount">￥{{orderInformation.amount}}</text>
			</view>
			<view class="popup-item flex-no-horizontal" @click="payMethods(payIndex='balance')" :class="[payIndex=='balance'?'checkActive':'popup-item']">
				<u--image :src="'/static/order/icon-balancePay.png'" width="30" height="30" class="p-l-10"></u--image>
				<text class="item-title-text font-16 p-l-10" style="color:rgba(102, 102, 102, 1)">我的余额</text>
				<text class="item-title-num font-12 p-l-10">( {{balance.totalAssets}} )</text>
			</view>
			<view class="popup-item flex-no-horizontal" @click="payMethods(payIndex='wechat')" :class="[payIndex=='wechat'?'checkActive':'popup-item']">
				<u--image :src="'/static/order/icon-wechatPay.png'" width="30" height="30" class="p-l-10"></u--image>
				<text class="item-title-text font-16 p-l-10">微信支付</text>
			</view>
		</u-popup> -->
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
import { orderListApi, cancelOrder, createOrder } from '@/api/order.js';
import { userFinish, payOrderApi, userAssets } from '@/api/user.js';
import { weChatH5Pay, weChatH5config } from '@/utility/wechat';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			dataList: [],
			firstLoaded: false,
			modalShow: false,
			modalContent: '您确定要取消订单吗？',
			orderNo: '',
			show: false,
			payIndex: '',
			orderInformation: {},
			balance: {}
		};
	},
	props: {
		//当前组件的index，也就是当前组件是swiper中的第几个
		tabIndex: {
			type: Number,
			default: function() {
				return 0;
			}
		},
		//当前swiper切换到第几个index
		currentIndex: {
			type: Number,
			default: function() {
				return 0;
			}
		}
	},
	watch: {
		currentIndex: {
			handler(newVal) {
				if (newVal === this.tabIndex) {
					//懒加载，当滑动到当前的item时，才去加载
					if (!this.firstLoaded) {
						setTimeout(() => {
							this.$refs.paging.reload();
						}, 100);
					}
				}
			},
			immediate: true
		},
		isEvaluate: {
			handler(newVal) {
				if (newVal && this.currentIndex === this.tabIndex) {
					this.$refs.paging.reload();
				}
			},
			immediate: true
		}
	},
	created() {
	},
	computed: {
		...mapState({
			isEvaluate: state => state.isEvaluate
		})
	},
	methods: {
		...mapMutations(['delEvaluate']),
		// 订单列表
		async queryList(pageNo, pageSize) {
			try {
				let res = await orderListApi({
					page: pageNo,
					rows: pageSize,
					orderStatus: this.tabIndex
				});
				this.$refs.paging.complete(res.data.data);
				this.firstLoaded = true;
			} catch (e) {
				//TODO handle the exception
				this.$refs.paging.complete(false);
			}
		},
		close() {
			this.show = false;
		},
		// 去评价
		toEvaluate(item) {
			uni.navigateTo({
				url: `./evaluate?orderNo=${item.orderNo}`
			});
			this.delEvaluate(false);
		},
		// 获取可提现余额
		async getUserAssets() {
			let res = await userAssets();
			this.balance = res.data;
		},
		orderAgain() {
			uni.switchTab({
				url: '/pages/technician/list'
			});
		},
		open() {},
		// 选择支付方式  第二期需要
		// async payMethods(status){
		// 	this.payIndex=status
		// 	try {

		// 		let obj={
		// 			product:[],
		// 			// trafficType:this.travelData=="公交/地铁"?"bus":"taxi",
		// 			yuYueTime:this.orderInformation.yuYueTime,
		// 			// serverAddress:this.selectAddress,
		// 			// serverPerson:this.orderInformation.artificer.guid,
		// 			cityCode:"510100",
		// 			totalPrice:this.orderInformation.amount,
		// 			payType:status==='wechat'?1:3
		// 		}
		// 		obj.product=this.orderList.product.map(item=>{
		// 			return {
		// 				guid:item.guid,
		// 				number:item.productNumber
		// 			}
		// 		})
		// 		// 创建订单
		// 		let res=await createOrder(obj);
		// 		uni.showLoading({
		// 			title: '请稍后'
		// 		});
		// 		setTimeout(() => {
		// 			uni.hideLoading();
		// 		}, 2000);

		// 		if(status==='wechat'){
		// 			uni.showLoading({
		// 				title: '请稍后'
		// 			});
		// 			setTimeout(() => {
		// 				uni.hideLoading();
		// 			}, 2000);
		// 			//获取支付数据
		// 			const payOrderRes = await payOrderApi({
		// 				payNo: this.orderInformation.payInfo.payNo
		// 			});
		// 			let payRes = await weChatH5Pay(payOrderRes)

		// 		}

		// 		this.failMessage({
		// 			msg: '支付成功'
		// 		});
		// 		// 支付成功进入成功页面
		// 		setTimeout(() => {
		// 			uni.reLaunch({
		// 				url:`/pages/order/pay-success?orderNo=${item.orderNo}&totalPrice=${item.productAmount}`
		// 			});
		// 			this.$refs.paging.reload();
		// 		}, 800);
		// 	} catch (e) {
		// 		if (e.errMsg === 'requestPayment:fail cancel') {
		// 			this.failMessage({
		// 				msg: '取消支付'
		// 			});
		// 		} else {
		// 			this.failMessage(e);
		// 		}
		// 	}
		// },
		// 支付
		async payClick(item) {
			try {
				uni.showLoading({
					title: '请稍后'
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 2000);
				//获取支付数据
				const payOrderRes = await payOrderApi({
					payNo: item.payInfo.payNo
				});
				let payRes = await weChatH5Pay(payOrderRes);
				this.failMessage({
					msg: '支付成功'
				});
				// 支付成功进入成功页面
				setTimeout(() => {
					uni.reLaunch({
						url: `/pages/order/pay-success?orderNo=${item.orderNo}&totalPrice=${item.productAmount}`
					});
					this.$refs.paging.reload();
				}, 800);
			} catch (e) {
				if (e.errMsg === 'requestPayment:fail cancel') {
					this.failMessage({
						msg: '取消支付'
					});
				} else {
					this.failMessage(e);
				}
			}
		},
		// 确认完成
		async completeBtn(item) {
			let res = await userFinish({ orderNo: item.orderNo });
			this.failMessage({
				msg: '操作成功'
			});
			setTimeout(() => {
				this.$refs.paging.reload();
			}, 1000);
		},
		toDetail(item) {
			uni.navigateTo({
				url: `/pages/order/detail?orderNo=${item.orderNo}`
			});
		},
		againPay() {
			uni.switchTab({
				url: '/pages/classification/index'
			});
		},
		async cancelClick(orderNo) {
			this.orderNo = orderNo;
			this.modalShow = true;
		},
		async confirmCancel() {
			try {
				this.modalShow = false;
				let res = await cancelOrder({ orderNo: this.orderNo });
				setTimeout(() => {
					this.$refs.paging.reload();
				}, 500);
			} catch (error) {
				this.failMessage(error);
			}
		}
	}
};
</script>

<style>
/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
.content {
	height: 100%;
}

.z-paging-content{
	bottom: 0 !important;
}
page {
	background-color: #f4f4f4;
}
</style>

<style lang="scss">
.checkActive {
	border: 1px solid rgba(253, 120, 15, 1);
}
.popup-item {
	margin: 20rpx;
	height: 100rpx;
	border-radius: 20rpx;
	background: rgba(255, 249, 245, 1);
}
.toPay {
	margin: 0 auto;
	padding-top: 20rpx;
	&-amount {
		color: rgba(255, 30, 0, 1);
		font-size: 44rpx;
		font-weight: 500;
	}
	&-item {
		color: rgba(153, 153, 153, 1);
		font-size: 32rpx;
		font-weight: 500;
	}
}
.activeStatus {
	color: rgba(253, 120, 15, 1);
	font-weight: 500;
}
.uncheckedStyle {
	color: rgba(107, 187, 42, 1);
	font-weight: 500;
}
.item {
	padding: 30rpx 24rpx;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 16rpx;
	&-title {
		&-status {
			font-weight: 500;
			// color: rgba(254, 90, 73, 1);
		}
		&-technician {
			color: rgba(51, 51, 51, 1);
		}
	}

	&-main {
		flex: 1;
		&-goodsImg {
			margin-right: 10rpx;
			flex: 0.2;
		}

		&-goods {
			flex: 0.8;
			.tags-item {
				color: rgba(153, 153, 153, 1);
			}
			&-time {
				height: 50rpx;
				line-height: 50rpx;
				align-items: center;
			}
			&-name {
				margin-bottom: 28rpx;
				.imgn-name {
					max-width: 400rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space:nowrap;
					color: rgba(51, 51, 51, 1);
					font-weight: 500;
				}
				.imgn-nums {
					color: rgba(185, 185, 185, 1);
				}
			}
		}
	}
	.imgn-time {
		color: rgba(185, 185, 185, 1);
	}
	&-price {
		&-amount {
			color: rgba(153, 153, 153, 1);
			font-size: 24rpx;
			font-weight: 400;
		}
		&-orderAmount {
			font-size: 32rpx;
			color: rgba(255, 30, 0, 1);
			font-weight: bold;
		}
		&-time {
			color: rgba(153, 153, 153, 1);
		}
	}
	.item-footer {
		justify-content: flex-end;
		&-btn-cancel {
			justify-content: center;
			margin: 0;
			width: 172rpx;
			height: 56rpx;
			border: 2rpx solid rgba(153, 153, 153, 1);
			color: rgba(153, 153, 153, 1);
		}
		&-btn-pay {
			justify-content: center;
			margin: 0;
			margin-left: 20rpx;
			width: 172rpx;
			height: 56rpx;
			border: 0;
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			color: rgba(255, 255, 255, 1);
		}
		&-btn-again {
			justify-content: center;
			margin: 0;
			width: 172rpx;
			height: 56rpx;
			border: 2rpx solid rgba(253, 120, 15, 1);
			color: rgba(253, 120, 15, 1);
		}
		&-btn-cancelPay {
			justify-content: center;
			margin: 0;
			width: 172rpx;
			height: 56rpx;
			background: rgba(255, 255, 255, 1);
			color: rgba(153, 153, 153, 1);
			border-radius: 40rpx;
			border: 2rpx solid rgba(153, 153, 153, 1);
		}
	}
}
</style>
