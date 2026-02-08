<script setup lang="ts">
/**
 * 食材详情页面
 *
 * 显示食材的营养信息、AI 评分、健康益处、食用建议等详细信息
 */
import { ref, computed, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 食物数据映射
const foodDatabase: Record<string, {
  image: string
  scientificName: string
  calories: number
  protein: number
  fat: number
  carbs: number
  score: number
  tags: Array<{ icon: string; label: string; color: string }>
  description: string
  benefitTags: Array<{ icon: string; label: string; color: string }>
  tips: Array<{ icon: string; title: string; desc: string; color: string }>
}> = {
  '奇亚籽': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_5.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Salvia hispanica',
    calories: 486,
    protein: 16.5,
    fat: 30.7,
    carbs: 42.1,
    score: 96,
    tags: [
      { icon: 'eco', label: '超级食物', color: 'green' },
      { icon: 'grass', label: 'Omega-3', color: 'blue' }
    ],
    description: '奇亚籽富含膳食纤维、蛋白质和Omega-3脂肪酸，是植物界营养密度最高的食物之一。吸水膨胀后能提供持久饱腹感，有助于控制体重。',
    benefitTags: [
      { icon: 'favorite', label: '护心', color: 'red' },
      { icon: 'water_drop', label: '高纤维', color: 'blue' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '食用建议',
        desc: '需浸泡 10 分钟激活胶质，可加入酸奶、燕麦或制作布丁。',
        color: 'green'
      },
      {
        icon: 'local_grocery_store',
        title: '选购技巧',
        desc: '选择无异味、颗粒饱满的奇亚籽，密封保存于阴凉干燥处。',
        color: 'orange'
      }
    ]
  },
  '羽衣甘蓝': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_28.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Brassica oleracea var. sabellica',
    calories: 35,
    protein: 2.9,
    fat: 0.9,
    carbs: 6.0,
    score: 94,
    tags: [
      { icon: 'eco', label: '超级食物', color: 'green' },
      { icon: 'local_florist', label: '维生素K', color: 'purple' }
    ],
    description: '羽衣甘蓝是营养密度最高的绿叶蔬菜之一，富含维生素K、A、C和钙质，具有强大的抗氧化和抗炎特性。',
    benefitTags: [
      { icon: 'visibility', label: '护眼', color: 'purple' },
      { icon: 'shield', label: '抗氧化', color: 'blue' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '烹饪建议',
        desc: '建议轻微橄榄油炒制，避免过温导致营养流失。也可生食制作沙拉。',
        color: 'green'
      },
      {
        icon: 'shopping_basket',
        title: '挑选技巧',
        desc: '选择叶片深绿、茎部脆嫩的，避免叶片发黄或枯萎。',
        color: 'orange'
      }
    ]
  },
  '三文鱼沙拉': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_2.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Salmo salar with greens',
    calories: 180,
    protein: 22,
    fat: 8,
    carbs: 5,
    score: 94,
    tags: [
      { icon: 'set_meal', label: '轻食', color: 'green' },
      { icon: 'water_drop', label: 'Omega-3', color: 'blue' }
    ],
    description: '三文鱼沙拉结合优质蛋白质和新鲜蔬菜，富含Omega-3脂肪酸、维生素和矿物质，是完美的营养均衡轻食选择。',
    benefitTags: [
      { icon: 'favorite', label: '护心', color: 'red' },
      { icon: 'psychology', label: '健脑', color: 'purple' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '搭配建议',
        desc: '搭配油醋汁食用，补充优质Omega-3脂肪酸，避免热量过高的酱料。',
        color: 'green'
      },
      {
        icon: 'schedule',
        title: '最佳时机',
        desc: '适合午餐或晚餐，作为主食可提供持久饱腹感。',
        color: 'orange'
      }
    ]
  },
  '轻食波奇碗': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_27.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Poke Bowl',
    calories: 350,
    protein: 18,
    fat: 12,
    carbs: 45,
    score: 91,
    tags: [
      { icon: 'balance', label: '均衡膳食', color: 'green' },
      { icon: 'spa', label: '植物蛋白', color: 'green' }
    ],
    description: '轻食波奇碗是夏威夷传统料理，包含毛豆、玉米、鳄梨等丰富配料，植物蛋白丰富，营养均衡且色彩诱人。',
    benefitTags: [
      { icon: 'energy_savings_leaf', label: '低GI', color: 'blue' },
      { icon: 'diversity_3', label: '营养全面', color: 'purple' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '食用建议',
        desc: '包含毛豆、玉米和鳄梨，植物蛋白丰富。作为一餐主食即可。',
        color: 'green'
      },
      {
        icon: 'warning',
        title: '注意事项',
        desc: '注意控制酱料用量，避免热量超标。',
        color: 'orange'
      }
    ]
  },
  '混合蔬菜': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_7.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Mixed Vegetables',
    calories: 45,
    protein: 2.5,
    fat: 0.5,
    carbs: 8,
    score: 87,
    tags: [
      { icon: 'grass', label: '高纤维', color: 'green' },
      { icon: 'local_florist', label: '维生素', color: 'purple' }
    ],
    description: '混合蔬菜提供多种维生素、矿物质和植物化学素。色彩越丰富，植物化学素摄入越全面。',
    benefitTags: [
      { icon: 'shield', label: '抗氧化', color: 'purple' },
      { icon: 'healing', label: '增强免疫', color: 'blue' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '烹饪建议',
        desc: '建议快速翻炒或蒸煮，保留营养和色彩。',
        color: 'green'
      },
      {
        icon: 'palette', label: '色彩搭配', desc: '多种颜色搭配，营养更全面。', color: 'orange', icon: 'lightbulb' }
    ]
  },
  '菠菜': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_12.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Spinacia oleracea',
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    carbs: 3.6,
    score: 85,
    tags: [
      { icon: 'bloodtype', label: '补铁', color: 'red' },
      { icon: 'local_florist', label: '叶酸', color: 'green' }
    ],
    description: '菠菜富含铁、叶酸、维生素K和抗氧化物质。含有草酸，烹饪前建议焯水去除涩味并提高钙吸收率。',
    benefitTags: [
      { icon: 'visibility', label: '护眼', color: 'purple' },
      { icon: 'favorite', label: '补血', color: 'red' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '烹饪建议',
        desc: '含有草酸，烹饪前建议焯水去除涩味。',
        color: 'green'
      },
      {
        icon: 'science',
        title: '营养搭配',
        desc: '搭配维生素C食物（如柠檬）更好吸收铁质。',
        color: 'orange'
      }
    ]
  },
  '西兰花': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_13.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Brassica oleracea var. italica',
    calories: 34,
    protein: 2.8,
    fat: 0.4,
    carbs: 7.0,
    score: 90,
    tags: [
      { icon: 'local_florist', label: '维生素C', color: 'orange' },
      { icon: 'star', label: '蔬菜之冠', color: 'green' }
    ],
    description: '西兰花被誉为"蔬菜皇冠"，富含维生素C、K、叶酸和膳食纤维。具有强大的抗癌和抗氧化特性。',
    benefitTags: [
      { icon: 'shield', label: '抗癌', color: 'green' },
      { icon: 'auto_awesome', label: '抗氧化', color: 'purple' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '烹饪建议',
        desc: '建议短时间蒸煮3-5分钟，保留最多营养，避免过度烹饪。',
        color: 'green'
      },
      {
        icon: 'shopping_basket',
        title: '挑选技巧',
        desc: '选择花球紧实、颜色深绿、无黄色花朵的。',
        color: 'orange'
      }
    ]
  },
  '鸡胸肉': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_29.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Chicken Breast',
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    score: 88,
    tags: [
      { icon: 'fitness_center', label: '高蛋白', color: 'red' },
      { icon: 'trending_down', label: '低脂', color: 'green' }
    ],
    description: '鸡胸肉是优质蛋白质的重要来源，脂肪含量低，每100g含约31g蛋白质，是减脂期增肌的首选食材。',
    benefitTags: [
      { icon: 'fitness_center', label: '增肌', color: 'red' },
      { icon: 'trending_down', label: '减脂', color: 'green' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '烹饪建议',
        desc: '每100g含23g蛋白质，减脂期增肌首选。避免过度烹饪导致肉质变老。',
        color: 'green'
      },
      {
        icon: 'water_drop',
        title: '腌制技巧',
        desc: '用柠檬汁或姜汁腌制可去腥并保持嫩滑。',
        color: 'orange'
      }
    ]
  },
  '土鸡蛋': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_15.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Gallus gallus domesticus',
    calories: 155,
    protein: 13,
    fat: 11,
    carbs: 1.1,
    score: 92,
    tags: [
      { icon: 'star', label: '完全蛋白', color: 'yellow' },
      { icon: 'eco', label: '全营养', color: 'green' }
    ],
    description: '鸡蛋是自然界最完美的蛋白质来源之一，含有人体所需的全部必需氨基酸。蛋黄富含卵磷脂、维生素A、D、E和B族维生素。',
    benefitTags: [
      { icon: 'psychology', label: '健脑', color: 'purple' },
      { icon: 'visibility', label: '护眼', color: 'orange' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '烹饪建议',
        desc: '建议水煮控制在8分钟内，保留最多营养。半熟蛋营养吸收率更高。',
        color: 'green'
      },
      {
        icon: 'info',
        title: '食用量',
        desc: '健康成人每天1-2个鸡蛋即可，无需过度担心胆固醇。',
        color: 'orange'
      }
    ]
  },
  '燕麦粥': {
    image: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_16.jpg?imageMogr2/format/webp/quality/85',
    scientificName: 'Avena sativa',
    calories: 389,
    protein: 16.9,
    fat: 6.9,
    carbs: 66,
    score: 86,
    tags: [
      { icon: 'grain', label: '全谷物', color: 'yellow' },
      { icon: 'schedule', label: '慢碳水', color: 'green' }
    ],
    description: '燕麦富含β-葡聚糖膳食纤维，有助于降低胆固醇、稳定血糖。提供持久饱腹感，是理想的早餐选择。',
    benefitTags: [
      { icon: 'favorite', label: '护心', color: 'red' },
      { icon: 'trending_down', label: '低升糖', color: 'green' }
    ],
    tips: [
      {
        icon: 'restaurant_menu',
        title: '选购建议',
        desc: '选传统燕麦片，避免速溶含糖版本。',
        color: 'green'
      },
      {
        icon: 'local_dining',
        title: '搭配建议',
        desc: '可加入坚果、水果或蛋白粉增加营养。',
        color: 'orange'
      }
    ]
  },
}

