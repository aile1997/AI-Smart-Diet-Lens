<script setup lang="ts">
/**
 * 发现页面
 *
 * 只有两个主标签：百科 和 社区
 */
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useCommunity } from "@diet-lens/core";
import BottomNav from "@/components/BottomNav.vue";

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);

const { loading: communityLoading, posts: communityPosts, isEmpty: communityEmpty, toggleLike: togglePostLike, fetchPosts } = useCommunity();

// 当前标签：百科 or 社区
const activeTab = ref<"wiki" | "community">("wiki");

// ========== 百科数据 ==========
const wikiSearchQuery = ref("");
const wikiFilter = ref("全部");

const wikiFilters = ["全部", "⚡️ 超级食物", "💪 优质蛋白", "📉 低GI", "🥕 维生素"];

// 当季 AI 推荐（使用前4张图片）
const wikiSeasonalItems = ref([
  {
    name: "奇亚籽",
    score: 96,
    tags: ["超级食物", "Omega-3"],
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_5.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "羽衣甘蓝",
    score: 94,
    tags: ["营养密度", "高纤维"],
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_28.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "三文鱼沙拉",
    score: 94,
    tags: ["轻食", "Omega-3"],
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_2.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "轻食波奇碗",
    score: 91,
    tags: ["均衡膳食", "植物蛋白"],
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_27.jpg?imageMogr2/format/webp/quality/85",
  },
]);

// 食材百科列表（12张图片的正确对应关系）
const allWikiFoodItems = [
  // --- 第一行 ---
  {
    name: "奇亚籽",
    sub: "超级食物",
    score: 96,
    category: "⚡️ 超级食物",
    tags: ["膳食纤维", "Omega-3"],
    desc: "需浸泡 10 分钟激活胶质，可加入酸奶或燕麦。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_5.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "羽衣甘蓝",
    sub: "营养密度之王",
    score: 94,
    category: "⚡️ 超级食物",
    tags: ["高纤维", "维生素K"],
    desc: "建议轻微橄榄油炒制，避免过温导致营养流失。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_28.jpg?imageMogr2/format/webp/quality/85",
  },
  // --- 第二行 ---
  {
    name: "三文鱼沙拉",
    sub: "轻食首选",
    score: 94,
    category: "💪 优质蛋白",
    tags: ["Omega-3", "优质蛋白"],
    desc: "搭配油醋汁食用，补充优质Omega-3脂肪酸。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_2.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "轻食波奇碗",
    sub: "均衡膳食",
    score: 91,
    category: "💪 优质蛋白",
    tags: ["植物蛋白", "均衡"],
    desc: "包含毛豆、玉米和鳄梨，植物蛋白丰富。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_27.jpg?imageMogr2/format/webp/quality/85",
  },

  // --- 第四行 ---
  {
    name: "混合蔬菜",
    sub: "膳食纤维",
    score: 87,
    category: "🥕 维生素",
    tags: ["高纤维", "维生素"],
    desc: "色彩越丰富，植物化学素摄入越全面。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_7.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "菠菜",
    sub: "补铁能手",
    score: 85,
    category: "🥕 维生素",
    tags: ["铁", "叶酸"],
    desc: "含有草酸，烹饪前建议焯水去除涩味。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_12.jpg?imageMogr2/format/webp/quality/85",
  },
  // --- 第五行 ---
  {
    name: "西兰花",
    sub: "蔬菜之冠",
    score: 90,
    category: "🥕 维生素",
    tags: ["维生素C", "高纤维"],
    desc: "建议短时间蒸煮3-5分钟，保留最多营养。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_13.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "鸡胸肉",
    sub: "低脂高蛋白",
    score: 88,
    category: "💪 优质蛋白",
    tags: ["低脂", "高蛋白"],
    desc: "每100g含23g蛋白质，减脂期增肌首选。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_29.jpg?imageMogr2/format/webp/quality/85",
  },
  // --- 第六行 ---
  {
    name: "土鸡蛋",
    sub: "全营养食品",
    score: 92,
    category: "⚡️ 超级食物",
    tags: ["完全蛋白", "营养全面"],
    desc: "建议水煮控制在8分钟内，保留最多营养。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_15.jpg?imageMogr2/format/webp/quality/85",
  },
  {
    name: "燕麦粥",
    sub: "慢碳水",
    score: 86,
    category: "📉 低GI",
    tags: ["膳食纤维", "饱腹感"],
    desc: "选传统燕麦片，避免速溶含糖版本。",
    image: "https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_16.jpg?imageMogr2/format/webp/quality/85",
  },
];

