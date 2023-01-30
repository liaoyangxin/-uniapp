<template>
	<!-- 使用z-paging-swiper为根节点可以免计算高度 -->
	<z-paging-swiper>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<view class="tabs-box flex" slot="top">
			<view class="tabs-item" v-for="(item, index) in list1" :key="index" @click="tabsChange(index)">
				<view class="tabs-item-title font-16" :class="{ 'tabs-item-title-hover': index === current }">{{ item.name }}</view>
				<view class="tabs-item-slider" v-if="index === current"></view>
			</view>
		</view>
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
		<swiper class="swiper" :current="current" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in list1" :key="index">
				<orderItem :tabIndex="index" :currentIndex="current">
				</orderItem>
			</swiper-item>
		</swiper>
		<view class="tab-horizontal"></view>
	</z-paging-swiper> 
</template>

<script>
import orderItem from './common/list-item.vue';
export default {
	components: {
		orderItem
	},
	data() {
		return {
			list1: [
				{
					name: '全部'
				},
				{
					name: '待支付'
				},
				{
					name: '待接单'
				},
				{
					name: '进行中'
				},
				{
					name: '已完成'
				},
				{
					name: '已取消'
				}
			],
			current: 0 // tabs组件的current值，表示当前活动的tab选项
		};
	},
	onLoad(e) {
		if (e.orderStatus) {
			this.current = parseInt(e.orderStatus);
		}
	},
	methods: {
		//tabs通知swiper切换
		tabsChange(value) {
			this.current = value;
		},
		//swiper滑动结束
		animationfinish(e) {
			let current = e.detail.current;
			this.current = current;
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: rgba(247, 247, 247, 1);
}
.tabs-box {
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	.tabs-item {
		text-align: center;
		.tabs-item {
			color: rgba(51, 51, 51, 1);
		}
		.tabs-item-slider {
			margin: 0 auto;
			margin-top: 12rpx;
			width: 36rpx;
			height: 6rpx;
			border-radius: 4rpx;
			background: rgba(253, 120, 15, 1);
		}
	}
	.tabs-item-title-hover {
		color: rgba(253, 120, 15, 1);
		font-weight: bold;
		font-size: 32rpx;
	}
}
.swiper {
	height: 100%;
}
</style>
