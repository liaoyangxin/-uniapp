<template>
	<view class="travel-page">
		<u-popup :show="show" mode="center" @close="close" @open="open" closeable>
			<text class="travel-page-title">请选择出行方式</text>
			<view class="travel-page-text" v-for="(item, inx) in travelData" :key="inx" v-if="currentIndex === inx">
				{{ traveldesc }}
				<text v-if="regResult" class="descStyle">{{ regResult }}</text>
			</view>
			<view class="travel-page-tabs flex" v-if="travelData">
				<view
					class="travel-page-content"
					v-for="(item, index) in travelData"
					:key="index"
					:class="{ activeStyle: currentIndex === index }"
					@click="travelMode(item, index)"
				>
					<u--image :src="item.iconhover" width="25" height="25" v-if="currentIndex === index"></u--image>
					<u--image :src="item.icon" width="25" height="25" v-else></u--image>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
import { getTravel } from '@/api/order';
export default {
	data() {
		return {
			travelData: [
				{
					iconhover: '/static/order/taxi-hover.png',
					icon: '/static/order/taxi.png',
					current: 'taxi',
				},
				{
					iconhover: '/static/order/bus-hover.png',
					icon: '/static/order/bus.png',
					current: 'bus',
				},
			],
			travelList: [],
			currentIndex: 0,
			traveldesc: '',
			regResult: '',
		};
	},
	props: {
		show: Boolean,
		showTime: String,
	},
	onload() {},
	methods: {
		...mapMutations(['setSelectTravel']),
		open() {
			this.getTravelData();
		},
		close() {
			this.$emit('closePopup', false);
		},
		async getTravelData() {
			try {
				let res = await getTravel();
				this.travelData = this.travelData.map(item => {
					res.data.forEach(self => {
						if (item.current === self.id) {
							item.name = self.name;
							item.id = self.id;
							item.time = self.time;
							if (item.name == '出租车/网约车') {
								this.traveldesc = self.desc.slice(0, self.desc.indexOf('<'));
								this.regResult = self.desc.match(/>(\S*)</)[1];
							} else {
								this.traveldesc = self.desc;
							}
						}
					});
					return item;
				});
			} catch (error) {
				this.failMessage({
					msg: error.msg,
				});
			}
		},
		travelMode(item, index) {
			if (item.id === 'bus') {
				if (
					this.showTime < this.travelData[index]?.time?.max &&
					this.showTime > this.travelData[index]?.time?.min
				) {
					this.setSelectTravel(item.name);
					this.currentIndex = index;
				}
			} else {
				this.setSelectTravel(item.name);
				this.currentIndex = index;
			}
			this.close();
		},
		resetCurrentIndex() {
			const item = this.travelData[this.currentIndex];
			if (item.id === 'bus') {
				if (!(this.showTime < item?.time?.max && this.showTime > item?.time?.min)) {
					this.setSelectTravel(this.travelData[0].name);
					this.currentIndex = 0;
				}
			}
			// this.close()
		},
	},
};
</script>

<style lang="scss" scoped>
.travel-page {
	::v-deep .u-popup__content {
		width: 68%;
		padding: 40rpx;
		border-radius: 20rpx;
	}
	.descStyle {
		color: rgba(255, 30, 0, 1);
		font-size: 22rpx;
	}
	&-title {
		font-size: 32rpx;
		color: rgba(51, 51, 51, 1);
		text-align: center;
	}
	&-text {
		color: rgba(102, 102, 102, 1);
		font-size: 28rpx;
		padding: 20rpx 0;
	}
	.activeStyle {
		width: 44%;
		// height: 120rpx;;
		text-align: center;
		background: rgba(255, 249, 245, 1);
		border: 2rpx solid rgba(253, 120, 15, 1);
		color: rgba(51, 51, 51, 1);
		border-radius: 20rpx;
		font-size: 26rpx;
	}
	&-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 44%;
		// height: 120rpx;;
		padding: 10rpx;
		text-align: center;
		background: rgba(239, 239, 239, 1);
		border: 2rpx solid rgba(239, 239, 239, 1);
		color: rgba(153, 153, 153, 1);
		border-radius: 20rpx;
		font-size: 26rpx;
		::v-deep .u-image {
			margin: 0 auto !important;
		}
	}
}
</style>
