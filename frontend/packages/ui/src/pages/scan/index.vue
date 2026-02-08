<script setup lang="ts">
/**
 * 拍照扫描页面
 *
 * 打开相机拍照或从相册选择，上传到腾讯云 COS 后调用 AI 识别
 */
import { ref } from "vue";
import { getApi, UploadService, FoodService } from "@diet-lens/core";

// 拍照状态
const imageUrl = ref<string>("");
const isAnalyzing = ref(false);
const showResult = ref(false);
const flashOn = ref(false);

// 识别结果
const scanResult = ref<{
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
} | null>(null);

// API 服务实例
const api = getApi();
const uploadService = new UploadService(api);
const foodService = new FoodService(api);

/**
 * 打开相机拍照
 */
const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["camera"],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0];
      startAnalysis(res.tempFilePaths[0]);
    },
    fail: (err) => {
      console.error("拍照失败:", err);
      uni.showToast({
        title: "拍照失败",
        icon: "none",
      });
    },
  });
};

/**
 * 从相册选择
 */
const chooseFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album"],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0];
      startAnalysis(res.tempFilePaths[0]);
    },
    fail: (err) => {
      console.error("选择图片失败:", err);
      uni.showToast({
        title: "选择图片失败",
        icon: "none",
      });
    },
  });
};

/**
 * 切换闪光灯
 */
const toggleFlash = () => {
  flashOn.value = !flashOn.value;
  // TODO: 实际控制相机闪光灯
};

/**
 * 打开设置
 */
const openSettings = () => {
  // TODO: 打开相机设置
  uni.showToast({
    title: "相机设置",
    icon: "none",
  });
};

/**
 * 读取文件并转换为 Base64（跨平台兼容）
 */
const fileToBase64 = (tempFilePath: string, contentType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    // H5 环境：使用 FileReader API
    fetch(tempFilePath)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(blob);
      })
      .catch(reject);
    // #endif

    // #ifndef H5
    // 非 H5 环境（小程序/App）：使用 FileSystemManager
    try {
      const fs = uni.getFileSystemManager();
      const fileBuffer = fs.readFileSync(tempFilePath);
      const base64 = uni.arrayBufferToBase64(fileBuffer as ArrayBuffer);
      const dataUrl = `data:${contentType};base64,${base64}`;
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
    // #endif
  });
};

/**
 * 上传文件到预签名 URL（跨平台兼容）
 * 注意：不发送 Content-Type，因为预签名 URL 中不包含它的签名
 */
