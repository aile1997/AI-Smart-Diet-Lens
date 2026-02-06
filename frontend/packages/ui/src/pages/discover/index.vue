<script setup lang="ts">
/**
 * 发现页面
 *
 * 只有两个主标签：百科 和 社区
 */
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 当前标签：百科 or 社区
const activeTab = ref<'wiki' | 'community'>('wiki')

// ========== 百科数据 ==========
const wikiSearchQuery = ref('')
const wikiFilter = ref('全部')

const wikiFilters = ['全部', '⚡️ 超级食物', '💪 优质蛋白', '📉 低GI', '🥕 维生素']

const wikiSeasonalItems = ref([
  {
    name: '牛油果 (Avocado)',
    score: 98,
    tags: ['优质脂肪'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDejXUH1BDXEER9F3FELKud7iUO2KZ17RgJNrY4lDkBhH6Tc-u3bNIYyRX91RiuaPOa4I7wLJvn6ZUSSmnhptpgGJWgUy1pMWSHcxRkbWu65p9oHvIJk_e7cqKWSNSDfevoIE_bSJifkE_AMUrRxghzYnjTlZv07HY2OSH-10MW9ENvQf0j3PD7NWS0Uv_gzq-Ieqr8QVH5oTOAe5OysgaFENlD31regyrBhJ67q22tef3bWB41TtKa_NW5dYKxf5jURrpnZrWZzf7E'
  },
  {
    name: '深海三文鱼',
    score: 95,
    tags: ['Omega-3'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtDm4ZjOk45gKnLqrSyl18-u_ix9MGrFYxCQiVwzgo2AUJMw6ss2Z52uY5fDyJa2xBipdL0gY1_AvQmYyBCK9fgHtWeviyM3CmmbXBlzxTKBWRWuuL8GrNTDKs2s78Oh0O_4DYsR8VjWWRLExZzmS-xUqQXVW5bubUsCVBZ5I6dkrWxgZfE2f9qsXKeIAxlMq4cb5sLmQ2hdTHSczrJJi-2uRgj_g79pA9yjqjVLN2owINHy5RLiLvGxolQEy56yEsvu9VtzrPdBg3'
  }
])

const wikiFoodItems = ref([
  {
    name: '土鸡蛋',
    sub: '全蛋白来源',
    score: 94,
    tags: ['AI 小贴士'],
    desc: '建议水煮控制在 8 分钟内。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZEvgua3_rMOGa0OylbPtsG-yB1s_8OHCZxsEST06iY-IP8bR4N7LRQ-HiFpXY2oND-UdOXiPHb7cARuyJGHit4a7LnLWg-_iAk9aL4V3bPpqw9hwKF7174DgpYk0ZuZNgPe4HtnyJiIBFhGRvcQl10VxeorChMg8qgakFhfVAM7oeGJa-uItNLPmmQYXNmIJttaxsPdvwg4KihNu5cpbxQiTH4zqIScn9uTX9luc1o2hCIo0jQ5Etx-xAEATzm7dC5nrxuAH3hphA'
  },
  {
    name: '野生蓝莓',
    sub: '花青素之王',
    score: 88,
    tags: ['抗氧化', '低糖'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9vgDOQ4BdB-gds4ceL23WIpsqJRuBUuK9l6hzg0OGzU-B9IWcWmIuG2pOY2P1u1hGd64edy_CUXqTBYr7opWVHIbAZcB08PlgWFbqHF86MAPj7sH_WdnTp7QnOFx3vXRWhkxHv-zklLOs4DwI3ddwLWupcsgOZiEn_WRghc68hBBHyFJUG5h77v1W_qbw5RfZt6ytFY8VArMsijfDFmiUJtV7cIYO6ZB3n3gZAR1xBWmchy33KrPHTADD05B1WrIeetriFy7iT'
  },
  {
    name: '奇亚籽',
    sub: '超级食物',
    score: 96,
    tags: ['AI 小贴士'],
    desc: '需浸泡 10 分钟激活胶质。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0yzc3cWm8uQmrgASYcHb5nHNijPeRaODHRVXS4wKNUHHYheFkMZrYqp2B9fYm4PYYFnwjh1OtO7Tw6U2whTV2IYrSt-oiS9nQcyLA3KpRIdNiu_yF2acQXlxU2gbwahh9RNSdW2S2lXIXt6N83QW8xGolfbWg89-f2KWbRzjXJ-VhuvxilFUGTrGIqZ9IF8h1_Vfe_BM05yXui0Ce61rsDJ8s_CMrdJuhmJTLq1siOmcBk7hCVEmEOxTQ8D2IlzGIoiDE4377mGFAy63'
  },
  {
    name: '羽衣甘蓝',
    sub: '维生素K之王',
    score: 92,
    tags: ['高纤维', '排毒'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXUV-xiVHMPWSTmkIKfwT35kSoWU1qwQN3MGj3P-FgTk5GK6IeoU9hBcoLs369Tn_98uBhs_AKkrjs6ZKdJ84Vk9Kt1CV3TffaD7Xr4nxQbURfmO546cPKE1kPEGIu-iMc03tzLbomopQ-nWLZMcobgVhYBGEpK26wC0Gezm2yc3fmVml8drTJnF8Ze-vId86BM605eq7cw4LOf41tOETcECswDlk679f54m6dlBE05IaUOtX6JvLzb7amsK2IlZ2tfUzah4WX2NfU'
  }
])

const navigateToFoodDetail = (foodName?: string) => {
  const name = foodName || '土鸡蛋'
  uni.navigateTo({
    url: `/pages/food-detail/index?name=${encodeURIComponent(name)}`
  })
}

const selectWikiFilter = (filter: string) => {
  wikiFilter.value = filter
}

// ========== 社区数据 ==========
const posts = ref([
  {
    id: 1,
    author: {
      name: 'Alice Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      location: 'Shanghai',
      time: '2h ago'
    },
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600',
    title: 'Avocado Toast',
    content: 'Sunday brunch done right! Keeping it low carb today. The poached egg was perfect. 🥑🥚',
    calories: 320,
    nutritionScore: 9.5,
    tags: ['Keto', 'HealthyLiving', 'Brunch'],
    likes: 1200,
    comments: 45,
    isLiked: true,
    isSaved: false
  },
  {
    id: 2,
    author: {
      name: 'David Li',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      location: 'Beijing',
      time: '5h ago'
    },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    title: 'Salmon Poke Bowl',
    content: 'Fresh catch for lunch. The protein hit I needed after the gym. Absolutely delicious! 🐟🥢',
    calories: 510,
    nutritionScore: 9.8,
    tags: ['HighProtein', 'PokeBowl'],
    likes: 892,
    comments: 24,
    isLiked: false,
    isSaved: false
  },
  {
    id: 3,
    author: {
      name: 'Sarah Wang',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      location: 'Chengdu',
      time: '8h ago'
    },
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb5c489?w=600',
    title: 'Green Energy',
    content: 'Starting the day with vitamins. 🥝 #MorningRoutine',
    calories: 180,
    nutritionScore: 8.9,
    tags: ['MorningRoutine'],
    likes: 420,
    comments: 12,
    isLiked: false,
    isSaved: false
  }
])

// 点赞
const toggleLike = (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
  }
}

// 收藏
const toggleSave = (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.isSaved = !post.isSaved
  }
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F6F8F7]">
    <!-- Header -->
    <view class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <view class="flex items-center justify-between px-4 pt-12 pb-2">
        <view class="w-10"></view>
        <text class="text-lg font-extrabold tracking-tight text-slate-900">发现</text>
        <view class="flex w-10 items-center justify-end">
          <text class="material-symbols-outlined text-[28px] text-slate-900">search</text>
        </view>
      </view>
      <!-- Tabs: 百科 / 社区 -->
      <view class="flex px-6 justify-between gap-8">
        <view
          @tap="activeTab = 'wiki'"
          class="flex-1 flex flex-col items-center justify-center pb-3 pt-1 relative"
        >
          <text class="text-base font-bold" :class="activeTab === 'wiki' ? 'text-[#38e07b]' : 'text-slate-400'">🔍 百科</text>
          <view
            v-if="activeTab === 'wiki'"
            class="absolute bottom-0 h-[3px] w-8 rounded-full bg-[#38e07b]"
          ></view>
        </view>
        <view
          @tap="activeTab = 'community'"
          class="flex-1 flex flex-col items-center justify-center pb-3 pt-1 relative"
        >
          <text class="text-base font-bold" :class="activeTab === 'community' ? 'text-[#38e07b]' : 'text-slate-400'">👥 社区</text>
          <view
            v-if="activeTab === 'community'"
            class="absolute bottom-0 h-[3px] w-8 rounded-full bg-[#38e07b]"
          ></view>
        </view>
      </view>
    </view>

    <!-- ========== 百科内容 ========== -->
    <view v-if="activeTab === 'wiki'" class="pt-2">
      <!-- Search & Filters -->
      <view class="px-4 mb-4">
        <view class="relative mb-4">
          <text class="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">search</text>
          <input
            v-model="wikiSearchQuery"
            type="text"
            placeholder="搜索食材、功效 (如：抗氧化)..."
            class="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-12 text-sm"
          />
          <text class="absolute right-4 top-3.5 text-gray-400 material-symbols-outlined">mic</text>
        </view>
        <!-- Filters -->
        <scroll-view scroll-x class="w-full" :show-scrollbar="false">
          <view class="flex gap-3">
            <view
              v-for="filter in wikiFilters"
              :key="filter"
              @tap="selectWikiFilter(filter)"
              :class="[
                'px-5 py-2 rounded-full font-bold text-sm shrink-0 whitespace-nowrap transition-all',
                wikiFilter === filter
                  ? 'bg-[#38e07b] text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-600'
              ]"
            >
              <text>{{ filter }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Seasonal Section -->
      <view class="px-4 mb-6">
        <view class="flex justify-between items-center mb-4">
          <text class="text-xl font-bold text-gray-900">当季 AI 推荐</text>
          <view class="flex items-center gap-1 text-[#38e07b] text-xs font-bold bg-[#38e07b]/10 px-2 py-1 rounded-md">
            <text class="material-symbols-outlined text-sm">calendar_month</text>
            <text>SEASONAL</text>
          </view>
        </view>
        <scroll-view scroll-x class="w-full" :show-scrollbar="false">
          <view class="flex gap-4 pb-4">
            <view
              v-for="(item, idx) in wikiSeasonalItems"
              :key="idx"
              @tap="navigateToFoodDetail(item.name)"
              class="shrink-0 w-[280px] h-48 relative rounded-2xl overflow-hidden shadow-sm"
            >
              <image :src="item.image" class="absolute inset-0 w-full h-full" mode="aspectFill" />
              <view class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></view>
              <view class="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1 z-10">
                <text class="material-symbols-outlined text-[#38e07b] text-sm">auto_awesome</text>
                <text class="text-xs font-bold">{{ item.score }}分</text>
              </view>
              <view class="absolute bottom-4 left-4 right-4 z-10">
                <text class="text-lg font-bold text-white mb-1 block">{{ item.name }}</text>
                <view class="flex gap-2">
                  <text v-for="tag in item.tags" :key="tag" class="bg-[#38e07b] text-white px-2 py-0.5 rounded text-[10px] font-bold">{{ tag }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Grid List -->
      <view class="px-4 pb-6">
        <view class="grid grid-cols-2 gap-4">
          <view
            v-for="(item, idx) in wikiFoodItems"
            :key="idx"
            @tap="navigateToFoodDetail(item.name)"
            class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex flex-col"
          >
            <view class="relative aspect-[4/3] mb-3 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <image :src="item.image" class="w-full h-full" mode="aspectFill" />
              <view class="absolute bottom-2 right-2 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
                <text>{{ item.score }}</text>
              </view>
            </view>
            <text class="font-bold text-gray-900 text-sm block truncate">{{ item.name }}</text>
            <text class="text-[10px] text-gray-500 mb-2 block truncate">{{ item.sub }}</text>
            <view v-if="item.desc" class="bg-gray-50 p-2 rounded-lg border border-gray-100 mt-auto">
              <view class="flex items-center gap-1 text-[#38e07b] text-[9px] font-bold mb-0.5">
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

    <!-- ========== 社区内容 ========== -->
    <view v-if="activeTab === 'community'" class="pt-4">
      <!-- Posts -->
      <view class="space-y-4">
        <view
          v-for="post in posts"
          :key="post.id"
          class="bg-white mx-2 shadow-sm rounded-2xl overflow-hidden"
        >
          <!-- Author Info -->
          <view class="flex items-center justify-between px-4 py-3">
            <view class="flex items-center gap-3">
              <view
                class="h-9 w-9 rounded-full bg-gray-200"
                :style="`background-image: url('${post.author.avatar}'); background-size: cover;`"
              ></view>
              <view class="flex flex-col">
                <text class="text-sm font-bold text-slate-900">{{ post.author.name }}</text>
                <text class="text-[11px] font-medium text-slate-400">{{ post.author.time }} • {{ post.author.location }}</text>
              </view>
            </view>
            <text class="material-symbols-outlined text-[20px] text-slate-400">more_horiz</text>
          </view>

          <!-- Post Image -->
          <view class="relative w-full aspect-square bg-gray-100 overflow-hidden">
            <image
              class="w-full h-full"
              :src="post.image"
              mode="aspectFill"
            ></image>
            <!-- Tags Overlay -->
            <view class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <view class="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
                <text class="text-xs">⚡️</text>
                <text class="text-xs font-bold text-[#84a98c]">{{ post.calories }} 卡路里</text>
              </view>
              <view class="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
                <text class="text-xs">🥗</text>
                <text class="text-xs font-bold text-[#84a98c]">{{ post.nutritionScore }} 营养评分</text>
              </view>
            </view>
          </view>

          <!-- Actions -->
          <view class="flex items-center justify-between px-4 py-3">
            <view class="flex gap-5">
              <view @tap="toggleLike(post.id)" class="flex items-center gap-1.5">
                <text class="material-symbols-outlined text-[26px]" :class="post.isLiked ? 'text-red-500 filled' : 'text-slate-900'">
                  {{ post.isLiked ? 'favorite' : 'favorite_border' }}
                </text>
                <text class="text-sm font-semibold text-slate-900">{{ formatNumber(post.likes) }}</text>
              </view>
              <view class="flex items-center gap-1.5">
                <text class="material-symbols-outlined text-[26px] text-slate-900">chat_bubble</text>
                <text class="text-sm font-semibold text-slate-900">{{ post.comments }}</text>
              </view>
              <text class="material-symbols-outlined text-[26px] text-slate-900">send</text>
            </view>
            <view @tap="toggleSave(post.id)">
              <text class="material-symbols-outlined text-[26px]" :class="post.isSaved ? 'text-[#84a98c] filled' : 'text-slate-900'">
                {{ post.isSaved ? 'bookmark' : 'bookmark_border' }}
              </text>
            </view>
          </view>

          <!-- Content -->
          <view class="px-4 pb-4">
            <text class="text-sm text-slate-900 leading-relaxed">
              <text class="font-bold">{{ post.title }}</text>
              {{ post.content }}
            </text>
            <view class="mt-2 flex gap-2">
              <text
                v-for="tag in post.tags"
                :key="tag"
                class="text-xs font-medium text-[#84a98c]"
              >
                #{{ tag }}
              </text>
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
.no-scrollbar ::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

.shadow-sm {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.space-y-4 > view + view {
  margin-top: 1rem;
}
</style>
