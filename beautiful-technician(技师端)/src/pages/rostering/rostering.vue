<template>
	<view class="rostering-page">
		<view class="rostering-page-main">
			<scroll-view scroll-x class="rostering-page-main-scroll">
				<view class="rostering-date flex align-center">
					<view v-for="(item, self) in weekList" :key="self" :class="[weekListIndex === self ? 'defaultTime' : 'uncheckedStyle']" @click="weekClick(self)">
						<view class="align-center font-14">{{ item.date }}</view>
						<view class="align-center font-14" style="margin-top: 10rpx;">{{ item.week }}</view>
					</view>
				</view>
			</scroll-view>

			<view class="rostering-tips flex-no-horizontal font-12">
				<u--image src="/static/rostering/icon_inform.png" width="24" height="24"></u--image>
				点击以下时间段，
				<text>设置/取消忙时</text>
				（可有效避免拒单）
			</view>
			<view class="rostering-time p-10">
				<view class="rostering-time-item flex-no-horizontal" v-for="(item, index) in rosterTime" @click="changeTime(index)" :key="index" :class="{ 'rostering-time-item-hover': item }">
					<text>{{ index }}:00</text>
				</view>
			</view>
		</view>
		<view class="rostering-operation">
			<button type="default" class="user-recharge-resetBtn" @click="reset">
				<u-icon v-if="bFont==='全选'" name="checkmark"></u-icon>
				<u-icon v-else name="reload"></u-icon>
				<text style="margin-left: 6rpx;">{{bFont}}</text> 
			</button>
			<button type="default" class="user-recharge-successBtn" @click="setScheduling">确认</button>
		</view>
	</view>
</template>

<script>
import { userSetSchedulingApi, userGetSchedulingApi, getWorkDateList } from '@/api/technician.js';
import { getFutureTime } from '@/utility/random.js';
export default {
	data() {
		return {
			rosterTime: {
				'0': false,
				'1': false,
				'2': false,
				'3': false,
				'4': false,
				'5': false,
				'6': false,
				'7': false,
				'8': false,
				'9': false,
				'10': false,
				'11': false,
				'12': false,
				'13': false,
				'14': false,
				'15': false,
				'16': false,
				'17': false,
				'18': false,
				'19': false,
				'20': false,
				'21': false,
				'22': false,
				'23': false
			},
			notice: '点击以下时间段，设置/取消忙时（可有效避免拒单）。',
			weekList: [],
			weekListIndex: 0,
			bFont: '重置'
		};
	},
	onShow() {
		if(this.weekList.length > 0){
			this.getScheduling(this.$u.timeFormat(this.weekList[this.weekListIndex].time));
		}else{
			this.init()
		}
	},
	methods: {
		init(){
			getWorkDateList().then(res => {
				this.weekList = res.data
				this.getScheduling(this.weekList[this.weekListIndex].time)
			})
		},
		async getScheduling(date) {
			try {
				const res = await userGetSchedulingApi({
					date
				});
				this.rosterTime = {};
				for (let i = 0; i < res.data.length; i++) {
					this.rosterTime[i] = !res.data[i].isWork ? false : true;
				}
			} catch (e) {
				this.failMessage(e);
			}
		},
		async setScheduling() {
			try {
				const res = await userSetSchedulingApi({
					date: this.weekList[this.weekListIndex].time,
					plans: this.rosterTime
				});
				uni.showToast({
					title: '操作成功',
					icon: 'none'
				});
			} catch (e) {
				this.failMessage(e);
			}
		},
		async weekClick(index) {
			this.weekListIndex = index;
			this.getScheduling(this.$u.timeFormat(this.weekList[this.weekListIndex].time));
		},
		changeTime(index) {
			this.rosterTime[index] = !this.rosterTime[index];
			this.$forceUpdate();
		},
		reset() {
			if(Object.values(this.rosterTime).every(v => v == false)){
				for (let i = 0; i < Object.keys(this.rosterTime).length; i++) {
					this.rosterTime[i] = true;
				}
				this.bFont= '重置'
			} else {
				for (let i = 0; i < Object.keys(this.rosterTime).length; i++) {
					this.rosterTime[i] = false;
				}
				this.bFont= '全选'
			}
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
uni-page-body {
	background: rgba(245, 248, 250, 1);
}
.rostering-page {
	display: flex;
	flex-direction: column;
	.rostering-page-main-scroll {
		width: 100%;
		white-space: nowrap;
		background: rgba(255, 255, 255, 1);
		.rostering-date {
			width: 100%;
			height: 108rpx;
			.defaultTime {
				font-weight: bold;
				padding: 0 30rpx;
				color: rgba(253, 120, 15, 1);
				view: {
					width: 100%;
				}
			}
			.uncheckedStyle {
				padding: 0 30rpx;
				color: rgba(102, 102, 102, 1);
				view: {
					width: 100%;
				}
			}
		}
	}
	.rostering-tips {
		margin-top: 20rpx;
		padding-left: 30rpx;
		background: rgba(255, 255, 255, 1);
		height: 88rpx;
		color: rgba(153, 153, 153, 1);
		text {
			color: rgba(255, 147, 64, 1);
		}
	}
	.rostering-time {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: wrap;
		.rostering-time-item {
			justify-content: center;
			margin: 16rpx 0;
			border-radius: 20rpx;
			width: 160rpx;
			height: 80rpx;
			background: {
				repeat: no-repeat;
				image: url('../../static/rostering/bg_rostering_idle.png');
				size: 100% 100%;
			}
		}
		.rostering-time-item-hover{
			background: {
				repeat: no-repeat;
				image: url('../../static/rostering/bg_rostering_busy.png');
				size: 100% 100%;
			}
		}
	}
	.rostering-operation {
		position: fixed;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		bottom: var(--window-bottom);
		height: 100rpx;
		background: rgba(255, 255, 255, 1);
		.user-recharge-successBtn {
			margin: 0 30rpx 0 0;
			width: 160rpx;
			height: 56rpx;
			line-height: 56rpx;
			background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
			color: rgba(255, 255, 255, 1);
			font-size: 24rpx;
			border-radius: 28rpx;
		}
		.user-recharge-resetBtn {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 0 0 30rpx;
			width: 160rpx;
			height: 56rpx;
			line-height: 56rpx;
			background: rgba(235, 235, 235, 1);
			color: rgba(153, 153, 153, 1);
			font-size: 24rpx;
			border-radius: 28rpx;
			border: 0;
		}
		.user-recharge-resetBtn:after {
			border: 0;
		}
	}
}
</style>
