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
				<view class="top-main-item flex">
					<view class="top-main-item-title font-16 font-bold"
						><text style="color: #f00; padding-right: 10rpx">*</text>请输入姓名</view
					>
					<view class="top-main-item-input">
						<input
							v-model="submitData.name"
							type="text"
							placeholder="姓名"
							placeholder-class="top-main-item-input-pla"
						/>
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
						></u-radio>
					</u-radio-group>
				</view>
				<view class="top-main-item flex">
					<view class="top-main-item-title font-16 font-bold"
						><text style="color: #f00; padding-right: 10rpx">*</text>请输入联系方式</view
					>
					<view class="top-main-item-input"
						><input v-model="submitData.mobile" type="text" placeholder="手机号码" maxlength="11"
					/></view>
				</view>
				<view class="top-main-item flex">
					<view class="top-main-item-title font-16 font-bold" style="flex: 0.35">个人简介</view>
					<view class="top-main-item-input" style="flex: 0.65; text-align: right">
						<u--textarea
							v-model="submitData.userDesc"
							placeholder="请输入内容"
							autoHeight
							placeholderClass="top-main-item-input-pla"
							border="none"
						></u--textarea>
					</view>
				</view>
				<view class="top-main-item flex" style="border: 0"
					><view class="top-main-item-title font-16 font-bold"
						><text style="color: #f00; padding-right: 10rpx">*</text>请选择注册地址</view
					></view
				>
				<view class="top-main-address flex" @click="getLocation">
					<view
						class="top-main-address-text font-14"
						:class="{ 'top-main-address-text-hover': selectAddress !== '请选择地址' }"
						>{{ selectAddress }}</view
					>
					<u-icon name="map-fill" color="rgba(107, 187, 42, 1)" size="20"></u-icon>
				</view>
				<view class="top-main-updataImg flex">
					<view class="top-main-updataImg-title">
						<view class="font-16 font-bold"
							><text style="color: #f00; padding-right: 10rpx">*</text>请上传本人真实形象照</view
						>
						<view class="font-12">（有利于提高面试机会）</view>
					</view>
					<view class="top-main-updataImg-item flex-no-horizontal">
						<view class="tmui-box flex-no-horizontal" v-if="!headImg" @click="headImgClick">
							<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
						</view>
						<view class="tmui-delete flex-no-horizontal" v-if="headImg" @click="deleteImgs('headImg')">
							<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
						</view>
						<u--image
							:src="headImg | setCdnImgSize('70')"
							v-if="headImg"
							width="70"
							height="70"
							radius="6"
							@click="previewImages(headImg)"
						></u--image>
					</view>
				</view>
				<view class="top-main-updataImg flex" style="border: 0">
					<view class="top-main-updataImg-title">
						<view class="font-16 font-bold">请上传生活照</view>
						<view class="font-12">（有利于提高面试机会）</view>
					</view>
					<view class="top-main-updataImg-item flex-no-horizontal">
						<view class="tmui-box flex-no-horizontal" v-if="!lifeImgs[0]" @click="lifeImgsClick">
							<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
						</view>
						<view
							class="tmui-delete flex-no-horizontal"
							v-if="lifeImgs[0]"
							@click="deleteImgs('lifeImgs', 0)"
						>
							<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
						</view>
						<u--image
							:src="lifeImgs[0] | setCdnImgSize('70')"
							v-if="lifeImgs[0]"
							width="70"
							height="70"
							radius="6"
							@click="previewImages(lifeImgs[0])"
						></u--image>
					</view>
					<view class="top-main-updataImg-item flex-no-horizontal">
						<view class="tmui-box flex-no-horizontal" v-if="!lifeImgs[1]" @click="lifeImgsClick">
							<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
						</view>
						<view
							class="tmui-delete flex-no-horizontal"
							v-if="lifeImgs[1]"
							@click="deleteImgs('lifeImgs', 1)"
						>
							<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
						</view>
						<u--image
							:src="lifeImgs[1] | setCdnImgSize('70')"
							v-if="lifeImgs[1]"
							width="70"
							height="70"
							radius="6"
							@click="previewImages(lifeImgs[1])"
						></u--image>
					</view>
					<view class="top-main-updataImg-item flex-no-horizontal">
						<view class="tmui-box flex-no-horizontal" v-if="!lifeImgs[2]" @click="lifeImgsClick">
							<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
						</view>
						<view
							class="tmui-delete flex-no-horizontal"
							v-if="lifeImgs[2]"
							@click="deleteImgs('lifeImgs', 2)"
						>
							<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
						</view>
						<u--image
							:src="lifeImgs[2] | setCdnImgSize('70')"
							v-if="lifeImgs[2]"
							width="70"
							height="70"
							radius="6"
							@click="previewImages(lifeImgs[2])"
						></u--image>
					</view>
					<view class="top-main-updataImg-item flex-no-horizontal">
						<view class="tmui-box flex-no-horizontal" v-if="!lifeImgs[3]" @click="lifeImgsClick">
							<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
						</view>
						<view
							class="tmui-delete flex-no-horizontal"
							v-if="lifeImgs[3]"
							@click="deleteImgs('lifeImgs', 3)"
						>
							<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
						</view>
						<u--image
							:src="lifeImgs[3] | setCdnImgSize('70')"
							v-if="lifeImgs[3]"
							width="70"
							height="70"
							radius="6"
							@click="previewImages(lifeImgs[3])"
						></u--image>
					</view>
				</view>
			</view>
		</view>

		<!-- 身份信息模块 -->
		<view class="middle">
			<view style="padding: 28rpx; margin: 0 64rpx 0 42rpx; border: 2rpx dashed rgba(116, 155, 254, 1)">
				<view class="middle-item">
					<view class="middle-item-title font-16 font-bold"
						><text style="color: #f00; padding-right: 10rpx">*</text>请上传身份证正反面</view
					>
					<view class="middle-item-updataImg flex-no-horizontal">
						<view class="middle-item-updataImg-item flex-no-horizontal m-r-10">
							<view class="tmui-box flex-no-horizontal" v-if="!idCardImgs[0]" @click="idCardImgsClick">
								<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
							</view>
							<view
								class="tmui-delete flex-no-horizontal"
								v-if="idCardImgs[0]"
								@click="deleteImgs('idCardImgs', 0)"
							>
								<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
							</view>
							<u--image
								:src="idCardImgs[0] | setCdnImgSize('115')"
								v-if="idCardImgs[0]"
								width="119"
								height="75"
								radius="6"
								@click="previewImages(idCardImgs[0])"
							></u--image>
						</view>
						<view class="middle-item-updataImg-item flex-no-horizontal">
							<view class="tmui-box flex-no-horizontal" v-if="!idCardImgs[1]" @click="idCardImgsClick">
								<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
							</view>
							<view
								class="tmui-delete flex-no-horizontal"
								v-if="idCardImgs[1]"
								@click="deleteImgs('idCardImgs', 1)"
							>
								<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
							</view>
							<u--image
								:src="idCardImgs[1] | setCdnImgSize('115')"
								v-if="idCardImgs[1]"
								width="119"
								height="75"
								radius="6"
								@click="previewImages(idCardImgs[1])"
							></u--image>
						</view>
					</view>
				</view>
				<view class="middle-item">
					<view class="middle-item-title font-16 font-bold"
						><text style="color: #f00; padding-right: 10rpx">*</text>请上传营业执照</view
					>
					<view class="middle-item-updataImg flex-no-horizontal">
						<view class="middle-item-updataImg-item flex-no-horizontal">
							<view
								class="tmui-box flex-no-horizontal"
								v-if="!businessLicenseImgs[0]"
								@click="businessLicenseImgsClick"
							>
								<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
							</view>
							<view
								class="tmui-delete flex-no-horizontal"
								v-if="businessLicenseImgs[0]"
								@click="deleteImgs('businessLicenseImgs', 0)"
							>
								<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
							</view>
							<u--image
								:src="businessLicenseImgs[0] | setCdnImgSize('115')"
								v-if="businessLicenseImgs[0]"
								width="119"
								height="75"
								radius="6"
								@click="previewImages(businessLicenseImgs[0])"
							></u--image>
						</view>
					</view>
				</view>
				<view class="middle-item">
					<view class="middle-item-title font-16 font-bold"
						><text style="color: #f00; padding-right: 10rpx">*</text>请上传技师健康证</view
					>
					<view class="middle-item-updataImg flex-no-horizontal">
						<view class="middle-item-updataImg-item flex-no-horizontal">
							<view
								class="tmui-box flex-no-horizontal"
								v-if="!qualificationImgs[0]"
								@click="qualificationImgsClick"
							>
								<u-icon name="camera" color="rgba(220, 220, 220, 1)" size="20"></u-icon>
							</view>
							<view
								class="tmui-delete flex-no-horizontal"
								v-if="qualificationImgs[0]"
								@click="deleteImgs('qualificationImgs', 0)"
							>
								<u--image src="/static/user/icon_audit_delete.png" width="15" height="15"></u--image>
							</view>
							<u--image
								:src="qualificationImgs[0] | setCdnImgSize('115')"
								v-if="qualificationImgs[0]"
								width="119"
								height="75"
								radius="6"
								@click="previewImages(qualificationImgs[0])"
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
				<view class="bottom-box-title font-16 font-bold"
					><text style="color: #f00; padding-right: 10rpx">*</text>请选择注册项目</view
				>
				<view
					class="bottom-box-item flex"
					v-for="(item, index) in productList"
					:key="item.sysId"
					@click="productClick(index)"
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
				<!-- <scroll-view :scroll-y="true" style="height: 400rpx;">
					<view
						class="bottom-box-item flex"
						v-for="(item, index) in productList"
						:key="item.sysId"
						@click="productClick(index)"
					>
						<view class="bottom-box-item-title flex-no-horizontal">
							<view class="bbit-punctuation"></view>
							<view class="bbit-text font-14">{{ item.productName }}</view>
							<view class="bbit-time font-12">({{ item.serverTime }}分钟)</view>
						</view>
						<u--image :src="!item.ifSelect ? '/static/user/icon-select.png' : '/static/user/icon-selectHover.png'" width="20" height="20"></u--image>
					</view>
				</scroll-view> -->
				<!-- 保证金部分 -->
				<view class="bottom-box-item flex" style="padding-top: 20rpx">
					<view class="bottom-box-item-title flex-no-horizontal">
						<u--image :src="'/static/user/icon_share_money.png'" width="26" height="26"></u--image>
						<view class="bbit-earnest font-16 font-bold">我的保证金</view>
						<view class="bbit-balance font-16 font-bold">({{ userAsset.bond }})</view>
					</view>
					<u-button
						class="bottom-box-item-btn"
						type="primary"
						text="交保证金"
						@click="toPayEarnest"
					></u-button>
				</view>
			</view>
			<image src="../../static/user/bg_audit_bottom_bottom@2x.png" style="width: 100%" mode="widthFix"></image>
		</view>

		<!-- 审核失败部分 -->
		<view class="bottom" v-if="remark">
			<view class="bottom-box" style="border: 2rpx dashed rgba(255, 143, 143, 1)">
				<view class="bottom-box-title font-14 font-bold">不合格项：</view>
				<view class="bottom-box-reject font-12">{{ remark }}</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<u-button class="btn" type="primary" :text="btnText" @click="nowSubmit"></u-button>

		<view style="height: 60rpx"></view>
	</view>
