<script setup lang="ts">
/**
 * 食材百科页面
 *
 * 浏览食材、查看营养信息和 AI 健康评分
 */
import { ref } from 'vue'

const searchQuery = ref('')
const selectedFilter = ref('全部')

interface FoodItem {
  name: string
  sub: string
  score: number
  tags?: string[]
  desc?: string
  img: string
}

const filters = ['全部', '⚡️ 超级食物', '💪 优质蛋白', '📉 低GI', '🥕 维生素']

const seasonalItems = [
  {
    name: '牛油果 (Avocado)',
    score: 98,
    tags: ['优质脂肪'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDejXUH1BDXEER9F3FELKud7iUO2KZ17RgJNrY4lDkBhH6Tc-u3bNIYyRX91RiuaPOa4I7wLJvn6ZUSSmnhptpgGJWgUy1pMWSHcxRkbWu65p9oHvIJk_e7cqKWSNSDfevoIE_bSJifkE_AMUrRxghzYnjTlZv07HY2OSH-10MW9ENvQf0j3PD7NWS0Uv_gzq-Ieqr8QVH5oTOAe5OysgaFENlD31regyrBhJ67q22tef3bWB41TtKa_NW5dYKxf5jURrpnZrWZzf7E'
  },
  {
    name: '深海三文鱼',
    score: 95,
    tags: ['Omega-3'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtDm4ZjOk45gKnLqrSyl18-u_ix9MGrFYxCQiVwzgo2AUJMw6ss2Z52uY5fDyJa2xBipdL0gY1_AvQmYyBCK9fgHtWeviyM3CmmbXBlzxTKBWRWuuL8GrNTDKs2s78Oh0O_4DYsR8VjWWRLExZzmS-xUqQXVW5bubUsCVBZ5I6dkrWxgZfE2f9qsXKeIAxlMq4cb5sLmQ2hdTHSczrJJi-2uRgj_g79pA9yjqjVLN2owINHy5RLiLvGxolQEy56yEsvu9VtzrPdBg3'
  }
]

const foodItems: FoodItem[] = [
  {
    name: '土鸡蛋',
    sub: '全蛋白来源',
    score: 94,
    tags: ['AI 小贴士'],
    desc: '建议水煮控制在 8 分钟内。',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZEvgua3_rMOGa0OylbPtsG-yB1s_8OHCZxsEST06iY-IP8bR4N7LRQ-HiFpXY2oND-UdOXiPHb7cARuyJGHit4a7LnLWg-_iAk9aL4V3bPpqw9hwKF7174DgpYk0ZuZNgPe4HtnyJiIBFhGRvcQl10VxeorChMg8qgakFhfVAM7oeGJa-uItNLPmmQYXNmIJttaxsPdvwg4KihNu5cpbxQiTH4zqIScn9uTX9luc1o2hCIo0jQ5Etx-xAEATzm7dC5nrxuAH3hphA'
  },
  {
    name: '野生蓝莓',
    sub: '花青素之王',
    score: 88,
    tags: ['抗氧化', '低糖'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9vgDOQ4BdB-gds4ceL23WIpsqJRuBUuK9l6hzg0OGzU-B9IWcWmIuG2pOY2P1u1hGd64edy_CUXqTBYr7op9WVHIbAZcB08PlgWFbqHFy86MAPj7sH_WdnTp7QnOFx3vXRWhkxHv-zklLOs4DwI3ddwLWupcsgOZiEn_WRghc68hBBHyFJUG5h77v1W_qbw5RfZt6ytFY8VArMsijfDFmiUJtV7cIYO6ZB3n3gZAR1xBWmchy33KrPHTADD05B1WrIeetriFy7iT'
  },
  {
    name: '奇亚籽',
    sub: '超级食物',
    score: 96,
    tags: ['AI 小贴士'],
    desc: '需浸泡 10 分钟激活胶质。',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0yzc3cWm8uQmrgASYcHb5nHNijPeRaODHRVXS4wKNUHHr9eFkMZrYqp2B9fYm4PYYFnwjh1OtO7Tw6U2whTV2IYrSt-oiS9nQcyLA3KpRIdNiu_yF2acQXlxU2gbwahh9RNSdW2S2lXIXt6N83QW8xGolfbWg89-f5rBjITCYa7sAFYvH7Hxo53UUhhow0Lj0EzYHB2wSs7asscrnB8ZFYx98N89Pq4f4tVZ-huL6ex3tmk-M8sg4ufaS36D9dRaed72UHXwvQfMS'
  },
  {
    name: '羽衣甘蓝',
    sub: '维生素K之王',
    score: 92,
    tags: ['高纤维', '排毒'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXUV-xiVHMPWSTmkIKfwT35kSoWU1qwQN3MGj4P-FgTk5GK6IeoU9hBcoLs369Tn_98uBhs_AKkrjs6ZKdJ84Vk9Kt1CV3TffaD7Xr4nxQbURfmO546cPKE1kPEGIu-iMc03tzLbomopQ-nWLZMcobgVhYBGEpK26wC0Gezm2yc3fmVml8drTJnF8Ze-vId86BM605eq7cw4LOf41tOETtECswDlk679f54m6dlBE05IaUOtX6JvLzb7amsK2IlZ2tfUzah4WX2NfU'
  }
]

const navigateToFoodDetail = (foodName?: string) => {
  const name = foodName || '土鸡蛋'
  uni.navigateTo({
    url: `/pages/food-detail/index?name=${encodeURIComponent(name)}`
  })
}

const navigateToProfile = () => {
  uni.navigateTo({ url: '/pages/profile/index' })
}

const selectFilter = (filter: string) => {
  selectedFilter.value = filter
}
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar">
    <!-- Header -->
    <view class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0">
      <view class="flex items-center justify-between px-6 pt-12 pb-4">
        <view>
          <text class="text-xs font-bold text-primary tracking-widest uppercase block">Smart-Diet Lens</text>
          <text class="text-2xl font-bold text-gray-900">AI 食材百科</text>
        </view>
        <view @tap="navigateToProfile" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-95 transition-transform">
          <text class="material-symbols-outlined text-gray-600">person</text>
        </view>
      </view>
      <!-- Search -->
      <view class="px-6 pb-4">
        <view class="relative">
          <text class="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">search</text>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索食材、功效 (如：抗氧化)..."
            class="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-12 text-sm"
          />
          <text class="absolute right-4 top-3.5 text-gray-400 material-symbols-outlined">mic</text>
        </view>
      </view>
      <!-- Filters -->
      <scroll-view scroll-x class="w-full pb-4" :show-scrollbar="false">
        <view class="flex gap-3 px-6">
          <view
            v-for="filter in filters"
            :key="filter"
            @tap="selectFilter(filter)"
            :class="[
              'px-5 py-2 rounded-full font-bold text-sm shrink-0 whitespace-nowrap transition-all',
              selectedFilter === filter
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-600'
            ]"
          >
            <text>{{ filter }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="px-6 pt-6 space-y-8">
      <!-- Seasonal Section -->
      <view>
        <view class="flex justify-between items-center mb-4">
          <text class="text-xl font-bold text-gray-900">当季 AI 推荐</text>
          <view class="flex items-center gap-1 text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-md">
            <text class="material-symbols-outlined text-sm">calendar_month</text>
            <text>SEASONAL</text>
          </view>
        </view>
        <scroll-view scroll-x class="w-full" :show-scrollbar="false">
          <view class="flex gap-4 pb-4">
            <view
              v-for="(item, idx) in seasonalItems"
              :key="idx"
              @tap="navigateToFoodDetail(item.name)"
              class="shrink-0 w-[280px] h-48 relative rounded-2xl overflow-hidden shadow-sm"
            >
              <image :src="item.img" class="absolute inset-0 w-full h-full" mode="aspectFill" />
              <view class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></view>
              <view class="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1 z-10">
                <text class="material-symbols-outlined text-primary text-sm">auto_awesome</text>
                <text class="text-xs font-bold">{{ item.score }}分</text>
              </view>
              <view class="absolute bottom-4 left-4 right-4 z-10">
                <text class="text-lg font-bold text-white mb-1 block">{{ item.name }}</text>
                <view class="flex gap-2">
                  <text v-for="tag in item.tags" :key="tag" class="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-bold">{{ tag }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Grid List -->
      <view>
        <view class="flex justify-between items-center mb-4">
          <text class="text-xl font-bold text-gray-900">食材列表</text>
          <view class="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 active:bg-gray-50">
            <text>排序</text>
            <text class="material-symbols-outlined text-sm">sort</text>
          </view>
        </view>
        <view class="grid grid-cols-2 gap-4 pb-6">
          <view
            v-for="(item, idx) in foodItems"
            :key="idx"
            @tap="navigateToFoodDetail(item.name)"
            class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex flex-col"
          >
            <view class="relative aspect-[4/3] mb-3 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <image :src="item.img" class="w-full h-full" mode="aspectFill" />
              <view class="absolute bottom-2 right-2 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
                <text>{{ item.score }}</text>
              </view>
            </view>
            <text class="font-bold text-gray-900 text-sm block truncate">{{ item.name }}</text>
            <text class="text-[10px] text-gray-500 mb-2 block truncate">{{ item.sub }}</text>
            
            <view v-if="item.desc" class="bg-gray-50 p-2 rounded-lg border border-gray-100 mt-auto">
              <view class="flex items-center gap-1 text-primary text-[9px] font-bold mb-0.5">
                <text class="material-symbols-outlined text-xs">lightbulb</text>
                <text>AI 小贴士</text>
              </view>
              <text class="text-[9px] text-gray-600 leading-tight">{{ item.desc }}</text>
            </view>
            <view v-else class="flex gap-1 mt-auto overflow-hidden">
              <text v-for="tag in item.tags" :key="tag" class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] whitespace-nowrap">{{ tag }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <BottomNav />
  </view>
</template>

<style scoped>
.no-scrollbar ::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
