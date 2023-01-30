<template>
	<view>
		<web-view :src="webViewUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webViewUrl: '',
			};
		},
		onLoad(e) {
			this.webViewUrl = e.url || ''
		}
	}
</script>

<style lang="scss">

</style>
