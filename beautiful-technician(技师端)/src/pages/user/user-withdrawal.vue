<template>
	<view class="withdrawal-page">
		<view class="withdrawal-page-to-box">
			<view class="withdrawal-page-to">
				<text class="font-16">银行 </text>
				<input v-model="submitData.bankName" type="text" placeholder="请输入银行名称">
			</view>
			<view class="withdrawal-page-to">
				<text class="font-16">持卡人 </text>
				<input v-model="submitData.accountName" type="text" placeholder="请输入持卡人姓名">
			</view>
			<view class="withdrawal-page-to">
				<text class="font-16">卡号 </text>
				<input v-model="submitData.cardNo" type="number" placeholder="请输入银行卡号">
			</view>
			<view class="withdrawal-page-to" style="border: 0;">
				<text class="font-16">支行 </text>
				<input v-model="submitData.subBranch" type="text" placeholder="请输入开户支行">
			</view>
		</view>

		<view class="withdrawal-page-item">
			<view class="withdrawal-item-title">
				<text class="p-r-10">可提现金额:</text>
				<text>{{userAsset.allowWithdrawal}} 元</text>
			</view>
			<view class="withdrawal-item-input flex-no-horizontal">
				<text>￥</text>
				<input v-model="submitData.amount" type="number" placeholder="请输入提现金额(整数)" @input="amountChange">
			</view>
			<text class="withdrawal-item-text">
				注：可提现金额包含（订单结算和订单分佣），每两周可提
				现一次，提现金额须为证书且大于100。收到提现申请后，
				财务会在每月3日、17日进行打款，预计在72小时内完成。
			</text>
		</view>
		<view class="withdrawal-page-btn">
			<u-button type="number" text="提现"
				color="linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%)"
				@click="withdrawalClick"></u-button>
		</view>
	</view>
</template>
<script>
	import { createWithdrawalOrderApi ,withdrawalOrderCard} from '../../api/user.js'
	import { userAssetApi } from '../../api/technician.js'
	export default {
		data() {
			return {
				submitData: {
					amount: '', //提现金额
					accountName: '', //户名
					cardNo: '', //卡号
					bankName: '', //银行
					subBranch: '' //支行
				},
				userAsset: {
					allowWithdrawal: 0
				},
			};
		},
		onLoad() {
			this.getUserAsset()
			this.bankCard()
		},
		methods: {
			async getUserAsset() {
				try {
					const res = await userAssetApi();
					this.userAsset = res.data;
				} catch (e) {
					this.failMessage(e);
				}
			},
			amountChange(e){
				// console.log(e.detail.value)
				this.$nextTick(()=>{
					this.submitData.amount = parseInt(e.detail.value)
				})
			},
			async bankCard(){
				try{
					let res=await withdrawalOrderCard()
					this.submitData={
						accountName: res.data.accountName, //户名
						cardNo: res.data.cardNo, //卡号
						bankName: res.data.bankName, //银行
						subBranch: res.data.subBranch ,//支行
						amount:'',
					}
					console.log(res.data,"aaaaaaaaaa")
				}catch(e){
					this.failMessage(e)
					//TODO handle the exception
				}
			},
			async withdrawalClick() {
				try {
					switch (true) {
						case !this.submitData.amount:
							this.failMessage({
								msg: '请输入提现金额'
							});
							break;
						case parseFloat(this.submitData.amount) < 100:
							this.failMessage({
								msg: '提现金额小于100'
							});
							break;
						case parseFloat(this.submitData.amount) > parseFloat(this.userAsset.allowWithdrawal):
							this.failMessage({
								msg: '可提现余额仅为 '+this.userAsset.allowWithdrawal
							});
							break;
						case !this.submitData.accountName:
							this.failMessage({
								msg: '请输入持卡姓名'
							});
							break;
						case !this.submitData.cardNo:
							this.failMessage({
								msg: '请输入卡号'
							});
							break;
						case !this.submitData.bankName:
							this.failMessage({
								msg: '请输入银行名称'
							});
							break;
						case !this.submitData.subBranch:
							this.failMessage({
								msg: '请输入支行名称'
							});
							break;
						default:
							const res = await createWithdrawalOrderApi(this.submitData)
							this.failMessage({
								msg: '申请成功'
							});
							setTimeout(() => {
								uni.navigateBack()
							}, 800);
							break;
					}
				} catch (e) {
					this.failMessage(e);
				}
			}
		}
	}
</script>
<style>
	page {
		background-color: rgba(244, 244, 244, 1);
	}
</style>
<style lang="scss" scoped>
	.withdrawal-page {
		display: flex;
		flex-direction: column;
		padding: 18rpx 30rpx;
		background: rgba(245, 248, 250, 1);

		.withdrawal-page-to-box {
			padding: 4rpx 30rpx 10rpx 30rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 32rpx;

			.withdrawal-page-to {
				display: flex;
				flex: 1;
				flex-direction: row;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 2rpx solid rgba(241, 241, 241, 1);
				color: rgba(0, 0, 0, 1);
				font-size: 28rpx;
				font-weight: 500;

				text {
					flex: 0.3;
					font-weight: bold;
				}

				input {
					flex: 0.7;
					font-size: 32rpx;
					color: rgba(51, 51, 51, 1);
				}
			}
		}

		.withdrawal-page-item {
			margin: 20rpx 0;
			padding: 0 30rpx 30rpx;
			border-radius: 32rpx;
			background: rgba(255, 255, 255, 1);

			.withdrawal-item-title {
				padding-top: 30rpx;
				font-weight: 400;
			}

			.withdrawal-item-text {
				font-size: 24rpx;
				color: rgba(226, 226, 226, 1);
			}
			.withdrawal-item-input{
				flex: 1;
				padding: 30rpx 0 14rpx 0;
				margin-bottom: 30rpx;
				border-bottom: 2rpx solid rgba(241, 241, 241, 1);
				text{
					flex: 0.1;
					color: rgba(0, 0, 0, 1);
					font-size: 44rpx;
					font-weight: bold;
				}
				input{
					flex: 0.9;
				}
			}
		}

		.withdrawal-page-btn {
			margin-top: 100rpx;

			.u-button {
				border-radius: 40rpx;
			}

			::v-deep .u-button__text {
				font-size: 32rpx !important;
			}
		}

	}
</style>
