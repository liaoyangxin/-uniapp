<template>
	<view>
		<view class="warp">
			<view class="title m-b-10">
				<view class="title-content">{{ detailData.orderStatusTxt }}</view>
			</view>
			<view class="product m-b-10">
				<view class="product-top flex-no-horizontal" v-for="(item, index) in detailData.product" :key="index">
					<view class="product-top-img" @click="previewImages(item.coverImg)"><u--image :src="item.coverImg | setCdnImgSize" v-if="item.coverImg" width="60px" height="60px" radius="8px"></u--image></view>
					<view class="product-top-nameAndPrice">
						<view class="product-top-nameAndPrice-name flex">
							<view class="ptnn-name font-16">{{ item.productName }}</view>
							<view class="ptnn-nums font-12">x{{ item.productNumber }}</view>
						</view>
						<view class="product-top-nameAndPrice-name flex">
							<view class="ptnn-name font-16">{{ item.serverTime }}分钟</view>
							<view class="ptnn-nums font-12">x{{ item.productPrice }}</view>
						</view>
						<!-- <view class="product-top-nameAndPrice-price font-16">
							￥{{item.productPrice}}
						</view> -->
					</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14" style="color: rgba(51, 51, 51, 1);">结算比例</view>
					<view class="product-item-right font-14">{{ detailData.settlementRatio }}</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14" style="color: rgba(51, 51, 51, 1);">结算金额</view>
					<view class="product-item-right font-14">￥{{ detailData.settlementAmount }}</view>
				</view>
				<u-gap height="0.5" marginTop="12" bgColor="rgba(241, 241, 241, 1)"></u-gap>
				<view class="product-item flex">
					<view class="product-item-left font-14" style="color: rgba(153, 153, 153, 1);">车费：￥{{ detailData.traffic.trafficFee }}</view>
					<view class="product-item-right font-16 font-bold" style="color: rgba(255, 30, 0, 1);">合计：￥{{ detailData.amount }}</view>
				</view>
			</view>
			<view class="product m-b-10">
				<view class="product-item flex" style="margin: 0;"><view class="product-item-left font-16 font-bold" style="color: rgba(51, 51, 51, 1);">订单信息</view></view>
				<view class="product-item flex">
					<view class="product-item-left font-14">客户姓名</view>
					<view class="product-item-right font-14">{{ detailData.customerName }}</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14">服务技师</view>
					<view class="product-item-right font-14 flex-no-horizontal">
						<view style="margin-right: 10rpx;"><u--image :src="detailData.server.head" width="28px" height="28px" shape="circle"></u--image></view>
						{{ detailData.server.name }}
					</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14">预约时间</view>
					<view class="product-item-right font-14">{{ detailData.server.yuYueTime }}</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14">出行距离</view>
					<view class="product-item-right font-14">{{ detailData.traffic.distance }}</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14">出行费用</view>
					<view class="product-item-right font-14">￥{{ detailData.traffic.trafficFee }}</view>
				</view>

				<view class="product-item flex">
					<view class="product-item-left font-14">订单编号</view>
					<view class="product-item-right flex font-14" @click="copyClick(detailData.orderNo)">
						{{ detailData.orderNo }}
						<view class="product-item-right-copy flex-no-horizontal">
							复制
						</view>
					</view>
				</view>
				<view class="product-item flex">
					<view class="product-item-left font-14">下单时间</view>
					<view class="product-item-right font-14">{{ detailData.createTime }}</view>
				</view>
				<view class="product-item flex" @click="callPhone(detailData.orderNo)">
					<view class="product-item-left font-14">联系方式</view>
					<view class="product-item-right font-14 flex">
						{{ detailData.customerMobile }}
						<u-icon name="phone-fill" color="rgba(81, 81, 81, 1)" size="16"></u-icon>
					</view>
				</view>
				<view class="product-item flex" style="align-items: flex-start;">
					<view class="product-item-left font-14">服务地址</view>
					<view class="product-item-right font-14 flex" @click="toMap">
						{{ address }}
						<u--image src="/static/user/icon_order_toMap.png" width="16" height="16"></u--image>
					</view>
				</view>
			</view>
			<view class="product m-b-10" v-if="detailData.orderStatus === 1300">
				<view class="product-item flex" style="margin: 0 0 24rpx 0;"><view class="product-item-left font-16 font-bold" style="color: rgba(51, 51, 51, 1);">签到照片</view></view>
				<image class="product-signInImg" :src="detailData.server.sitePhotos" mode="widthFix" @click="previewImages(detailData.server.sitePhotos)"></image>
			</view>
		</view>
		<view class="btn-box" v-if="detailData.orderStatus === 1100 || detailData.orderStatus === 1300">
			<u-button class="btn-box-pay font-16" :loading="btnLoadingShow" type="primary" :text="btnText" @click="nowReceivingOrder"></u-button>
		</view>
		<view class="btn-box" v-if="detailData.orderStatus === 1200">
			<button class="btn-box-pay btn-box-service font-16 flex-no-horizontal" @click="toService">
				<u-icon name="camera-fill" color="rgba(255,255,255,1)" size="28"></u-icon>
				<text>开始服务</text>
			</button>
		</view>
		<view class="btn-box" v-if="parseFloat(detailData.server.score) > 0">
			<u-button class="btn-box-score font-16" type="primary" text="查看评价" @click="toScore(detailData.orderNo)"></u-button>
		</view>
		<view class="police" v-if="detailData.orderStatus === 1300">
			<u--image src="/static/user/icon_order_police.png" width="45" height="45" @click="policeClick(detailData.orderNo)"></u--image>
		</view>
		<view style="height: 40rpx;"></view>
	</view>
