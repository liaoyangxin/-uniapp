export default {
	install(Vue) {
		Vue.prototype.failMessage = (e) => {
			console.log(e)
			if (e) {
				uni.hideLoading()
				uni.showToast({
					title: e.msg || e.errMsg || '',
					icon: 'none'
				});
			}
		}
	}
}
