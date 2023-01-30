<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回
		顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :auto="false">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item, index) in dataList" :key="index">
				<view class="item-title flex m-b-10">
					<view class="item-title-status font-16">{{ item.orderStatusTxt }}</view>
					<view class="item-title-technician flex-no-horizontal font-14">
						距离：
						<text class="font-14" style="color: rgba(51, 51, 51, 1);">{{ item.productOrderServer.distance }}</text>
					</view>
				</view>
				<view class="item-main flex-no-horizontal m-b-10" v-for="(item1, index1) in item.product" :key="index1" @click="toDetail(item.orderNo)">
					<view class="item-main-goodsImg"><u--image :src="item1.coverImg | setCdnImgSize" width="60px" height="60px" radius="8px" v-if="item1.coverImg"></u--image></view>
					<view class="item-main-goods">
						<view class="item-main-goods-name flex">
							<view class="imgn-name font-16">{{ item1.productName }}</view>
							<view class="imgn-nums font-12">X {{ item1.productNumber }}</view>
						</view>
						<view class="item-main-goods-time flex">
							<view class="imgn-time font-12 flex-no-horizontal">
								<u--image src="/static/user/icon_time.png" width="13" height="13"></u--image>
								<text style="margin-left: 5rpx;">{{ item1.serverTime }}分钟</text>
							</view>
						</view>
					</view>
				</view>
				<view class="item-main-goods-time m-b-10 flex">
					<view class="imgn-time font-14">预约时间：{{ item.productOrderServer.yuYueTime }}</view>
					<view class="imgn-price font-16 font-bold">
						<text class="text font-12" style="font-weight: normal;">总额：</text>
						￥{{ item.amount }}
					</view>
				</view>

				<view class="item-footer flex" :style="{ 'justify-content': item.productOrderServer.serverStatus === 300 ? 'space-between' : 'flex-end' }">
					<u--image src="/static/user/btn_order_police.png" width="93" height="28" v-if="item.productOrderServer.serverStatus === 300" @click="toPolice(item.orderNo)"></u--image>
					<view class="item-footer flex-no-horizontal">
						<u-button class="item-footer-btn-cancel font-14" shape="circle" :plain="true" type="primary" text="查看详情" @click="toDetail(item.orderNo)"></u-button>
						<u-button
							class="item-footer-btn-pay font-14"
							shape="circle"
							type="primary"
							text="立即接单"
							v-if="item.orderStatus === 1100"
							@click="nowReceivingOrder(item.orderNo, '200')"
						></u-button>
						<u-button
							class="item-footer-btn-pay font-14"
							shape="circle"
							type="primary"
							text="立即完成"
							v-if="item.orderStatus === 1300"
							@click="nowReceivingOrder(item.orderNo, '400')"
						></u-button>
						<u-button
							class="item-footer-btn-again font-14"
							shape="circle"
							:plain="true"
							type="primary"
							text="查看评价"
							v-if="item.productOrderServer.scoreTime > 0"
							@click="toOrderEvaluate(item.orderNo)"
						></u-button>
					</view>
				</view>
			</view>
		</z-paging>
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
import { getOrderListApi, setOrderStatusApi } from '@/api/order.js';
export default {
	data() {
		return {
			//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
			dataList: [],
			firstLoaded: false,
			modalShow: false,
			modalContent: '您确定要取消订单吗？',
			waitServerNumber: "",
			waitReceivingNumber: "" 
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
					setTimeout(() => {
						this.$refs.paging.reload();
					}, 100);
				}
			},
			immediate: true
		}
	},
	methods: {
		async queryList(pageNo, pageSize) {
			try {
				const res = await getOrderListApi({
					page: pageNo,
					pageSize,
					orderStatus: (this.tabIndex + 1).toString()
				});
				this.$refs.paging.complete(res.data.list.data);
				this.waitServerNumber=res.data.waitServerNumber
				this.waitReceivingNumber=res.data.waitReceivingNumber
				this.$emit('badgeNumber',this.waitServerNumber,this.waitReceivingNumber)
				this.firstLoaded = true;
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				this.$refs.paging.complete(false);
			}
		},
		async nowReceivingOrder(value, status) {
			try {
				const res = await setOrderStatusApi({
					orderNo: value,
					orderStatus: status
				});
				this.failMessage({
					msg: '操作成功'
				});
				setTimeout(() => {
					this.$refs.paging.reload();
				}, 800);
			} catch (e) {
				this.failMessage(e);
			}
		},
		toDetail(item) {
			uni.navigateTo({
				url: '/pages/order/detail?orderNo=' + item
			});
		},
		cancelClick() {
			this.modalShow = true;
		},
		confirmCancel() {
			this.modalShow = false;
		},
		toPolice(item) {
			uni.navigateTo({
				url: '/pages/order/police?orderNo=' + item
			});
		},
		toOrderEvaluate(item) {
			uni.navigateTo({
				url: '/pages/order/order-evaluate?orderNo=' + item
			});
		}
	}
};
</script>

<style>
/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
.content {
	height: 100%;
}

page {
	background-color: #f4f4f4;
}
</style>

<style lang="scss">
.imgn-price {
	text-align: right;
	color: rgba(255, 30, 0, 1);
	.text {
		color: rgba(153, 153, 153, 1);
	}
}
.imgn-time {
	color: rgba(153, 153, 153, 1);
}
.item {
	padding: 30rpx 24rpx;
	margin: 20rpx 30rpx 0 30rpx;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 16rpx;

	.item-title {
		&-status {
			font-weight: 500;
			color: rgba(253, 120, 15, 1);
		}

		&-technician {
			margin-right: 4rpx;
			color: rgba(51, 51, 51, 1);
		}
	}

	.item-main {
		flex: 1;

		.item-main-goodsImg {
			margin-right: 10rpx;
			flex: 0.2;
		}

		.item-main-goods {
			flex: 0.8;

			&-name {
				margin-bottom: 28rpx;

				.imgn-name {
					color: rgba(51, 51, 51, 1);
				}

				.imgn-nums {
					color: rgba(185, 185, 185, 1);
				}
			}

			&-time {
				.imgn-time {
					color: rgba(185, 185, 185, 1);
				}

				.imgn-price {
					color: rgba(255, 30, 0, 1);
				}
			}
		}
	}

	.item-footer {
		justify-content: flex-end;

		.item-footer-btn-cancel {
			margin: 0;
			width: 172rpx;
			height: 56rpx;
			border: 2rpx solid rgba(153, 153, 153, 1);
			color: rgba(153, 153, 153, 1);
		}

		.item-footer-btn-pay {
			margin: 0 0 0 30rpx;
			width: 172rpx;
			height: 56rpx;
			border: 0;
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			color: rgba(255, 255, 255, 1);
		}

		.item-footer-btn-again {
			margin: 0 0 0 30rpx;
			width: 172rpx;
			height: 56rpx;
			border: 2rpx solid rgba(253, 120, 15, 1);
			color: rgba(253, 120, 15, 1);
		}
		.item-footer-btn {
			margin: 0 20rpx 0 0;
		}
	}
}
</style>