</template>

<script>
import { getOrderDetailApi, setOrderStatusApi, getVirtualNumberApi } from '@/api/order.js';
import { updataFileFun } from '../../utility/upload.js';
export default {
	data() {
		return {
			btnLoadingShow: false,
			btnText: '立即接单',
			detailData: {
				orderNo: '',
				amount: '',
				productAmount: '',
				createTime: '',
				operationTime: '',
				orderStatus: 0,
				orderStatusTxt: '',
				customerName: '',
				customerMobile: '',
				traffic: {
					trafficFee: '',
					trafficType: '',
					trafficTypeName: '',
					distance: 0
				},
				server: {
					sitePhotos: '',
					serverTime: 0,
					yuYueTime: '',
					name: '',
					head: '',
					mobile: '',
					serverAddress: {
						city: '',
						guid: '',
						county: '',
						mobile: '',
						address: '',
						country: '',
						latitude: '',
						province: '',
						username: '',
						isDefault: 0,
						longitude: '',
						addressType: 0,
						houseNumber: ''
					}
				},
				product: [
					{
						productName: '',
						serverTime: 0,
						productImg: [],
						productNumber: 0,
						productPrice: '0',
						totalPrice: '0'
					}
				]
			}
		};
	},
	onLoad(e) {
		if (e.orderNo) {
			this.detailData.orderNo = e.orderNo
		}
	},
	onShow() {
		this.getDetailData(this.detailData?.orderNo);
	},
	onPullDownRefresh() {
		this.getDetailData(this.detailData?.orderNo);
	},
	computed: {
		address() {
			return this.detailData.server.serverAddress.county + '-' + this.detailData.server.serverAddress.address;
		}
	},
	methods: {
		async nowReceivingOrder() {
			try {
				this.btnLoadingShow = true;
				this.btnText = '请稍后...';
				const res = await setOrderStatusApi({
					orderNo: this.detailData.orderNo,
					orderStatus: this.detailData.orderStatus === 1100 ? '200' : '400'
				});
				setTimeout(() => {
					this.btnLoadingShow = false;
					this.btnText = '操作成功';
					this.getDetailData(this.detailData.orderNo);
				}, 800);
			} catch (e) {
				this.btnLoadingShow = false;
				this.btnText = '操作失败，请重试';
				this.failMessage(e);
			}
		},
		async getDetailData(orderNo) {
			try {
				const res = await getOrderDetailApi({
					orderNo
				});
				this.btnText = res.data.orderStatus === 1100 ? '立即接单' : '确认完成';
				this.detailData = res.data;
			} catch (e) {
				this.failMessage(e);
			} finally {
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 500);
			}
		},
		//预览图片
		async previewImages(url) {
			try {
				let urls = []
				Object.prototype.toString.call(url) !== '[object Array]' ? urls = [url] : urls = url
				const res = await uni.previewImage({
					urls
				});
			} catch (e) {
				this.failMessage(e);
			}
		},
		async toService() {
			try {
				//打开相机
				const res = await uni.chooseImage({
					count: 1,
					sourceType: ['camera']
				});
				uni.showLoading({
					title:'请稍后'
				})
				const image = res.tempFiles[0]
				this.$store.commit('setFileImg',image)
				setTimeout(() => {
					uni.hideLoading()
					uni.navigateTo({
						url:'/pages/order/order-photo?orderNo='+ this.detailData.orderNo
					})
				}, 800);
			} catch (e) {
				this.failMessage(e);
			}
		},
		async callPhone(orderNo) {
			try {
				const virtualRes = await getVirtualNumberApi({
					orderNo,
					userType:2
				});
				const res = await uni.makePhoneCall({
					phoneNumber: virtualRes.data.middleNumber //仅为示例
				});
			} catch (e) {
				this.failMessage(e);
			}
		},
		async copyClick(value) {
			try {
				const res = await uni.setClipboardData({
					data: value
				});
				this.failMessage({
					msg: '复制成功'
				});
			} catch (e) {
				this.failMessage(e);
			}
		},
		async toMap (){
			try{
				const res = await uni.openLocation({
					latitude:parseFloat(this.detailData.server.serverAddress.latitude),
					longitude:parseFloat(this.detailData.server.serverAddress.longitude),
				})
			}catch(e){
				this.failMessage(e);
			}
		},
		policeClick(item){
			uni.navigateTo({
				url: '/pages/order/police?orderNo=' + item
			});
		},
		toScore(item){
			uni.navigateTo({
				url: '/pages/order/order-evaluate?orderNo=' + item
			});
		},
		
	}
};
</script>
<style>
page {
	background-color: rgba(248, 248, 248, 1);
}
</style>
<style lang="scss">
.warp {
	padding: 20rpx 30rpx;

	.title {
		padding: 28rpx 24rpx;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 1);

		.title-content {
			font-weight: 500;
			font-size: 40rpx;
			color: rgba(253, 120, 15, 1);
		}

		.title-subhead {
			color: rgba(102, 102, 102, 1);
		}
	}

	.product {
		padding: 30rpx 24rpx;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 1);
		.product-signInImg {
			border-radius: 20rpx;
		}
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
			margin-top: 24rpx;
			width: 100%;
			&-left {
				width: 30%;
				color: rgba(153, 153, 153, 1);
			}

			&-right {
				justify-content: flex-end;
				text-align: right;
				width: 70%;
				color: rgba(51, 51, 51, 1);
				&-copy{
					justify-content: center;
					margin-left: 6rpx;
					background: rgba(255, 255, 255, 1);
					border-radius: 14rpx;
					border: 2rpx solid #999999;
					width: 48rpx;
					height: 28rpx;
					color: rgba(81, 81, 81, 1);
					font-size: 16rpx;
				}
			}
		}
	}
}

.btn-box {
	padding: 20rpx 30rpx;

	&-pay {
		border: 0;
		border-radius: 40rpx;
		background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
	}
	&-service {
		justify-content: center;
		height: 80rpx;
		text {
			margin-left: 10rpx;
			color: rgba(255, 255, 255, 1);
		}
	}
	&-score{
		border: 2rpx solid rgba(253, 120, 15, 1);
		border-radius: 40rpx;
		background: {
			color:rgba(255, 255, 255, 1),
		};
		color: rgba(253, 120, 15, 1);
	}
}
.police{
	position: fixed;
	right: 20rpx;
	bottom: 20%;
}
</style>
