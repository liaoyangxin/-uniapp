<template>
	<view>
		<view v-if="value" class="refresh swapping-squares-spinner">
			<view class="refresh-box">
				<u--image :src="'/static/login/page_loading.gif'" width="110" height="110"></u--image>
				<!-- <view class="text">··· 资源加载中 ···</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Loading',
		props: {
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

.refresh {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
.refresh-box {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
}
.image {
	width: 300rpx;
	height: 300rpx;
	border-radius: 150rpx;
	animation-iteration-count: infinite;
	animation-name: loading;
	animation-duration: 2000ms;
	animation-delay: 200ms;
	animation-timing-function: ease-in-out;
}
.text {
	font-size: 36rpx;
	font-weight: bold;
	text-align: center;
	margin-top: 20rpx;
}
/* @keyframes loading {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
 */
</style>
