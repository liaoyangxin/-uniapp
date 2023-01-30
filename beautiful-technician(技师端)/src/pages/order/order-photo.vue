<template>
	<view>
		<image :src="imgData.path" mode="widthFix" style="width: 100%;"></image>
		<view class="bottom">
			<u-button class="bottom-confirmSubmit-btn font-16" type="primary" text="确认提交" @click="confirmClick"></u-button>
			<u-button class="bottom-againPhoto-btn font-16" type="primary" text="重新拍照" @click="againClick"></u-button>
		</view>
	</view>
</template>

<script>
import { updataFileFun } from '../../utility/upload.js';
import { setOrderStatusApi } from '@/api/order.js';
import {mapState} from 'vuex';
export default {
	data() {
		return {
			imgData: {
				path: '',
				name: ''
			},
			orderNo: ''
		};
	},
	onLoad(e) {
		if (e) {
			this.orderNo = e.orderNo;
			this.imgData = this.fileImg
			console.log(this.orderNo)
		}
	},
	computed: {
		...mapState({
			fileImg: state => state.fileImg,
		})
	},
	methods: {
		async confirmClick() {
			try {
				//上传图片
				const imgUrlRes = await updataFileFun(this.imgData);

				//修改订单状态
				const setOrderRes = await setOrderStatusApi({
					orderNo: this.orderNo,
					orderStatus: '300',
					sitePhotos: imgUrlRes
				});
				this.failMessage({
					msg: '操作成功'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 800);
			} catch (e) {
				this.failMessage(e);
			}
		},
		async againClick() {
			try {
				//打开相机
				const res = await uni.chooseImage({
					count: 1,
					sourceType: ['camera']
				});
				this.imgData = res.tempFiles[0];
			} catch (e) {
				this.failMessage(e);
			}
		}
	}
};
</script>

<style lang="scss">
.bottom {
	margin: 60rpx 30rpx 0 30rpx;
	padding-bottom: env(safe-area-inset-bottom);
	.bottom-confirmSubmit-btn {
		margin-bottom: 30rpx;
		border: 0;
		background: linear-gradient(90deg, rgba(253, 120, 15, 1) 0%, rgba(253, 99, 19, 1) 100%);
		border-radius: 40rpx;
		width: 100%;
		height: 80rpx;
		color: rgba(255, 255, 255, 1);
	}
	.bottom-againPhoto-btn {
		border-radius: 40rpx;
		border: 2rpx solid rgba(253, 120, 15, 1);
		background-color: rgba(255, 255, 255, 1);
		width: 100%;
		height: 80rpx;
		color: rgba(51, 51, 51, 1);
	}
}
</style>
