<script setup lang="ts">
/**
 * 饮食日记页面
 *
 * 显示每日营养摄入记录和 AI 分析建议
 */
import { ref } from 'vue'

const selectedDayIndex = ref(2)

const selectDay = (index: number) => {
  selectedDayIndex.value = index
}

interface MacroItem {
  label: string
  val: string
  color: string
  pct: string
}

interface FoodItem {
  title: string
  desc: string
  c: number
  img: string
}

interface MealSection {
  name: string
  color: string
  cal: string
  items: FoodItem[]
}

const macros: MacroItem[] = [
  { label: '碳水', val: '180g', color: 'bg-blue-400', pct: '75%' },
  { label: '蛋白质', val: '140g', color: 'bg-primary', pct: '90%' },
  { label: '脂肪', val: '55g', color: 'bg-amber-400', pct: '45%' },
]

const meals: MealSection[] = [
  {
    name: '早餐',
    color: 'bg-amber-400',
    cal: '450',
    items: [
      {
        title: '燕麦蓝莓碗',
        desc: '1 碗 (300g)',
        c: 320,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO6lCCNyCr-9sK8fXvaAIhKK7WmSfu9Uf149XcP8lpdAE7f_BzbdZmLZBZG4Zwlja0d_5ogEm6ZDptV3N0fTTbP9ybrY5BuPmBVx8yf_GtKAuf1S68VdZWi-SYUpiNg1zMJhmvcxA6_aPnKiCi5_-8pFr-2Lhsb5JeQwmItG2BBIFIpCBNcfzXjNxTt7wDMpOsdteVu6u3ZDI16VBTRsAdzrKHpFm2bys5YOMMJer-oWLdoYNLTPywsbINHy7tbI2JLXfkO7rPgZQB',
      },
      {
        title: '拿铁咖啡',
        desc: '大杯 (450ml)',
        c: 130,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt5M38stR6FqJQR6FVvwa3POgLoZ4AtoRLEfY-Aqu3SBFkl4CSbDvCecxJdBlZmN4k_HBRDCzv9puKG1OnWKtZYW4DUqyBeaPhc8vAD9g-pRhEJUTg8cd90wWdnpPSuSbmmRe3nC5Y1ong57pDiVAwwsWLT6qWEzafpbJOXJwdjgQRTEP9E25eUi2KeH02N-DBK8XMyMyF55GUARUXqb6zpK4nshLboc0VsYQTJeqMBx4m573IG5At8a2FKCTnmWhqCCUO1DSmuvre',
      },
    ],
  },
  {
    name: '午餐',
    color: 'bg-primary',
    cal: '680',
    items: [
      {
        title: '香煎鸡胸肉沙拉',
        desc: '1 份 (标准)',
        c: 450,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvDsm7kGmVlIiHWr_NkIXQ9YFLmlFPEwziSugN4FJ46DRT_-Ku_bA-XN3XGyR3mjKbOhhQF20s1VVpKA5Rnf_TO7ZX0kyLeCX-f02wneUKIdc1RYy_-B2pCbk0FdCpovcZKVXqtITwWMtOyyZyw-puf3I4-604wALd51lSx_MH9FDevnhWHHa7sZghPwFbvu9hnTrKXoT9OlFRp0DIpvQ9DAbgjQs3P_L_UZn0ExovrCkqAxCEyEMZuhkyNLFkRDh_6pJSUAlCB8s7',
      },
      {
        title: '全麦面包',
        desc: '2 片',
        c: 230,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB67183Q-wWAFHmB_ChEEFBvQcBk4BzDWAza0b1C_Yazm1Yq55M0aF9sVna1rs7oqPdavwF5jjOpbvz5WcKEydYhwmf3K7Ox_MotuTDmCVWlt9w1fxmxenqrPB7ZVRXLaDWUf-QjPNmRHFpN0j1fNXETgAxErBe-x3dFr724WgI6BQvgrP1M9NPzHzfgR4lcuXGXv4FgVEQadTnjGMLGwn5JE8izX2quKoZwXwJNIl_HlFPDIbS0w2XN14imv4oIhHl3v_4CpZuBIlS',
      },
    ],
  },
  {
    name: '晚餐',
    color: 'bg-indigo-500',
    cal: '720',
    items: [
      {
        title: '香煎三文鱼佐芦笋',
        desc: '1 份 (大)',
        c: 720,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7oURG6cfuepb1O4bTWBl3Bn685JRLNy3S7zPu71OgxXvi2z00YwITtYUib0t6qd0EM5mfT1lXeQjGqzxHPocPbgjb67zzifnkXBPRpG5_mjif7uybvlSG_1GgabHZTt-i8bc7XEt_-T94VHB1yqaIT5Fi8JgVDMygybJFxHkYi-SKpd9Sv_9mVJfTzIwJqQOfUmLQkSyEO7_YUVR28fE-p0jhY-UiZ7P25rNh1lZlp4f6KlrovQk1vdRFGy5t5Zr3qYd2OW0hWLyr',
      },
    ],
  },
]

