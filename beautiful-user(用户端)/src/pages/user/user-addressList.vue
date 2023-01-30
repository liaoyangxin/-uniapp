<template>
	<view>
		<view v-if="addressList.length !== 0">
			<view style="height: 20rpx;"></view>
			<view class="address-item flex" v-for="(item, index) in addressList" :key="index">
				<view class="item-left" @click="selectClick(item)">
					<view class="address font-16 font-bold m-b-10">
						<text class="unit" v-if="item.isDefault === 1">默认</text>
						{{ item.county }} {{ item.address }} {{ item.houseNumber ? '-' + item.houseNumber : '' }}
					</view>
					<view class="userInfo flex-no-horizontal">
						<view class="m-r-20 font-14">{{ item.username }}</view>
						<view class="font-14">{{ item.mobile }}</view>
					</view>
				</view>
				<view class="item-right" @click="toAddressDetail(item.guid)">
					<u--image :src="'/static/user/icon-edit.png'" width="15" height="15"></u--image>
				</view>
			</view>
		</view>

		<view class="empty" v-else>
			<view class="flex-no-horizontal" style="justify-content: center;"><!-- <image src="../../static/empty/empty-map.png" mode=""></image> --></view>
			<view class="empty-title m-b-10">您还没有添加过地址哦</view>
			<button class="flex-bottom-btn-empty font-16 flex-no-horizontal" @click="toAddressAdd">添加地址</button>
		</view>

		<view v-if="addressList.length !== 0">
			<view style="height: 200rpx;"></view>
			<view class="flex-bottom tab-horizontal"><button class="flex-bottom-btn font-16 flex-no-horizontal" @click="toAddressAdd">新增地址</button></view>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
import { addressListApi } from '@/api/user.js'
export default {
	data() {
		return {
			addressList: [
				{
					province: '', //省
					city: '', //市
					county: '', //区
					address: '', //详细地址
					username: '', //收货人姓名
					mobile: '' //收货人电话
				}
			],
			ifSelectAddress: false //是否为选择地址
		};
	},
	onLoad(e) {
		if(e.ifSelectAddress === 'true'){
			this.ifSelectAddress = true
		}
	},
	onShow() {
		this.getAddressList();
	},
	methods: {
		...mapMutations(['setSelectAddress']),
		async getAddressList() {
			try {
				let res = await addressListApi({
					addressType: 3
				});
				this.addressList = res.data;
			
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e.msg);
			}
		},
		selectClick(item){
			if(this.ifSelectAddress){
				this.setSelectAddress(item)
				uni.navigateBack()
			}
		},
		toAddressDetail(e) {
			uni.navigateTo({
				url: `./user-addresDetail?guid=${e}`
			});
		},
		toAddressAdd() {
			uni.navigateTo({
				url: '/pages/user/user-addresDetail'
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f0f0f0;
}

.empty {
	margin: 0 auto;
	image {
		margin-top: 290rpx;
		width: 312rpx;
		height: 304rpx;
	}
	.empty-title {
		color: rgba(217, 217, 217, 1);
		text-align: center;
	}
	.flex-bottom-btn-empty {
		justify-content: center;
		margin: 0 auto;
		margin: 0 20rpx;
		height: 80rpx;
		border-radius: 42rpx;
		background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
		color: #ffffff;
	}
	.flex-bottom-btn-empty::after {
		border: 0;
	}
}

.address-item {
	padding: 20rpx 40rpx;
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 30rpx 20rpx 0 20rpx;

	.address {
		width: 480rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; // 默认不换行；
		.unit {
			color: rgba(255, 103, 0, 1);
			font-size: 22rpx;
			font-weight: 400;
			background: #fff1e8;
			border-radius: 8rpx;
			padding: 4rpx;
			margin-right: 10rpx;
		}
	}
	.userInfo{
		color: rgba(153, 153, 153, 1);
	}
}

.flex-bottom {
	width: 100%;
	height: 80rpx;
	position: fixed;
	bottom: 0;
	background-color: #f0f0f0;

	.flex-bottom-btn {
		justify-content: center;
		margin: 0 20rpx;
		height: 100%;
		border-radius: 42rpx;
		background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);;
		color: rgba(255, 255, 255, 1);
	}
	.flex-bottom-btn::after {
		border: 0;
	}
}
</style>
