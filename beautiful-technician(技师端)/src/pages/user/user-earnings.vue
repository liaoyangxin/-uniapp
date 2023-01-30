<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{ top: '0' }" :auto="false">
			<view class="user-page">
				<view class="user-assets">
					<view class="assets-item"> 
						<view class="assets-item-balance">
							<view class="flex-no-horizontal">
								<u--image src="/static/user/icon_user_balance.png" width="25" height="25"></u--image>
								<text class="assets-title">
									{{ '&nbsp;' + '我的总资产' }}
									<span>(元)</span>
								</text>
							</view>
							<text class="quota">{{ userAssetData.totalAssets }}</text>
						</view>
						<u-button
							class="withdrawal-btn"
							type="primary"
							:plain="true"
							@click="withdrawal"
							text="去提现"
							color="rgba(255, 255, 255, 1)"
							size="small"
							shape="circle"
						></u-button>
					</view>
					<view class="flex" style="width: 100%;">
						<view style="width: 50%;">
							<view class="title-color" style="background-color: rgba(255, 161, 49, 1);"></view>
							<text class="assets-text font-12 flex">
								订单结算
								<span>(元)</span>
							</text>
							<text class="assets-money font-bold">{{ userAssetData.orderRevenue }}</text>
						</view>
						<view>
							<view class="title-color" style="background-color: rgba(107, 187, 42, 1);"></view>
							<text class="assets-text font-12 flex">
								保证金
								<span>(元)</span>
							</text>
							<text class="assets-money font-bold">{{ userAssetData.bond }}</text>
						</view>
						<view style="text-align: right;">
							<u-button class="recharge" type="primary" :plain="true" text="充值" size="small" shape="circle" @click="toRecharge"></u-button>
						</view>
						
					</view>
					<view class="flex" style="width:100%">
						<view style="width: 90%;">
							<view class="title-color" style="background-color: rgba(255, 114, 101, 1);"></view>
							<text class="assets-text font-12 flex">
								订单分佣
								<span>(元)</span>
							</text>
							<text class="assets-money font-bold">{{ userAssetData.incomeSharing }}</text>
						</view>
					</view>
				</view>
				<view class="bill-details">
					<view class="tab-tilte flex-no-horizontal">
						<text v-for="(item, index) in billDetailsTitle" :key="index" @click="check(index)" :class="[current == index ? 'activeStyle' : 'uncheckedStyle']">
							{{ item.name }}
						</text>
					</view>
				</view>
				<view class="configure-modular" :style="{ padding: dataList.length > 0 ? '10px 0' : '0' }">
					<template v-if="current === 3">
						<view class="configure-modular-item" v-for="(item, index) in dataList" :key="index" :border="false">
							<view class="configure-modular-item-title">
								<view class="item-title-text">
									<text class="text-type font-14 font-bold">余额提现</text>
									<text class="text-orderNo font-12">{{ '&nbsp;&nbsp;' + item.orderNo }}</text>
								</view>
								<view class="configure-modular-item-time" style="margin: 10rpx 0;">{{ item.orderStatusTxt }} {{ item.operationDesc ? '( ' + item.operationDesc + ' )' : '' }}</view>
								<view class="configure-modular-item-time">{{ item.operationTime }}</view>
							</view>
							<view class="font-16 font-bold" :class="[item.amount >= 0 ? 'incomeStyle' : 'configure-modular-item-money']">{{ item.amount }}</view>
						</view>
					</template>

					<template v-else>
						<view class="configure-modular-item" v-for="(item, index) in dataList" :key="index" :border="false">
							<view class="configure-modular-item-title">
								<view class="item-title-text">
									<text class="text-type font-14 font-bold">{{ item.orderTypeStr }}</text>
									<text class="text-orderNo font-12">{{ '&nbsp;&nbsp;' + item.orderNo }}</text>
								</view>
								<view class="configure-modular-item-time" style="margin: 10rpx 0;">{{ item.receiptPayTypeStr }}</view>
								<view class="configure-modular-item-time m-t-10">{{ item.createTime }}</view>
							</view>
							<view class="font-16 font-bold" :class="[item.addReduceStr === '+' ? 'incomeStyle' : 'configure-modular-item-money']">
								{{ item.addReduceStr + item.money }}
							</view>
						</view>
					</template>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
