<template>
	<z-paging
		ref="paging"
		v-model="technicianList"
		@query="queryList"
		:auto="false"
		:refresher-enabled="!isShow"
		:scrollable="!isShow"
		:paging-style="{ bottom: '84px' }"
	>
		<view class="content">
			<pageLoading :value="isLoading"></pageLoading>
			<view class="technician-search">
				<text class="city font-14" @click="viewLifePhotos">成都市</text>
				<u-search
					:showAction="true"
					placeholder="请输入技师姓名"
					v-model="reqParams.name"
					bgColor="#FFF"
					actionText="搜索"
					shape="round"
					@search="searchBtn"
					@change="searchBtn"
					@custom="searchBtn"
					:action-style="actionStyle"
					@clear="clearInput"
				></u-search>
			</view>
			<view class="technician">
				<u-tabs
					:list="genderList"
					@click="sexClick"
					:activeStyle="{
						color: '#fff',
						fontWeight: '500',
						background: 'linear-gradient(88deg,rgba(107, 187, 42, 1) 0%, rgba(152, 200, 62, 1) 100%)',
					}"
					:inactiveStyle="{
						fontWeight: '500',
						color: 'rgba(102, 102, 102, 1)',
						background: 'rgba(235, 235, 235, 1)',
					}"
					lineWidth="0"
					lineHeight="0"
				></u-tabs>
				<view class="technician-item" v-for="(item, index) in technicianList" :key="index">
					<view class="technician-img">
						<u--image
							:showLoading="true"
							:src="item.headImg"
							width="176rpx"
							height="176rpx"
							radius="50%"
							@click="viewImgPhotos(item.headImg, item.lifeImgs)"
						></u--image>
						<text
							class="technician-server font-12"
							:class="[item.reservableTime ? 'technician-server' : 'technician-no']"
							>可服务</text
						>
					</view>
					<view class="technician-Information">
						<view class="technician-name">
							<view class="name">
								<text class="font-16">{{ item.name }}</text>
								<u--image
									src="/static/technician/photo-icon.png"
									width="48rpx"
									height="48rpx"
									v-if="item.lifeImgs.length > 0"
									@click="viewLifePhotos(item.lifeImgs)"
								></u--image>
							</view>
							<view class="serverNumber">
								<u-icon name="map" color="rgba(0, 0, 0, 1)" size="16"></u-icon>
								<text class="font-12" style="height: 56rpx; line-height: 65rpx">{{
									item.distance
								}}</text>
							</view>
						</view>
						<view class="technician-tag">
							<view class="technician-authentication" @click="deDertification(item.guid)">
								<u--image
									:src="'/static/detail/zhengshu-icon.png'"
									width="48rpx"
									height="48rpx"
								></u--image>
								<text>{{ '已认证' }}</text>
							</view>
							<text class="server-time">{{
								item.reservableTime ? item.reservableTime : '暂不可约'
							}}</text>
						</view>
						<view class="technician-score">
							<view class="score">
								<u--image
									src="/static/technician/star-fill.png"
									width="30rpx"
									height="28rpx"
									style="padding-right: 4rpx"
								></u--image>
								<span>{{ Number(item.score).toFixed(1) }}</span>
							</view>
							<text class="orderTotal font-14">已服务{{ item.orderTotal }}单</text>
							<u-button
								type="primary"
								shape="circle"
								size="small"
								:class="[item.reservableTime ? 'primaryBtn' : 'primaryStyle']"
								@click="makeAppointment(item)"
								text="立即预约"
							></u-button>
						</view>
					</view>
				</view>
			</view>
			<popupBar :show="isShow" @closePopup="closePopup" :_technicianGuid="technicianGuid"></popupBar>
		</view>
	</z-paging>
</template>

