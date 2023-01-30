<template>
	<view class="exchange">
		<view class="account">
			<u--input placeholder="请输入兑换码" v-model="pageQuery.redeemCode"></u--input>
			<u-row customStyle="margin: 20rpx 0">
				<u-col span="7">
					<u--input v-model="pageQuery.graphicCode" placeholder="请输入验证码" maxlength="5"></u--input>
				</u-col>
				<u-col span="5">
					<image class="imgebox" @click="changeUrl" :src="captchaUrl"></image>
				</u-col>
			</u-row>
			<u-row customStyle="margin: -20rpx 0 88rpx 0;">
				<u-col span="7">&nbsp;</u-col>
				<u-col span="5" @click="changeUrl" customStyle="text-align: center;font-size: 32rpx;color: #999999;">
					看不清？换一张</u-col>
			</u-row>
			<u-button shape="circle" color="linear-gradient(to right, #FD780F, #FD6313)" text="确认兑换" @click="submit">
			</u-button>
		</view>
	</view>
</template>

<script>
	import * as fns from '@/api/exchange.js'
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				pageQuery: {
					redeemCode: '', // 兑换码
					graphicCode: '', // 图形码
				},
				local: '', // 获取当前的域名
				captchaUrl: '', // 图片验证码的图片地址
			}
		},
		onLoad(e) {
			if (e?.exchangeCode) {
				if (!store.state.userToken || !uni.getStorageSync('userToken')) {
					uni.setStorageSync('exchangeCode', e.exchangeCode)
					uni.navigateTo({
						url: "/pages/login/login"
					})
				} else {
					this.pageQuery.redeemCode = e.exchangeCode
					uni.removeStorageSync('exchangeCode');
				}
			}
			this.local = window.$request.config.baseUrl,
				this.init()
		},
		methods: {
			init() {
				uni.request({
					withCredentials: true,
					url: `${this.local}index/Captcha/index?t=${Math.random()}`,
					method: 'GET',
					responseType: 'arraybuffer', //设置响应类型
					success: res => {
						const arrayBuffer = new Uint8Array(res.data)
						const base64 = "data:image/png;base64," + uni.arrayBufferToBase64(
							arrayBuffer) //这里需要添加前缀
						this.captchaUrl = base64
					},
					fail: () => {},
				});
			},
			changeUrl() {
				this.init()
			},
			submit() {
				if (!this.pageQuery.redeemCode) return uni.$u.toast('兑换码不能为空！')
				if (!this.pageQuery.graphicCode) return uni.$u.toast('验证码不能为空！')
				fns.redeemCoupon(this.pageQuery).then(res => {
					uni.navigateTo({
						url: 'pages/user/exchange/success'
					})
				}).catch(err => {
					console.log('err', err)
					if (err.code === 704006) {
						this.pageQuery.graphicCode = ''
						this.init()
					}
					uni.$u.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.exchange {
		position: relative;
		height: 100vh;

		.account {
			width: calc(100% - 60rpx);
			position: absolute;
			top: 20rpx;
			left: 50%;
			transform: translate(-50%, 0%);

			.imgebox {
				margin-left: 12rpx;
				width: calc(100% - 12rpx);
				height: 84rpx;
			}
		}
	}
</style>