// 获取页面参数
const foodName = ref('牛油果')
const foodData = computed(() => foodDatabase[foodName.value])

// 默认数据（当找不到匹配时）
const defaultImage = 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_1.jpg?imageMogr2/format/webp/quality/85'
const displayImage = computed(() => foodData.value?.image || defaultImage)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}
  const name = decodeURIComponent(options.name || '牛油果')
  foodName.value = name
  // TODO: 如果本地数据库没有，可以从 API 获取详细数据
  // await foodService.getFoodDetail(foodName.value)
})

const scientificName = computed(() => foodData.value?.scientificName || 'Persea americana')
const calories = computed(() => foodData.value?.calories || 160)
const protein = computed(() => foodData.value?.protein || 2.0)
const fat = computed(() => foodData.value?.fat || 14.7)
const carbs = computed(() => foodData.value?.carbs || 8.5)
const aiScore = computed(() => foodData.value?.score || 98)
const foodTags = computed(() => foodData.value?.tags || [
  { icon: 'eco', label: '超级食物', color: 'green' },
  { icon: '', label: '优质脂肪', color: 'orange' }
])
const aiDescription = computed(() => foodData.value?.description || '暂无描述')
const benefitTags = computed(() => foodData.value?.benefitTags || [])
const tips = computed(() => foodData.value?.tips || [])