<script>
import { technicianListApi } from '@/api/technician.js';
import popupBar from './common/popupBar.vue';
import { mapState, mapMutations } from 'vuex';
import { previewImage } from '../../utility/download.js';
import pageLoading from '../loading/loading.vue';
let preD = function (e) {
	e.preventDefault();
};
export default {
	data() {
		return {
			isShow: false,
			isLoading: true,
			bannerData: [],
			reqParams: {
				latitude: 30.639947,
				longitude: 104.045562,
				name: '', // 技师名称
				productGuid: '', // 产品guid
				sex: 2,
			},

			technicianList: [],
			genderList: [
				{
					name: '只看女生',
				},
				{
					name: '只看男生',
				},
			],
			technicianGuid: '',
			keywords: '',
			actionStyle: {
				width: '92rpx',
				background: '#F0F',
				height: '68rpx',
				background: 'linear-gradient(90deg, #FD780F 0%, #FD6313 100%)',
				opacity: 1,
				color: '#FFF',
				borderRadius: '34rpx',
				lineHeight: '68rpx',
			},
			ifMap: false,
			resetProductStatus: false,
			pagingUsePage: false,
			imgArr: [],
		};
	},
	components: {
		popupBar,
		pageLoading,
	},
	mounted() {},
	computed: {
		...mapState({
			productStatus: state => state.productStatus,
		}),
	},
	onLoad: function () {
		this.mapSelect();
	},
	onShow() {
		// 地图定位数据加载完触发
		if (this.ifMap) {
			if (!this.resetProductStatus) {
				this.$refs.paging.reload();
			}
		}
	},
	onHide() {
		// 路由不在当前页面和图片页面设置不刷新
		if (this.$route.path !== '/preview-image' && this.$route.path !== '/pages/technician/list') {
			this.resetProductStatus = false;
		}
		this.deleteProductId();
	},
	methods: {
		// 获取清空项目ID方法
		...mapMutations(['deleteProductId']),
		// 去认证
		deDertification(guid) {
			this.resetProductStatus = true;
			uni.navigateTo({
				url: `./authentication?guid=${guid}`,
			});
		},
		// 查看头像
		viewImgPhotos(headImg, lifeImgs) {
			let imgarr = [...lifeImgs];
			imgarr.unshift(headImg);
			previewImage(imgarr);
			this.resetProductStatus = true;
		},
		// 查看生活照片
		viewLifePhotos(lifeImgs) {
			previewImage(lifeImgs);
			this.resetProductStatus = true;
		},
		// 打开选择项目弹窗
		makeAppointment(item) {
			// scrollable=false 属性设置禁止滚动，用于打开弹窗禁止外层列表滑动
			this.isShow = true;
			this.technicianGuid = item.guid;
		},
		closePopup(show) {
			this.isShow = show;
			this.pagingUsePage = false;
		},
		sexClick(e) {
			this.reqParams.sex = e.name === '只看女生' ? 2 : 1;
			this.$refs.paging.reload();
		},
		async mapSelect() {
			try {
				let locationRes = await uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
				});
				this.reqParams.latitude = locationRes.latitude;
				this.reqParams.longitude = locationRes.longitude;
				setTimeout(() => {
					this.$refs.paging.reload();
				}, 100);
			} catch (e) {
				//TODO handle the exception
			} finally {
				this.ifMap = true;
			}
		},
		// 技师列表
		async queryList(page, pageSize) {
			try {
				this.reqParams.productGuid = this.productStatus;
				// this.reqParams.page = page;
				// this.reqParams.pageSize = pageSize;
				let res = await technicianListApi(this.reqParams);
				// this.$refs.paging.complete(res.data);
				this.$refs.paging.setLocalPaging(res.data);
				this.isLoading = false;
			} catch (e) {
				//TODO handle the exception
				this.failMessage(e.msg);
				this.$refs.paging.complete(false);
			}
		},
		// 搜索 custom用户点击右侧控件时触发
		searchBtn() {
			// if (this.reqParams.name) {
				setTimeout(() => {
					this.$refs.paging.reload();
				}, 100);
			// }
		},
		clearInput() {
			setTimeout(() => {
				this.$refs.paging.reload();
			}, 100);
		},
	},
};
</script>
<style>
page {
	background: rgba(248, 248, 248, 1);
	/* height: 444px !important; */
}
</style>
<style lang="scss" scoped>
.z-paging-content {
	background: rgba(248, 248, 248, 1);
}
.z-paging-content {
	bottom: 80rpx !important;
}
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: rgba(248, 248, 248, 1);
	.technician-search {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 24rpx 30rpx;
		.city {
			// display: flex;
			width: 120rpx;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
		.u-search {
			width: 582rpx;
			height: 68rpx;
			background: #ffffff;
			border-radius: 34rpx 34rpx 34rpx 34rpx;
			opacity: 1;
		}
		.u-search__content {
			width: 502rpx;
		}
	}
	.technician {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		.u-tabs {
			padding: 20rpx;
			margin: 0 0 -20rpx 0;
			border-radius: 36rpx 36rpx 0 0;
			background: rgba(255, 255, 255, 1);
		}
		::v-deep .u-tabs__wrapper {
			margin: 0 auto;

			.u-tabs__wrapper__nav__item {
				padding: 0 0;
			}
			.u-tabs__wrapper__nav__item-0 .u-tabs__wrapper__nav__item__text {
				width: 200rpx;
				height: 56rpx;
				line-height: 56rpx;
				font-weight: 500;
				text-align: center;
				border-radius: 30rpx 0 30rpx 30rpx;
				z-index: 999;
			}
			.u-tabs__wrapper__nav__item-1 .u-tabs__wrapper__nav__item__text {
				width: 230rpx;
				height: 56rpx;
				margin-left: -40rpx;
				line-height: 56rpx;
				border-radius: 0 30rpx 30rpx 0;
				font-weight: 500;
				text-align: center;
			}
		}
		.technician-item {
			display: flex;
			align-items: center;
			height: 232rpx;
			padding: 0 30rpx;
			margin-top: 18rpx;
			background: #ffffff;
			opacity: 1;
			background: #fff;
			.technician-Information {
				width: calc(100% - 180rpx);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-left: 10rpx;
				.technician-name {
					width: 100%;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: space-between;
					height: 56rpx;
					line-height: 56rpx;
					padding-left: 10rpx;
					margin-bottom: 10rpx;
					.name {
						display: flex;
						flex-direction: row;
						align-items: center;
						height: 56rpx;
						font-size: 32rpx;
						font-weight: bold;
						color: #333333;
					}
					.serverNumber {
						display: flex;
						flex-direction: row;
						height: 56rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
						margin-right: 12rpx;
					}
				}
				.technician-score {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					height: 56rpx;
					align-items: flex-end;
					padding-left: 10rpx;
					.score {
						display: flex !important;
						flex-direction: row;
						align-items: center;
						display: inline-block;
						width: 100rpx;
						height: 45rpx;
						// line-height: 45rpx;
						text-align: center;
						font-size: 28rpx;
						font-weight: 500;
						color: #ff1d00;
					}
					.orderTotal {
						width: 200rpx;
						height: 40rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}
					.primaryStyle {
						display: flex;
						align-items: center;
						justify-content: center;
						margin: 0;
						width: 172rpx;
						height: 56rpx;
						background: rgba(235, 235, 235, 1);
						color: rgba(196, 196, 196, 1);
						border-color: rgba(235, 235, 235, 1);
					}
					.primaryBtn {
						display: flex;
						align-items: center;
						justify-content: center;
						margin: 0;
						width: 172rpx;
						height: 56rpx;
						background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
						border-color: rgba(253, 120, 15, 1);
					}
				}
				.technician-tag {
					display: flex;
					justify-content: space-between;
					align-items: center;
					overflow: hidden; /*设置隐藏*/
					height: 56rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;

					.technician-authentication {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
					.server-time {
						margin-right: 14rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #fd780f;
					}
				}
			}
			.technician-img {
				display: flex;
				position: relative;
			}
			.technician-server {
				position: absolute;
				left: 15%;
				top: 80%;
				width: 120rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				color: #fff;
				background: #6bbb2a;
				border-radius: 20rpx 20rpx 20rpx 20rpx;
				opacity: 1;
			}
			.technician-no {
				position: absolute;
				left: 15%;
				top: 80%;
				width: 120rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				color: rgba(196, 196, 196, 1);
				background: rgba(235, 235, 235, 1);
				border-radius: 20rpx 20rpx 20rpx 20rpx;
				opacity: 1;
			}
		}
	}
}
</style>
