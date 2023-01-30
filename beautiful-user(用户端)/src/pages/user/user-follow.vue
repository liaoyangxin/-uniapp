
<template>
	<view class="follow-page">
		<view class="flex-no-horizontal">
			<image mode="widthFix" :showLoading="true" :src="'../../static/user/follow-img-t.png'"></image>
		</view>
		<view class="flex-no-horizontal">
			<image mode="widthFix" :showLoading="true" :src="'../../static/user/follow-img-b.png'"></image>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.follow-page{
		padding-bottom: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100vh;
		background: linear-gradient(139deg, rgba(255, 255, 255, 1) 0%, rgba(255, 237, 228, 1) 44%, rgba(255, 134, 39, 1) 100%);
		image{
			width: 92%;
			margin: 0 auto;
			background-size: 100% 100%!important;
			// width: 100%;
		}
	}
</style>