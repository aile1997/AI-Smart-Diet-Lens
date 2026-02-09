<script setup lang="ts">
/**
 * 我的评价页面
 *
 * 显示用户对食谱/食材的评价
 */
import { ref } from "vue";
import BottomNav from "@/components/BottomNav.vue";

// 评价数据
interface ReviewItem {
  id: number;
  name: string;
  image: string;
  rating: number;
  content: string;
  date: string;
  tags: string[];
  hasMerchantReply: boolean;
}

// 当前标签
const activeTab = ref<"reviewed" | "pending">("reviewed");

// 已评价数据
const reviewedList = ref<ReviewItem[]>([
  {
    id: 1,
    name: "牛油果全麦吐司",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_23.jpg?imageMogr2/format/webp/quality/85",
    rating: 5,
    content: "非常清爽的早餐选择，牛油果熟度刚刚好，配上黑胡椒简直完美。热量也很低，适合减脂期。",
    date: "2小时前",
    tags: ["早餐", "低卡"],
    hasMerchantReply: false,
  },
  {
    id: 2,
    name: "彩虹藜麦沙拉",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_24.jpg?imageMogr2/format/webp/quality/85",
    rating: 4,
    content: "食材很新鲜，但是酱汁稍微有点少。希望能增加一些低脂油醋汁的选项。整体口感还是很丰富的。",
    date: "昨天",
    tags: ["午餐"],
    hasMerchantReply: false,
  },
  {
    id: 3,
    name: "韩式低脂拌饭",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_25.jpg?imageMogr2/format/webp/quality/85",
    rating: 5,
    content: "味道出乎意料的好！完全感觉不到是减脂餐，强烈推荐大家尝试。特别是那个特制的拌饭酱，绝了。",
    date: "10月22日",
    tags: [],
    hasMerchantReply: true,
  },
  {
    id: 4,
    name: "羽衣甘蓝排毒饮",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBu9V8WE-Psw8QVhR5drvEb9VYsj49zw7dqUVntHP439U63rlurpNI5OCy-LiZqieSl2FdAEtsIg1fYTqV6ulfKl_X4_7rx0ousU38vMqfIKVo0tp3T9SdUGvzQ7Jc6gTr9MgSXHW4qj5IqpPmEaddDkE_GQech9k_OcOJk2xNnLCBkM3WH_JEysAj09jjCMf10jUhZd0vh9jIqdaX3dGWdzXRF8cYDcYyTcszLuNgiQrdWewq07JEtRjMIWsQISGM-TB9TdqhRjcfi",
    rating: 3,
    content: "健康是健康，但是味道真的有点难以接受... 建议加点苹果或者香蕉中和一下苦味。",
    date: "10月18日",
    tags: ["饮品"],
    hasMerchantReply: false,
  },
]);

// 待评价数据
const pendingList = ref([
  {
    id: 101,
    name: "等待评价的食谱",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
    rating: 0,
    content: "",
    date: "",
    tags: [],
    hasMerchantReply: false,
  },
  {
    id: 102,
    name: "等待评价的食谱",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb5c489?w=200",
    rating: 0,
    content: "",
    date: "",
    tags: [],
    hasMerchantReply: false,
  },
  {
    id: 103,
    name: "等待评价的食谱",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200",
    rating: 0,
    content: "",
    date: "",
    tags: [],
    hasMerchantReply: false,
  },
]);

// 返回
const navigateBack = () => {
  uni.navigateBack();
};

// 切换标签
const switchTab = (tab: "reviewed" | "pending") => {
  activeTab.value = tab;
};

// 渲染星星
const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= rating);
  }
  return stars;
};

// 点击待评价项目
const handlePendingClick = (item: ReviewItem) => {
  uni.navigateTo({
    url: `/pages/recipe-detail/index`,
  });
};

