<template>
	<view class="wrap">
		<u-swiper
			:list="lifeImgs"
			@change="e => (current = e.current)"
			@click="click"
			:autoplay="false"
			indicatorStyle="left: 45%"
		>
			<view slot="indicator" class="indicator-num">
				<text class="indicator-num__text">{{ current + 1 }}/{{ lifeImgs.length }}</text>
			</view>
		</u-swiper>
	</view>
</template>
<script>
import { authInfoApi } from '../../api/technician';
export default {
	data() {
		return {
			lifeImgs: [],
			technicianGuid: '',
			current: 0,
		};
	},
	computed: {},
	onLoad(item) {
		this.technicianGuid = item.guid;
		this.getdetail();
	},
	methods: {
		async getdetail() {
			try {
				let res = await authInfoApi({ guid: this.technicianGuid });
				this.lifeImgs = Object.values(res.data.lifeImgs);
			} catch (e) {
				this.failMessage({
					msg: e,
				});
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.indicator {
	@include flex(row);
	justify-content: center;
	&__dot {
		height: 6px;
		width: 6px;
		border-radius: 100px;
		background-color: rgba(255, 255, 255, 0.35);
		margin: 0 5px;
		transition: background-color 0.3s;

		&--active {
			background-color: rgba(255, 255, 255, 1);
		}
	}
}

.indicator-num {
	position: fixed;
	top: 12rpx;
	padding: 4rpx;
	background-color: rgba(153, 153, 153, 1);
	border-radius: 100rpx;
	width: 100rpx;
	@include flex;
	justify-content: center;

	&__text {
		color: rgba(255, 255, 255, 1);
		font-size: 28rpx;
	}
}
::v-deep .u-swiper {
	height: 100vh !important;
}
::v-deep .u-swiper__wrapper {
	height: 100vh !important;
}
::v-deep .u-swiper__wrapper__item__wrapper__image {
	height: 100% !important;
}
</style>
