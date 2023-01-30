<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" :fix="false" @query="getList" :auto="true">
			<u-radio-group v-model="radioVal" @change="chageRadio" placement="col">
				<view :class="currentIndex == 0 ? 'popup' : 'popup2'" v-for="(item, index) in dataList" :key="index">
					<view class="item-left">
						<view class="item-left-box">
							<view class="">
								<text>￥</text>
								<text class="item-title-number font-30">{{ item.amount }}</text>
							</view>
							<view class="font-14">{{ item.thresholdAmountDesc }}</view>
						</view>
					</view>
					<view class="item-right" v-if="currentIndex == 0" @click="toUseCoupon(item)">
						<view class="item-content-title font-16">{{ ' ' + item.name }}</view>
						<!-- <view class="item-content-time font-14">有效期至: {{item.endTime}}</view> -->
						<view class="item-content-time font-14">{{ item.assertTime }} ~ {{ item.endTime }}</view>
					</view>
					<view class="item-right" v-else>
						<view class="item-content-title font-16">{{ ' ' + item.name }}</view>
						<!-- <view class="item-content-time font-14">有效期至: {{item.endTime}}</view> -->
						<view class="item-content-time font-14">{{ item.assertTime }} ~ {{ item.endTime }}</view>
					</view>
					<u-radio
						v-if="radioConfig.show"
						class="right-radio"
						:name="item[radioConfig.key]"
						activeColor="#FDC48D"
					></u-radio>
				</view>
			</u-radio-group>
		</z-paging>
	</view>
</template>

<script>
import { couponList } from '@/api/coupon.js';
export default {
	props: {
		currentIndex: {
			type: Number,
			default: 0,
		},
		radioConfig: {
			type: Object,
			default: () => {
				return {
					selectKey: '', // 默认选中的值，
					show: false, // 是否显示 必填
					key: '', // 作为选中的key属性 必填
				};
			},
		},
	},
	data() {
		return {
			radioVal: null,
			dataList: [],
			oldcurrentIndex: null,
		};
	},
	created() {
		this.radioVal = this.radioConfig.selectKey;
		// this.getList()
	},
	mounted() {},
	methods: {
		toUseCoupon(item) {
			console.log(item.guid, 'item');
			uni.navigateTo({
				url: `../order/coupon-projects?couponGuid=${item.guid}`,
			});
		},
		getList() {
			const attr = {
				couponType: this.currentIndex + 1,
			};
			couponList(attr).then(res => {
				// this.dataList = res.data
				// this.$refs.paging.complete(res.data);
				this.$refs.paging.setLocalPaging(res.data);
			});
		},
		chageRadio(val) {
			this.$emit('getSelectRadio', val);
		},
	},
	watch: {
		currentIndex: {
			handler(val) {
				setTimeout(() => {
					this.$refs.paging.reload();
				}, 2);
			},
			immediate: false,
		},
	},
};
</script>

<style>
page {
	background-color: #f4f4f4;
}

.z-paging-content {
	top: 0 !important;
}
</style>

<style lang="scss">
.popup {
	.item-left {
		background: url('../../../static/coupons/available.png') no-repeat left top;
		background-size: contain;
	}

	.item-right {
		background: url('../../../static/coupons/bg-right.png') no-repeat right top;
		background-size: contain;
	}
}

.popup2 {
	.item-left {
		background: url('../../../static/coupons/available2.png') no-repeat left top;
		background-size: contain;
	}

	.item-right {
		background: url('../../../static/coupons/available2-right.png') no-repeat right top;
		background-size: contain;
	}
}

.popup,
.popup2 {
	height: 190rpx;
	margin: 10rpx 30rpx;

	.right-radio {
		position: absolute;
		top: 50%;
		right: 24rpx;
		transform: translate(0, -50%);
	}

	.item-left {
		height: 100%;
		width: 252rpx;
		float: left;
		position: relative;
		top: 0;
		left: 0;
		z-index: 22;
		color: rgba(255, 255, 255, 1);

		.item-left-box {
			width: 252rpx;
			text-align: center;
			position: relative;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			.item-title-number {
				font-family: Impact-Regular, Impact;
			}
		}
	}

	.item-right {
		height: calc(100% - 30rpx);
		padding-top: 30rpx;
		padding-left: 270rpx;
		position: relative;

		.item-content-title {
			position: relative;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			font-size: 32rpx;
			// margin-right: 24rpx;
			margin-right: 50rpx;
			color: #333;
			font-family: Source Han Sans CN-Regular, Source Han Sans CN;
			font-weight: 400;
		}

		.item-content-time {
			position: absolute;
			bottom: 32rpx;
			font-family: Source Han Sans CN-Regular, Source Han Sans CN;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
	}
}
</style>