// 更多操作
const showMore = (id: number) => {
  uni.showActionSheet({
    itemList: ["编辑评价", "删除评价"],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showToast({ title: "编辑评价", icon: "none" });
      } else if (res.tapIndex === 1) {
        reviewedList.value = reviewedList.value.filter((r) => r.id !== id);
        uni.showToast({ title: "已删除", icon: "success" });
      }
    },
  });
};
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7FA]">
    <!-- Header -->
    <view class="sticky top-0 z-30 px-4 pt-12 pb-4 bg-[#F5F7FA]/95 backdrop-blur-md flex justify-between items-center">
      <view @tap="navigateBack" class="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-800 active:scale-95 transition-transform">
        <text class="material-symbols-outlined">arrow_back_ios_new</text>
      </view>
      <text class="text-xl font-bold text-[#273936] tracking-tight">我的评价</text>
      <view class="w-10"></view>
    </view>

    <!-- Tabs -->
    <view class="px-4 mb-6 sticky top-[88px] z-20">
      <view class="bg-gray-200/60 p-1 rounded-xl flex text-sm font-semibold relative backdrop-blur-sm shadow-inner">
        <view
          @tap="switchTab('reviewed')"
          class="flex-1 py-2.5 rounded-lg flex justify-center items-center gap-1.5 transition-all"
          :class="activeTab === 'reviewed' ? 'bg-white shadow-sm text-[#456960]' : 'text-gray-500'"
        >
          <text>已评价</text>
          <view class="bg-[#e3ebe5] text-[#456960] text-[10px] px-1.5 py-0.5 rounded-full font-bold">{{ reviewedList.length }}</view>
        </view>
        <view
          @tap="switchTab('pending')"
          class="flex-1 py-2.5 rounded-lg flex justify-center items-center gap-1.5 transition-all"
          :class="activeTab === 'pending' ? 'bg-white shadow-sm text-[#456960]' : 'text-gray-500'"
        >
          <text>待评价</text>
          <view class="bg-gray-200/50 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{{ pendingList.length }}</view>
        </view>
      </view>
    </view>

    <!-- Reviewed List -->
    <view v-if="activeTab === 'reviewed'" class="px-4 space-y-4">
      <view
        v-for="item in reviewedList"
        :key="item.id"
        class="bg-white p-5 rounded-2xl shadow-soft border border-white/50 active:scale-[0.99] transition-transform"
      >
        <!-- Header -->
        <view class="flex gap-4 mb-3">
          <view class="w-14 h-14 rounded-xl bg-cover bg-center shadow-inner flex-shrink-0" :style="`background-image: url('${item.image}')`"></view>
          <view class="flex-1 min-w-0">
            <view class="flex justify-between items-start">
              <text class="font-bold text-slate-900 truncate pr-2 text-sm">{{ item.name }}</text>
              <text class="text-xs text-gray-400 whitespace-nowrap mt-0.5">{{ item.date }}</text>
            </view>
            <!-- Stars -->
            <view class="flex items-center gap-1 mt-1">
              <view
                v-for="(filled, idx) in renderStars(item.rating)"
                :key="idx"
                class="text-[#5a847b] text-base"
                :class="filled ? 'text-[#5a847b]' : 'text-gray-300'"
              >
                <text class="material-symbols-outlined" :class="filled ? 'filled' : ''">star</text>
              </view>
              <text class="text-xs font-bold text-[#5a847b] ml-1">{{ item.rating.toFixed(1) }}</text>
            </view>
          </view>
        </view>

        <!-- Content -->
        <text class="text-xs text-slate-600 leading-relaxed block">{{ item.content }}</text>

        <!-- Footer -->
        <view class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <view class="flex gap-2">
            <view v-for="tag in item.tags" :key="tag" class="px-2.5 py-1 rounded-md bg-[#f4f7f5] text-[#5a847b] text-[10px] font-medium">
              {{ tag }}
            </view>
          </view>
          <view
            @tap="showMore(item.id)"
            class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#5a847b] hover:bg-[#f4f7f5] transition-colors"
          >
            <text class="material-symbols-outlined text-xl">more_horiz</text>
          </view>
        </view>

        <!-- Merchant Reply -->
        <view v-if="item.hasMerchantReply" class="mt-3 flex items-center gap-2 bg-gray-50 px-2.5 py-1 rounded-full">
          <text class="material-symbols-outlined text-xs filled text-[#5a847b]">check_circle</text>
          <text class="text-[10px] text-gray-500 font-medium">商家已回复</text>
        </view>
      </view>
    </view>

    <!-- Pending List -->
    <view v-if="activeTab === 'pending'" class="px-4 space-y-4">
      <view
        v-for="item in pendingList"
        :key="item.id"
        @tap="handlePendingClick(item)"
        class="bg-white p-5 rounded-2xl shadow-soft border border-white/50 active:scale-[0.99] transition-transform"
      >
        <view class="flex gap-4">
          <view class="w-14 h-14 rounded-xl bg-cover bg-center shadow-inner flex-shrink-0" :style="`background-image: url('${item.image}')`"></view>
          <view class="flex-1 flex flex-col justify-center">
            <text class="font-bold text-slate-900 text-sm mb-1">{{ item.name }}</text>
            <text class="text-xs text-gray-400">点击进行评价</text>
          </view>
          <view class="flex items-center">
            <text class="material-symbols-outlined text-[#5a847b]">chevron_right</text>
          </view>
        </view>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
.shadow-soft {
  box-shadow: 0 8px 30px -4px rgba(90, 132, 123, 0.08);
}
</style>
