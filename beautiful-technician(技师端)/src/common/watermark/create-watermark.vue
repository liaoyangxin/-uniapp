<template>
	<view><canvas canvas-id="poster" class="poster_canvas"></canvas></view>
</template>

<script>
import {updataFileFun} from '../../utility/upload.js'
export default {
	data() {
		return {
			
		};
	},
	props: {},
	methods: {
		async setWatermark(url) {
			try {
				const canvas = await uni.createCanvasContext('poster');
				canvas.drawImage(url, 0, 0, 375, 362);
				canvas.setFontSize(16);
				canvas.setFillStyle('rgba(255, 30, 0, 1)');
				canvas.setTextAlign('left');
				canvas.fillText('测试内容', 140, 238);
				canvas.draw();
				setTimeout(async () => {
					try{
						const canvasImgRes = await uni.canvasToTempFilePath({
							canvasId: 'poster',
							quality: 1,
							destWidth: 375,
							destHeight: 362
						});
						const watermarkImg = await updataFileFun({path:canvasImgRes.tempFilePath,name:'.png'})
						this.$emit('pathChange',watermarkImg)
					}catch(e){
						uni.showToast({
							title:'操作失败~,请检查环境后重试',
							icon:'none'
						})
					}
				}, 500);
			} catch (e) {
				return Promise.reject(e)
			}
		},
	}
};
</script>

<style lang="scss">
.poster_canvas {
	width: 375px;
	height: 362px;
	position: fixed;
	top: -10000rpx;
	left: 0rpx;
}
</style>