</template>

<script>
import { addressRegular, weChatH5GetLocation, weChatH5OpenLocation } from '../../utility/wechat.js';
import { updataFileFun } from '../../utility/upload.js';
import {
	createAuditOrderApi,
	productListApi,
	userAssetApi,
	getAuditOrderStatusApi,
	revocationAuditOrderApi,
	anewSubmitAuditOrderApi,
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
			radiovalue1: '男',
			src: false,
			selectAddress: '请选择地址',
			submitData: {
				name: '',
				sex: 1,
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
				qualificationImgs: [], //技师健康证
				idCardImgs: [], //身份证照片
				productIds: [],
				userDesc: '',
			},
			headImg: '', //形象照片
			lifeImgs: [], //生活照
			businessLicenseImgs: [], //营业执照图片
			qualificationImgs: [], //技师健康证
			idCardImgs: [], //身份证照片
			productList: [
				{
					productName: '',
					serverTime: 0,
				},
			],
			userAsset: {
				bond: 0,
			},
			ifAuditUnderway: false, //审核中
			ifAudit: false, //已审核
			remark: '',
			orderId: '', //订单id
			orderStatus: 0,
			btnText: '立即提交',
		};
	},
	onLoad(e) {
		this.getUserAsset();
		e.ifAnew ? this.getOrderStatus() : this.productListFun();
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
		async productListFun() {
			try {
				const productListRes = await productListApi({
					page: 1,
					pageSize: 100,
				});
				// 渲染注册项目
				console.log(productListRes.data.data, 'productListRes.data.data');
				this.productList = productListRes.data.data.map((item, index) => {
					return {
						productName: item.productName,
						serverTime: item.serverTime,
						ifSelect: false,
						sysId: item.sysId,
					};
				});
			} catch (e) {
				return Promise.reject(e);
			}
		},
		async getOrderStatus() {
			try {
				await this.productListFun();
				const res = await getAuditOrderStatusApi();
				if (Object.keys(res.data).length) {
					this.orderId = res.data.guid;
					this.remark = res.data.remark;
					this.orderStatus = res.data.status;
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
						productIds: res.data.historyPassProductIds,
						userDesc: res.data.userDesc,
					};
					this.selectAddress = res.data.address.address;
					// this.productList = this.productList.filter(
					// 	item => this.submitData.productIds.indexOf(item.sysId) < 0
					// );
					for (let i = 0; i < this.productList.length; i++) {
						for (let j = 0; j < this.submitData.productIds.length; j++) {
							if (this.productList[i].sysId === this.submitData.productIds[j]) {
								this.productList[i].ifSelect = true;
							}
						}
					}

					this.headImg = res.data.headImg; //形象照片
					this.lifeImgs = [...res.data.lifeImgs]; //生活照片
					this.businessLicenseImgs = [...res.data.businessLicenseImgs]; //营业执照图片
					this.qualificationImgs = [...res.data.qualificationImgs]; //技师健康证
					this.idCardImgs = [...res.data.idCardImgs]; //身份证照片
				}
			} catch (e) {
				this.failMessage(e);
			}
		},

		radioChange(n) {
			this.submitData.sex = n === '男' ? 1 : 2;
		},

		async getLocation() {
			try {
				const mapRes = await weChatH5GetLocation();
				// const openlocatianRes = await weChatH5OpenLocation(mapRes.latitude,mapRes.longitude)
				// console.log(openlocatianRes)
				const res = await uni.chooseLocation({
					latitude: mapRes.latitude,
					longitude: mapRes.longitude,
				});
				this.selectAddress = res.name;
				const data = res.address.match(addressRegular);
				console.log(res.address, '--------初始数据');
				console.log(data, '---------正则之后数据');
				this.submitData.address.latitude = res.latitude;
				this.submitData.address.longitude = res.longitude;
				data.groups.address = data.groups.address !== ' ' ? data.groups.address : res.name;
				this.submitData.address = {
					...this.submitData.address,
					...data.groups,
				};
				this.submitData.address.city = data.groups.city || data.groups.province;
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e);
			}
		},

		//形象照片
		async headImgClick() {
			try {
				const res = await uni.chooseImage({
					count: 1,
				});
				// const imgInfo = await uni.getImageInfo({
				// 	src:res.tempFiles[0].path
				// })
				// console.log(imgInfo)
				this.submitData.headImg = await updataFileFun(res.tempFiles[0]);
				this.headImg = res.tempFiles[0].path;
				console.log(this.headImg);
			} catch (e) {
				this.failMessage(e);
			}
		},

		//生活照片
		async lifeImgsClick() {
			try {
				if (this.lifeImgs.length > 4) {
					this.failMessage({
						msg: '最多上传四张图片',
					});
					return;
				}
				const res = await uni.chooseImage({
					count: 4 - this.lifeImgs.length,
				});
				for (let i = 0; i < res.tempFiles.length; i++) {
					this.submitData.lifeImgs.push(await updataFileFun(res.tempFiles[i]));
					this.lifeImgs.push(res.tempFiles[i].path);
				}
				console.log(this.lifeImgs);
			} catch (e) {
				this.failMessage(e);
			}
		},

		//营业照片
		async businessLicenseImgsClick() {
			try {
				const res = await uni.chooseImage({
					count: 1,
				});
				this.submitData.businessLicenseImgs.push(await updataFileFun(res.tempFiles[0]));
				this.businessLicenseImgs.push(res.tempFiles[0].path);
			} catch (e) {
				this.failMessage(e);
			}
		},

		//技师健康证
		async qualificationImgsClick() {
			try {
				const res = await uni.chooseImage({
					count: 1,
				});
				this.submitData.qualificationImgs.push(await updataFileFun(res.tempFiles[0]));
				this.qualificationImgs.push(res.tempFiles[0].path);
			} catch (e) {
				this.failMessage(e);
			}
		},

		//身份证照片
		async idCardImgsClick() {
			try {
				const res = await uni.chooseImage({
					count: 2 - this.submitData.idCardImgs.length,
				});
				for (let i = 0; i < res.tempFiles.length; i++) {
					this.submitData.idCardImgs.push(await updataFileFun(res.tempFiles[i]));
					this.idCardImgs.push(res.tempFiles[i].path);
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

		//删除图片
		deleteImgs(type, index) {
			if (index !== undefined) {
				this[type].splice(index, 1);
				this.submitData[type].splice(index, 1);
				return;
			}
			this[type] = '';
			this.submitData[type] = '';
		},

		productClick(index) {
			this.productList[index].ifSelect = !this.productList[index].ifSelect;
		},

		//提交订单
		async nowSubmit() {
			console.log(this.submitData.productIds.length, '注册');
			try {
				this.submitData.productIds = [];
				this.productList.forEach((item, index) => {
					if (item.ifSelect) {
						this.submitData.productIds.push(item.sysId);
					}
				});
				switch (true) {
					case this.submitData.name === '':
						uni.showToast({
							title: '请输入姓名',
							icon: 'none',
						});
						break;
					case this.submitData.mobile === '':
						uni.showToast({
							title: '请输入电话',
							icon: 'none',
						});
						break;
					case this.submitData.idCardImgs.length < 2:
						uni.showToast({
							title: '请上传身份证照片',
							icon: 'none',
						});
						break;
					case this.submitData.businessLicenseImgs.length:
						uni.showToast({
							title: '请上传营业照片',
							icon: 'none',
						});
						break;
					case this.submitData.qualificationImgs.length:
						uni.showToast({
							title: '请上传技师健康证',
							icon: 'none',
						});
						break;
					case this.submitData.productIds.length < 1:
						uni.showToast({
							title: '请选择注册项目',
							icon: 'none',
						});
						break;
					case this.selectAddress == '请选择地址':
						uni.showToast({
							title: '请选择注册地址',
							icon: 'none',
						});
						break;
					default:
						const res = await createAuditOrderApi(this.submitData);
						uni.showToast({
							title: '提交成功',
							icon: 'none',
						});
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/user/user-audit-success',
							});
						}, 800);

						// if (this.orderStatus === 150) {
						// 	const res = await anewSubmitAuditOrderApi({
						// 		guid: this.orderId,
						// 		...this.submitData
						// 	});
						// 	uni.showToast({
						// 		title: '提交成功',
						// 		icon: 'none'
						// 	});
						// 	setTimeout(() => {
						// 		uni.navigateBack();
						// 	}, 800);
						// } else {
						// 	const res = await createAuditOrderApi(this.submitData);
						// 	uni.showToast({
						// 		title: '提交成功',
						// 		icon: 'none'
						// 	});
						// 	setTimeout(() => {
						// 		uni.navigateBack();
						// 	}, 800);
						// }
						break;
				}
			} catch (e) {
				this.failMessage(e);
			}
		},

		//撤销
		async revocationClick() {
			try {
				const res = await revocationAuditOrderApi({
					guid: this.orderId,
				});
				this.ifAuditUnderway = false;
			} catch (e) {
				this.failMessage(e);
			}
		},

		//跳转保证金
		toPayEarnest() {
			uni.navigateTo({
				url: '/pages/user/user-recharge',
			});
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
	.status {
		position: fixed;
		z-index: 10;
		justify-content: center;
		top: 400rpx;
		left: 200rpx;
	}
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
			margin: 30rpx 64rpx 0 42rpx;
			border: 2rpx dashed rgba(116, 155, 254, 1);
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
					color: rgba(153, 153, 153, 1);
				}
				&-text-hover {
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
			padding: 0 68rpx 0 44rpx;
			background: {
				repeat: no-repeat;
				image: url('../../static/user/bg_audit_bottom_ middle@2x.png');
				size: 100% 100%;
				position: 0 0;
			}
			&-title {
				color: rgba(51, 51, 51, 1);
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
				border-bottom: 2rpx dashed rgba(116, 155, 254, 1);
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
