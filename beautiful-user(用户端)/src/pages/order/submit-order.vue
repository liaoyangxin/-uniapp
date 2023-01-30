<template>
	<!-- <scroll-view :scroll-y="!timePopupShow" :class="{ 'wrap-hover': timePopupShow }"> -->
	<view :class="{ 'wrap-hover': timePopupShow }">
		<view class="warp">
			<view class="address">
				<view class="address-content flex" @click="toAddress">
					<view class="address-content-text font-14">{{ addressText }}</view>
					<u-icon name="arrow-right" color="rgba(102, 102, 102, 0.9000)" size="15"></u-icon>
				</view>
				<view class="address-content-name flex font-14">{{ userName }}</view>
				<u-divider text=""></u-divider>
				<view class="address-time flex">
					<view class="address-time-text font-14">预约时间</view>
					<view class="address-time-icon font-14 flex-no-horizontal" @click="scheduledTime()">
						{{ showDate + showTime }}
						<u-icon name="arrow-right" color="rgba(102, 102, 102, 0.9000)" size="15"></u-icon>
					</view>
				</view>
			</view>
			<view class="followStyle" v-if="followStatus == false" @click="followClick"
				><u--image src="/static/user/follow-img.png" width="100%" height="66"></u--image
			></view>
			<view class="product m-t-10">
				<view class="product-content flex-no-horizontal m-b-10" v-for="(item, index) in orderList.product" :key="index">
					<view class="product-content-img flex-no-horizontal"
						><u--image :src="item.coverImg" width="60" height="60" radius="8"></u--image
					></view>
					<view class="product-content-namePrice">
						<view class="product-content-namePrice-nums flex">
							<view class="pcnn-name font-16">{{ item.productName }}</view>
							<text class="pcnn-nums font-12">{{ 'x ' + item.number }}</text>
						</view>
						<view class="product-content-namePrice-price font-16 font-bold">￥ {{ item.price }}</view>
					</view>
				</view>
				<view class="flex" v-if="orderList.artificer">
					<view class="pcnn-technician font-14 weight-500 flex">服务技师</view>
					<text class="font-14 weight-500">{{ orderList.artificer.name }}</text>
				</view>
				<view class="product-travel">
					<view class="flex" @click="showPopup = true">
						<view class="product-travel-title weight-500 font-14">出行方式</view>
						<view class="product-travel-content weight-500 font-14 flex-no-horizontal">
							{{ travelData }}（￥{{ trafficFee }}）
							<u-icon name="arrow-right" color="rgba(51, 51, 51, 1)" size="15"></u-icon>
						</view>
					</view>
					<view class="remarks">
						{{ traveldesc }}
						<text style="color: rgba(255, 30, 0, 1); font-size: 22rpx" v-if="travelData == '出租车/网约车'">{{
							regResult
						}}</text>
					</view>
				</view>
				<view class="flex" style="padding-top: 30rpx" v-if="orderList.artificer">
					<view class="pcnn-technician font-14 weight-500 flex">项目费用</view>
					<text class="font-14 weight-500">¥{{ totalProduct }}</text>
				</view>
				<view class="flex" style="padding-top: 30rpx" @click="ifCoupopShow = !ifCoupopShow">
					<view class="product-travel-title weight-500 font-14">优惠券</view>
					<view class="product-travel-content weight-500 font-14 flex-no-horizontal" style="color: rgba(255, 30, 0, 1)">
						{{ couponPrice && couponPrice !== '0' ? '-¥' + couponPrice : '暂无可用优惠券' }}
						<u-icon name="arrow-right" color="rgba(51, 51, 51, 1)" size="15"></u-icon>
					</view>
				</view>
				<view class="product-remarks flex">
					<view class="product-remarks-title weight-500 font-14 flex-no-horizontal">
						备注
						<input type="text" style="width: 550rpx" placeholder="备注" />
					</view>
					<!-- <view class="product-remarks-content"><u-icon name="arrow-right" color="rgba(51, 51, 51, 1)" size="15"></u-icon></view> -->
				</view>
			</view>
		</view>
		<view class="warp-paymentMethod m-t-10">
			<view class="title font-16 weight-400">支付方式</view>
			<u-checkbox-group :value="checkboxValue" placement="column" @change="checkboxChange">
				<view class="item flex">
					<view class="item-title flex-no-horizontal">
						<u--image :src="'/static/order/icon-balancePay.png'" width="20" height="20"></u--image>
						<text class="item-title-text font-16">我的余额</text>
						<text class="item-title-num font-13">(￥{{ balance.totalAssets }} )</text>
					</view>
					<u-checkbox
						shape="circle"
						activeColor="rgba(88, 193, 76, 1)"
						:customStyle="{ marginBottom: '8px' }"
						name="my"
						:disabled="isSupportPursePay"
					></u-checkbox>
					<!-- <u--image :src="'/static/order/icon-select.png'" v-if="payment" width="20" height="20" shape="circle"></u--image> -->
				</view>
				<view class="item flex">
					<view class="item-title flex-no-horizontal">
						<u--image :src="'/static/order/icon-wechatPay.png'" width="22" height="22"></u--image>
						<text class="item-title-text font-16">微信支付</text>
					</view>

					<u-checkbox
						shape="circle"
						activeColor="rgba(88, 193, 76, 1)"
						:customStyle="{ marginBottom: '8px' }"
						name="weixin"
					></u-checkbox>
					<!-- <u--image :src="'/static/order/icon-selectHover.png'" width="20" height="20" shape="circle"></u--image> -->
				</view>
			</u-checkbox-group>
		</view>
		<view class="footer">
			<view class="flex-no-horizontal" :class="this.showTime !== '暂不可约' ? 'footer-paybtn' : 'footer-ashpay'">
				<view class="footer-paybtn-price flex-no-horizontal">
					<text class="footer-paybtn-price-total font-14">合计：</text>
					<text class="footer-paybtn-price-unit font-14">￥</text>
					<text class="footer-paybtn-price-nums font-bold">{{ totalAmount }}</text>
				</view>
				<view class="footer-paybtn-pay flex-no-horizontal" @click="payImmediately">提交订单</view>
			</view>
		</view>
		<view style="height: 130rpx"></view>
		<!-- 服务时间弹窗 -->
		<u-popup :show="timePopupShow" @close="timePopupShow = false" round="16">
			<view class="popup">
				<view class="title flex-no-horizontal font-16">请选择服务时间</view>
				<view class="subhead flex-no-horizontal">
					<!-- 	<u-tabs
						:list="titleTimeList"
						:keyName="titleTimeList.name"
						lineColor="rgba(253, 120, 15, 1)"
						:activeStyle="{ color: 'rgba(253, 120, 15, 1)' }"
						:inactiveStyle="{ color: 'rgba(51, 51, 51, 1)' }"
						@click="titleTimeClick()"
						:current="showDateIndex"
						@change="tabs_change"
					>
					</u-tabs> -->
					<u-grid :border="false" col="4" align="left">
						<u-grid-item
							v-for="(listItem, listIndex) in titleTimeList"
							:key="listIndex"
							:class="listIndex == showDateIndex ? 'item_hover' : ''"
							:current="showDateIndex"
							@click="titleTimeClick(listItem, listIndex)"
						>
							<u-icon :customStyle="{ paddingTop: 50 + 'rpx' }" :name="listItem.name" size="26rpx"></u-icon>
							<!-- <text class="grid-text">{{listItem.name}}</text> -->
						</u-grid-item>
					</u-grid>
					<u-toast ref="uToast" />
				</view>
				<scroll-view :scroll-y="timePopupShow" :disableScroll="!timePopupShow">
					<view class="main flex-no-horizontal">
						<view
							class="main-item flex-no-horizontal"
							v-for="(item, index) in timeData"
							:class="
								item.isUse
									? { 'main-item-hover': timeIndex === index && dateActiveIndex === showDateIndex }
									: 'aboutStyle'
							"
							:key="index"
							@click="timeIndexClick(item, index)"
						>
							<view>{{ item.date }}</view>
							<text class="font-12">{{ item.isUse ? '' : '暂不可约' }}</text>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer m-t-20">
					<view class="title font-12">实际到达可能会有30分钟浮动</view>
					<view class="btn-box"
						><u-button class="btn-box-pay font-16" type="primary" :text="'确定预约'" @click="nowPayClick"></u-button
					></view>
				</view>
			</view>
		</u-popup>
		<travelPopup :show="showPopup" ref="travelPopupRef" @closePopup="closePopup" :showTime="showTime"></travelPopup>
		<u-popup :show="ifCoupopShow" round="16" @close="ifCoupopShow = false">
			<view class="coupop">
				<view class="coupop-title flex-no-horizontal">
					<text>-</text>
					选择优惠券
					<text>-</text>
				</view>
				<view style="margin: 0 30rpx">
					<scroll-view scroll-y style="height: 740rpx" v-if="couponList">
						<!-- <z-paging ref="paging" :fixed="false" :height="'370px'" width="100%" v-model="dataList" @query="queryList"> -->
						<view
							class="coupop-item flex-no-horizontal m-t-10"
							:class="{ 'coupop-itemNot': !item.isCheck }"
							v-for="(item, index) in couponList"
							:key="item.guid"
							@click="couponClick(index)"
						>
							<view class="coupop-item-left">
								<view class="coupop-item-left-price">
									<text>¥</text>
									{{ item.amount }}
								</view>
								<view class="coupop-item-left-condition font-14">{{ item.thresholdAmountDesc }}</view>
							</view>
							<view class="coupop-item-right flex-no-horizontal">
								<view class="coupop-item-right-main">
									<view class="cirm-name font-14">{{ item.name }}</view>
									<view class="cirm-time font-14">{{ item.assertTime }} ~ {{ item.endTime }}</view>
								</view>
								<view class="coupop-item-right-icon" v-if="item.isCheck">
									<image
										src="../../static/coupons/icon_coupon_selectHover.png"
										class="icon-select"
										mode=""
										v-if="couponIndex === index"
									></image>
									<image src="../../static/user/icon-select.png" mode="" class="icon-select" v-else></image>
								</view>
							</view>
						</view>
						<!-- </z-paging> -->
					</scroll-view>
				</view>
				<view style="height: 20rpx"></view>
				<view class="coupop-bottom"
					><u-button class="coupop-bottom-btn" type="primary" text="确定" @click="couponConfirmClick"></u-button
				></view>
				<view style="height: 20rpx"></view>
			</view>
		</u-popup>
	</view>
	<!-- </scroll-view> -->
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import {
	getWorkPlanByUser,
	createOrder,
	getPrice,
	getCouponListApi,
	getOrderInfoApi,
	getOrderPriceApi,
} from '@/api/order.js';
import { payOrderApi, userAssets, addressListApi, userInfoApi } from '@/api/user.js';
import { weChatH5Pay, weChatH5config } from '../../utility/wechat';
import travelPopup from './common/travelPopup.vue';
// 引入lodash
import _ from 'lodash';
var app = getApp();
export default {
	data() {
		return {
			timePopupShow: false,
			ifCoupopShow: false,
			dataList: [],
			titleTimeList: [],
			checkboxValue: ['weixin'],
			timeDataParams: {},
			timeIndex: 0,
			orderList: {},
			showTime: '',
			regResult: '',
			dateActiveIndex: 0,
			showDate: '', // 周几
			showDateIndex: 0, // 时间
			trafficFee: 0, // 车费
			traveldesc: '', //出行注释
			distance: '', // 距离
			balance: {}, //余额
			payment: false,
			showPopup: false,
			payType: '',
			addressList: '',
			followStatus: Boolean,
			totalAmount: 0,
			checkboxList: [
				{
					name: 'weixin',
					disabled: false,
				},
			],
			yuYueTime: 0,
			couponList: [],
			couponIndex: 0,
			couponPrice: '',
			totalProduct: '',
		};
	},
	components: {
		travelPopup,
	},
	watch: {
		timePopupShow: function (newVal, oldVal) {
			newVal ? this.stopScroll() : this.canScroll();
		},
		travelData: {
			handler(newVal) {
				if (newVal) {
					try {
						this.getOrderPrice();
					} catch (e) {
						this.failMessage({
							msg: e.msg,
						});
					}
				}
			},
		},
		addressText: {
			handler(newVal) {
				if (newVal) {
					try {
						this.getOrderPrice();
					} catch (e) {
						this.failMessage({
							msg: e.msg,
						});
					}
				}
			},
		},
	},

	computed: {
		...mapState({
			selectAddress: state => state.selectAddress,
			selectTravel: state => state.selectTravel,
			orderParams: state => state.productDetail,
		}),
		addressText() {
			return this.selectAddress ? this.selectAddress.county + ' ' + this.selectAddress.address : '请选择服务地址';
		},
		userName() {
			return this.selectAddress ? this.selectAddress.username + ' ' + this.selectAddress.mobile : '';
		},
		travelData() {
			return this.selectTravel ? this.selectTravel : '出租车/网约车';
		},
		timeData() {
			return this.timeDataParams[this.showDateIndex]?.children;
		},
		//判断是否满足余额支付
		isSupportPursePay() {
			return !(parseFloat(this.balance.totalAssets) >= parseFloat(this.totalAmount));
		},
		// totalProduct(){
		// 	let price = 0;
		// 	this.orderList.product.forEach((item,index) =>{

		// 		price+=(parseFloat(item.price)*(item.number))
		// 	})
		// 	return price
		// }
	},
	async onLoad(option) {
		this.onLoadFun();
	},
	methods: {
		...mapMutations(['setSelectAddress']),
		async onLoadFun() {
			try {
				await this.getWorkTime();
				//获取默认地址
				await this.getAddressList();
				//获取下单信息
				await this.getOrderInfo();
				//获取优惠券
				await this.getCouponList();
				//获取价格
				await this.getOrderPrice();
				//获取资产
				await this.getUserAssets();
				//获取用户是否关注公众号
				const userInfoRes = await userInfoApi();
				this.followStatus = userInfoRes.data.isFollowOfficialAccount;
			} catch (e) {
				this.failMessage({
					msg: e.msg,
				});
			}
		},
		checkboxChange(value) {
			let oldValue = this.checkboxValue.slice();
			if (value.length > 0) {
				if (value.length > 1) {
					let valueStr = oldValue[0];
					this.checkboxValue = value.filter(item => item !== valueStr);
				} else {
					this.checkboxValue = value;
				}
			} else {
				this.checkboxValue = oldValue;
			}
		},
		async queryList(pageNo, pageSize) {
			try {
				// let res = await inviteRecord();
				// this.dataList = res.data;
				this.$refs.paging.complete([1]);
			} catch (e) {
				this.failMessage(e);
				this.$refs.paging.complete(false);
				//TODO handle the exception
			}
		},
		toAddress() {
			uni.navigateTo({
				url: '/pages/user/user-addressList?ifSelectAddress=true',
			});
		},
		// 默认地址
		async getAddressList() {
			try {
				let res = await addressListApi({
					addressType: 3,
				});
				res.data.filter(item => {
					if (item.isDefault === 1) {
						this.setSelectAddress(item);
					}
				});
			} catch (e) {
				//TODO handle the exception
				return Promise.reject(e);
			}
		},
		// 去关注
		followClick() {
			uni.navigateTo({
				url: '/pages/user/user-follow',
			});
		},
		timestampToTime(timestamp, time) {
			let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear() + '-';
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
			return Y + M + D + time;
		},
		//立即支付
		payImmediately: _.throttle(
			async function () {
				let orderInfo = '';
				let payNo = '';
				try {
					if (this.showTime !== '暂不可约') {
						if (this.selectAddress) {
							let obj = {
								product: [],
								trafficType: this.travelData == '公交/地铁' ? 'bus' : 'taxi',
								yuYueTime: this.timestampToTime(this.timeDataParams[this.dateActiveIndex]?.dateTime, this.showTime),
								serverAddress: this.selectAddress,
								serverPerson: this.orderList.artificer.guid,
								cityCode: '510100',
								trafficFee: this.trafficFee,
								totalPrice: this.totalAmount,
								payType: this.checkboxValue[0] === 'weixin' ? 1 : 3,
								coupon: {
									guid:
										this.couponList.length && this.couponList[this.couponIndex].isCheck
											? this.couponList[this.couponIndex].guid
											: '',
									amount:
										this.couponList.length && this.couponList[this.couponIndex].isCheck
											? this.couponList[this.couponIndex].amount
											: '',
								},
							};
							obj.product = this.orderList.product.map(item => {
								return {
									guid: item.guid,
									number: item.number,
								};
							});
							// 首先，调取创建订单接口
							let res = await createOrder(obj);
							uni.showLoading({
								title: '请稍后',
							});
							setTimeout(() => {
								uni.hideLoading();
							}, 2000);
							orderInfo = res.data.orderInfo.orderNo;
							payNo = res.data.orderInfo.payNo;
							//判断是余额支付还是微信支付
							if (obj.payType === 1) {
								// 传入创建订单接口返回的支付编号payNo
								const orderRes = await payOrderApi({
									payNo: res.data.orderInfo.payNo,
								});
								//微信支付 将订单信息对象传给调起微信支付的接口
								let payRes = await weChatH5Pay(orderRes);
							}
							setTimeout(() => {
								obj.orderInfo = res.data.orderInfo;
								uni.reLaunch({
									url: `/pages/order/pay-success?orderNo=${obj.orderInfo.orderNo}&totalPrice=${obj.totalPrice}?debug=1`,
								});
							}, 500);
						} else {
							this.failMessage({
								msg: '请选择服务地址',
							});
						}
					}
				} catch (error) {
					this.failMessage({
						msg: error.msg,
					});

					if (error.code === 704005) {
						this.getTotalAmount(true);
						return;
					}
					this.getCouponList();
					if (this.checkboxValue[0] === 'weixin') {
						if (error.msg === '取消支付' || error.msg === '支付失败') {
							setTimeout(() => {
								uni.reLaunch({
									url: `/pages/order/pay-failed?orderNo=${orderInfo}&totalPrice=${this.totalAmount}&payNo=${payNo}?debug=1`,
								});
							}, 1000);
						}
					}
				}
			},
			3000,
			{ trailing: false }
		),
		closePopup(show) {
			this.showPopup = show;
		},
		scheduledTime() {
			this.timePopupShow = true;
			this.titleTimeList = [];
			this.getWorkTime();
		},
		// 选择时间
		timeIndexClick(item, index) {
			try {
				if (item.isUse) {
					this.dateActiveIndex = this.showDateIndex;
					this.timeIndex = index;
					this.showTime = item.date;
					// this.getTotalAmount() //暂时
					this.getOrderPrice();
				}
			} catch (e) {
				this.failMessage({
					msg: e.msg,
				});
			}
		},
		// 10位时间戳转日期
		timeStamp: function (time) {
			//  uni.$u.timeFormat(time, 'yyyy-mm-dd'); 限制getDay方法
			let week = '';
			let date = new Date(parseInt(time) * 1000);
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? '0' + MM : MM;
			let d = date.getDate();
			d = d < 10 ? '0' + d : d;
			let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
			switch (new Date(y + '-' + MM + '-' + d).getDay()) {
				case 0:
					week = '周日';
					break;
				case 1:
					week = '周一';
					break;
				case 2:
					week = '周二';
					break;
				case 3:
					week = '周三';
					break;
				case 4:
					week = '周四';
					break;
				case 5:
					week = '周五';
					break;
				case 6:
					week = '周六';
					break;
			}
			if (MM + '-' + d === this.formatDate(new Date())) {
				week = '今天';
			}
			return MM + '-' + d + ' (' + week + ')';
		},
		formatDate(date) {
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = date.getDate();
			d = d < 10 ? '0' + d : d;
			var h = date.getHours();
			var minute = date.getMinutes();
			minute = minute < 10 ? '0' + minute : minute;
			return m + '-' + d;
		},
		// 选择日期
		titleTimeClick(item, index) {
			this.showDateIndex = index;
			console.log(item, index, 'item,index');
		},
		// 日期切换
		tabs_change(e) {
			console.log(this.showDateIndex, e, '===');
			this.showDateIndex = e.index;
		},
		// 确定预约
		nowPayClick() {
			this.showDate = this.titleTimeList[this.dateActiveIndex]?.name;
			this.timePopupShow = false;
			this.$refs.travelPopupRef.resetCurrentIndex();
		},
		// 获取排期时间表
		async getWorkTime() {
			try {
				let res = await getWorkPlanByUser({ serverPerson: this.orderParams.technicianGuid });
				this.timeDataParams = res.data;
				this.showDateIndex = this.dateActiveIndex;
				console.log(res.data, 'res.data111');
				res.data.map(item => {
					// this.timeStamp(item.dateTime)
					this.titleTimeList.push({
						name: this.timeStamp(item.dateTime),
					});
				});
				console.log(this.titleTimeList, 'this.titleTimeListthis.titleTimeList');
			} catch (error) {
				return Promise.reject(error);
			}
		},
		// 获取可提现余额
		async getUserAssets() {
			try {
				let res = await userAssets();
				this.balance = res.data;
			} catch (e) {
				return Promise.reject(e);
			}
		},
		//获取订单信息
		async getOrderInfo() {
			try {
				let parameter = {
					product: [],
					trafficType: this.travelData == '公交/地铁' ? 'bus' : 'taxi',
					yuYueTime: this.yuYueTime ? this.timestampToTime(this.yuYueTime, this.showTime) : '',
					serverAddress: this.selectAddress,
					serverPerson: this.orderParams.technicianGuid,
					cityCode: '510100',
				};
				parameter.product = this.orderParams.product.map(item => {
					if (item.value) {
						return {
							guid: item.guid,
							number: item.value,
						};
					}
				});
				const res = await getOrderInfoApi(parameter);
				this.orderList = res.data;
				this.totalAmount = res.data.amount.orderPrice;
				this.trafficFee = res.data.amount.trafficFee;
				// 出行注释
				res.data.traffic.configs.map(item => {
					if (item.name === this.travelData) {
						this.traveldesc = item.desc.slice(0, item.desc.indexOf('<'));
						let result = item.desc.match(/>(\S*)</)[1];
						this.regResult = result;

						return;
					}
				});
				if (res.data.artificer.yuYueTime !== 0) {
					// 接口返回的默认可服务时间
					this.yuYueTime = res.data.artificer.yuYueTime;
					this.showDate = this.timeStamp(res.data.artificer.yuYueTime);
					this.showTime = uni.$u.timeFormat(res.data.artificer.yuYueTime, 'hh:MM');
					this.timeDataParams.forEach((item, index) => {
						if (item.date === uni.$u.timeFormat(res.data.artificer.yuYueTime, 'mm-dd')) {
							item.children.forEach((v, i) => {
								if (v.date === uni.$u.timeFormat(res.data.artificer.yuYueTime, 'hh:MM')) {
									console.log(index, 'index', i);
									this.timeIndex = i;
									this.showDateIndex = index;
									this.dateActiveIndex = index;
								}
							});
						}
					});
				} else {
					this.showTime = '暂不可约';
				}
			} catch (e) {
				return Promise.reject(e);
			}
		},

		async getOrderPrice() {
			try {
				let coupon =
					this.couponList.length > 0 && this.couponList[this.couponIndex].isCheck
						? {
								guid: this.couponList[this.couponIndex].guid,
								amount: this.couponList[this.couponIndex].amount,
						  }
						: {};
				let parameter = {
					product: [],
					trafficType: this.travelData == '公交/地铁' ? 'bus' : 'taxi',
					yuYueTime: this.yuYueTime ? this.timestampToTime(this.yuYueTime, this.showTime) : '',
					serverAddress: this.selectAddress,
					serverPerson: this.orderParams.technicianGuid,
					cityCode: '510100',
					coupon,
				};
				parameter.product = this.orderParams.product.map(item => {
					if (item.value) {
						return {
							guid: item.guid,
							number: item.value,
						};
					}
				});
				const res = await getOrderPriceApi(parameter);
				this.totalAmount = res.data.amount.orderPayPrice;
				this.couponPrice = res.data.amount.couponAmount;
				this.trafficFee = res.data.amount.trafficFee;
				this.totalProduct = res.data.amount.productPrice;
			} catch (e) {
				return Promise.reject(e);
			}
		},

		async getTotalAmount(resetTimeFlag) {
			try {
				let obj = {
					product: [],
					trafficType: this.travelData == '公交/地铁' ? 'bus' : 'taxi',
					yuYueTime: this.yuYueTime ? this.timestampToTime(this.yuYueTime, this.showTime) : '',
					serverAddress: this.selectAddress,
					serverPerson: this.orderParams.technicianGuid,
					cityCode: '510100',
				};
				obj.product = this.orderParams.product.map(item => {
					if (item.value) {
						return {
							guid: item.guid,
							number: item.value,
						};
					}
				});
				let res = await getPrice(obj);
				this.orderList = res.data;
				this.totalAmount = res.data.amount.orderPrice;
				this.trafficFee = res.data.amount.trafficFee;
				// 出行注释
				res.data.traffic.configs.map(item => {
					if (item.name === this.travelData) {
						this.traveldesc = item.desc.slice(0, item.desc.indexOf('<'));
						let result = item.desc.match(/>(\S*)</)[1];
						this.regResult = result;

						return;
					}
				});
				if (resetTimeFlag) {
					if (res.data.artificer.yuYueTime !== 0) {
						// 接口返回的默认可服务时间
						this.yuYueTime = res.data.artificer.yuYueTime;
						this.showDate = this.timeStamp(res.data.artificer.yuYueTime);
						this.showTime = uni.$u.timeFormat(res.data.artificer.yuYueTime, 'hh:MM');
						this.timeDataParams.forEach((item, index) => {
							if (item.date === uni.$u.timeFormat(res.data.artificer.yuYueTime, 'mm-dd')) {
								item.children.forEach((v, i) => {
									if (v.date === uni.$u.timeFormat(res.data.artificer.yuYueTime, 'hh:MM')) {
										console.log(index, 'index', i);
										this.timeIndex = i;
										this.showDateIndex = index;
										this.dateActiveIndex = index;
									}
								});
							}
						});
						console.log(this.timeDataParams, '当前默认时间', uni.$u.timeFormat(res.data.artificer.yuYueTime, 'mm-dd'));
					} else {
						this.showTime = '暂不可约';
					}
				}
			} catch (error) {
				return Promise.reject(error);
			}
		},
		async getCouponList() {
			console.log(this.orderList, 'this.orderList.amount.productPric');
			try {
				let parameter = {
					product: [],
					amount: this.orderList.amount.productPrice, //项目订单金额
				};
				parameter.product = this.orderParams.product.map(item => {
					if (item.value) {
						return {
							guid: item.guid,
							number: item.value,
						};
					}
				});
				const res = await getCouponListApi(parameter);
				this.couponList = res.data;
			} catch (e) {
				return Promise.reject(e);
			}
		},
		couponClick(index) {
			if (this.couponList[index].isCheck) {
				this.couponIndex = index;
				console.log(this.couponIndex);
			}
		},
		async couponConfirmClick() {
			try {
				this.getOrderPrice();
				this.ifCoupopShow = false;
			} catch (e) {
				this.failMessage({
					msg: e.msg,
				});
			}
		},
		//禁止滚动
		stopScroll() {
			var mo = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = 'hidden';
			document.addEventListener('touchmove', mo, false); //禁止页面滑动
		},
		//取消滑动限制
		canScroll() {
			var mo = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = ''; //出现滚动条
			document.removeEventListener('touchmove', mo, false);
		},
	},
};
</script>

