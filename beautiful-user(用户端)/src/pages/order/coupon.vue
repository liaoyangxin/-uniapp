<template>
  <view class="coupon">
    <z-paging-swiper>
      <block slot="top">
        <view class="tabs-box">
          <view
            class="tabs-item"
            v-for="(item, index) in list1"
            :key="index"
            @click="tabsChange(index)"
          >
            <view
              class="tabs-item-title font-16"
              :class="{ 'tabs-item-title-hover': index === current }"
            >
              {{ item.name }}
            </view>
            <view class="tabs-item-slider" v-if="index === current"></view>
          </view>
        </view>
      </block>
      <swiper
        class="swiper"
        :current="current"
        @animationfinish="animationfinish"
        @change="changeswiper"
      >
        <swiper-item
          class="swiper-item"
          v-for="(item, index) in list1"
          :key="index"
        >
          <couponItem
            v-if="index === current"
            :id="'coupon' + index"
            :currentIndex="current"
          >
          </couponItem>
        </swiper-item>
      </swiper>
    </z-paging-swiper>
  </view>
</template>
<script>
import couponItem from "./common/couponItem.vue";
export default {
  components: {
    couponItem,
  },
  data() {
    return {
      list1: [
        {
          name: "可用优惠券",
        },
        {
          name: "不可用优惠券",
        },
      ],
      current: 0, // tabs组件的current值，表示当前活动的tab选项
      dataList: [],
    };
  },
  onLoad(e) {
    if (e.orderStatus) {
      this.current = parseInt(e.orderStatus);
    }
  },
  onReady() {},
  methods: {
    //tabs通知swiper切换
    tabsChange(value) {
      this.current = value;
    },
    //swiper滑动结束
    animationfinish(e) {},
    changeswiper(e) {
      let current = e.detail.current;
      this.current = current;
    },
  },
};
</script>
<style>
.zp-swiper-container-fixed {
  top: 0 !important;
}
</style>
<style lang="scss" scoped>
.tabs-box {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  padding: 20rpx 30rpx;

  .tabs-item {
    text-align: center;

    .tabs-item-title {
      color: rgba(51, 51, 51, 1);
      font-family: Source Han Sans CN-Regular, Source Han Sans CN !important;
    }

    .tabs-item-slider {
      margin: 0 auto;
      margin-top: 12rpx;
      width: 36rpx;
      height: 6rpx;
      border-radius: 4rpx;
      background: rgba(253, 120, 15, 1);
    }
  }

  .tabs-item-title-hover {
    color: rgba(51, 51, 51, 1);
    font-weight: 400;
    font-size: 32rpx;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN !important;
  }
}

.swiper {
  height: 100%;
}
</style>
