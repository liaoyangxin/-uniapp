<template>
	<view class="wrap">
		<view class="title flex-no-horizontal">
			<u--image src="/static/technician/icon-technicianAuthentication.png" width="15" height="16"></u--image>
			<text class="title-text font-14">签约商家</text>
		</view>
		<view class="subhead font-12 flex-no-horizontal">
			{{productList.address}}
			<text class="subhead-text flex-no-horizontal">已认证</text>
		</view>
		<view class="item m-t-20">
			<view class="item-title m-b-10 font-14">
				营业执照
			</view>
			<u--image :src="productList.businessLicenseImgs[0] | setCdnImgSize('205')" width="205" height="110"></u--image>
		</view>
		<view class="item m-t-20">
			<view class="item-title m-b-10 font-14">
				技师职业资格证书
			</view>
			<u--image :src="productList.qualificationImgs[0] | setCdnImgSize('205')" width="205" height="110"></u--image>
		</view>
	</view>
</template>
<script>
import { authInfoApi } from "../../api/technician"
export default {
	data() {
		return {
			productList: {},
			technicianGuid:""
		};
	},
	computed: {},
	onLoad(item) {
		this.technicianGuid=item.guid
		this.getdetail();
	},
	methods: {
		async getdetail() {
			try {
				
				let res=await authInfoApi({"guid":this.technicianGuid})
				this.productList=res.data
				this.productList.address=res.data.address.province+res.data.address.city+res.data.address.county+res.data.address.address
			} catch (e) {
				this.failMessage({
					msg:e
				})
			}
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: rgba(248, 248, 248, 1);
}
.wrap {
	padding: 24rpx 30rpx;
	.title{
		&-text{
			margin-left: 10rpx;
			color: rgba(51, 51, 51, 1);
		}
	}
	.subhead{
		margin-top: 5rpx;
		padding-left: 40rpx;
		color: rgba(102, 102, 102, 1);
		&-text{
			justify-content: center;
			margin-left: 10rpx;
			padding: 4rpx 10rpx;
			border-radius: 22rpx;
			background-color: rgba(107, 187, 42, 1);
			width: 72rpx;
			height: 28rpx;
			font-size: 16rpx;
			color: rgba(255, 255, 255, 1);
		}
	}
	.item{
		padding-left: 40rpx;
		&-title{
			color: rgba(51, 51, 51, 1);
		}
		.img{
			justify-content: center;
		}
	}
}
</style>