// 根据筛选条件过滤
const wikiFoodItems = computed(() => {
  if (wikiFilter.value === "全部") {
    return allWikiFoodItems;
  }
  return allWikiFoodItems.filter((item) => item.category === wikiFilter.value);
});

const navigateToFoodDetail = (foodName?: string) => {
  const name = foodName || "土鸡蛋";
  uni.navigateTo({
    url: `/pages/food-detail/index?name=${encodeURIComponent(name)}`,
  });
};

const selectWikiFilter = (filter: string) => {
  wikiFilter.value = filter;
};

// ========== 社区功能 ==========
// 格式化时间
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // 分钟

  if (diff < 60) return `${diff}分钟前`;
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
  return `${Math.floor(diff / 1440)}天前`;
};

// 格式化数字
const formatNumber = (num?: number) => {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

// 点赞
const handleToggleLike = async (postId: string) => {
  if (!isLoggedIn.value) {
    uni.showToast({ title: "请先登录", icon: "none" });
    return;
  }
  try {
    await togglePostLike(postId);
    // 后端返回的更新会自动同步到本地状态，无需手动处理
  } catch (err) {
    uni.showToast({ title: "操作失败", icon: "none" });
  }
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({ url: "/pages/onboarding/login" });
};

// 切换到社区标签时加载数据
const switchTab = async (tab: "wiki" | "community") => {
  activeTab.value = tab;
  if (tab === "community" && isLoggedIn.value && communityPosts.value.length === 0) {
    await fetchPosts();
  }
};

// 页面加载时如果默认是社区标签，则加载数据
onMounted(async () => {
  if (activeTab.value === "community" && isLoggedIn.value) {
    await fetchPosts();
  }
});
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F6F8F7]">
    <!-- Header -->
    <view class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <view class="flex px-6 justify-between gap-8 pt-4">
        <view @tap="switchTab('wiki')" class="flex-1 flex flex-col items-center justify-center pb-3 pt-1 relative">
          <text class="text-base font-bold transition-colors" :class="activeTab === 'wiki' ? 'text-[#38e07b]' : 'text-slate-400'"> 百科 </text>
          <view v-if="activeTab === 'wiki'" class="absolute bottom-0 h-[3px] w-12 rounded-full bg-[#38e07b]"></view>
        </view>

        <view @tap="switchTab('community')" class="flex-1 flex flex-col items-center justify-center pb-3 pt-1 relative">
          <text class="text-base font-bold transition-colors" :class="activeTab === 'community' ? 'text-[#38e07b]' : 'text-slate-400'"> 社区 </text>
          <view v-if="activeTab === 'community'" class="absolute bottom-0 h-[3px] w-12 rounded-full bg-[#38e07b]"></view>
        </view>
      </view>
    </view>

    <!-- ========== 百科内容 ========== -->
    <view v-if="activeTab === 'wiki'" class="pt-2">
      <!-- Search & Filters -->
      <view class="px-4 mb-4">
        <view class="relative mb-4 flex items-center h-11 bg-gray-50 border border-gray-200 rounded-2xl px-4">
          <text class="text-gray-400 material-symbols-outlined text-xl shrink-0">search</text>
          <input
            v-model="wikiSearchQuery"
            type="text"
            placeholder="搜索食材、功效 (如：抗氧化)..."
            class="flex-1 bg-transparent border-none text-sm ml-3 mr-3"
          />
          <text class="text-gray-400 material-symbols-outlined text-xl shrink-0">mic</text>
        </view>
        <!-- Filter Chips -->
        <scroll-view scroll-x :show-scrollbar="false" class="w-full">
          <view class="flex gap-2">
            <view
              v-for="filter in wikiFilters"
              :key="filter"
              @tap="selectWikiFilter(filter)"
              class="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
              :class="wikiFilter === filter ? 'bg-[#38e07b] text-white' : 'bg-gray-100 text-gray-600'"
            >
              {{ filter }}
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Seasonal Section -->
      <view class="px-4 mb-6">
        <view class="flex justify-between items-center mb-4">
          <text class="text-xl font-bold text-gray-900">当季 AI 推荐</text>
          <view class="flex items-center gap-1 text-[#34C759] text-xs font-bold bg-[#34C759]/10 px-2 py-1 rounded-md">
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
              class="shrink-0 w-[280px] h-48 relative rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
            >
              <image :src="item.image" class="absolute inset-0 w-full h-full transition-transform duration-700" mode="aspectFill" />
              <view class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></view>
              <view class="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm z-10">
                <text class="material-symbols-outlined text-[#34C759] text-sm">auto_awesome</text>
                <text class="text-xs font-bold text-gray-900">{{ item.score }}分</text>
              </view>
              <view class="absolute bottom-4 left-4 right-4 z-10">
                <text class="text-lg font-bold text-white mb-1.5 block drop-shadow-sm">{{ item.name }}</text>
                <view class="flex items-center gap-2">
                  <text v-for="tag in item.tags" :key="tag" class="bg-[#34C759] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">{{ tag }}</text>
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
            class="bg-white rounded-2xl p-3 shadow-card border border-gray-100 active:scale-[0.98] transition-all flex flex-col overflow-hidden"
          >
            <view class="relative aspect-[4/3] mb-3 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <image :src="item.image" class="w-full h-full transition-transform duration-500" mode="aspectFill" />
              <!-- 圆形进度条分数 -->
              <view class="absolute bottom-2 right-2">
                <view class="relative w-8 h-8 flex items-center justify-center">
                  <!-- SVG 圆形进度条 -->
                  <svg class="absolute inset-0 w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                    <circle class="text-gray-200" cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="3"></circle>
                    <circle
                      :class="item.score >= 90 ? 'text-[#34C759]' : item.score >= 80 ? 'text-purple-500' : 'text-orange-500'"
                      :cx="18"
                      :cy="18"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      :stroke-dasharray="`${item.score}, 100`"
                      stroke-width="3"
                      stroke-linecap="round"
                    ></circle>
                  </svg>
                  <!-- 分数背景和文字 -->
                  <view class="absolute w-5 h-5 flex items-center justify-center bg-white rounded-full">
                    <text class="text-[10px] font-bold text-gray-900">{{ item.score }}</text>
                  </view>
                </view>
              </view>
            </view>
            <text class="font-bold text-gray-900 text-sm block truncate mb-1">{{ item.name }}</text>
            <text class="text-xs text-gray-500 mb-2 block truncate">{{ item.sub }}</text>
            <view v-if="item.desc" class="bg-gray-50 p-2.5 rounded-xl border border-gray-100/80 mt-auto">
              <view class="flex items-center gap-1 text-[#34C759] text-[10px] font-bold mb-1 uppercase tracking-wider">
                <text class="material-symbols-outlined text-sm">lightbulb</text>
                <text>AI 小贴士</text>
              </view>
              <text class="text-xs text-gray-600 leading-relaxed">{{ item.desc }}</text>
            </view>
            <view v-else class="flex flex-wrap gap-1.5 mt-auto">
              <text
                v-for="tag in item.tags"
                :key="tag"
                :class="[
                  'text-[10px] px-2 py-0.5 rounded font-medium border',
                  tag === 'AI 小贴士'
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : tag === '抗氧化'
                      ? 'bg-purple-50 text-purple-700 border-purple-100'
                      : tag === '低糖'
                        ? 'bg-gray-100 text-gray-600 border-gray-200'
                        : 'bg-blue-50 text-blue-700 border-blue-100',
                ]"
                >{{ tag }}</text
              >
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ========== 社区内容 ========== -->
    <view v-if="activeTab === 'community'" class="pt-4">
      <!-- 未登录提示 -->
      <view v-if="!isLoggedIn" class="flex flex-col items-center justify-center px-10 py-16">
        <text class="material-symbols-outlined text-slate-300 text-5xl mb-4">lock</text>
        <text class="text-base font-medium text-slate-600 mb-2">需要登录</text>
        <text class="text-sm text-slate-400 text-center mb-6">请先登录以查看社区动态</text>
        <view class="bg-[#34C759] text-white py-3 px-8 rounded-full font-medium" @tap="goToLogin"> 去登录 </view>
      </view>

      <template v-else>
        <!-- Loading State -->
        <view v-if="communityLoading" class="flex flex-col items-center justify-center py-16">
          <view class="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#34C759] animate-spin"></view>
          <text class="text-sm text-slate-400 mt-4">加载中...</text>
        </view>

        <!-- Empty State -->
        <view v-else-if="communityEmpty" class="flex flex-col items-center justify-center py-16">
          <view class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <text class="material-symbols-outlined text-slate-300 text-4xl">forum</text>
          </view>
          <text class="text-slate-600 text-base font-medium mb-2">暂无动态</text>
          <text class="text-slate-400 text-sm">快来发布第一条动态吧</text>
        </view>

        <!-- Posts -->
        <view v-else class="space-y-4">
          <view v-for="post in communityPosts" :key="post.id" class="bg-white mx-2 shadow-sm rounded-2xl overflow-hidden">
            <!-- Author Info -->
            <view class="flex items-center justify-between px-4 py-3">
              <view class="flex items-center gap-3">
                <view
                  v-if="post.user.avatar"
                  class="h-9 w-9 rounded-full bg-gray-200"
                  :style="`background-image: url('${post.user.avatar}'); background-size: cover;`"
                ></view>
                <view v-else class="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                  <text class="material-symbols-outlined text-slate-400">person</text>
                </view>
                <view class="flex flex-col">
                  <text class="text-sm font-bold text-slate-900">{{ post.user.nickname }}</text>
                  <text class="text-[10px] font-medium text-slate-400">{{ formatTime(post.createdAt) }}</text>
                </view>
              </view>
              <text class="material-symbols-outlined text-xl text-slate-400">more_horiz</text>
            </view>

            <!-- Post Images -->
            <view v-if="post.images.length > 0" class="relative w-full aspect-square bg-gray-100 overflow-hidden">
              <image class="w-full h-full" :src="post.images[0]" mode="aspectFill"></image>
              <!-- Tags Overlay -->
              <view v-if="post.tags.length > 0" class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                <view v-for="tag in post.tags.slice(0, 2)" :key="tag" class="rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
                  <text class="text-xs font-bold text-[#84a98c]">#{{ tag }}</text>
                </view>
              </view>
            </view>

            <!-- Actions -->
            <view class="flex items-center justify-between px-4 py-3">
              <view class="flex gap-5">
                <view @tap="handleToggleLike(post.id)" class="flex items-center gap-1.5">
                  <text class="material-symbols-outlined text-2xl" :class="post.isLiked ? 'text-red-500 filled' : 'text-slate-900'">
                    {{ post.isLiked ? "favorite" : "favorite_border" }}
                  </text>
                  <text class="text-sm font-semibold text-slate-900">{{ formatNumber(post.likes) }}</text>
                </view>
                <view class="flex items-center gap-1.5">
                  <text class="material-symbols-outlined text-2xl text-slate-900">chat_bubble</text>
                </view>
              </view>
              <text class="material-symbols-outlined text-2xl text-slate-900">share</text>
            </view>

            <!-- Content -->
            <view class="px-4 pb-4">
              <text class="text-sm text-slate-900 leading-relaxed">
                {{ post.content }}
              </text>
              <view v-if="post.tags.length > 0" class="mt-2 flex gap-2 flex-wrap">
                <text v-for="tag in post.tags" :key="tag" class="text-xs font-medium text-[#84a98c]"> #{{ tag }} </text>
              </view>
            </view>
          </view>
        </view>
      </template>
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

.shadow-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filled {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

.space-y-4 > view + view {
  margin-top: 1rem;
}
</style>
