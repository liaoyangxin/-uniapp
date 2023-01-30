<!-- 服务时间 -->
<template>
	<view class="page">
		<view class="card">
			<view class="title">
				<view>工作时间</view>
				<u-icon
					v-if="!startTime"
					@click="chooseTime"
					label="请选择时间"
					labelPos="left"
					stop
					color="#FD780F"
					labelColor="#FD780F"
					hoverClass="hoverClass"
					name="arrow-right"
				></u-icon>
				<view v-else @click="chooseTime" style="display: flex; color: #fd780f">
					{{ startTime }}
					<view v-if="endTime" style="display: flex">
						<text style="margin: 0 6rpx"> - </text>
						{{ endTime }}
					</view>
				</view>
			</view>
			<view class="week">
				<view
					v-for="(item, index) in week"
					class="weekData"
					:class="item.isCheck ? 'chooseb' : ''"
					:key="index"
				>
					<span @click.stop="chooseWeek(item, index)">{{ item.name }}</span>
				</view>
			</view>
		</view>
		<view class="footer">
			<u-button class="okb" type="warning" shape="circle" text="保存" @click="save"></u-button>
		</view>
		<view>
			<u-picker
				:show="show"
				:defaultIndex="defaultVal"
				ref="uPicker"
				confirmColor="#FD780F"
				:columns="columns"
				@confirm="confirm"
				@change="changeHandler"
				@cancel="show = false"
			>
			</u-picker>
		</view>
	</view>
</template>

<script>
import * as fns from '@/api/serviceTime.js';
export default {
	data() {
		return {
			showLoadingToal: false,
			show: false,
			columns: [[], [], [], []],
			startTime: '',
			endTime: '',
			defaultVal: [0, 0, 0, 0],
			week: [
				{
					label: '周一',
					value: 1,
					choosed: false,
				},
				{
					label: '周二',
					value: 2,
					choosed: false,
				},
				{
					label: '周三',
					value: 3,
					choosed: false,
				},
				{
					label: '周四',
					value: 4,
					choosed: false,
				},
				{
					label: '周五',
					value: 5,
					choosed: false,
				},
				{
					label: '周六',
					value: 6,
					choosed: false,
				},
				{
					label: '周日',
					value: 7,
					choosed: false,
				},
			],
		};
	},
	computed: {
		choosedWeek() {
			let arr = [];
			this.week.forEach(item => {
				item.isCheck && arr.push(item.id);
			});
			return arr;
		},
	},
	onLoad() {},
	onShow() {
		this.init();
		this.setTime();
	},
	methods: {
		setTime() {
			this.columns[0] = [];
			this.columns[1] = ['00'];
			this.columns[2] = [];
			this.columns[3] = ['00'];
			for (let i = 0; i < 24; i++) {
				if (i < 10) {
					this.columns[0].push('0' + i);
					this.columns[2].push('0' + i);
				} else {
					this.columns[0].push(i);
					this.columns[2].push(i);
				}
			}
		},
		init() {
			fns.getServerTimeConfig().then(res => {
				this.week = res.data.weeks;
				const picker = this.$refs.uPicker;
				if (res.data.startTime) {
					this.startTime = res.data.startTime;
					this.endTime = res.data.endTime;
					const starth = parseInt(res.data.startTime.split(':')[0]);
					const endh = parseInt(res.data.endTime.split(':')[0]);
					this.$set(this.defaultVal, 0, starth);
					this.$set(this.defaultVal, 2, endh);
				}
			});
		},
		chooseWeek(obj, index) {
			obj.isCheck = !obj.isCheck;
			this.week[index] = obj;
		},
		chooseTime() {
			this.show = true;
		},
		changeHandler(e) {
			const { value } = e;
			this.chooseTimeVal = value;
		},
		save() {
			if (!this.showLoadingToal) {
				if (!this.startTime) {
					uni.showToast({
						title: '请选择工作时间',
						icon: 'error',
					});
					return;
				}
				const attr = {
					week: this.choosedWeek,
					startTime: this.startTime,
					endTime: this.endTime,
				};
				this.showLoadingToal = true;
				uni.showLoading({});
				fns.setServerTimeConfig(attr)
					.then(res => {
						uni.hideLoading();
						this.showLoadingToal = false;
						uni.showToast({
							title: '操作成功',
							icon: 'success',
						});
						this.show = false;
					})
					.catch(e => {
						this.showLoadingToal = false;
						this.failMessage(e);
					});
			}
		},
		confirm(e) {
			const { value, indexs } = e;
			this.defaultVal = indexs;
			const startTime = value[0] + ':00';
			const endTime = value[2] + ':00';
			const startN = parseInt(value[0]);
			const endN = parseInt(value[2]);
			if (startN > endN) {
				uni.showToast({
					title: '结束时间不能大于开始时间',
					icon: 'none',
					duration: 2000,
				});
				return;
			}
			this.startTime = startTime;
			this.endTime = endTime;
			this.show = false;
		},
	},
};
</script>
<style lang="scss">
v::deep.u-popup__content {
	border-radius: 20rpx;
}
</style>
<style lang="scss" scoped>
.page {
	background-color: #f5f8fa;
	height: 100vh;

	.card {
		// height: 100%;
		// margin: 42rpx;
		padding: 24rpx;
		background-color: #fff;

		.title {
			display: flex;
			justify-content: space-between;
			padding: 6rpx 30rpx 30rpx 30rpx;
			border-bottom: 2px solid #f2f2f2;
			margin-bottom: 32rpx;
		}

		.week {
			display: flex;
			flex-wrap: wrap;
			padding-bottom: 12rpx;

			.weekData {
				width: 25%;
				line-height: 100rpx;
				text-align: center;

				span {
					color: #999999;
					background-color: #ebebeb;
					border-radius: 20rpx;
					padding: 14rpx 40rpx;
				}
			}

			.chooseb {
				span {
					color: #fd780f;
					border: 1px solid #fd780f;
					background-color: #fff9f5;
				}
			}
		}
	}

	.footer {
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		bottom: 72rpx;

		.okb {
			background: linear-gradient(90deg, #fd780f 0%, #fd6313 100%);
		}
	}
}
</style>
