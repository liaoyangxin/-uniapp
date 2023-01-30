export default {
    install(Vue) {
        Vue.prototype.failMessage = (e) => {
            console.log(e, "瞎执行？")
            if (e.msg) {
                uni.hideLoading()
                uni.showToast({
                    title: e.msg || e.errMsg || '',
                    icon: 'none'
                });
            }
        }
    }
}