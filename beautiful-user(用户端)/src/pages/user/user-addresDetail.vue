<template>
	<view>
		<view class="wrap">
			<view class="item flex-no-horizontal" style="padding-top: 0">
				<view class="item-title font-16">收货人</view>
				<input
					type="text"
					v-model="address.username"
					placeholder-class="line font-16"
					placeholder="请填写姓名"
				/>
			</view>
			<view class="item flex-no-horizontal">
				<view class="item-title font-16">手机号码</view>
				<input
					type="number"
					v-model="address.mobile"
					maxlength="11"
					placeholder-class="line font-16"
					placeholder="请填写手机号"
				/>
			</view>
			<view class="item flex-no-horizontal" @click="$u.throttle(getAddress, 5000)">
				<view class="item-title font-16">服务地址</view>
				<view class="Location flex">
					<view
						class="Location-address font-16"
						:style="{ color: exhibitionAddress !== '请选择服务地址' ? '#000' : '#aeaeae' }"
						>{{ exhibitionAddress }}</view
					>
					<u-icon name="arrow-right" color="rgba(214, 214, 214, 1)" size="15"></u-icon>
				</view>
			</view>
			<view class="item flex-no-horizontal" style="border: 0; padding-bottom: 0">
				<view class="item-title font-16">门牌号</view>
				<input
					type="text"
					v-model="address.houseNumber"
					class="line font-16"
					placeholder-class="line"
					placeholder="例：7号楼709室"
				/>
			</view>
		</view>
		<view class="btn-box">
			<u-button
				class="btn-box-pay font-16"
				:loading="btnLoadingShow"
				type="primary"
				:text="btnText"
				@click="saveAddress"
			></u-button>
			<u-button class="btn-box-delete font-16" type="primary" text="删除" @click="deleteAddress"></u-button>
		</view>
	</view>
</template>

<script>
import { addressRegular, weChatH5GetLocation } from '../../utility/wechat.js';
import { addressAddApi, addressEditApi, addressDelApi, addressDetailApi } from '@/api/user.js';
export default {
	data() {
		return {
			address: {
				country: '中国',
				province: '', //省
				city: '', //市
				county: '', //区
				address: '', //详细地址
				latitude: '', //纬度
				longitude: '', //经度
				username: '', //收货人姓名
				mobile: '', //收货人电话
				isDefault: 4, //是否默认：1默认、4普通
				addressType: 3, //类型：1收货地址、2发货地址
				houseNumber: '', //门牌号
			},
			exhibitionAddress: '请选择服务地址',
			ifEdit: false, //是否为编辑地址
			btnLoadingShow: false,
			btnText: '保存地址',
		};
	},
	async onLoad(option) {
		//option为object类型，会序列化上个页面传递的参数
		console.log(option.guid); //打印出上个页面传递的参数。
		// this.getProductDetail(option.productGuid)
		if (option.guid) {
			try {
				let res = await addressDetailApi({ guid: option.guid });
				console.log(res.data, '详情页的数据');
				this.address = res.data;
				this.exhibitionAddress = res.data.address;
				this.ifEdit = true;
			} catch (e) {
				uni.showToast({
					title: e.msg,
					icon: 'none',
				});
				//TODO handle the exception
			}
		}
	},
	methods: {
		async getAddress() {
			try {
				const mapRes = await weChatH5GetLocation();
				const res = await uni.chooseLocation({
					latitude: mapRes.latitude,
					longitude: mapRes.longitude,
				});
				this.exhibitionAddress = res.name;
				let data = res.address.match(addressRegular);
				this.address.latitude = res.latitude;
				this.address.longitude = res.longitude;
				// address值进行判断
				data.groups.address = data.groups.address !== ' ' ? data.groups.address : res.name;
				this.address = {
					...this.address,
					...data.groups,
				};
				// console.log(...this.address,"...this.address")
				this.address.city = data.groups.city || data.groups.province;
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e);
			}
		},
		async saveAddress() {
			let reg = /^1[3-9]{1}[0-9]{9}$/;
			try {
				switch (true) {
					case this.address.username === '':
						uni.showToast({
							title: '请填写收货人',
							icon: 'none',
						});
						break;
					case this.address.address === '':
						uni.showToast({
							title: '请重新选择地址',
							icon: 'none',
						});
						break;

					case reg.test(this.address.mobile) == false:
						uni.showToast({
							title: '请填写正确手机号',
							icon: 'none',
						});
						break;

					case this.exhibitionAddress === '请选择服务地址':
						uni.showToast({
							title: '请选择服务地址',
							icon: 'none',
						});
						break;
					default:
						if (!this.ifEdit) {
							console.log(this.address, 'this.address');
							let res = await addressAddApi({
								...this.address,
							});
							uni.showToast({
								title: '添加成功',
								icon: 'none',
							});
							// 返回上一级
							setTimeout(() => {
								uni.navigateBack({
									delta: 1,
								});
							}, 800);
							return;
						}
						let res = await addressEditApi({
							...this.address,
						});
						uni.showToast({
							title: '修改成功',
							icon: 'none',
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 800);
				}
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e.msg);
			}
		},
		async deleteAddress() {
			try {
				const modalRes = await uni.showModal({
					title: '提示',
					content: '是否删除该地址',
				});
				if (modalRes.confirm) {
					let res = await addressDelApi({
						guid: this.address.guid,
						addressType: 3, //类型：1收货地址、2发货地址
					});
					uni.showToast({
						title: '操作成功',
						icon: 'none',
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 800);
				} else if (modalRes.cancel) {
					console.log('用户点击取消');
				}
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e.msg);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
page {
	background-color: rgba(244, 244, 244, 1);
}
.wrap {
	padding: 28rpx;
	margin: 24rpx 30rpx;
	border-radius: 16rpx;
	background-color: rgba(255, 255, 255, 1);
	.item {
		flex: 1;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f2f2f2;
		.item-title {
			flex: 0.28;
			color: rgba(0, 0, 0, 1);
		}
		input {
			flex: 0.72;
		}
		.Location {
			flex: 0.72;
			color: #cccccc;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap; // 默认不换行；
			.Location-address {
				color: rgba(0, 0, 0, 1);
			}
		}
		.line {
			color: rgba(174, 174, 174, 1);
		}
	}
}
.btn-box {
	padding: 20rpx 30rpx;
	&-pay {
		border: 0;
		border-radius: 40rpx;
		background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
		::v-deep .u-button__text {
			font-size: 32rpx !important;
		}
	}
	&-delete {
		margin-top: 40rpx;
		border-radius: 40rpx;
		border: 2rpx solid rgba(253, 120, 15, 1);
		background-color: rgba(248, 248, 248, 1);
		color: rgba(102, 102, 102, 1);
		::v-deep .u-button__text {
			font-size: 32rpx !important;
		}
	}
}
</style>
