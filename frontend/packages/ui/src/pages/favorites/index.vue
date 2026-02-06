<script setup lang="ts">
/**
 * 我的收藏页面
 *
 * 显示用户收藏的食谱和食材
 */
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 搜索关键词
const searchQuery = ref('')

// 当前标签
const activeTab = ref<'recipe' | 'food'>('recipe')

// 收藏的食谱数据
const favoriteRecipes = ref([
  {
    id: 1,
    name: '鲜虾牛油果沙拉',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWhqtO3XnmeZdSVy5qBOJEZNjVWAerUWobszJb-hvx4rYuUGPF7VKsc0si1tUkn6P26kw9z6JjiFpJTsvS3W43ahd7z3I7X_ax1ktEY4JDd7_IiF1C1sh9NHZbhXmr7R3Tkxg3kuON6pWcWTdfuObwRTxReelaV9f9usMHIi6W0jOdwrw2R80eN37iD4rNx47BEYVgYlQfkZEnC8ImIi9bu6vlVe7uQ1eXttHZvlsh5B48KYu4wespSP83PBfPGWKe7CvT2-qXKbmQ',
    calories: 320
  },
  {
    id: 2,
    name: '香煎三文鱼排',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpBHq4SkS--NXJZQbwcK2whB-FwN3_qN9gBlcX5Lie7q7VvTXlBdUh4rrhdGFfXT8s7rSOZoSYJR-10G46AKa_kMdhVXChF_3Cd9J0vlEXQLch8mhbtd4cVdY4GvrCJGNdCOwFdncwQ5AyO0qtKZSwN3ZyIbauD4oIPJclHXHpikX3oqF8z7DfHJTsF05vdxYa1wl8Cnuyrn-wA-EBPv7SavcAPJ2Urgm8fo9Ws2PuU4YKObSbU5KNJ5WTTD24ziYxkSWKFl8vSF9j',
    calories: 450
  },
  {
    id: 3,
    name: '莓果燕麦碗',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsO3zyyQkfMWzZ8Jp3Tx2VVQobqUD7pZcnhWr9_1k_Gh1WgJKFUVPcmBxalsuEj4Zu3chmgf8H9t9jHd9ITjD3WllAtBcm7Mb4XmgDvZV1JsQNMw4S5Pz_E5qsxsq5nV4JNNQQsXquDcVZY6gbCYBH6_1m3LwzR4ffEqAMTOaWaH4v54wOy8QfLd2F2Q3wf3ombRy1W2eVooLCXIc3Vii7OjrtcXsKIzMUBHC2evW0eT5nBgjdhtDHCMLfv2v4lbb9RMuWvzL4mP-U',
    calories: 280
  },
  {
    id: 4,
    name: '迷迭香鸡胸肉',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE37J7kFpHoZ0UFCxWy3nWXmzpItEG5YM2hNZed2WSim-jtzTWLuqcmpVUxG2hLVEZe3ZJx48tF3_HrPY3919_edcUIa5GFAQXaDB0QFYnuZNAk1pAFe1E8RA6VcrTlRhQD6L1vkP7KqurxpVLy0VPW5oo6ub-ZOMFxr1L9me4Q58Ffn_Xw-iCnKhw9hWWq1jHXZLI_ipH7XGdAxCAon_yuEKlLCR474WAYxg4eaXu4OnyF4LTlK12uEhaUD-h1EYp3OJJavdziiQ2',
    calories: 180
  },
  {
    id: 5,
    name: '藜麦时蔬碗',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM70iSyaZFFp1-nlmeDCsDv8SrVBhRAGHz02FCoquhZx4JOjpXv9fEquZ9WrHqiGr3d-PjgSNOAXWxly6rPbPzbLRnowycVBCvgsYv9jPgkVKvr6l6Ule4e0xYkIYAIKxB2iXNY9SjSljrPEtO5eCfJeyyO8mP74UbWCuAscMLDG8xLb45znUSInLtesxz7MeHTKloCs44FAXfcfh3bGCaS5WBAR_Lmn5wb6ZmxdJ5S-FNbcA5f0QobPD3-GijoaoJpB285oG8bDtt',
    calories: 340
  },
  {
    id: 6,
    name: '缤纷水果拼盘',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2HgxzFfoIVNm302MXjLHlsrwM10qTVqx5fESIHyo_nw1HEbeb4HlGeMDfZEQs3lzHp8kzaEz0eZXHi0szmJJFMP1HxYtkhRr7OHrJeLFqOG-WQKqoXRlZxoOMneaQd8BvhFCjqcuSIAoYTUBObVdYgvW4n8gh-0vboIL6WbXt9LA3HjREuZMDvZr-EN-kSzbyn5C1kPef7MQ5FGlVGmsREOTp0SiF41iHbIU261oE6VkAlvlglJ9EqGblJrSe3bmOGq0EejM5FuUP',
    calories: 150
  }
])

