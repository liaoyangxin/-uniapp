<template>
	<view class="wrap">
		<view class="font-img flex-no-horizontal"
			><u--image :src="'/static/user/font_technician.png'" width="250" height="40"></u--image
		></view>
		<view class="font-img m-t-10 flex-no-horizontal"
			><u--image :src="'/static/user/btn_technician.png'" width="180" height="30"></u--image
		></view>

		<!-- 基础信息模块 -->
		<view class="top">
			<view class="font-img flex-no-horizontal"
				><u--image :src="'/static/user/btn_technicianFome.png'" width="288" height="50"></u--image
			></view>
			<view class="top-main">
				<view class="status flex-no-horizontal" v-if="orderStatus === 150"
					><u--image :src="'/static/user/bg_auditRevocation.png'" width="171" height="168"></u--image
				></view>
				<view class="status flex-no-horizontal" v-if="orderStatus === 400"
					><u--image :src="'/static/user/bg_auditSucceed.png'" width="171" height="168"></u--image
				></view>
				<view class="status flex-no-horizontal" v-if="orderStatus === 100"
					><u--image :src="'/static/user/bg_auditUnderway.png'" width="171" height="168"></u--image
				></view>
				<view class="top-main-item flex">
					<view class="top-main-item-title font-16 font-bold">姓名</view>
					<view class="top-main-item-input">
						{{ submitData.name }}
					</view>
				</view>
				<view class="top-main-sex">
					<u-radio-group v-model="radiovalue1">
						<u-radio
							:customStyle="{ marginRight: '8px' }"
							v-for="(item, index) in radiolist1"
							:key="index"
							:label="item.name"
							:name="item.name"
							@change="radioChange"
							:disabled="true"
						></u-radio>
					</u-radio-group>
				</view>
				<view class="top-main-item flex">
					<view class="top-main-item-title font-16 font-bold">联系方式</view>
					<view class="top-main-item-input">
						{{ submitData.mobile }}
					</view>
				</view>
				<view class="top-main-item flex">
					<view class="top-main-item-title font-16 font-bold" style="flex: 0.35">个人简介</view>
					<view class="top-main-item-input" style="flex: 0.65">
						{{ submitData.userDesc }}
					</view>
				</view>
				<view class="top-main-item flex" style="border: 0"
					><view class="top-main-item-title font-16 font-bold">注册地址</view></view
				>
				<view class="top-main-address flex">
					<view class="top-main-address-text font-14">{{ selectAddress }}</view>
					<u-icon name="map-fill" color="rgba(107, 187, 42, 1)" size="20"></u-icon>
				</view>
				<view class="top-main-updataImg flex">
					<view class="top-main-updataImg-title">
						<view class="font-16 font-bold">本人真实形象照</view>
					</view>
					<view class="top-main-updataImg-item flex-no-horizontal">
						<u--image
							:src="submitData.headImg | setCdnImgSize('70')"
							v-if="submitData.headImg"
							width="70"
							height="70"
							radius="6"
							@click="previewImages(submitData.headImg)"
						></u--image>
					</view>
				</view>
				<view class="top-main-updataImg" style="border: 0; display: flex; align-items: center">
					<view class="top-main-updataImg-title">
						<view class="font-16 font-bold">本人生活照</view>
					</view>
					<view
						class="top-main-updataImg-item flex-no-horizontal"
						style="margin: 10rpx"
						v-for="(item, index) in submitData.lifeImgs"
						:key="index"
					>
						<u--image
							:src="item | setCdnImgSize('70')"
							v-if="item"
							width="70"
							height="70"
							radius="6"
							@click="previewImages(item)"
						></u--image>
					</view>
				</view>
			</view>
		</view>

		<!-- 身份信息模块 -->
		<view class="middle">
			<view style="padding: 28rpx; margin: 0 64rpx 0 42rpx; border: 2rpx dashed rgba(116, 155, 254, 1)">
				<view class="middle-item">
					<view class="middle-item-title font-16 font-bold">身份证正反面</view>
					<view class="middle-item-updataImg flex-no-horizontal">
						<view
							class="middle-item-updataImg-item flex-no-horizontal m-r-10"
							v-for="(item, index) in submitData.idCardImgs"
							:key="index"
						>
							<u--image
								:src="item | setCdnImgSize('115')"
								v-if="item"
								width="119"
								height="75"
								radius="6"
								@click="previewImages(item)"
							></u--image>
						</view>
					</view>
				</view>
				<view class="middle-item">
					<view class="middle-item-title font-16 font-bold">营业执照</view>
					<view class="middle-item-updataImg flex-no-horizontal">
						<view
							class="middle-item-updataImg-item flex-no-horizontal"
							v-for="(item, index) in submitData.businessLicenseImgs"
							:key="index"
						>
							<u--image
								:src="item | setCdnImgSize('115')"
								v-if="item"
								width="119"
								height="75"
								radius="6"
								@click="previewImages(item)"
							></u--image>
						</view>
					</view>
				</view>
				<view class="middle-item">
					<view class="middle-item-title font-16 font-bold">技师健康证</view>
					<view class="middle-item-updataImg flex-no-horizontal">
						<view
							class="middle-item-updataImg-item flex-no-horizontal"
							v-for="(item, index) in submitData.qualificationImgs"
							:key="index"
						>
							<u--image
								:src="item | setCdnImgSize('115')"
								v-if="item"
								width="119"
								height="75"
								radius="6"
								@click="previewImages(item)"
							></u--image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 项目选择模块 -->
		<view class="bottom" :class="{ 'bottom-reject': remark }">
			<image
				src="../../static/user/bg_audit_bottom_top@2x.png"
				style="width: 100%; display: block"
				mode="widthFix"
			></image>
			<view class="bottom-box">
				<view class="bottom-box-title font-16 font-bold">注册项目</view>
				<view
					class="bottom-box-item flex"
					v-for="(item, index) in productList"
					:key="item.sysId"
					:class="{ 'bottom-box-item-hover': index === productList.length - 1 }"
				>
					<view class="bottom-box-item-title flex-no-horizontal">
						<view class="bbit-punctuation"></view>
						<view class="bbit-text font-14">{{ item.productName }}</view>
						<view class="bbit-time font-12">({{ item.serverTime }}分钟)</view>
					</view>
					<u--image
						:src="!item.ifSelect ? '/static/user/icon-select.png' : '/static/user/icon-selectHover.png'"
						width="20"
						height="20"
					></u--image>
				</view>

				<!-- 保证金部分 -->
				<view class="bottom-box-item flex">
					<view class="bottom-box-item-title flex-no-horizontal">
						<u--image :src="'/static/user/icon_share_money.png'" width="26" height="26"></u--image>
						<view class="bbit-earnest font-16 font-bold">我的保证金</view>
						<view class="bbit-balance font-16 font-bold">({{ userAsset.bond }})</view>
					</view>
				</view>
			</view>
			<!-- <scroll-view :scroll-y="true" style="height: 400rpx">
					<view
						class="bottom-box-item flex"
						v-for="(item, index) in productList"
						:key="item.sysId"
						:class="{ 'bottom-box-item-hover': index === productList.length - 1 }"
					>
						<view class="bottom-box-item-title flex-no-horizontal">
							<view class="bbit-punctuation"></view>
							<view class="bbit-text font-14">{{ item.productName }}</view>
							<view class="bbit-time font-12">({{ item.serverTime }}分钟)</view>
						</view>
						<u--image
							:src="!item.ifSelect ? '/static/user/icon-select.png' : '/static/user/icon-selectHover.png'"
							width="20"
							height="20"
						></u--image>
					</view>
				</scroll-view> -->
			<image src="../../static/user/bg_audit_bottom_bottom@2x.png" style="width: 100%" mode="widthFix"></image>
		</view>

		<!-- 审核失败部分 -->
		<view class="bottom" v-if="remark">
			<view class="bottom-box" style="border: 2rpx dashed rgba(255, 143, 143, 1)">
				<view class="bottom-box-title font-14 font-bold">不合格项：</view>
				<view class="bottom-box-reject font-12">{{ remark }}</view>
			</view>
		</view>

		<u-button class="btn" type="primary" :text="btnText" @click="revocationClick"></u-button>

		<view style="height: 60rpx"></view>
	</view>