import { withdrawalOrderListApi, closeAnAccountOrderListApi } from '../../api/user.js';
import { userAssetApi } from '../../api/technician.js';
export default {
	data() {
		return {
			dataList: [],
			current: 0,
			billDetailsTitle: [
				{
					name: '订单结算'
				},
				{
					name: '订单分佣'
				},
				{
					name: '保证金'
				},
				{
					name: '提现明细'
				}
			],
			userAssetData: {
				totalAssets: 0, //总资产
				incomeSharing: 0, //分享收入
				orderRevenue: 0, //订单收入
				rechargeIncome: 0, //余额
				bond: 0, //保证金
				allowWithdrawal: 0 //可提现金额
			}
		};
	},
	onShow() {
		setTimeout(() => {
			this.$refs.paging.reload();
		}, 100);
	},
	methods: {
		check(index) {
			this.current = index;
			this.$refs.paging.reload();
		},
		toRecharge() {
			uni.navigateTo({
				url: './user-recharge'
			});
		},
		// 提现
		withdrawal() {
			if (parseFloat(this.userAssetData.allowWithdrawal) < 1) {
				this.failMessage({
					msg: '可提现余额不足'
				});
				return;
			}
			uni.navigateTo({
				url: './user-withdrawal'
			});
		},
		async queryList(pageNo, pageSize) {
			try {
				const res = await userAssetApi();
				this.userAssetData = res.data;
				let dataListRes = [];
				switch (this.current) {
					case 0:
						//订单结算
						dataListRes = await closeAnAccountOrderListApi({
							page: pageNo,
							pageSize,
							type: 3
						});
						break;
					case 1:
						//订单分佣
						dataListRes = await closeAnAccountOrderListApi({
							page: pageNo,
							pageSize,
							type: 2
						});
						break;
					case 2:
						//保证金明细
						dataListRes = await closeAnAccountOrderListApi({
							page: pageNo,
							pageSize,
							type: 1
						});
						break;
					case 3:
						//提现明细
						dataListRes = await withdrawalOrderListApi({
							page: pageNo,
							pageSize
						});
						break;
					default:
						break;
				}
				this.$refs.paging.complete(dataListRes.data.data);
			} catch (e) {
				this.$refs.paging.complete(false);
				this.failMessage(e);
			}
		}
	}
};
</script>

<style>
page {
	background-color: rgba(244, 244, 244, 1);
}
</style>

<style lang="scss">
.assets-text {
	color: rgba(153, 153, 153, 1);
}
.user-page {
	.user-assets {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 500rpx;
		align-items: center;
		margin: 20rpx 40rpx 0 40rpx;
		background: #ffffff;
		border-radius: 32rpx;
		padding: 10rpx 40rpx;
		.title-color {
			margin-bottom: 10rpx;
			border-radius: 8rpx;
			width: 24rpx;
			height: 10rpx;
		}
		.assets-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			// margin: 0 40rpx;
			font-size: 28rpx;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);

			&-balance {
				width: 70%;
			}

			.assets-title {
				font-size: 28rpx;
				font-family: Source Han Sans CN-Medium, Source Han Sans CN;
				font-weight: 500;
				color: #333333;

				span {
					color: #999999;
				}
			}

			.withdrawal-btn {
				margin: 0;
				border: 0;
				border: {
					width: 0 !important;
				}
				background: linear-gradient(270deg, rgba(255, 112, 99, 1) 0%, rgba(255, 162, 131, 1) 100%);
				box-shadow: 0 6rpx 12rpx 2rpx rgba(255, 162, 131, 0.52);
				border-radius: 50rpx;
				width: 36.6%;
				height: 70rpx;
				color: rgba(255, 255, 255, 1);
			}
		}

		.quota {
			font-size: 52rpx;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}

		.recharge {
			color: rgba(253, 120, 15, 1);
			width: 108rpx;
			height: 48rpx;
			background: #fcfdff;
			opacity: 1;
			border: 2rpx solid rgba(253, 120, 15, 1);
		}
	}

	.bill-details {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 30rpx 40rpx;

		.bill-details-title {
			width: 130rpx;
			font-size: 32rpx;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			color: #333333;
		}

		.tab-tilte {
			display: flex;
			flex-direction: row;
			flex: 1;
			text-align: center;
			font-size: 24rpx;
		}

		.activeStyle {
			display: flex;
			align-items: center;
			padding: 10rpx 24rpx;
			background: #fd780f;
			border-radius: 30rpx;
			color: #fff;
			text-align: center;
			margin-right: 16rpx;
			border: 1px solid #fd780f;
		}

		.uncheckedStyle {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 10rpx 24rpx;
			background: #fcfdff;
			color: #999999;
			border-radius: 30rpx;
			border: 1px solid #dfdfdf;
			text-align: center;
			margin-right: 16rpx;
		}
	}

	.configure-modular {
		background: #ffffff;
		border-radius: 32rpx;
		margin: 0 30rpx;
		padding: 20rpx 0;
		font-family: Source Han Sans CN-Medium, Source Han Sans CN !important;
		.configure-modular-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 28rpx;
			font-weight: 500;
			color: #666666;
			padding:8rpx 28rpx;

			&-money {
				color: rgba(51, 51, 51, 1);
				font-weight: 500;
				font-size: 28rpx;
			}
			.incomeStyle {
				color: rgba(253, 120, 15, 1);
				font-weight: 500;
			}
			&-time {
				color: rgba(200, 200, 200, 1);
				font-size: 24rpx;
				height: 50rpx;
			   	line-height: 50rpx;
			}
			.item-title-text {
			height: 50rpx;
			line-height: 50rpx;
		}
        .text-type {
            font-size: 28rpx;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
        }
        .text-orderNo {
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(200, 200, 200, 1);
        }
		}
	}
}
</style>
