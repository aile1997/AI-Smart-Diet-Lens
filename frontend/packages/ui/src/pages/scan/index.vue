<script setup lang="ts">
/**
 * 拍照扫描页面
 *
 * 打开相机拍照或从相册选择，AI 识别后显示结果
 */
import { ref } from 'vue'

// 拍照状态
const imageUrl = ref<string>('')
const isAnalyzing = ref(false)
const showResult = ref(false)
const flashOn = ref(false)

// 模拟识别结果
const scanResult = ref({
  foodName: '香煎三文鱼轻食沙拉碗',
  calories: 450,
  protein: 35,
  carbs: 12,
  fat: 18
})

/**
 * 打开相机拍照
 */
const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0]
      startAnalysis()
    },
    fail: (err) => {
      console.error('拍照失败:', err)
      uni.showToast({
        title: '拍照失败',
        icon: 'none'
      })
    }
  })
}

/**
 * 从相册选择
 */
const chooseFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0]
      startAnalysis()
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

/**
 * 切换闪光灯
 */
const toggleFlash = () => {
  flashOn.value = !flashOn.value
  // TODO: 实际控制相机闪光灯
}

/**
 * 打开设置
 */
const openSettings = () => {
  // TODO: 打开相机设置
  uni.showToast({
    title: '相机设置',
    icon: 'none'
  })
}

/**
 * 开始 AI 分析
 */
const startAnalysis = () => {
  isAnalyzing.value = true

  // TODO: 调用后端 AI 识别接口
  // POST /api/ai/analyze
  // 暂时使用模拟数据
  setTimeout(() => {
    isAnalyzing.value = false
    showResult.value = true
  }, 2000)
}

/**
 * 确认并进入营养详情页面
 */
const confirmAndDetail = () => {
  uni.navigateTo({
    url: '/pages/food-result/index'
  })
}

/**
 * 返回上一页
 */
