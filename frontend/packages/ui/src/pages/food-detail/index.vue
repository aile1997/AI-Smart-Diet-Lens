<script setup lang="ts">
/**
 * 食材详情页面
 *
 * 显示食材的营养信息、AI 评分、健康益处、食用建议等详细信息
 */
import { ref, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 获取页面参数
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}
  const name = decodeURIComponent(options.name || '牛油果')
  foodName.value = name
  // TODO: 根据食物名称从 API 获取详细数据
  // await foodService.getFoodDetail(foodName.value)
})

const foodName = ref('牛油果')
const scientificName = ref('Persea americana')
const calories = ref(160)
const protein = ref(2.0)
const fat = ref(14.7)
const carbs = ref(8.5)
const aiScore = ref(98)

// 食材标签
const foodTags = ref([
  { icon: 'eco', label: '超级食物', color: 'green' },
  { icon: '', label: '优质脂肪', color: 'orange' }
])

// AI 营养百科描述
const aiDescription = ref('牛油果被誉为"森林奶油"，富含单不饱和脂肪酸（主要是油酸），有助于降低坏胆固醇水平。它也是钾的极佳来源，含量甚至超过香蕉，有助于维持血压稳定和心血管健康。')

// 健康益处标签
const benefitTags = ref([
  { icon: 'favorite', label: '护心', color: 'red' },
  { icon: 'visibility', label: '护眼', color: 'purple' },
  { icon: 'trending_down', label: '低升糖', color: 'blue' }
])

// AI 小贴士
const tips = ref([
  {
    icon: 'shopping_basket',
    title: '如何挑选',
    desc: '选择表皮深紫黑色、轻按微软的果实即为成熟。若表皮翠绿，需室温放置 2-3 天催熟。',
    color: 'orange'
  },
  {
    icon: 'restaurant_menu',
    title: '最佳吃法',
    desc: '生吃保留最多营养。建议搭配全麦面包或做成沙拉，避免高温烹饪破坏不饱和脂肪酸。',
    color: 'green'
  }
])

// 推荐搭配
const pairings = ref([
  {
    name: '水煮蛋',
    sub: '优质蛋白互补',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZEvgua3_rMOGa0OylbPtsG-yB1s_8OHCZxsEST06iY-IP8bR4N7LRQ-HiFpXY2oND-UdOXiPHb7cARuyJGHit4a7LnLWg-_iAk9aL4V3bPpqw9hwKF7174DgpYk0ZuZNgPe4HtnyJiIBFhGRvcQl10VxeorChMg8qgakFhfVAM7oeGJa-uItNLPmmQYXNmIJttaxsPdvwg4KihNu5cpbxQiTH4zqIScn9uTX9luc1o2hCIo0jQ5Etx-xAEATzm7dC5nrxuAH3hphA'
  },
  {
    name: '三文鱼',
    sub: '双重Omega-3',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtDm4ZjOk45gKnLqrSyl18-u_ix9MGrFYxCQiVwzgo2AUJMw6ss2Z52uY5fDyJa2xBipdL0gY1_AvQmYyBCK9fgHtWeviyM3CmmbXBlzxTKBWRWuuL8GrNTDKs2s78Oh0O_4DYsR8VjWWRLExZzmS-xUqQXVW5bubUsCVBZ5I6dkrWxgZfE2f9qsXKeIAxlMq4cb5sLmQ2hdTHSczrJJi-2uRgj_g79pA9yjqjVLN2owINHy5RLiLvGxolQEy56yEsvu9VtzrPdBg3'
  },
  {
    name: '轻食沙拉',
    sub: '清爽低卡',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXUV-xiVHMPWSTmkIKfwT35kSoWU1qwQN3MGj4P-FgTk5GK6IeoU9hBcoLs369Tn_98uBhs_AKkrjs6ZKdJ84Vk9Kt1CV3TffaD7Xr4nxQbURfmO546cPKE1kPEGIu-iMc03tzLbomopQ-nWLZMcobgVhYBGEpK26wC0Gezm2yc3fmVml8drTJnF8Ze-vId86BM605eq7cw4LOf41tOETtECswDlk679f54m6dlBE05IaUOtX6JvLzb7amsK2IlZ2tfUzah4WX2NfU'
  }
])

// 返回
const navigateBack = () => {
  uni.navigateBack()
}

// 收藏
const toggleFavorite = ref(false)
const onToggleFavorite = () => {
  toggleFavorite.value = !toggleFavorite.value
}

// 分享
const onShare = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

// 查看营养详情
const viewNutritionDetail = () => {
  uni.showToast({
    title: '查看详细营养成分',
    icon: 'none'
  })
}

