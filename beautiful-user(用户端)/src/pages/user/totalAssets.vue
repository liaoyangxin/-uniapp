<template>
	<view class="user-page">
        <z-paging ref="paging" v-model="revenueDetails" @query="queryList">
		<view class="user-assets">
			<view class="assets-item">
                <view class="flex">
                    <u--image src="/static/order/icon-balancePay.png" width="16" height="16"></u--image>
                    <text class="assets-title">{{"&nbsp;"+"我的总资产"}} <span>(元)</span></text>
                </view>
				<text class="quota">{{assetsList.totalAssets}}</text>
				<view class="">
					
					<!-- <u-button type="primary" :plain="true" text="提现" size="small" @click="withdrawal" shape="circle" color="#FD780F"></u-button> -->
				</view>
			</view>
			<view class="">
				<u-button type="primary" :plain="true" text="充值" size="small" class="rechargeBtn" @click="toRecharge" shape="circle" color="#FD780F"></u-button>
			</view>
             <!-- <view class="flex" style="width:100%">
               <view>
                   <view class="title-color" style="background-color: rgba(254, 89, 73, 1)"></view>
                    <text class="assets-text flex" style="margin-bottom: 8rpx;">余额充值<span>(元)</span></text>
                    <text class="assets-money">{{assetsList.rechargeIncome}}</text>
                </view>
				 
				<view>
					<view class="title-color" style="background-color: rgba(255, 161, 49, 1)"></view>
				    <text class="assets-text flex" style="margin-bottom: 8rpx;">分佣收益<span>(元)</span></text>
				    <text class="assets-money">{{assetsList.incomeSharing}}</text>
				</view>
             </view> -->
             
		</view>
        <view class="bill-details">
            <text class="bill-details-title">资产明细</text>
            <view class="tab-tilte">
                <text v-for="(item,index) in billDetailsTitle" :key="index" @click="check(item.name,index)" :class="[current == index ? 'activeStyle' : 'uncheckedStyle']">{{item.name}}
                </text>
            </view>
        </view>
		<view class="configure-modular" v-if="revenueDetails.length > 0">
            <view class="configure-modular-item" v-for="(item,index) in revenueDetails" :key="index" :border="false">
				<view class="configure-modular-item-title">
					<view class="item-title-text" >
						<text class="text-type">{{item.orderTypeStr}}</text>
						<text class="text-orderNo">{{"&nbsp;&nbsp;"+item.orderNo}}</text>
					</view>
					<view style="color: rgba(150, 150, 150, 1);font-weight: 400;">
						{{item.receiptPayTypeStr}}
					</view>
					<view class="configure-modular-item-time">
						{{item.createTime}}
					</view>
				</view>
				<view :class="[(Number(item.addReduceStr+item.money)<0)&&'configure-modular-item-money',!(Number(item.addReduceStr+item.money)<0)&&'incomeStyle']">
					{{item.addReduceStr}}{{item.money}}
				</view>
			</view>
		</view>
      </z-paging>
	</view>
</template>

<script>
import { userAssets ,orderDetailed} from "../../api/user"
	export default {
		data() {
			return {
				assetsList:{},
                current:0,
                revenueDetails:[],// 明细
                assetStype:4,
                moneyData:[
                    {
						color:"#FE5949",
						text:"余额充值",
					},
     //                {
					// 	color:"#FFA131",
					// 	text:"分佣收益",
					// },
                    {
						color:"#4CC98D",
						text:"结算收益",
					},
                ],
				billDetailsTitle:[
					{			
						name:"余额明细",
					},
					// {
					// 	name:"分佣明细",
					// }
				],
                billDetailsData:[111,43,5656]
			};
		},
        watch: {
			
		},
        onLoad(){
            this.getUserAssets()
        },
        methods: {
            //我的资产
            async getUserAssets(){
                try {
                    let res=await userAssets()
                    this.assetsList=res.data
                } catch (error) {
                    this.failMessage({
                        msg:error.msg
                    })
                }
            },
			toRecharge(){
               
				uni.navigateTo({
					url: `./user-recharge?rechargeIncome=${this.assetsList.rechargeIncome}`
				});
			},
            // 明细
            async queryList(page, pageSize) {
				try {
					let res = await orderDetailed({
						page: page,
						pageSize: pageSize,
                        type: parseInt(this.assetStype)
					});
					this.$refs.paging.complete(res.data.data);
					this.firstLoaded = true;
				} catch (e) {
					//TODO handle the exception
					this.failMessage(e.msg);
					this.$refs.paging.complete(false);
				}
			},	
            check: function (item,index) {
                this.current = index
                switch(item){
                    case "分佣明细":
                    this.assetStype=2
                    break;
                    case "余额明细":
                    this.assetStype=4
                    break;
                }
                this.$refs.paging.reload();
            },
            // 提现
            withdrawal(){
                uni.navigateTo({
                    url: './user-withdrawal'
                });
            }
        }
	}
