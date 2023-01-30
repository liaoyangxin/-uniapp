<template>
	<view class="content">
		<z-paging ref="paging" v-model="productList" @query="queryList" :auto="true">
			<view class="product">
				<view class="product-title">
					<!-- <u--image src="/static/detail/most-icon.png" width="24" height="24"></u--image> -->
					<text>{{ '&nbsp;' + '可用项目' }}</text>
				</view>
				<view class="product-box">
					<scroll-view :scroll-y="true" style="height: calc(100% -500rpx)">
						<view class="product-box-item flex" v-for="(item, index) in productList" :key="index">
							<u--image
								:src="item.coverImg ? item.coverImg : ''"
								width="100"
								height="100"
								radius="20rpx"
								@click="productDetail(item)"
							></u--image>
							<view class="product-box-item-right m-l-10">
								<view class="item-name flex" @click="productDetail(item)">
									<view class="productName font-16 font-bold">{{ item.productName }}</view>
									<view class="nums font-10">{{ item.totalNumber }}人已选择</view>
								</view>
								<text class="securities" style="display: inline-flex">领劵立减</text>
								<view class="item-tags flex-no-horizontal" @click="productDetail(item)">
									<view
										style="
											overflow: hidden;
											text-overflow: ellipsis;
											white-space: nowrap;
											width: 70%;
										"
									>
										<text
											class="tags-item font-12"
											v-for="(item1, index1) in item.productTags"
											:key="index1"
										>
											{{ item1 }}{{ index1 === item.productTags.length - 1 ? '' : ' |' }}
										</text>
									</view>
								</view>
								<view class="item-price flex">
									<view class="price font-12 flex">
										<text class="font-14 font-bold" style="height: 40rpx; line-height: 46rpx"
											>￥</text
										>
										<text class="salePrice font-18">{{ item.salePrice }}</text>
										<text
											v-if="item.linePrice > 0"
											class="pricetext font-10"
											style="
												text-decoration: line-through;
												padding-left: 8rpx;
												padding-right: 18rpx;
											"
										>
											￥{{ item.linePrice }}
										</text>

										<view class="time flex-no-horizontal">
											<u--image
												src="/static/detail/time-icon.png"
												width="13"
												height="13"
												shape="circle"
												style="padding-right: 2rpx"
											></u--image>
											{{ item.serverTime }}分钟
										</view>
									</view>
									<view>
										<u-button
											class="btn"
											type="primary"
											shape="circle"
											size="small"
											@click="selectTechnician(item)"
											text="选择技师"
										></u-button>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</z-paging>
		<u-popup :show="showModel" @click="showModel = false" mode="center">
			<view class="model">
				<image mode="widthFix" class="model_img" @click.stop="toList" :src="modelImg"></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { useCoupon } from '@/api/coupon.js';
import { userInfoApi, getPack, drawPack } from '@/api/user.js';
import { mapState, mapMutations } from 'vuex';
import store from '../../store';
export default {
	data() {
		return {
			showModel: false,
			modelVal: 0,
			mode: 'dot',
			bannerData: [],
			styleData: { margin: '10rpx', background: '#Ff0' },
			reqParams: {
				bannerSeat: 1, // 位置，1首页
				platformType: 1, // 平台，1用户端 2技师端
			},
			productList: [],
			bannerList: [],
			couponGuid: '',
			isbanner: false,
			// packObj: {}
			modelImg: '#',
		};
	},

	onShow() {
		this.showModel = false;
		if (this.modelVal === 0) {
			getPack({
				packType: 'new_people',
			}).then(res => {
				this.modelVal = res.data.receiveStatus;
				this.modelImg = res.data.coverImg;
				if (this.modelVal === 2) {
					this.showModel = true;
				}
			});
		}
	},
	async onLoad(reqParams) {
		console.log(reqParams.couponGuid, '带过来的id');
		if (reqParams.couponGuid) {
			this.couponGuid = reqParams.couponGuid;
			this.$refs.paging.reload();
		}
	},
	methods: {
		// 项目详情
		productDetail(item) {
			uni.navigateTo({
				url: `../product/detail?productGuid=${item.guid}`,
			});
		},
		// 选择技师
		selectTechnician(item) {
			uni.switchTab({
				url: `../technician/list`,
			});
			store.commit('setProductStatus', item.guid);
		},
		// 可服务项目
		async queryList(page, pageSize) {
			try {
				let res = await useCoupon({
					page: page,
					pageSize: pageSize,
					couponGuid: this.couponGuid,
				});
				this.$refs.paging.complete(res.data.data);
				this.firstLoaded = true;
			} catch (e) {
				this.failMessage(e.msg);
			}
		},
		toList() {
			drawPack({
				packType: 'new_people',
			})
				.then(res => {
					if (res.code === 0) {
						this.showModel = false;
						uni.navigateTo({
							url: 'pages/order/coupon',
						});
					}
				})
				.catch(err => {
					this.showModel = false;
					uni.$u.toast(err.msg);
				});
		},
	},
};
</script>