// 添加到日记
const addToDiary = () => {
  uni.showToast({
    title: '已添加到饮食日记',
    icon: 'success'
  })
}

// 查看推荐搭配
const viewAllPairings = () => {
  uni.showToast({
    title: '查看全部推荐搭配',
    icon: 'none'
  })
}

// 添加搭配食物
const addPairing = (item: typeof pairings.value[0]) => {
  uni.showToast({
    title: `已添加 ${item.name}`,
    icon: 'success'
  })
}
</script>

<template>
  <view class="relative min-h-screen w-full flex flex-col bg-[#F5F7F8]">
    <!-- Hero Image Section -->
    <view class="relative h-[380px] w-full shrink-0">
      <view class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDejXUH1BDXEER9F3FELKud7iUO2KZ17RgJNrY4lDkBhH6Tc-u3bNIYyRX91RiuaPOa4I7wLJvn6ZUSSmnhptpgGJWgUy1pMWSHcxRkbWu65p9oHvIJk_e7cqKWSNSDfevoIE_bSJifkE_AMUrRxghzYnjTlZv07HY2OSH-10MW9ENvQf0j3PD7NWS0Uv_gzq-Ieqr8QVH5oTOAe5OysgaFENlD31regyrBhJ67q22tef3bWB41TtKa_NW5dYKxf5jURrpnZrWZzf7E')">
        <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></view>
      </view>

      <!-- Top Bar -->
      <view class="absolute top-0 left-0 w-full p-6 pt-14 flex justify-between items-center text-white z-20">
        <view @tap="navigateBack" class="bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full active:bg-white/30 transition active:scale-95 border border-white/10">
          <text class="material-symbols-outlined">arrow_back</text>
        </view>
        <view class="flex gap-3">
          <view @tap="onToggleFavorite" class="bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full active:bg-white/30 transition active:scale-95 border border-white/10">
            <text class="material-symbols-outlined text-[20px]" :class="toggleFavorite ? 'fill-current' : ''">favorite</text>
          </view>
          <view @tap="onShare" class="bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full active:bg-white/30 transition active:scale-95 border border-white/10">
            <text class="material-symbols-outlined text-[20px]">ios_share</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Content Section -->
    <view class="relative -mt-12 bg-[#F5F7F8] rounded-t-3xl px-6 pt-8 pb-28 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <!-- Title & Score -->
      <view class="flex justify-between items-start mb-8">
        <view class="flex-1 pr-4">
          <text class="text-3xl font-bold text-[#1C1C1E] mb-1 tracking-tight">{{ foodName }}</text>
          <text class="text-[#8E8E93] text-sm italic mb-3 block">{{ scientificName }}</text>
          <view class="flex flex-wrap gap-2">
            <view v-for="(tag, index) in foodTags" :key="index" class="inline-flex items-center px-2.5 py-1 rounded-lg border">
              <text v-if="tag.icon" class="material-symbols-outlined text-[14px] mr-1">{{ tag.icon }}</text>
              <text class="text-xs font-bold uppercase tracking-wide">{{ tag.label }}</text>
            </view>
          </view>
        </view>
        <!-- AI Score Card -->
        <view class="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-3 border border-gray-100 w-[84px] h-[100px] shrink-0 relative overflow-hidden">
          <view class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#34C759] to-green-300"></view>
          <text class="material-symbols-outlined text-[#34C759] mb-1 text-[24px]">verified</text>
          <text class="text-3xl font-bold text-[#1C1C1E] leading-none mb-1">{{ aiScore }}</text>
          <text class="text-[10px] text-[#8E8E93] font-medium uppercase tracking-wide">营养分</text>
        </view>
      </view>

      <!-- Nutrition Overview -->
      <view class="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-8">
        <view class="flex justify-between items-center mb-5">
          <text class="text-sm font-bold text-[#1C1C1E] flex items-center gap-2">
            <view class="w-1.5 h-4 bg-[#34C759] rounded-full"></view>
            营养概览 <text class="text-xs font-normal text-[#8E8E93] ml-1">(每100g)</text>
          </text>
          <view @tap="viewNutritionDetail" class="text-xs text-[#34C759] font-medium flex items-center">
            <text>详情</text>
            <text class="material-symbols-outlined text-[14px]">chevron_right</text>
          </view>
        </view>
        <view class="grid grid-cols-4 gap-2 text-center relative">
          <view class="absolute top-2 bottom-2 left-1/4 w-px bg-gray-100"></view>
          <view class="absolute top-2 bottom-2 left-2/4 w-px bg-gray-100"></view>
          <view class="absolute top-2 bottom-2 left-3/4 w-px bg-gray-100"></view>
          <!-- Calories -->
          <view class="flex flex-col items-center">
            <text class="text-[11px] text-[#8E8E93] mb-1">热量</text>
            <text class="text-lg font-bold text-[#1C1C1E]">{{ calories }}</text>
            <text class="text-[10px] text-gray-400">kcal</text>
          </view>
          <!-- Protein -->
          <view class="flex flex-col items-center">
            <text class="text-[11px] text-[#8E8E93] mb-1">蛋白质</text>
            <text class="text-lg font-bold text-[#1C1C1E]">{{ protein }}</text>
            <text class="text-[10px] text-gray-400">g</text>
          </view>
          <!-- Fat -->
          <view class="flex flex-col items-center">
            <text class="text-[11px] text-[#8E8E93] mb-1">脂肪</text>
            <text class="text-lg font-bold text-[#34C759]">{{ fat }}</text>
            <text class="text-[10px] text-gray-400">g</text>
          </view>
          <!-- Carbs -->
          <view class="flex flex-col items-center">
            <text class="text-[11px] text-[#8E8E93] mb-1">碳水</text>
            <text class="text-lg font-bold text-[#1C1C1E]">{{ carbs }}</text>
            <text class="text-[10px] text-gray-400">g</text>
          </view>
        </view>
      </view>

      <!-- AI Nutrition Encyclopedia -->
      <view class="mb-8">
        <view class="flex items-center gap-2 mb-4">
          <view class="w-8 h-8 rounded-full bg-gradient-to-br from-[#34C759] to-green-600 flex items-center justify-center">
            <text class="material-symbols-outlined text-white text-[16px]">auto_awesome</text>
          </view>
          <text class="text-lg font-bold text-[#1C1C1E]">AI 营养百科</text>
        </view>
        <view class="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-5 relative overflow-hidden">
          <view class="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></view>
          <text class="text-[13px] leading-relaxed text-gray-600 font-medium mb-4 relative z-10 block">{{ aiDescription }}</text>
          <view class="flex flex-wrap gap-2 relative z-10">
            <view v-for="(tag, index) in benefitTags" :key="index" class="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full font-bold border">
              <text v-if="tag.icon" class="material-symbols-outlined text-[14px]">{{ tag.icon }}</text>
              <text>{{ tag.label }}</text>
            </view>
          </view>
        </view>

        <!-- AI Tips -->
        <text class="text-sm font-bold text-[#1C1C1E] mb-3 ml-1 flex items-center gap-2 block">
          <text class="material-symbols-outlined text-[#34C759] text-[18px]">lightbulb</text>
          AI 小贴士
        </text>
        <view class="space-y-3">
          <view v-for="(tip, index) in tips" :key="index" class="bg-[#F9FAFB] p-4 rounded-xl border border-gray-200/60 flex gap-4">
            <view :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              tip.color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-[#34C759]/10 text-[#34C759]'
            ]">
              <text class="material-symbols-outlined">{{ tip.icon }}</text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-bold text-gray-800 mb-1 block">{{ tip.title }}</text>
              <text class="text-xs text-[#8E8E93] leading-relaxed block">{{ tip.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Recommended Pairings -->
      <view class="mb-2">
        <view class="flex justify-between items-center mb-4">
          <text class="text-lg font-bold text-[#1C1C1E]">推荐搭配</text>
          <view @tap="viewAllPairings" class="text-xs text-[#34C759] font-bold flex items-center gap-0.5">
            <text>查看全部</text>
            <text class="material-symbols-outlined text-[14px]">arrow_forward</text>
          </view>
        </view>
        <scroll-view scroll-x="true" show-scrollbar="false" class="w-full">
          <view class="flex gap-4 pb-4">
            <view v-for="(item, index) in pairings" :key="index" @tap="addPairing(item)" class="shrink-0 w-36">
              <view class="w-36 h-36 rounded-2xl overflow-hidden mb-2 relative shadow-sm border border-gray-100">
                <image :src="item.img" class="w-full h-full" mode="aspectFill" />
                <view class="absolute inset-0 bg-black/10"></view>
                <view class="absolute bottom-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-[#34C759]">
                  <text class="material-symbols-outlined text-[16px]">add</text>
                </view>
              </view>
              <text class="text-sm font-bold text-[#1C1C1E] ml-1 block">{{ item.name }}</text>
              <text class="text-[10px] text-[#8E8E93] ml-1 block">{{ item.sub }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
  <BottomNav />
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
/* 食材详情页面特定样式 */
</style>