// 推荐搭配（固定数据）
const pairings = ref([
  {
    name: '水煮蛋',
    sub: '优质蛋白互补',
    img: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_15.jpg?imageMogr2/format/webp/quality/85'
  },
  {
    name: '三文鱼沙拉',
    sub: '双重Omega-3',
    img: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_2.jpg?imageMogr2/format/webp/quality/85'
  },
  {
    name: '混合蔬菜',
    sub: '清爽低卡',
    img: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_7.jpg?imageMogr2/format/webp/quality/85'
  }
])

// 返回
const navigateBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
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
      <view class="absolute inset-0 bg-cover bg-center" :style="`background-image: url('${displayImage}')`">
        <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></view>
      </view>

      <!-- Top Bar -->
      <view class="absolute top-0 left-0 w-full p-6 pt-14 flex justify-between items-center text-white z-20">
        <view @tap="navigateBack" class="bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full active:bg-white/30 transition active:scale-95 border border-white/10">
          <text class="material-symbols-outlined">arrow_back</text>
        </view>
        <view class="flex gap-3">
          <view @tap="onToggleFavorite" class="bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full active:bg-white/30 transition active:scale-95 border border-white/10">
            <text class="material-symbols-outlined text-xl" :class="toggleFavorite ? 'fill-current' : ''">favorite</text>
          </view>
          <view @tap="onShare" class="bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full active:bg-white/30 transition active:scale-95 border border-white/10">
            <text class="material-symbols-outlined text-xl">ios_share</text>
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
              <text v-if="tag.icon" class="material-symbols-outlined text-sm mr-1">{{ tag.icon }}</text>
              <text class="text-xs font-bold uppercase tracking-wide">{{ tag.label }}</text>
            </view>
          </view>
        </view>
        <!-- AI Score Card -->
        <view class="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-3 border border-gray-100 w-[84px] h-[100px] shrink-0 relative overflow-hidden">
          <view class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#34C759] to-green-300"></view>
          <text class="material-symbols-outlined text-[#34C759] mb-1 text-2xl">verified</text>
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
            <text class="material-symbols-outlined text-sm">chevron_right</text>
          </view>
        </view>
        <view class="grid grid-cols-4 gap-2 text-center relative">
          <view class="absolute top-2 bottom-2 left-1/4 w-px bg-gray-100"></view>
          <view class="absolute top-2 bottom-2 left-2/4 w-px bg-gray-100"></view>
          <view class="absolute top-2 bottom-2 left-3/4 w-px bg-gray-100"></view>
          <!-- Calories -->
          <view class="flex flex-col items-center">
            <text class="text-[10px] text-[#8E8E93] mb-1">热量</text>
            <text class="text-lg font-bold text-[#1C1C1E]">{{ calories }}</text>
            <text class="text-[10px] text-gray-400">kcal</text>
          </view>
          <!-- Protein -->
          <view class="flex flex-col items-center">
            <text class="text-[10px] text-[#8E8E93] mb-1">蛋白质</text>
            <text class="text-lg font-bold text-[#1C1C1E]">{{ protein }}</text>
            <text class="text-[10px] text-gray-400">g</text>
          </view>
          <!-- Fat -->
          <view class="flex flex-col items-center">
            <text class="text-[10px] text-[#8E8E93] mb-1">脂肪</text>
            <text class="text-lg font-bold text-[#34C759]">{{ fat }}</text>
            <text class="text-[10px] text-gray-400">g</text>
          </view>
          <!-- Carbs -->
          <view class="flex flex-col items-center">
            <text class="text-[10px] text-[#8E8E93] mb-1">碳水</text>
            <text class="text-lg font-bold text-[#1C1C1E]">{{ carbs }}</text>
            <text class="text-[10px] text-gray-400">g</text>
          </view>
        </view>
      </view>

      <!-- AI Nutrition Encyclopedia -->
      <view class="mb-8">
        <view class="flex items-center gap-2 mb-4">
          <view class="w-8 h-8 rounded-full bg-gradient-to-br from-[#34C759] to-green-600 flex items-center justify-center">
            <text class="material-symbols-outlined text-white text-base">auto_awesome</text>
          </view>
          <text class="text-lg font-bold text-[#1C1C1E]">AI 营养百科</text>
        </view>
        <view class="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-5 relative overflow-hidden">
          <view class="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></view>
          <text class="text-xs leading-relaxed text-gray-600 font-medium mb-4 relative z-10 block">{{ aiDescription }}</text>
          <view class="flex flex-wrap gap-2 relative z-10">
            <view v-for="(tag, index) in benefitTags" :key="index" class="inline-flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-full font-bold border">
              <text v-if="tag.icon" class="material-symbols-outlined text-xs">{{ tag.icon }}</text>
              <text>{{ tag.label }}</text>
            </view>
          </view>
        </view>

        <!-- AI Tips -->
        <text class="text-sm font-bold text-[#1C1C1E] mb-3 ml-1 flex items-center gap-2 block">
          <text class="material-symbols-outlined text-[#34C759] text-lg">lightbulb</text>
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
            <text class="material-symbols-outlined text-sm">arrow_forward</text>
          </view>
        </view>
        <scroll-view scroll-x="true" show-scrollbar="false" class="w-full">
          <view class="flex gap-4 pb-4">
            <view v-for="(item, index) in pairings" :key="index" @tap="addPairing(item)" class="shrink-0 w-36">
              <view class="w-36 h-36 rounded-2xl overflow-hidden mb-2 relative shadow-sm border border-gray-100">
                <image :src="item.img" class="w-full h-full" mode="aspectFill" />
                <view class="absolute inset-0 bg-black/10"></view>
                <view class="absolute bottom-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-[#34C759]">
                  <text class="material-symbols-outlined text-sm">add</text>
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