<style lang="scss">
.wrap {
	padding: 40rpx;
}
page {
	background: rgba(248, 248, 248, 1);
}
.z-paging-reached-top {
	top: 0rpx !important;
}
.z-paging-content-fixed {
	top: 0rpx !important;
}
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #f8f8f8;
	.time {
		padding-left: 4rpx;
		color: rgba(153, 153, 153, 1);
		font-size: 12px;
		font-weight: 400;
	}

	.product {
		width: 100%;
		display: flex;
		flex-direction: column;
		font-family: Source Han Sans CN-Medium, Source Han Sans CN !important;

		.product-title {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 48rpx;
			font-size: 32rpx;
			padding: 40rpx 30rpx 16rpx 30rpx;
			color: #333333;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			line-height: 48rpx;
		}

		.product-box {
			margin: 20rpx 30rpx;

			&-item {
				padding: 14rpx 18rpx;
				border-radius: 20rpx;
				background-color: #fff;
				margin-bottom: 20rpx;

				&-right {
					flex: 1;
					flex-direction: column;
					justify-content: space-between;

					// 项目名称
					.item-name {
						height: 56rpx;
						align-items: center;

						.productName {
							max-width: 350rpx;
							padding-right: 8rpx;
							font-weight: bold;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							color: rgba(51, 51, 51, 1);
						}
						.nums {
							padding-right: 4rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							color: rgba(153, 153, 153, 1);
						}
					}
					.item-tags {
						padding-bottom: 10rpx;
						align-items: flex-end;
						height: 56rpx;

						.tags-item {
							color: rgba(153, 153, 153, 1);
							padding: 5rpx;
							font-weight: 400;
						}
					}

					.item-price {
						display: flex;
						flex-direction: row;
						align-items: flex-end;
						height: 56rpx;
						color: rgba(255, 0, 0, 1);

						.price {
							display: flex;
							flex-direction: row;
							align-items: flex-end;
							height: 56rpx;

							.salePrice {
								display: flex;
								align-items: baseline;
								height: 56rpx;
								line-height: 76rpx;
								color: rgba(255, 0, 0, 1);
								font-weight: bold;
							}
						}

						.pricetext {
							display: flex;
							align-items: baseline;
							font-weight: 400;
							color: rgba(153, 153, 153, 1);
						}

						.btn {
							background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(255, 118, 66, 1) 100%);
							border-radius: 30rpx;
							border: 0;
							width: 152rpx;
							height: 56rpx;
							::v-deep .u-button__text {
								font-weight: 500 !important;
							}
						}
					}
				}
			}

			.icon {
				width: 26rpx;
				height: 26rpx;
				margin-right: 10rpx;
			}
			.title {
				color: rgba(51, 51, 51, 1);
				margin: 20rpx 0;
			}
		}
	}
}

.model {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;

	&_img {
		width: 690rpx;
	}

	&_button {
		width: 380rpx;
		height: 86rpx;
	}
}
.securities {
	color: #fff;
	font-size: 20rpx;
	padding: 6rpx 12rpx;
	border-radius: 8rpx;
	background: -webkit-linear-gradient(left, #ffbd7d, #ff8567);
}
</style>
