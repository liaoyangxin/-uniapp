<template>
	<view class="user-page">
		<view class="user-header">
			<view class="avatar" style="height: 116rpx;">
				<u-avatar :src="userInfo.headImgUrl || '/static/logo_headLogin.png'" shape="circle" size="58" @click="nextOperation('login')"></u-avatar>
				<text style="padding-left: 16rpx;">{{ userInfo.userName || '微信用户' }}</text>

				<view class="btn-rate-box m-l-10" v-if="userInfo">
					<view class="btn-rate flex-no-horizontal">
						<text class="font-14">{{ userInfo.score || '' }}</text>
						<u-icon name="star-fill" color="rgba(255, 70, 0, 1)" size="18"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="user-assets">
			<view class="assets-item-box">
				<view class="assets-item">
					<u--image src="/static/user/icon_user_balance.png" width="15" height="15"></u--image>
					<text class="assets-title">
						{{ '&nbsp;' + '我的总资产' }}
						<span>(元)</span>
					</text>
				</view>
				<text class="quota">{{ '&nbsp;&nbsp;' + userAssetData.totalAssets }}</text>
			</view>
			<u-button type="primary" class="withdrawal-btn" :plain="true" text="去提现" size="small" shape="circle" color="rgba(255, 255, 255, 1)" @click="viewAssets"></u-button>
		</view>
		<view class="share-modular">
			<view class="share-invitation" v-for="(item, self) in shareData" :key="self" :style="{ background: item.bgColour }" @click="nextOperation(item.titleText + item.text)">
				<u--image :src="item.iconImg" width="84" height="100"></u--image>
				<view class="share-text">
					<view class="font-16 m-b-10">
						<text class="titleText">{{ item.titleText }}</text>
						<text class="titleText-right">{{ item.text }}</text>
					</view>
					<text class="shareName">{{ item.shareName }}</text>
				</view>
			</view>
		</view>
		<view class="configure-modular">
			<view class="configure-item" v-for="(item, index) in listData" :key="index" @click="nextOperation(item.name)">
				<view class="flex">
					<u--image :src="item.iconImg" width="25" height="25"></u--image>
					<text>{{ '&nbsp;' + item.name }}</text>
				</view>
				<u-icon name="arrow-right" color="rgba(198, 198, 198, 0.90)" size="14"></u-icon>
			</view>
		</view>
		<u-overlay :show="ifShareShow" @click="ifShareShow = false">
			<view class="share-guidance">
				<view class="share-guidance-top"><u--image src="/static/user/share-btn.png" width="45" height="50"></u--image></view>
				<view class=""><u--image src="/static/user/share-text.png" width="270" height="80"></u--image></view>
				<view class="" @click="ifShareShow = false"><u--image src="/static/user/I-know.png" width="182" height="50"></u--image></view>
			</view>
		</u-overlay>
		<view style="height: 200rpx;"></view>
	</view>
</template>