</template>

<script>
import { addressRegular } from '../../utility/wechat.js';
import { updataFileFun } from '../../utility/upload.js';
import {
	createAuditOrderApi,
	productListApi,
	userAssetApi,
	getAuditResultApi,
	revocationAuditOrderApi,
} from '../../api/technician.js';
export default {
	data() {
		return {
			radiolist1: [
				{
					name: '男',
					disabled: false,
				},
				{
					name: '女',
					disabled: false,
				},
			],
			radiovalue1: '',
			src: false,
			selectAddress: '',
			submitData: {
				name: '',
				sex: 2,
				mobile: '',
				address: {
					country: '中国',
					province: '',
					city: '',
					county: '',
					address: '',
					latitude: '',
					longitude: '',
				},
				headImg: '', //形象照片
				lifeImgs: [], //生活照
				businessLicenseImgs: [], //营业执照图片
				qualificationImgs: [], //从业资格证图片
				idCardImgs: [], //身份证照片
				productIds: [],
				userDesc: '',
			},
			productList: [
				{
					productName: '',
					serverTime: 0,
				},
			],
			userAsset: {
				bond: 0,
			},
			remark: '',
			orderId: '', //订单id
			btnText: '撤销',
			orderStatus: 0,
			inquireOrderId: 0, //查询id
		};
	},
	onLoad(e) {
		this.inquireOrderId = e.id ? parseInt(e.id) : 0;
		this.getUserAsset();
		this.getOrderStatus();
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

		async getOrderStatus() {
			try {
				const productListRes = await productListApi({
					page: 1,
					pageSize: 100,
				});
				this.productList = productListRes.data.data.map((item, index) => {
					return {
						productName: item.productName,
						serverTime: item.serverTime,
						ifSelect: true,
						sysId: item.sysId,
					};
				});
				const res = await getAuditResultApi({
					id: this.inquireOrderId,
				});
				if (Object.keys(res.data).length) {
					this.orderId = res.data.guid;
					this.remark = res.data.remark;
					this.orderStatus = res.data.status;
					//已撤销
					if (res.data.status !== 100) {
						this.btnText = '重新提交';
					}
					this.radiovalue1 = res.data.sex === 1 ? '男' : '女';
					this.submitData = {
						address: res.data.address,
						mobile: res.data.mobile,
						name: res.data.name,
						sex: res.data.sex,
						headImg: res.data.headImg,
						lifeImgs: res.data.lifeImgs,
						businessLicenseImgs: res.data.businessLicenseImgs,
						qualificationImgs: res.data.qualificationImgs,
						idCardImgs: res.data.idCardImgs,
						productIds:
							res.data.status < 400
								? res.data.lastProductId.subProductId
								: res.data.lastProductId.passProductId,
						userDesc: res.data.userDesc,
					};
					console.log(this.submitData, 'this.submitDatasss');
					this.selectAddress = res.data.address.address;
					this.productList = this.productList.filter((item, index) => {
						return this.submitData.productIds.indexOf(item.sysId) !== -1;
					});
				}
			} catch (e) {
				this.failMessage(e);
			}
		},

		//预览图片
		async previewImages(url) {
			try {
				let urls = [];
				Object.prototype.toString.call(url) !== '[object Array]' ? (urls = [url]) : (urls = url);
				const res = await uni.previewImage({
					urls,
				});
			} catch (e) {
				this.failMessage(e);
			}
		},

		//撤销
		async revocationClick() {
			try {
				if (this.orderStatus !== 100) {
					uni.redirectTo({
						url: '/pages/user/user-audit?ifAnew=ture',
					});
					return;
				}
				const res = await revocationAuditOrderApi({
					guid: this.orderId,
				});
				this.getOrderStatus();
				this.failMessage({
					msg: '操作成功',
				});
			} catch (e) {
				this.failMessage(e);
			}
		},
	},
};
</script>

