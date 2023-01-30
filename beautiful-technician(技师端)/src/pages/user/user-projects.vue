<template>
	
		<view class="main">
			<z-paging ref="paging" v-model="productList" @query="queryList" :auto="true" :paging-style="{top:'0'}">
			<view class="main-item m-t-10 p-10 flex-no-horizontal" v-for="(item, index) in productList" :key="item.guid">
				<view class="main-item-img"><u--image :src="item.product.productImg[0] | setCdnImgSize('120')" width="156rpx" height="156rpx" radius="20rpx" v-if="item.product.productImg.length"></u--image></view>
				<view class="main-item-content">
					<view class="main-item-content-name font-16 font-bold">{{ item.product.productName }}</view>
					<view class="main-item-content-tag font-12">
						<text v-for="(item1, index1) in item.product.productTags" :key="index1" style="margin-left: 10rpx;">{{ item1 }} {{index1 === (item.product.productTags.length-1) ? '' : ' |' }}</text>
					</view>
					<view class="main-item-content-price flex-no-horizontal">
						<view class="micp-price font-18 font-bold">
							<text>￥</text>
							{{ item.product.salePrice }}
						</view>
						<view class="micp-lineationPrice font-10" v-if="item.product.linePrice>0">￥{{ item.product.linePrice }}</view>
						<view class="micp-time font-12 flex-no-horizontal">
							<image src="../../static/user/icon_time.png" mode=""></image>
							{{ item.product.serverTime }}分钟
						</view>
					</view>
				</view>
				<view class="main-item-status">
					<view class="main-item-status-title font-12" :class="{'main-item-status-title-hover':item.jsStatus !== 100}">{{ item.jsStatus === 100 ? '已上架' : '已下架' }}</view>
					<u-switch
						space="2"
						v-model="item.jsStatus"
						:activeValue="100"
						:inactiveValue="400"
						activeColor="rgba(253, 120, 15, 1)"
						inactiveColor="rgba(0, 0, 0, 0.1000)"
						@change="setProductStatus(item.guid, index)"
					></u-switch>
				</view>
			</view>
			</z-paging>
		</view>
</template>

<script>
import { userAuditedProductListApi, userAuditedProductSetStatusApi } from '@/api/technician.js';
export default {
	data() {
		return {
			productList: [
				{
					guid: '',
					jsStatus: 100,
					product: {
						productName: '',
						productTags: [],
						serverTime: 0,
						productImg: [],
						suitExplain: [],
						salePrice: '',
						linePrice: ''
					}
				}
			],
			isShow: false
		};
	},
	onLoad() {
		
	},
	onShow() {
		console.log("---")
		// this.$refs.paging.reload();
	},
	methods: {
		async queryList(page, pageSize) {
			console.log("======")
			try {
				let res = await userAuditedProductListApi({
					page: page,
					pageSize: pageSize
				});
				this.$refs.paging.complete(res.data.data);
				// this.firstLoaded = true;
			} catch (e) {
				this.failMessage(e.msg);
			}
		},
		async setProductStatus(guid, index) {
			try {
				const res = await userAuditedProductSetStatusApi({
					guid,
					status: this.productList[index].jsStatus
				});
				uni.showToast({
					title: '操作成功',
					icon: 'none'
				});
			} catch (e) {
				this.failMessage(e);
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f8f8f8;
}

.main {
	margin: 0 30rpx;
	&-item {
		justify-content: space-between;
		flex: 1;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 1);
		&-img {
			flex: 0.3;
		}
		&-content {
			flex: 0.66;
			&-name {
				color: rgba(51, 51, 51, 1);
			}
			&-tag {
				margin: 14rpx 0;
				color: rgba(153, 153, 153, 1);
			}
			&-price { 
				.micp-price {
					margin-right: 16rpx;
					color: rgba(255, 0, 0, 1);
					text {
						font-size: 28rpx;
					}
				}
				.micp-lineationPrice {
					margin-right: 16rpx;
					color: rgba(153, 153, 153, 1);
					text-decoration: line-through;
				}
				.micp-time {
					image {
						width: 24rpx;
						height: 24rpx;
					}
					color: rgba(153, 153, 153, 1);
				}
			}
		}
		&-status {
			&-title {
				margin-bottom: 6rpx;
				text-align: center;
				color: rgba(253, 120, 15, 1);
			}
			&-title-hover {
				color: rgba(153, 153, 153, 1);
			}
		}
	}
}
</style>
