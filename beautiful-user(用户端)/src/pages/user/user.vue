<template>
	<view class="user-page">
		<view class="user-header">
			<view class="avatar">
				<u-avatar :src="information.headImgUrl" shape="circle" size="58"></u-avatar>
				<text style="padding-left: 16rpx">{{ information.userName }}</text>
			</view>
		</view>
		<view class="user-assets">
			<view v-for="(item, index) in userCard" :key="index + 'quan'" class="user-assets-acount">
				<image :src="item.img" style="width: 48rpx; height: 48rpx; vertical-align: middle"></image>
				<text class="user-assets-label">{{ item.label }}</text>
				<view @click="viewAssets(item.lookUrl)">
					<view class="user-assets-number">{{ item.number }}</view>
					<view class="user-assets-todo">
						<text>去查看 > </text>
					</view>
				</view>
			</view>
			<u-line class="centerLine" direction="col" length="74rpx" color="#E8E8E8"></u-line>
		</view>
		<view class="share-modular">
			<view
				class="share-invitation"
				:class="{ 'share-invitation-hover': self > 0 }"
				v-for="(item, self) in shareData"
				:key="self"
				@click="shareClick(item, self)"
			>
				<u--image :src="item.iconImg | setCdnImgSize('100')" width="84" height="100"></u--image>
				<view class="share-text">
					<view class="flex font-16">
						<text class="titleText">{{ item.titleText }}</text>
						<text class="titleText-right">{{ item.text }}</text>
					</view>
					<text class="shareName">{{ item.shareName }}</text>
				</view>
			</view>
		</view>
		<view class="configure-modular">
			<view
				class="configure-item"
				v-for="(item, index) in listData"
				:key="index"
				@click="userSelect(item, index)"
			>
				<view class="flex">
					<u--image :src="item.iconImg" width="25" height="25"></u--image>
					<text class="p-l-10">{{ item.name }}</text>
				</view>
				<u-icon name="arrow-right" v-if="item.name !== '客服电话'" size="14" color="rgba(198, 198, 198, 0.90)">
				</u-icon>
				<text style="color: rgba(153, 153, 153, 1)" v-else>暂未开通</text>
			</view>
		</view>
		<view style="height: 168rpx"></view>
	</view>
</template>

<script>
import { userBasicApi, userAssets } from '@/api/user';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			userCard: [
				{
					img: '/static/order/icon-my.png',
					label: '我的总资产(元)',
					number: 0,
					lookUrl: './totalAssets',
				},
				{
					img: '/static/order/icon-quan.png',
					label: '我的优惠券(张)',
					number: 0,
					lookUrl: '/pages/order/coupon',
				},
			],
			listData: [
				{
					name: '客服电话',
					iconImg: '/static/user/icon_userService.png',
				},
				{
					name: '地址管理',
					iconImg: '/static/user/icon_userMap.png',
				},
				{
					name: '设置',
					iconImg: '/static/user/icon_userSet.png',
				},
				// {
				// 	name: '邀请有礼',
				// 	iconImg: '/static/user/icon_userShare.png'
				// },
				// {
				// 	name: '成为技师',
				// 	iconImg: '/static/user/icon_userTechnician.png'
				// },
				{
					name: '兑换码券',
					iconImg: '/static/user/icon-change.png',
				},
			],
			assets: '',
			information: {},
			shareData: [
				{
					iconImg: '/static/user/hongbao-img.png',
					titleText: '邀请',
					text: '有礼',
					shareName: '现金等你拿',
				},
				{
					iconImg: '/static/user/bg_technician.png',
					titleText: '成为',
					text: '技师',
					shareName: '平台有保障',
				},
			],
		};
	},
	onLoad() {
		this.getUser();
	},
	computed: {
		...mapState({
			userToken: state => state.userToken,
			secretKey: state => state.secretKey,
		}),
	},
	methods: {
		viewAssets(url) {
			uni.navigateTo({
				url,
			});
		},
		shareClick(item, index) {
			switch (index) {
				case 0:
					uni.navigateTo({
						url: './user-share',
					});
					break;
				case 1:
					const url =
						window.location.origin +
						'/business/#/?token=' +
						this.userToken +
						'&secretKey=' +
						this.secretKey;
					window.location.href = url;
					break;
			}
		},
		userSelect(item, index) {
			switch (index) {
				case 1:
					uni.navigateTo({
						url: './user-addressList',
					});
					break;

				case 2:
					uni.navigateTo({
						url: './set',
					});
					break;
				case 3:
					uni.navigateTo({
						url: 'pages/user/exchange/exchange',
					});

				// break;
			}
		},
		// 获取基本信息
		async getUser() {
			try {
				let res = await userBasicApi();
				let user = await userAssets();
				this.assets = user.data.totalAssets;
				this.userCard[0].number = user.data.totalAssets;
				this.userCard[1].number = user.data.couponTotal;
				this.information = res.data;
				// 判断是否绑定手机号
				if (!res.data.isBindMobile) {
					uni.navigateTo({
						url: '../login/bind-mobile-phone.vue',
					});
				} else if (!isArtificer) {
					console.log('没有认证技师');
				}
			} catch (error) {
				this.failMessage({
					msg: error.msg,
				});
			}
		},
	},
};
</script>