const uploadToPresignedUrl = (tempFilePath: string, presignedUrl: string, contentType: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    // H5 环境：使用 XMLHttpRequest 上传（比 fetch 更可靠地处理二进制数据）
    fetch(tempFilePath)
      .then(response => response.blob())
      .then(blob => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl);
        // 不设置 Content-Type，让浏览器自动处理（会使用 image/jpeg 等）
        // 如果显式设置，会与签名不匹配导致 403
        // xhr.setRequestHeader('Content-Type', contentType);
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve();
          } else {
            reject(new Error(`上传失败: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('网络错误'));
        xhr.send(blob);
      })
      .catch(reject);
    // #endif

    // #ifndef H5
    // 非 H5 环境（小程序/App）：使用 uni.request 上传
    try {
      const fs = uni.getFileSystemManager();
      const fileBuffer = fs.readFileSync(tempFilePath);

      uni.request({
        url: presignedUrl,
        method: 'PUT',
        // 不设置 Content-Type，让云存储自动检测
        // header: {
        //   'Content-Type': contentType,
        // },
        data: fileBuffer,
        success: () => resolve(),
        fail: (err: any) => reject(new Error(err.errMsg || '上传失败')),
      });
    } catch (error) {
      reject(error);
    }
    // #endif
  });
};

/**
 * 开始 AI 分析
 *
 * 流程：
 * 1. 获取预签名 URL（包含 fileKey）
 * 2. 判断上传方式：
 *    - 如果 uploadUrl === 'USE_BACKEND_UPLOAD'：使用后端直接上传（Base64）
 *    - 否则：使用预签名 URL 方式（PUT）
 * 3. 调用 AI 识别接口
 */
const startAnalysis = async (tempFilePath: string) => {
  isAnalyzing.value = true;

  try {
    // 1. 获取上传信息
    const filename = `food_${Date.now()}.jpg`;
    const contentType = "image/jpeg";

    const presignedData = await uploadService.getPresignedUrl(filename, contentType);

    // 2. 根据上传方式处理
    if (presignedData.uploadUrl === 'USE_BACKEND_UPLOAD') {
      // 使用后端直接上传（Base64 格式）
      console.log('使用后端直接上传方式');

      // 读取图片文件并转换为 Base64（跨平台兼容）
      const dataUrl = await fileToBase64(tempFilePath, contentType);

      // 调用直接上传 API
      await uploadService.directUpload(presignedData.fileKey, dataUrl);
    } else {
      // 使用预签名 URL 方式（跨平台兼容）
      console.log('使用预签名 URL 上传方式');
      await uploadToPresignedUrl(tempFilePath, presignedData.uploadUrl, contentType);
    }

    // 3. 调用 AI 识别接口（使用 publicUrl 而不是 fileKey）
    const analyzeResult = await foodService.analyzeFood(presignedData.publicUrl);

    // 4. 显示结果（取第一个识别的食物）
    if (analyzeResult.foods && analyzeResult.foods.length > 0) {
      const food = analyzeResult.foods[0];
      scanResult.value = {
        foodName: food.name,
        calories: food.nutrition.calories,
        protein: food.nutrition.protein,
        carbs: food.nutrition.carbs,
        fat: food.nutrition.fat,
        imageUrl: presignedData.publicUrl, // 保存图片 URL
      };
      showResult.value = true;
    } else {
      uni.showToast({
        title: "未能识别食物，请重试",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("AI 识别失败:", error);
    uni.showToast({
      title: "识别失败，请重试",
      icon: "none",
    });
  } finally {
    isAnalyzing.value = false;
  }
};

/**
 * 确认并进入营养详情页面
 */
const confirmAndDetail = () => {
  if (scanResult.value) {
    // 将结果存储到全局状态或通过路由参数传递
    uni.navigateTo({
      url: `/pages/food-result/index?data=${encodeURIComponent(JSON.stringify(scanResult.value))}`,
    });
  }
};

/**
 * 返回上一页
 */
const navigateBack = () => {
  if (showResult.value) {
    showResult.value = false;
    imageUrl.value = "";
    scanResult.value = null;
  } else if (imageUrl.value) {
    imageUrl.value = "";
  } else {
    uni.switchTab({ url: "/pages/index/index" });
  }
};
</script>

<template>
  <view class="h-screen w-full bg-[#F6F8F7] dark:bg-[#122017] overflow-hidden relative">
    <!-- Camera Feed Background -->
    <view class="absolute inset-0 z-0 bg-gray-900">
      <image v-if="imageUrl" :src="imageUrl" class="h-full w-full object-cover opacity-90" mode="aspectFill" />
      <image
        v-else
        src="/static/images/food/food_21.jpg"
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
            <text class="material-symbols-outlined text-[#122017] text-lg">temp_preferences_custom</text>
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
    <view class="relative z-10 flex flex-col h-full justify-between pb-24 pt-12 px-4">
      <!-- Top Bar: Navigation & Tools -->
      <view class="flex justify-between items-center w-full">
        <view
          @tap="navigateBack"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:bg-black/40 transition"
        >
          <text class="material-symbols-outlined text-2xl">close</text>
        </view>
        <!-- <view class="flex gap-4">
          <view @tap="toggleFlash" class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:bg-black/40 transition">
            <text class="material-symbols-outlined text-2xl">{{ flashOn ? 'flash_off' : 'flash_on' }}</text>
          </view>
          <view @tap="openSettings" class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:bg-black/40 transition">
            <text class="material-symbols-outlined text-2xl">settings</text>
          </view>
        </view> -->
      </view>

      <!-- 初始状态：拍照按钮 -->
      <view v-if="!imageUrl && !isAnalyzing && !showResult" class="flex-1 flex flex-col items-center justify-center">
        <text class="text-white/80 text-center text-lg mb-8 tracking-wide">点击下方按钮拍摄食物</text>
      </view>

      <!-- Bottom Section: Controls & Result Card -->
      <view class="flex flex-col gap-4 w-full">
        <!-- Result Card (Sliding Up) -->
        <view
          v-if="showResult && scanResult"
          class="w-full bg-white/85 dark:bg-[#122017]/85 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/50 dark:border-white/10 animate-slide-up"
        >
          <!-- Header -->
          <view class="flex justify-between items-start mb-4">
            <view>
              <view class="flex items-center gap-1.5 mb-1">
                <text class="material-symbols-outlined text-[#38e07b] text-xl font-bold">check_circle</text>
                <text class="text-xs font-bold text-[#38e07b] uppercase tracking-wider">识别成功</text>
              </view>
              <text class="text-[#0e1a13] dark:text-white text-xl font-bold leading-tight">{{ scanResult.foodName }}</text>
            </view>
            <view class="flex flex-col items-end">
              <text class="text-2xl font-extrabold text-[#38e07b]">{{ scanResult.calories }}</text>
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
            <text class="material-symbols-outlined text-3xl">photo_library</text>
          </view>
          <!-- Shutter -->
          <view
            @tap="takePhoto"
            class="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:scale-95 transition shadow-lg shadow-white/20"
          >
            <view class="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <text class="material-symbols-outlined text-[#38e07b] text-2xl">photo_camera</text>
            </view>
          </view>
          <view class="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition">
            <text class="material-symbols-outlined text-3xl transform rotate-90">cameraswitch</text>
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
  0% {
    top: 0%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-scan {
  animation: scan 2s linear infinite;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
</style>
