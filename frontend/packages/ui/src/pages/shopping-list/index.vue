<script setup lang="ts">
/**
 * 购物清单页面
 *
 * 管理购物清单和食材
 */
import { ref } from 'vue'

interface ShoppingItem {
  id: number
  name: string
  quantity: string
  category: string
  checked: boolean
}

const items = ref<ShoppingItem[]>([
  { id: 1, name: '三文鱼排', quantity: '200g', category: '海鲜', checked: false },
  { id: 2, name: '鲜嫩芦笋', quantity: '100g', category: '蔬菜', checked: false },
  { id: 3, name: '初榨橄榄油', quantity: '1瓶', category: '油类', checked: false },
  { id: 4, name: '海盐', quantity: '1罐', category: '调味', checked: false },
  { id: 5, name: '黑胡椒', quantity: '1罐', category: '调味', checked: false },
])

const navigateToHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const toggleItem = (id: number) => {
  const item = items.value.find(i => i.id === id)
  if (item) {
    item.checked = !item.checked
  }
}

const deleteItem = (id: number) => {
  items.value = items.value.filter(i => i.id !== id)
}
</script>

<template>
  <view class="flex flex-col h-full min-h-screen pb-24 max-w-md mx-auto w-full">
    <!-- Header -->
    <view class="flex items-center justify-between px-6 pt-12 pb-4 bg-white/90 sticky top-0 z-30 backdrop-blur-md">
      <view class="flex flex-col">
        <text class="text-2xl font-bold text-gray-900 leading-tight">购物清单</text>
      </view>
      <view @tap="navigateToHome" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
        <text class="material-symbols-outlined text-gray-900">add</text>
      </view>
    </view>

    <view class="flex-1 px-6 space-y-6 py-6">
      <view v-if="items.length === 0" class="text-center py-12">
        <text class="material-symbols-outlined text-6xl text-gray-300">shopping_cart</text>
        <text class="text-lg font-bold text-gray-900 mt-4">购物清单为空</text>
        <text class="text-gray-500 text-sm mt-2">添加食材来创建购物清单</text>
      </view>

      <view v-else class="space-y-3">
        <view v-for="item in items" :key="item.id" class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
          <checkbox
            :checked="item.checked"
            @tap="toggleItem(item.id)"
            color="#38e07b"
            class="scale-75"
          />
          <view class="flex-1 min-w-0">
            <view class="flex justify-between items-start">
              <text :class="['font-bold text-gray-900', item.checked ? 'line-through text-gray-400' : '']">{{ item.name }}</text>
              <text class="text-xs text-gray-500">{{ item.quantity }}</text>
            </view>
            <text class="text-xs text-gray-400 mt-0.5">{{ item.category }}</text>
          </view>
          <view
            @tap="deleteItem(item.id)"
            class="text-gray-400 active:text-red-500"
          >
            <text class="material-symbols-outlined text-lg">close</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "购物清单"
  }
}
</route>

<style scoped>
/* ShoppingList page specific styles */
</style>