<style lang="scss">
.wrap-hover {
	height: 100vh !important;
	overflow-y: hidden;
	position: fixed;
	// background: #FF0 !important;
}
.warp {
	padding: 20rpx 30rpx;
	background: linear-gradient(180deg, #ffd7b7 0%, #f8f8f8 100%);
	::v-deep .input-placeholder {
		text-align: end !important;
	}
	::v-deep .u-divider .u-line {
		border-bottom: 1rpx solid #f2f2f2 !important;
	}
	.address {
		padding: 30rpx 24rpx;
		border-radius: 20rpx;
		background-color: #ffffff;
		&-content {
			&-text {
				color: rgba(51, 51, 51, 1);
				font-weight: 500;
			}
		}
		.address-content-name {
			margin-top: 8rpx;
			color: rgba(153, 153, 153, 1);
			font-weight: 400;
		}
		&-time {
			margin-top: 40rpx;
			&-text {
				color: rgba(51, 51, 51, 1);
			}
			&-icon {
				color: rgba(255, 113, 59, 1);
			}
		}
	}
	.followStyle {
		margin: 20rpx 0;
		::v-deep .u-image__image div {
			background-size: 100% !important;
		}
	}
	.product {
		padding: 30rpx 24rpx;
		border-radius: 20rpx;
		background-color: #ffffff;
		&-content {
			flex: 1;
			&-img {
				flex: 0.2;
			}
			&-namePrice {
				flex: 0.8;
				&-nums {
					.pcnn-name {
						color: rgba(51, 51, 51, 1);
					}
					.pcnn-nums {
						margin-left: 10rpx;
						color: rgba(185, 185, 185, 1);
					}
					.pcnn-technician {
						color: rgba(51, 51, 51, 1);
					}
				}
				&-price {
					margin-top: 24rpx;
					color: rgba(255, 30, 0, 1);
				}
			}
		}
		&-travel {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f2f2f2;
			&-title {
				color: rgba(51, 51, 51, 1);
			}
			&-content {
				color: rgba(51, 51, 51, 1);
			}
			.remarks {
				margin-top: 20rpx;
				font-size: 22rpx;
				color: rgba(185, 185, 185, 1);
			}
		}
		&-remarks {
			padding-top: 30rpx;
			&-title {
				color: rgba(51, 51, 51, 1);
				input {
					margin-left: 20rpx;
					font-size: 28rpx;
					color: rgba(153, 153, 153, 1);
				}
			}
			&-content {
			}
		}
	}
}
.aboutStyle {
	font-size: 28rpx;
	background: rgba(239, 239, 239, 1) !important;
	color: rgba(153, 153, 153, 1);
}
.warp-paymentMethod {
	margin: 20rpx 30rpx;
	padding: 30rpx 24rpx;
	border-radius: 20rpx;
	background-color: #ffffff;
	.title {
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #f2f2f2;
		color: rgba(0, 0, 0, 1);
	}
	.item {
		padding-top: 30rpx;
		&-title {
			&-text {
				margin-left: 20rpx;
				color: rgba(51, 51, 51, 1);
				font-weight: normal;
			}
		}
	}
	.item-title-num {
		font-weight: 500;
		font-size: 22rpx;
		color: rgba(102, 102, 102, 1);
	}
}
.footer {
	position: fixed;
	bottom: 0;
	padding: 10rpx 30rpx;
	width: 92.5%;
	height: 128rpx;
	background: rgba(255, 255, 255, 1);
	z-index: 9999;
	&-paybtn {
		flex: 1;
		height: 110rpx;
		background: url(../../static/button/pay-icon@2x.png) no-repeat;
		background-size: 100% 100%;
		&-price {
			flex: 0.55;
			margin-left: 54rpx;
			height: 100%;
			color: rgba(255, 0, 0, 1);
			&-nums {
				font-size: 44rpx;
			}
		}
		&-pay {
			flex: 0.45;
			justify-content: center;
			font-weight: bold;
			height: 100%;
			color: rgba(255, 255, 255, 1);
		}
	}
	&-ashpay {
		flex: 1;
		height: 110rpx;
		background: url(../../static/button/ashpay@2.png) no-repeat;
		background-size: 100% 100%;
		.footer-paybtn-price {
			flex: 0.55;
			margin-left: 54rpx;
			height: 100%;
			color: rgba(153, 153, 153, 1);
			&-nums {
				font-size: 44rpx;
			}
		}
		.paybtn-pay {
			flex: 0.45;
			justify-content: center;
			height: 100%;
			color: rgba(153, 153, 153, 1);
		}
	}
}
.popup {
	padding: 0 30rpx;
	z-index: 99999;

	.title {
		justify-content: center;
		padding: 38rpx 0 0 0;
	}
	.subhead {
		padding-bottom: 40rpx;
		border-bottom: 1rpx solid #f2f2f2 !important;
		display: flex;
		flex-direction: column;
		::v-deep.u-grid-item {
			text-align: center;
			font-size: 26rpx;
			// margin-bottom: 4rpx;
			background-color: rgba(248, 248, 248, 1);
			// color: rgba(253, 120, 15, 1);
		}
		::v-deep.item_hover {
			// border: 4rpx solid #F00;
			text-align: center;
			font-size: 26rpx;
			// margin-left: 10rpx;
			// border-bottom: 4rpx solid rgba(253, 120, 15, 1);
			background-color: rgba(255, 249, 245, 1);
			span {
				color: rgba(253, 120, 15, 1) !important;
			}
		}
		.item_hover::after {
			content: '';
			width: 50%;
			margin: 0 auto;
			border-bottom: 4rpx solid rgba(253, 120, 15, 1);
			padding: 2rpx;
		}
	}
	.main {
		flex-wrap: wrap;
		margin-top: 40rpx;
		max-height: 200px;
		overflow-y: scroll;

		&-item {
			justify-content: center;
			flex-direction: column;
			margin-bottom: 1.6%;
			margin-left: 10rpx;
			font-size: 28rpx;
			width: 23.5%;
			height: 80rpx;
			border-radius: 20rpx;
			background-color: rgba(248, 248, 248, 1);
		}
		&-item-hover {
			font-size: 28rpx;
			width: 23%;
			height: 76rpx;
			// margin-left: 10rpx;
			border: 2rpx solid rgba(253, 120, 15, 1);
			background-color: rgba(255, 249, 245, 1);
			color: rgba(253, 120, 15, 1);
		}
	}
	&-footer {
		.title {
			text-align: center;
			color: rgba(51, 51, 51, 1);
			padding: 10rpx;
		}
		.btn-box {
			z-index: 99999;
			padding: 0 30rpx 20rpx 30rpx;
			&-pay {
				border: 0;
				border-radius: 40rpx;
				background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			}
		}
	}
}
.coupop {
	border-top-left-radius: 32rpx;
	border-top-right-radius: 32rpx;
	background-color: rgba(244, 244, 244, 1);
	&-title {
		justify-content: center;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		background-color: rgba(255, 255, 255, 1);
		height: 116rpx;
		color: rgba(51, 51, 51, 1);
		text {
			color: rgba(218, 218, 218, 1);
		}
	}
	&-itemNot {
		background-image: url('../../static/coupons/bg_coupon_canNot.png') !important;
	}
	&-item {
		flex: 1;
		background: {
			image: url('../../static/coupons/bg_coupon_can.png');
			size: 100% 100%;
			repeat: no-repeat;
		}
		&-left {
			flex: 0.365;
			color: rgba(255, 255, 255, 1);
			&-price {
				text-align: center;
				font-size: 80rpx;
				text {
					font-size: 24rpx;
				}
			}
			&-condition {
				text-align: center;
				margin-top: 5rpx;
			}
		}
		&-right {
			flex: 0.635;
			padding: 30rpx 20rpx 30rpx 30rpx;
			&-main {
				flex: 0.9;
				.cirm-name {
					color: rgba(51, 51, 51, 1);
				}
				.cirm-time {
					margin-top: 46rpx;
					color: rgba(153, 153, 153, 1);
				}
			}
			&-icon {
				flex: 0.1;
				.icon-select {
					width: 20px;
					height: 20px;
				}
			}
		}
	}
	&-bottom {
		padding: 24rpx 30rpx 0 30rpx;
		background-color: rgba(255, 255, 255, 1);
		&-btn {
			border: 0;
			border-radius: 40rpx;
			background: linear-gradient(238deg, rgba(253, 199, 142, 1) 0%, rgba(255, 143, 120, 1) 100%);
			color: rgba(255, 255, 255, 1);
			font-size: 32rpx;
		}
	}
}
</style>
<style>
page {
	background-color: rgba(248, 248, 248, 1);
}
</style>