const navigateBack = () => {
  if (showResult.value) {
    showResult.value = false
    imageUrl.value = ''
  } else if (imageUrl.value) {
    imageUrl.value = ''
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}
</script>

<template>
  <view class="h-screen w-full bg-[#F6F8F7] dark:bg-[#122017] overflow-hidden relative">
    <!-- Camera Feed Background -->
    <view class="absolute inset-0 z-0 bg-gray-900">
      <image
        v-if="imageUrl"
        :src="imageUrl"
        class="h-full w-full object-cover opacity-90"
        mode="aspectFill"
      />
      <image
        v-else
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP9ZqyvoNOkfUKn5kUom1CwhefOCGiIdSYFYymfFT1VUmw6O-k3omUWe5luc3WeEs-uBCmKtQLsTg9IQUkb8xHVOQ56ozg4Bawg1pQQlmj5rbvHS-AfoduqbnrupeBU1FNX3owz6befdRHYWoSgOlr-sLcpQ56f2KWbRzjXJ-VhuvxilFUGTrGIqZ9IF8h1_Vfe_BM05yXui0Ce61rsDJ8s_CMrdJuhmJTLq1siOmcBk7hCVEmEOxTQ8D2IlzGIoiDE4377mGFAy63"
        class="h-full w-full object-cover opacity-90"
        mode="aspectFill"
      />
      <!-- Gradient Overlay -->
      <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></view>

      <!-- 分析中的扫描动画 -->
      <view v-if="isAnalyzing && !showResult" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <!-- Confidence Chip -->
        <view class="mb-4 animate-bounce duration-[2000ms]">
          <view class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38e07b]/90 backdrop-blur-sm shadow-lg shadow-[#38e07b]/20">
            <text class="material-symbols-outlined text-[#122017] text-[18px]">temp_preferences_custom</text>
            <text class="text-[#122017] text-sm font-bold tracking-wide">98% 匹配</text>
          </view>
        </view>

        <!-- AR Reticle -->
        <view class="relative w-72 h-72">
          <!-- Scanning Line Animation -->
          <view class="absolute w-full h-0.5 bg-[#38e07b]/80 shadow-[0_0_15px_rgba(56,224,123,0.8)] animate-scan z-10"></view>
          <!-- Corners -->
          <view class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#38e07b] rounded-tl-xl shadow-[0_0_10px_rgba(56,224,123,0.4)]"></view>
          <view class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#38e07b] rounded-tr-xl shadow-[0_0_10px_rgba(56,224,123,0.4)]"></view>
          <view class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#38e07b] rounded-bl-xl shadow-[0_0_10px_rgba(56,224,123,0.4)]"></view>
          <view class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#38e07b] rounded-br-xl shadow-[0_0_10px_rgba(56,224,123,0.4)]"></view>
          <!-- Inner guide hints -->
          <view class="absolute inset-4 border border-white/20 rounded-lg"></view>
        </view>
        <text class="mt-4 text-white/90 text-sm font-medium tracking-wider drop-shadow-md">正在识别...</text>
      </view>
    </view>

    <!-- Main UI Container -->
    <view class="relative z-10 flex flex-col h-full justify-between pb-8 pt-12 px-4">
      <!-- Top Bar: Navigation & Tools -->
      <view class="flex justify-between items-center w-full">
        <view @tap="navigateBack" class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:bg-black/40 transition">
          <text class="material-symbols-outlined text-[24px]">close</text>
        </view>
        <view class="flex gap-4">
          <view @tap="toggleFlash" class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:bg-black/40 transition">
            <text class="material-symbols-outlined text-[24px]">{{ flashOn ? 'flash_off' : 'flash_on' }}</text>
          </view>
          <view @tap="openSettings" class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:bg-black/40 transition">
            <text class="material-symbols-outlined text-[24px]">settings</text>
          </view>
        </view>
      </view>

      <!-- 初始状态：拍照按钮 -->
      <view v-if="!imageUrl && !isAnalyzing && !showResult" class="flex-1 flex flex-col items-center justify-center">
        <text class="text-white/80 text-center text-lg mb-8 tracking-wide">点击下方按钮拍摄食物</text>
      </view>

      <!-- Bottom Section: Controls & Result Card -->
      <view class="flex flex-col gap-4 w-full">
        <!-- Result Card (Sliding Up) -->
        <view v-if="showResult" class="w-full bg-white/85 dark:bg-[#122017]/85 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/50 dark:border-white/10 animate-slide-up">
          <!-- Header -->
          <view class="flex justify-between items-start mb-4">
            <view>
              <view class="flex items-center gap-1.5 mb-1">
                <text class="material-symbols-outlined text-[#38e07b] text-[20px] font-bold">check_circle</text>
                <text class="text-xs font-bold text-[#38e07b] uppercase tracking-wider">识别成功</text>
              </view>
              <text class="text-[#0e1a13] dark:text-white text-2xl font-bold leading-tight">{{ scanResult.foodName }}</text>
            </view>
            <view class="flex flex-col items-end">
              <text class="text-3xl font-extrabold text-[#38e07b]">{{ scanResult.calories }}</text>
              <text class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">千卡</text>
            </view>
          </view>

          <!-- Macros -->
          <view class="grid grid-cols-3 gap-3 mb-6">
            <!-- Protein -->
            <view class="flex flex-col gap-1.5">
              <view class="flex justify-between items-end">
                <text class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">蛋白质</text>
                <text class="text-xs font-bold text-[#0e1a13] dark:text-white">{{ scanResult.protein }}g</text>
              </view>
              <view class="h-1.5 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <view class="h-full bg-blue-400 rounded-full" :style="{ width: '60%' }"></view>
              </view>
            </view>
            <!-- Carbs -->
            <view class="flex flex-col gap-1.5">
              <view class="flex justify-between items-end">
                <text class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">碳水</text>
                <text class="text-xs font-bold text-[#0e1a13] dark:text-white">{{ scanResult.carbs }}g</text>
              </view>
              <view class="h-1.5 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <view class="h-full bg-[#38e07b] rounded-full" :style="{ width: '30%' }"></view>
              </view>
            </view>
            <!-- Fat -->
            <view class="flex flex-col gap-1.5">
              <view class="flex justify-between items-end">
                <text class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">脂肪</text>
                <text class="text-xs font-bold text-[#0e1a13] dark:text-white">{{ scanResult.fat }}g</text>
              </view>
              <view class="h-1.5 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <view class="h-full bg-amber-400 rounded-full" :style="{ width: '45%' }"></view>
              </view>
            </view>
          </view>

          <!-- Action Button -->
          <view
            @tap="confirmAndDetail"
            class="w-full py-3.5 bg-[#38e07b] text-[#122017] font-bold text-base rounded-xl shadow-lg shadow-[#38e07b]/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <text class="material-symbols-outlined">add_circle</text>
            <text>添加到日记</text>
          </view>
        </view>

        <!-- Minimalist Camera Controls -->
        <view class="flex items-center justify-around px-4 pb-2 pt-2">
          <view @tap="chooseFromAlbum" class="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition">
            <text class="material-symbols-outlined text-[28px]">photo_library</text>
          </view>
          <!-- Shutter -->
          <view @tap="takePhoto" class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:scale-95 transition">
            <view class="w-12 h-12 rounded-full bg-white"></view>
          </view>
          <view class="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition">
            <text class="material-symbols-outlined text-[28px] transform rotate-90">cameraswitch</text>
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
    "navigationBarBackgroundColor": "#000000",
    "navigationBarTextStyle": "white",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
@keyframes scan {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

@keyframes slideUp {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.animate-scan {
  animation: scan 2s linear infinite;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
</style>