// 收藏的食材数据
const favoriteFoods = ref([
  {
    id: 1,
    name: '牛油果',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDejXUH1BDXEER9F3FELKud7iUO2KZ17RgJNrY4lDkBhH6Tc-u3bNIYyRX91RiuaPOa4I7wLJvn6ZUSSmnhptpgGJWgUy1pMWSHcxRkbWu65p9oHvIJk_e7cqKWSNSDfevoIE_bSJifkE_AMUrRxghzYnjTlZv07HY2OSH-10MW9ENvQf0j3PD7NWS0Uv_gzq-Ieqr8QVH5oTOAe5OysgaFENlD31regyrBhJ67q22tef3bWB41TtKa_NW5dYKxf5jURrpnZrWZzf7E',
    score: 98
  },
  {
    id: 2,
    name: '三文鱼',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtDm4ZjOk45gKnLqrSyl18-u_ix9MGrFYxCQiVwzgo2AUJMw6ss2Z52uY5fDyJa2xBipdL0gY1_AvQmYyBCK9fgHtWeviyM3CmmbXBlzxTKBWRWuuL8GrNTDKs2s78Oh0O_4DYsR8VjWWRLExZzmS-xUqQXVW5bubUsCVBZ5I6dkrWxgZfE2f9qsXKeIAxlMq4cb5sLmQ2hdTHSczrJJi-2uRgj_g79pA9yjqjVLN2owINHy5RLiLvGxolQEy56yEsvu9VtzrPdBg3',
    score: 95
  }
])

// 返回
const navigateBack = () => {
  uni.navigateBack()
}

// 切换标签
const switchTab = (tab: 'recipe' | 'food') => {
  activeTab.value = tab
}

// 取消收藏
const removeFavorite = (id: number) => {
  if (activeTab.value === 'recipe') {
    favoriteRecipes.value = favoriteRecipes.value.filter(r => r.id !== id)
  } else {
    favoriteFoods.value = favoriteFoods.value.filter(f => f.id !== id)
  }
  uni.showToast({
    title: '已取消收藏',
    icon: 'none'
  })
}

// 点击项目
const handleItemClick = (item: any) => {
  if (activeTab.value === 'recipe') {
    uni.navigateTo({
      url: '/pages/recipe-detail/index'
    })
  } else {
    uni.navigateTo({
      url: `/pages/food-detail/index?name=${encodeURIComponent(item.name)}`
    })
  }
}
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7F8]">
    <!-- Header -->
    <view class="sticky top-0 z-30 px-4 pt-12 pb-4 bg-[#F5F7F8]/95 backdrop-blur-md flex justify-between items-center">
      <view @tap="navigateBack" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5a847b] active:scale-95 transition-transform">
        <text class="material-symbols-outlined">arrow_back</text>
      </view>
      <text class="text-[20px] font-bold text-slate-900 tracking-tight">我的收藏</text>
      <view class="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-[#5a847b]">
        <text class="material-symbols-outlined">more_horiz</text>
      </view>
    </view>

    <!-- Search -->
    <view class="px-4 mt-2">
      <view class="relative">
        <view class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <text class="material-symbols-outlined text-gray-400 text-[20px]">search</text>
        </view>
        <input
          v-model="searchQuery"
          class="block w-full pl-11 pr-4 py-3.5 border-none rounded-2xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5a847b]/50 shadow-sm"
          :placeholder="activeTab === 'recipe' ? '搜索收藏的食谱' : '搜索收藏的食材'"
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
          :class="activeTab === 'recipe' ? 'bg-white shadow-sm text-[#5a847b]' : 'text-gray-500'"
        >
          食谱
        </view>
        <view
          @tap="switchTab('food')"
          class="flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all"
          :class="activeTab === 'food' ? 'bg-white shadow-sm text-[#5a847b]' : 'text-gray-500'"
        >
          食材
        </view>
      </view>
    </view>

    <!-- Recipe Grid -->
    <view v-if="activeTab === 'recipe'" class="px-4 mt-6">
      <view class="grid grid-cols-2 gap-4">
        <view
          v-for="item in favoriteRecipes"
          :key="item.id"
          @tap="handleItemClick(item)"
          class="bg-white p-3 rounded-2xl shadow-soft active:scale-[0.98] transition-transform"
        >
          <view class="relative aspect-[1/1] rounded-xl overflow-hidden bg-gray-100 mb-3">
            <image :src="item.image" class="w-full h-full" mode="aspectFill" />
            <view
              @tap.stop="removeFavorite(item.id)"
              class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 shadow-sm active:scale-90 transition-transform"
            >
              <text class="material-symbols-outlined filled text-[18px]">favorite</text>
            </view>
          </view>
          <text class="font-bold text-slate-800 text-[15px] leading-tight mb-1 block truncate">{{ item.name }}</text>
          <view class="flex items-center gap-1 text-[#5a847b] font-bold text-xs mt-2">
            <text class="material-symbols-outlined filled text-[14px]">local_fire_department</text>
            <text>{{ item.calories }} kcal</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Food Grid -->
    <view v-if="activeTab === 'food'" class="px-4 mt-6">
      <view class="grid grid-cols-2 gap-4">
        <view
          v-for="item in favoriteFoods"
          :key="item.id"
          @tap="handleItemClick(item)"
          class="bg-white p-3 rounded-2xl shadow-soft active:scale-[0.98] transition-transform"
        >
          <view class="relative aspect-[1/1] rounded-xl overflow-hidden bg-gray-100 mb-3">
            <image :src="item.image" class="w-full h-full" mode="aspectFill" />
            <view
              @tap.stop="removeFavorite(item.id)"
              class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 shadow-sm active:scale-90 transition-transform"
            >
              <text class="material-symbols-outlined filled text-[18px]">favorite</text>
            </view>
          </view>
          <text class="font-bold text-slate-800 text-[15px] leading-tight mb-1 block truncate">{{ item.name }}</text>
          <view class="flex items-center justify-between mt-2">
            <view class="flex items-center gap-1 text-[#5a847b] font-bold text-xs">
              <text class="material-symbols-outlined filled text-[14px]">verified</text>
              <text>{{ item.score }}分</text>
            </view>
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
  box-shadow: 0 8px 30px -4px rgba(52, 199, 89, 0.08);
}
</style>