<style lang="scss">
page {
	background-color: rgba(163, 199, 251, 1);
}
.wrap {
	padding: 48rpx 30rpx;
	background: {
		repeat: no-repeat;
		image: url('../../static/user/bg_technician.png');
		size: 100% 200%;
		position: 0 0;
	}
	height: 100%;
	.font-img {
		justify-content: center;
	}
	.top {
		padding: 50rpx 0;
		background: {
			repeat: no-repeat;
			image: url('../../static/user/bg_technicianTop.png');
			size: 100% 100%;
			position: 0 0;
		}
		&-main {
			position: relative;
			margin: 30rpx 64rpx 0 42rpx;
			border: 2rpx dashed rgba(116, 155, 254, 1);
			.status {
				width: 342rpx;
				position: absolute;
				z-index: 10;
				justify-content: center;
				top: -162rpx;
				right: -50rpx;
			}
			&-item {
				flex: 1;
				padding: 28rpx 0;
				margin: 0 30rpx;
				border-bottom: 2rpx dashed rgba(116, 155, 254, 1);
				&-title {
					flex: 0.5;
					color: rgba(51, 51, 51, 1);
				}
				&-input {
					flex: 0.5;
					padding-right: 20rpx;
					text-align: right;
					&-pla {
						color: rgba(153, 153, 153, 1);
						font-size: 28rpx;
					}
				}
			}
			&-sex {
				padding: 28rpx 0;
				margin: 0 30rpx;
				border-bottom: 2rpx dashed rgba(116, 155, 254, 1);
			}
			&-address {
				padding-bottom: 28rpx;
				margin: 0 30rpx;
				border-bottom: 2rpx dashed rgba(116, 155, 254, 1);
				&-text {
					color: rgba(51, 51, 51, 1);
				}
			}
			&-updataImg {
				flex-wrap: wrap;
				padding: 28rpx 0;
				margin: 0 30rpx;
				border-bottom: 2rpx dashed rgba(116, 155, 254, 1);
				&-title {
					color: rgba(51, 51, 51, 1);
					view:nth-child(2) {
						margin-top: 10rpx;
					}
				}
				&-item {
					position: relative;
					justify-content: center;
					margin-bottom: 20rpx;
					border-radius: 12rpx;
					background-color: rgba(243, 243, 243, 1);
					width: 140rpx;
					height: 140rpx;
					.tmui-delete {
						position: absolute;
						top: 5rpx;
						right: 5rpx;
						z-index: 10;
						justify-content: center;
						background-color: rgba(179, 180, 181, 1);
						border-radius: 50%;
					}
					.tmui-box {
						justify-content: center;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
	.middle {
		padding: 50rpx 0;
		background: {
			repeat: no-repeat;
			image: url('../../static/user/bg_technicianMiddle.png');
			size: 100% 100%;
			position: 0 0;
		}
		&-item {
			margin-bottom: 30rpx;
			&-title {
				margin-bottom: 16rpx;
				color: rgba(51, 51, 51, 1);
			}
			&-updataImg {
				&-item {
					position: relative;
					justify-content: center;
					border-radius: 12rpx;
					background-color: rgba(243, 243, 243, 1);
					width: 230rpx;
					height: 146rpx;
					.tmui-delete {
						position: absolute;
						top: 5rpx;
						right: 5rpx;
						z-index: 10;
						justify-content: center;
						background-color: rgba(179, 180, 181, 1);
						border-radius: 50%;
					}
					.tmui-box {
						justify-content: center;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
	.bottom {
		// padding: 20rpx 0 40rpx 0;
		// background: {
		// 	repeat: no-repeat;
		// 	image: url('../../static/user/bg_technicianBottom.png');
		// 	size: 100% 100%;
		// 	position: 0 0;
		// }
		&-box {
			// padding: 28rpx;
			padding: 0 68rpx 0 44rpx;
			// border: 2rpx dashed rgb(116, 155, 254);
			background: {
				repeat: no-repeat;
				image: url('../../static/user/bg_audit_bottom_ middle@2x.png');
				size: 100% 100%;
				position: 0 0;
			}
			&-title {
				color: rgba(51, 51, 51, 1);
			}
			&-topImg {
				width: 100%;
				height: 100rpx;
			}
			&-item {
				margin-top: 16rpx;
				&-title {
					.bbit-punctuation {
						margin-right: 10rpx;
						border-radius: 50%;
						background-color: rgba(53, 109, 252, 1);
						width: 10rpx;
						height: 10rpx;
					}
					.bbit-text {
						color: rgba(51, 51, 51, 1);
					}
					.bbit-time {
						margin-left: 20rpx;
						color: rgba(153, 153, 153, 1);
					}
				}
				&-btn {
					margin: 0;
					background: rgba(53, 109, 252, 1);
					box-shadow: 0 4rpx 8rpx 2rpx rgba(53, 109, 252, 0.27);
					border-radius: 28rpx;
					width: 168rpx;
					height: 56rpx;
				}
			}
			&-item-hover {
				padding-bottom: 40rpx;
				// border-bottom: 2rpx dashed rgba(116, 155, 254, 1);
			}
			&-reject {
				line-height: 44rpx;
				color: rgba(51, 51, 51, 1);
			}
		}
	}
	.bottom-reject {
		background: {
			repeat: no-repeat;
			image: url('../../static/user/bg_technicianMiddle.png');
			size: 100% 100%;
			position: 0 0;
		}
	}
	.btn {
		margin: 20rpx auto;
		background: {
			color: rgba(163, 199, 251, 1);
			repeat: no-repeat;
			image: url('../../static/user/btn_bg_technician.png');
			size: 100% 100%;
			position: 0 0;
		}
		border: 0;
		width: 696rpx;
		height: 96rpx;
		color: rgba(53, 109, 252, 1);
		font-size: 40rpx;
		font-weight: bold;
	}
}
</style>