<script>
import { userAssetApi, getAuditOrderStatusApi } from '../../api/technician.js';
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			img: 'http://mlx-user-test-1312871973.cos.ap-chengdu.myqcloud.com/2022-11-03/product-image/2eeacbc290f25d16752d94478516bfad.png',
			listData: [
				{
					name: '我的审核',
					iconImg: '/static/user/icon-userAudit.png'
				},
				{
					name: '我的项目',
					iconImg: '/static/user/icon-userProduct.png'
				},
				{
					name: '设置',
					iconImg: '/static/user/icon-userSet.png'
				},
				{
					name: '服务时间',
					iconImg: '/static/user/icon-date.png'
				},
				{
					name: '技师规范',
					iconImg: '/static/user/icon-userTechnician.png'
				}
				
			],
			shareData: [
				{
					iconImg: '/static/user/btn_redPacket.png',
					titleText: '推荐',
					text: '技师',
					shareName: '高推荐费 高返佣',
					bgColour: 'linear-gradient(91deg, #ffd5d1 0%, #ffffff 100%)'
				},
				{
					iconImg: '/static/user/bg_user_recruit.png',
					titleText: '成为',
					text: '技师',
					shareName: '提成高达80%',
					bgColour: 'linear-gradient(270deg, #FFFFFF 0%, #DBE6FC 100%)'
				}
			],
			userAssetData: {
				totalAssets: 0, //总资产
				incomeSharing: 0, //分享收入
				orderRevenue: 0, //订单收入
				rechargeIncome: 0, //余额
				bond: 0, //保证金
				allowWithdrawal: 0 //可提现金额
			},
			urlParms: null,
			ifShareShow: false
		};
	},
	onLoad() {},
	onShow() {
		if (this.userToken) {
			this.getUserAsset();
			this.getUserInfo();
		} else {
			uni.navigateTo({
				url: '/pages/login/login'
			});
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.userInfo,
			userToken: state => state.userToken
		})
	},
	methods: {
		...mapActions(['getUserInfo']),
		async getUserAsset() {
			try {
				const res = await userAssetApi();
				this.userAssetData = res.data;
			} catch (e) {
				this.failMessage(e);
			}
		},
		viewAssets() {
			uni.navigateTo({
				url: './user-earnings'
			});
		},
		testFun(e) {
			console.log(e);
		},
		nextOperation(name) {
			switch (name) {
				case '我的项目':
					uni.navigateTo({
						url: './user-projects'
					});
					break;
				case '成为技师':
					this.auditFunc();
					break;
				case 'login':
					if (!this.userToken) {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}
				case '设置':
					uni.navigateTo({
						url: './set'
					});
					break;
				case '我的审核':
					this.auditFunc();
					break;
				case '推荐技师' :
					uni.navigateTo({
						url: './user-share'
					});
					break;
				case '技师规范' :
					uni.navigateTo({
						url:'/pages/rostering/webView?url=' + this.TechnicianSpecifications
					})
					break;
				case '技师招募':
					this.ifShareShow = true;
					break;
				case '服务时间':
					uni.navigateTo({
						url: 'pages/user/serviceTime/serviceTime'
					});
					break;
			}
		},
		async auditFunc() {
			try {
				uni.showLoading({
					title: '请稍后'
				});
				const res = await getAuditOrderStatusApi();
				Object.keys(res.data).length
					? uni.navigateTo({
							url: './user-audit-success'
					  })
					: uni.navigateTo({
							url: './user-audit'
					  });
			} catch (e) {
				this.failMessage(e);
			} finally {
				setTimeout(() => {
					uni.hideLoading();
				}, 500);
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f5f8fa;
}

.user-page {
	display: flex;
	flex-direction: column;
	background: #f5f8fa;

	.user-header {
		position: relative;
		display: flex;
		height: 434rpx;
		background: url(../../static/user/bg_userTop.png) no-repeat;
		background-size: 100% 100%;
		line-height: 120rpx;

		.avatar {
			display: flex;
			flex-direction: row;
			justify-content: start;
			align-items: center;
			margin: 80rpx 30rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #ffffff;

			.btn-rate-box {
				width: 120rpx;
				height: 44rpx;
				background-color: rgba(255, 255, 255, 1);
				padding: 4rpx;
				border-radius: 28rpx;

				.btn-rate {
					justify-content: center;
					width: 116rpx;
					height: 40rpx;
					border-radius: 28rpx;
					border: 1px solid rgba(255, 45, 0, 1);
					color: rgba(255, 27, 0, 1);

					text {
						margin-right: 10rpx;
						font-weight: bold;
					}
				}
			}
		}
	}

	.user-assets {
		display: flex;
		justify-content: space-around;
		height: 216rpx;
		align-items: center;
		// width: 690rpx;
		margin: -150rpx 30rpx 0 30rpx;
		z-index: 9999;
		background: #ffffff;
		border-radius: 32rpx;

		.assets-item {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			width: 300rpx;
			padding: 0 48rpx;
			font-size: 28rpx;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			color: #999999;

			.assets-title {
				font-size: 28rpx;
				font-family: Source Han Sans CN-Medium, Source Han Sans CN;
				font-weight: 500;
				color: #333333;

				span {
					color: #999999;
				}
			}
		}

		.quota {
			padding: 0 48rpx;
			font-size: 52rpx;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			color: #333333;
		}

		.withdrawal-btn {
			border: {
				width: 0 !important;
			}

			width: 220rpx;
			height: 68rpx;
			font-weight: 600;
			font-size: 28rpx;
			color: rgba(255, 255, 255, 1);
			box-shadow: 0 6rpx 12rpx 2rpx rgba(255, 159, 129, 0.33);
			background: linear-gradient(270deg, rgba(255, 112, 99, 1) 0%, rgba(255, 162, 131, 1) 100%);
			border-radius: 50rpx;
		}
	}

	.share-modular {
		display: flex;
		justify-content: space-between;
		height: 200rpx;
		margin: 20rpx 30rpx;

		.share-invitation {
			display: flex;
			width: 48%;
			align-items: center;
			box-shadow: 0px 4rpx 8rpx 2rpx rgba(0, 0, 0, 0.06);
			border-radius: 20rpx;
		}

		.share-text {
			.titleText {
				color: #ff564a;
			}

			.titleText-right {
				color: #666666;
			}

			.shareName {
				font-size: 24rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
			}
		}
	}

	.configure-modular {
		background: #ffffff;
		border-radius: 32rpx;
		margin: 0 30rpx;
		padding: 20rpx 0;

		.configure-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 28rpx;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			color: #666666;
			padding: 30rpx;
		}
	}
}

.share-guidance {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 600rpx;
	align-items: center;
	text-align: center;
	padding: 80rpx 30rpx;
	margin-top: 20rpx;

	&-top {
		margin-left: 80%;
	}

	::v-deep .u-image__image div {
		background-size: 100% !important;
	}
}
</style>