</script>

<style lang="scss">
    page{
        background:rgba(248, 248, 248, 1);
    }
	.z-paging-content{
		top: 0 !important;
	}
	
	.user-page{
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #F5F8FA;
	.title-color{
		margin-bottom: 10rpx;
		border-radius: 8rpx;
		width: 24rpx;
		height: 10rpx;
	}
	.user-assets{
        position: relative;
		display: flex;
        flex-direction: row;
		justify-content: space-around;
		height: 172rpx;
		align-items: center;
		margin: 20rpx 30rpx 0 30rpx;
		background: #FFFFFF;
		border-radius: 32rpx;
        padding:10rpx 108rpx;
		.assets-text{
			color: rgba(153, 153, 153, 1);
			font-size: 24rpx;
			font-weight: 400;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN !important;
		}
		.assets-money{
			font-size: 36rpx;
			font-weight: 500;
		}
		.assets-item{
			display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN !important;
			// text-align: start;
			font-size: 28rpx;
			font-weight: 500;
			color: #999999;
			.assets-title{
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				span{
					color: #999999;
				}
			}
            .u-button{
				width: 50%;
                height: 48rpx;
                font-size: 28rpx;
                font-weight: 500;
                color: #FD780F;
            }
		}
        .quota{
			height: 90rpx;
			line-height: 90rpx;
            font-size: 52rpx;
            font-weight: 500;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN !important;
            color: #333333;
        }
		
	}
	.rechargeBtn{
		width: 108rpx;
		height: 48rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FD780F;
		margin-left: 40rpx;
	}
    .bill-details{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin: 30rpx 40rpx;
        .bill-details-title{
            width: 130rpx;
            font-size: 32rpx;
            font-weight: 500;
            color: #333333;
        }
        .tab-tilte{
            display: flex;
            flex-direction: row;
            justify-content:flex-start;
            flex: 1;
            text-align: center;
            font-size: 24rpx;
        }
        .activeStyle{
            display: flex;
            height: 48rpx;
            align-items: center;
            padding: 0 16rpx;
            background: #FD780F;
            border-radius: 26rpx;
            color: #FFF;
            text-align: center;
            margin-left: 10rpx;
            border: 1px solid #FD780F;
        }
        .uncheckedStyle{
            display: flex;
            align-items: center;
            padding: 0 16rpx;
            height: 48rpx;
            background: #FCFDFF;
            color: #999999;
            border-radius: 26rpx;
            border: 1px solid #DFDFDF;
            text-align: center;
            margin-left: 10rpx;
        }
    }
	.configure-modular{
		background: #FFFFFF;
		border-radius: 32rpx;
		margin:0 30rpx;
		padding: 20rpx 0;
		font-family: Source Han Sans CN-Medium, Source Han Sans CN !important;
		&-item-money{
			color: rgba(51, 51, 51, 1);
			font-weight: 500;
			font-size: 28rpx;
		}
		.configure-modular-item{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 28rpx;
			font-weight: 500;
			color: #666666;
			padding:8rpx 28rpx;
			
            .incomeStyle{
               color: rgba(253, 120, 15, 1);
               font-weight: 500;
            }
            &-time{
               color: rgba(200, 200, 200, 1);
               font-size: 24rpx;
			   height: 50rpx;
			   line-height: 50rpx;
            }
		}
		.item-title-text{
			height: 50rpx;
			line-height: 50rpx;
		}
        .text-type{
            font-size: 28rpx;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
        }
        .text-orderNo{
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(200, 200, 200, 1);
        }
	}
 }
</style>
