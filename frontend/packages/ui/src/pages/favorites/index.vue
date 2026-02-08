<script setup lang="ts">
/**
 * 我的收藏页面
 *
 * 显示用户收藏的食谱和食材
 */
import { ref, computed, onMounted } from 'vue'
import { useAuthStore, useFavorites, type FavoriteType } from '@diet-lens/core'
import BottomNav from '@/components/BottomNav.vue'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const {
  loading,
  error,
  selectedType,
  currentList,
  isEmpty,
  fetchFavorites,
  removeFavorite: removeFav,
  switchType,
  refresh,
} = useFavorites()

// 搜索关键词
const searchQuery = ref('')

// 过滤后的列表
const filteredList = computed(() => {
  if (!searchQuery.value.trim()) {
    return currentList.value
  }
  return currentList.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 返回
const navigateBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

// 切换标签
const switchTab = async (tab: 'recipe' | 'food') => {
  await switchType(tab as FavoriteType)
}

// 取消收藏
const removeFavorite = async (id: string) => {
  try {
    await removeFav(id)
    uni.showToast({
      title: '已取消收藏',
      icon: 'success'
    })
  } catch (err) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 点击项目
const handleItemClick = (item: any) => {
  if (selectedType.value === 'recipe') {
    uni.navigateTo({
      url: `/pages/recipe-detail/index?id=${item.itemId}`
    })
  } else {
    uni.navigateTo({
      url: `/pages/food-detail/index?name=${encodeURIComponent(item.name)}`
    })
  }
}

// 下拉刷新
const onRefresh = async () => {
  await refresh()
  uni.stopPullDownRefresh()
}

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/onboarding/login' })
}

// 页面加载时获取收藏列表
onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchFavorites()
  }
})
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7F8]">
    <!-- Header -->
    <view class="sticky top-0 z-30 px-4 pt-12 pb-4 bg-[#F5F7F8]/95 backdrop-blur-md flex justify-between items-center">
      <view @tap="navigateBack" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5a847b] active:scale-95 transition-transform">
        <text class="material-symbols-outlined">arrow_back</text>
      </view>
      <text class="text-xl font-bold text-slate-900 tracking-tight">我的收藏</text>
      <view class="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-[#5a847b]">
        <text class="material-symbols-outlined">more_horiz</text>
      </view>
    </view>

    <!-- 未登录提示 -->
    <view v-if="!isLoggedIn" class="flex flex-col items-center justify-center px-10" style="min-height: 60vh;">
      <text class="material-symbols-outlined text-slate-300 text-6xl mb-4">lock</text>
      <text class="text-base font-medium text-slate-600 mb-2">需要登录</text>
      <text class="text-sm text-slate-400 text-center mb-6">请先登录以查看您的收藏</text>
      <view class="bg-[#34C759] text-white py-3 px-8 rounded-full font-medium" @tap="goToLogin">
        去登录
      </view>
    </view>

    <template v-else>
      <!-- Search -->
      <view class="px-4 mt-2">
        <view class="relative">
          <view class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <text class="material-symbols-outlined text-gray-400 text-xl">search</text>
          </view>
          <input
            v-model="searchQuery"
            class="block w-full pl-11 pr-4 py-3.5 border-none rounded-2xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5a847b]/50 shadow-sm"
            :placeholder="selectedType === 'recipe' ? '搜索收藏的食谱' : '搜索收藏的食材'"
            type="text"
          />
        </view>
      </view>

      <!-- Tabs -->
      <view class="px-4 mt-6">
        <view class="flex p-1.5 bg-gray-200/50 rounded-2xl">
          <view
            @tap="switchTab('recipe')"
            class="flex-1 py-2.5 text-sm font-bold rounded-xl text-center transition-all"
            :class="selectedType === 'recipe' ? 'bg-white shadow-sm text-[#5a847b]' : 'text-gray-500'"
          >
            食谱
          </view>
          <view
            @tap="switchTab('food')"
            class="flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all"
            :class="selectedType === 'food' ? 'bg-white shadow-sm text-[#5a847b]' : 'text-gray-500'"
          >
            食材
          </view>
        </view>
      </view>

      <!-- Loading State -->
      <view v-if="loading" class="px-4 mt-12 flex flex-col items-center">
        <view class="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#34C759] animate-spin"></view>
        <text class="text-sm text-slate-400 mt-4">加载中...</text>
      </view>

      <!-- Empty State -->
      <view v-else-if="isEmpty && !loading" class="px-4 mt-12 flex flex-col items-center">
        <view class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <text class="material-symbols-outlined text-slate-300 text-4xl">favorite_border</text>
        </view>
        <text class="text-slate-600 text-base font-medium mb-2">暂无收藏</text>
        <text class="text-slate-400 text-sm text-center">{{ selectedType === 'recipe' ? '快去收藏喜欢的食谱吧' : '快去收藏喜欢的食材吧' }}</text>
      </view>

      <!-- Content Grid -->
      <view v-else class="px-4 mt-6">
        <view class="grid grid-cols-2 gap-4">
          <view
            v-for="item in filteredList"
            :key="item.id"
            @tap="handleItemClick(item)"
            class="bg-white p-3 rounded-2xl shadow-soft active:scale-[0.98] transition-transform"
          >
            <view class="relative aspect-[1/1] rounded-xl overflow-hidden bg-gray-100 mb-3">
              <image
                v-if="item.image"
                :src="item.image"
                class="w-full h-full"
                mode="aspectFill"
              />
              <view v-else class="w-full h-full flex items-center justify-center bg-slate-100">
                <text class="material-symbols-outlined text-slate-300 text-4xl">image</text>
              </view>
              <view
                @tap.stop="removeFavorite(item.id)"
                class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 shadow-sm active:scale-90 transition-transform"
              >
                <text class="material-symbols-outlined filled text-lg">favorite</text>
              </view>
            </view>
            <text class="font-bold text-slate-800 text-sm leading-tight mb-1 block truncate">{{ item.name }}</text>
            <view v-if="selectedType === 'recipe'" class="flex items-center gap-1 text-[#5a847b] font-bold text-xs mt-2">
              <text class="material-symbols-outlined filled text-sm">local_fire_department</text>
              <text>{{ item.calories }} kcal</text>
            </view>
            <view v-else class="flex items-center justify-between mt-2">
              <view class="flex items-center gap-1 text-[#5a847b] font-bold text-xs">
                <text class="material-symbols-outlined filled text-sm">verified</text>
                <text>已收藏</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>

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
  box-shadow: 0 8px 30px -4px rgba(52, 199, 89, 0.08);
}
</style>