const navigateBack = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-gray-50">
    <!-- Header -->
    <view class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shrink-0">
      <view class="flex items-center justify-between p-4">
        <view @tap="navigateBack" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-200">
          <text class="material-symbols-outlined text-gray-900">arrow_back</text>
        </view>
        <text class="text-lg font-bold text-gray-900">每日饮食日记</text>
        <view class="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-200">
          <text class="material-symbols-outlined text-gray-900">calendar_month</text>
        </view>
      </view>
      <!-- Week Strip -->
      <scroll-view scroll-x class="w-full pb-4" :show-scrollbar="false">
        <view class="flex px-4 gap-2">
          <view v-for="(day, idx) in ['周日', '周一', '周二', '周三', '周四', '周五', '周六']" :key="idx" class="flex flex-col items-center gap-1 shrink-0">
            <text :class="['text-[10px] font-medium', selectedDayIndex === idx ? 'text-primary' : 'text-gray-500']">{{ day }}</text>
            <view @tap="selectDay(idx)" :class="[
              'w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center transition-all',
              selectedDayIndex === idx
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                : 'text-gray-700 active:bg-gray-100'
            ]">
              <text>{{ 22 + idx }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="px-4 pt-6 space-y-8">
      <!-- Summary Card -->
      <view class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <view class="flex justify-between items-end mb-4">
          <view>
            <text class="text-xs font-medium text-gray-500 block mb-1">今日摄入 (Intake)</text>
            <view class="flex items-baseline gap-1">
              <text class="text-3xl font-extrabold text-gray-900 leading-none">1,850</text>
              <text class="text-xs font-medium text-gray-400">/ 2,000 kcal</text>
            </view>
          </view>
          <view class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <text class="material-symbols-outlined text-2xl">local_fire_department</text>
          </view>
        </view>
        <!-- Bars -->
        <view class="grid grid-cols-3 gap-4">
          <view v-for="(m, i) in macros" :key="i" class="flex flex-col gap-1.5">
            <view class="flex justify-between text-[10px] font-medium">
              <text class="text-gray-600">{{ m.label }}</text>
              <text class="text-gray-400">{{ m.val }}</text>
            </view>
            <view class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <view :class="[m.color, 'h-full rounded-full']" :style="{ width: m.pct }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- Meals List -->
      <view class="space-y-6">
        <view v-for="(meal, idx) in meals" :key="idx" class="space-y-3">
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <view :class="['w-2 h-2 rounded-full', meal.color]"></view>
              <text class="text-base font-bold text-gray-900">{{ meal.name }}</text>
            </view>
            <text class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{{ meal.cal }} kcal</text>
          </view>
          
          <view class="flex flex-col gap-3">
            <view v-for="(item, i) in meal.items" :key="i" class="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-transparent active:border-gray-200 transition-all">
              <view class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <image :src="item.img" mode="aspectFill" class="w-full h-full" />
              </view>
              <view class="flex-1 min-w-0">
                <view class="flex justify-between items-start mb-0.5">
                  <text class="font-bold text-gray-900 text-sm truncate">{{ item.title }}</text>
                  <text class="font-bold text-sm text-gray-900 ml-2">{{ item.c }}</text>
                </view>
                <text class="text-xs text-gray-500 block truncate">{{ item.desc }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- AI Analysis Card -->
      <view class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 shadow-sm mb-8">
        <view class="absolute -top-6 -right-6 text-blue-100/50">
          <text class="material-symbols-outlined" style="font-size: 100px">auto_awesome</text>
        </view>
        <view class="relative z-10 flex flex-col gap-2">
          <view class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <text class="material-symbols-outlined text-lg">smart_toy</text>
            <text>AI 智能分析</text>
          </view>
          <text class="text-gray-600 text-xs leading-relaxed">
            您的蛋白质摄入非常理想，达到了目标的 110%。但晚餐后的脂肪摄入略高。建议明天早餐增加全麦面包来平衡碳水比例。
          </text>
          <view class="text-xs font-bold text-primary flex items-center gap-1 mt-2 active:opacity-70">
            <text>查看详细报告</text>
            <text class="material-symbols-outlined text-xs">arrow_forward</text>
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