<style lang="scss">
.z-paging-reached-top {
	top: 0 !important;
}

.user-page {
	display: flex;
	flex-direction: column;
	background: #f5f8fa;
	font-family: Source Han Sans CN-Medium, Source Han Sans CN;

	.user-header {
		position: relative;
		display: flex;
		height: 434rpx;
		background: url(../../static/user/beijing-img.png) no-repeat;
		background-size: 100% 100%;
		line-height: 120rpx;

		.avatar {
			display: flex;
			flex-direction: row;
			justify-content: start;
			margin: 80rpx 30rpx;
			font-size: 18px;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			// padding-left: 16rpx;
		}
	}

	.user-assets {
		display: flex;
		justify-content: space-between;
		padding: 0 38rpx;
		height: 250rpx;
		align-items: center;
		margin: -200rpx 30rpx 0 30rpx;
		z-index: 9999;
		background: rgba(255, 255, 255, 1);
		border-radius: 32rpx;
		position: relative;

		.centerLine {
			position: absolute;
			left: 50%;
			top: 40%;
			transform: translate(-50%, -50%);
		}

		&-acount {
			text-align: center;
		}

		&-lable {
			font-size: 28rpx;
			color: #999999;
		}

		&-number {
			text-align: center;
			font-size: 52rpx;
			font-weight: bold;
			padding: 12rpx 0;
		}

		&-todo {
			text-align: center;
			color: #c6c6c6;
			font-size: 24rpx;
		}

		// 	.assets-item {
		// 		display: flex;
		// 		flex-wrap: wrap;
		// 		display: block;
		// 		font-size: 28rpx;
		// 		font-weight: 500;
		// 		color: #999999;
		// 		.assets-title {
		// 			font-size: 28rpx;
		// 			font-weight: 500;
		// 			color: #333333;
		// 			span {
		// 				color: #999999;
		// 			}
		// 		}
		// 		.quota {
		// 			font-size: 52rpx;
		// 			font-weight: 500;
		// 			text-align: center;
		// 			color: #333333;
		// 		}
		// 	}
		// 	.assets-btn{

		// 		.u-button {
		// 			width: 220rpx;
		// 			height: 68rpx;
		// 			font-weight: 600;
		// 			font-size: 28rpx;
		// 			color: rgba(255, 255, 255, 1);
		// 			box-shadow: 0 6rpx 12rpx 2rpx rgba(255,159,129,0.33);
		// 			background: linear-gradient(270deg, rgba(255, 112, 99, 1) 0%, rgba(255, 162, 131, 1) 100%);

		// 		}
		// 		::v-deep .u-button__text{
		// 			font-size: 28rpx !important;
		// 		}
		// 	}

		// 	.u-button--primary{
		// 		border: none;
		// 	}
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
			background: linear-gradient(91deg, #ffd5d1 0%, rgba(255, 255, 255, 1) 100%);
			box-shadow: 0px 4rpx 8rpx 2rpx rgba(0, 0, 0, 0.06);
			border-radius: 20rpx;
		}

		.share-invitation-hover {
			background: linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(219, 230, 252, 1) 100%);
		}

		.share-text {
			.titleText {
				color: #ff564a;
				font-weight: bold;
			}

			.titleText-right {
				color: #666666;
				font-weight: 500;
			}

			.shareName {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
		}
	}

	.configure-modular {
		background: rgba(255, 255, 255, 1);
		border-radius: 32rpx;
		margin: 0 30rpx;
		padding: 20rpx 0;

		.configure-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			padding: 30rpx;

			::v-deep .u-icon__icon .uicon-arrow-right {
				font-size: 30rpx;
				color: rgba(198, 198, 198, 1) !important;
				background: rgba(198, 198, 198, 1);
			}
		}
	}
}
</style>
