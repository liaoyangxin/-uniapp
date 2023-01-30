<template>
	<view>
		<view class="wrap" :class="{ 'wrap-hover': ifShowRules }">
			<view class="bg">
				<view class="bg-fontImg p-t-20 m-b-10 flex-no-horizontal"><u--image src="/static/user/font_userShare@2x.png" width="704rpx" height="67"></u--image></view>
				<view class="bg-title flex-no-horizontal font-12">推荐好友成为技师  您将获得1200元推荐费 单笔最高30元佣金</view>
				<!-- <u-button class="bg-btn" type="primary" @click="invitation" text="立即邀请"></u-button> -->
				<view class="bg-btn flex-no-horizontal"><u--image src="/static/user/btn_share_now.png" width="380rpx" height="86rpx" @click="invitation"></u--image></view>
			</view>
			<image src="/static/user/bg_userShare_steps@2x.png" style="width: 100%;" mode="widthFix"></image>
			<view class="share-rule" @click="ifShowRules = true">活动 规则</view>
			<view class="share">
				<view class="share-title flex-no-horizontal"><u--image src="/static/user/font_userShare_list@2x.png" width="183" height="21"></u--image></view>
				<z-paging ref="paging" :fixed="false" :height="'570px'" width="100%" v-model="dataList" @query="queryList">
					<view class="share-item flex" v-for="(item, index) in dataList" :key="index">
						<view class="share-item-name flex-no-horizontal">
							<u--image :src="item.headImgurl" shape="circle" width="40" height="40"></u--image>
							<text>{{ item.nickname }}</text>
						</view>
						<view class="share-item-time font-12">{{ item.createTime }}</view>
					</view>
				</z-paging>
			</view>
			<u-overlay :show="show" @click="show = false" opacity="0.7">
				<view class="share-guidance">
					<view class="share-guidance-top"><u--image src="/static/user/share-btn.png" width="45" height="50"></u--image></view>
					<view class=""><u--image src="/static/user/share-text.png" width="270" height="80"></u--image></view>
					<view class="" @click="close"><u--image src="/static/user/I-know.png" width="182" height="50"></u--image></view>
				</view>
			</u-overlay>
		</view>

		<u-popup :show="ifShowRules" mode="center" closeable :round="10" :customStyle="{ margin: '0 15px' }" :safeAreaInsetBottom="false" @close="ifShowRules = false">
			<view class="rules">
			
				<view class="rules-title">活动规则</view>
				<view class="rules-item">1、参与本活动需要您注册成为美优到家技师。</view>
				<view class="rules-item">2、本次活动中，您可将注册链接分享给好友或分享到朋友圈。</view>
				<view class="rules-item">3、您的好友通过您的链接成功注册，正式成为技师开始接单，在平台每满一个月，您将获得200元推荐费，连续六个月，返满您1200元推荐费；若您推荐的技师中途离开平台，则当月停止返推荐费。</view>
				<view class="rules-item">4、您推荐的技师在平台每完成一笔交易，您将获得20元分佣。</view>
				<view class="rules-item">
					5、如果您推荐的技师也参与到推荐活动中，每当他再推荐其他人成为技师并接单，每一笔订单将为您返回10元分佣。最多仅存在两级推荐关系，例如：A技师推荐B技师，B技师推荐C技师，那么C技师服务后，A、B技师都将获得分佣，其中B技师获得20元分佣，A技师获得10元分佣。
				</view>
				<view class="rules-item">6、当前只有通过链接注册，成功注册美优到家技师并确认绑定关系的技师在服务后，才可以获得分佣。</view>
				<view class="rules-item">7、分佣会在72小时内发放到您的账户中，每月15日、30日可提现。</view>
				<view class="rules-item">8、本次活动解释权归四川美邻鲜科技有限公司所有，如存在恶意刷单、使用非法手段获得收入，我司将有权对您的账号进行封禁处理，同时将取消违规获得的分佣。</view>
				<view class="rules-item">
					9、如活动规则存在调整，我们将第一时间在本活动页进行告知。
				</view>
				<view class="rules-item">
					10、如您对本活动中的规则存在疑问，请联系美优到家客服。
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { inviteRecord } from '@/api/user.js';
export default {
	data() {
		return {
			dataList: [],
			show: false,
			ifShowRules: false
		};
	},
	onLoad() {},
	watch: {
		ifShowRules: function(newVal, oldVal) {
			newVal ? this.stopScroll() : this.canScroll()
		}
	},
	methods: {
		async queryList(pageNo, pageSize) {
			try {
				let res = await inviteRecord(
					{
					"type": 2
					}
				);
				this.dataList = res.data;
				console.log(this.dataList,"---------")
				// this.$refs.paging.complete(res.data);
			} catch (e) {
				this.failMessage(e.msg);
				//TODO handle the exception
			}
		},
		open() {},
		// 立即邀请
		invitation() {
			this.show = true;
		},
		close() {
			this.show = false;
		},
		//禁止滚动
		stopScroll() {
			var mo = function(e) {
				e.preventDefault();
			};
			document.body.style.overflow = 'hidden';
			document.addEventListener('touchmove', mo, false); //禁止页面滑动
		},
		//取消滑动限制
		canScroll() {
			var mo = function(e) {
				e.preventDefault();
			};
			document.body.style.overflow = ''; //出现滚动条
			document.removeEventListener('touchmove', mo, false);
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: rgba(255, 241, 230, 1);
}
.rules {
	border-radius: 20rpx;
	padding: 0 30rpx 30rpx 30rpx;
	background-color: rgba(255, 250, 242, 1);
	&-title {
		font-size: 32rpx;
		font-weight: 500;
		text-align: center;
		height: 100rpx;
		line-height: 100rpx;
	}
	&-item {
		line-height: 44rpx;
		font-size: 26rpx;
	}
}
.wrap-hover {
	
}
.wrap {
	position: relative;
	.share-rule {
		position: absolute;
		right: 0;
		top: 600rpx;
		width: 68rpx;
		// height: 84rpx;
		background: rgba(255, 238, 202, 1);
		border-radius: 12rpx 0 0 12rpx;
		color: rgba(219, 75, 75, 1);
		font-size: 12px;
		text-align: center;
		padding: 10rpx 0;
	}
	.share-guidance {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 600rpx;
		align-items: center;
		text-align: center;
		padding: 80rpx 30rpx;
		margin-top: 20rpx;
		&-top {
			margin-left: 80%;
		}
		::v-deep .u-image__image div {
			background-size: 100% !important;
		}
	}
	.bg {
		padding-bottom: 20rpx;
		background: {
			size: 100% 100%;
			repeat: no-repeat;
			image: url('../../static/user/bg_userShare@2x.png');
			position: 0 0;
		}
		width: 100%;
		&-fontImg {
			justify-content: center;
		}
		&-title {
			justify-content: center;
			background: {
				color: transparent;
				size: 100% 100%;
				repeat: no-repeat;
				image: url('../../static/user/bg_share_title.png');
				position: 0 0;
			}
			margin: 0 auto;
			width: 666rpx;
			height: 76rpx;
			line-height: 76rpx;
			color: rgba(255, 255, 255, 1);
		}
		&-btn {
			justify-content: center;
			margin-top: 478rpx;
		}
	}
	.share {
		margin: 20rpx 30rpx;
		padding: 0 28rpx;
		border-radius: 60rpx;
		box-shadow: 0 4rpx 8rpx 2rpx rgba(255, 223, 199, 0.16);
		background-color: rgba(255, 255, 255, 1);
		&-title {
			justify-content: center;
			padding: 40rpx 0;
		}
		&-item {
			margin-bottom: 30rpx;
			&-name {
				text {
					margin-left: 10rpx;
					font-size: 28rpx;
					color: rgba(51, 51, 51, 1);
				}
			}
			&-time {
				color: rgba(153, 153, 153, 1);
			}
		}
	}
}
</style>
