<script setup lang="ts">
/**
 * 拍照扫描页面
 *
 * 打开相机拍照或从相册选择，上传到腾讯云 COS 后调用 AI 识别
 */
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
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
  portion: number; // 食物份量（克）
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
        portion: food.portion_g || 100, // 食物份量（克）
        imageUrl: presignedData.publicUrl,
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

/**
 * 重新拍照
 */
const retake = () => {
  showResult.value = false;
  imageUrl.value = "";
  scanResult.value = null;
};

/**
 * 页面显示时重置状态
 * 修复 bug：拍完一次后，下次进来还是上次的结果
 */
onShow(() => {
  // 重置所有状态到初始值
  imageUrl.value = "";
  isAnalyzing.value = false;
  showResult.value = false;
  scanResult.value = null;
});
</script>

<template>
  <view class="relative w-full h-full bg-[#050505] overflow-hidden">
    <!-- 极光背景效果 -->
    <view class="absolute top-[-10%] left-[-20%] w-[600rpx] h-[600rpx] bg-[#38e07b] opacity-20 blur-[120px] rounded-full animate-pulse-slow"></view>
    <view class="absolute bottom-[-10%] right-[-20%] w-[600rpx] h-[600rpx] bg-[#4f46e5] opacity-15 blur-[100px] rounded-full animate-pulse-slow delay-1000"></view>

    <!-- 噪点纹理 -->
    <view class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></view>

    <!-- 相机背景 -->
    <view class="absolute inset-0 z-0">
      <image v-if="imageUrl" :src="imageUrl" class="h-full w-full object-cover opacity-80" mode="aspectFill" />
      <image
        v-else
        src="https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_21.jpg?imageMogr2/format/webp/quality/85"
        class="h-full w-full object-cover opacity-80"
        mode="aspectFill"
      />
      <view class="absolute inset-0 bg-black/40"></view>
    </view>

    <!-- 主 UI 容器 -->
    <view class="relative z-10 flex flex-col h-full justify-between pb-20 pt-14 px-5">
      <!-- 顶部栏：导航和状态 -->
      <view class="flex justify-between items-center w-full">
        <view
          @tap="navigateBack"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 active:scale-95 transition"
        >
          <text class="material-symbols-outlined text-white text-xl">close</text>
        </view>
        <view v-if="!showResult" class="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center gap-2">
          <view class="w-1.5 h-1.5 rounded-full bg-[#38e07b] animate-ping"></view>
          <text class="text-[10px] text-white/80 font-medium tracking-widest uppercase">AI Vision Active</text>
        </view>
        <view class="w-10"></view>
      </view>

      <!-- 扫描框 -->
      <view v-if="!showResult" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <view class="relative w-72 h-72 transition-all duration-500" :class="isAnalyzing ? 'scale-90 opacity-80' : 'scale-100'">
          <!-- 四个角落标记 -->
          <view class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#38e07b] rounded-tl-lg shadow-[0_0_15px_rgba(56,224,123,0.5)]"></view>
          <view class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#38e07b] rounded-tr-lg shadow-[0_0_15px_rgba(56,224,123,0.5)]"></view>
          <view class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#38e07b] rounded-bl-lg shadow-[0_0_15px_rgba(56,224,123,0.5)]"></view>
          <view class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#38e07b] rounded-br-lg shadow-[0_0_15px_rgba(56,224,123,0.5)]"></view>

          <!-- 内部扫描区域 -->
          <view class="absolute inset-4 border border-white/5 rounded-lg overflow-hidden">
            <!-- 激光扫描线 -->
            <view v-if="!isAnalyzing" class="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#38e07b] to-transparent shadow-[0_0_20px_#38e07b] animate-laser-scan"></view>
            <!-- 分析中的脉冲效果 -->
            <view v-if="isAnalyzing" class="absolute inset-0 bg-[#38e07b]/10 animate-pulse"></view>
          </view>

          <!-- 中心十字准星 -->
          <view v-if="!isAnalyzing" class="absolute inset-0 flex items-center justify-center opacity-30">
            <view class="w-1 h-4 bg-white rounded-full"></view>
            <view class="h-1 w-4 bg-white rounded-full absolute"></view>
          </view>
        </view>

        <text class="mt-8 text-white/60 text-xs tracking-[4px] font-light uppercase">{{ isAnalyzing ? 'ANALYZING FOOD DATA...' : 'TARGET SUBJECT' }}</text>
      </view>

      <!-- 底部区域：控制和结果卡片 -->
      <view class="flex flex-col gap-6 w-full relative z-20">
        <!-- 结果卡片 -->
        <view
          v-if="showResult && scanResult"
          class="w-full bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] animate-slide-up"
        >
          <!-- 头部 -->
          <view class="flex justify-between items-start mb-6">
            <view>
              <view class="flex items-center gap-2 mb-2">
                <view class="px-2 py-0.5 rounded bg-[#38e07b]/20 border border-[#38e07b]/30">
                  <text class="text-[10px] font-bold text-[#38e07b] uppercase">High Confidence</text>
                </view>
              </view>
              <text class="text-white text-2xl font-bold tracking-tight">{{ scanResult.foodName }}</text>
            </view>
            <view class="flex flex-col items-end">
              <text class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#38e07b] to-[#2563eb] leading-none">{{ scanResult.calories }}</text>
              <text class="text-[10px] text-gray-400 font-bold uppercase mt-1">Kcal / {{ scanResult.portion }}g</text>
            </view>
          </view>

          <!-- 营养素进度条 -->
          <view class="space-y-4 mb-8">
            <view>
              <view class="flex justify-between text-xs mb-1.5">
                <text class="text-gray-400 font-medium">Protein</text>
                <text class="text-white font-bold">{{ scanResult.protein }}g</text>
              </view>
              <view class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <view class="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full" :style="{ width: Math.min((scanResult.protein / 30) * 100, 100) + '%' }"></view>
              </view>
            </view>
            <view>
              <view class="flex justify-between text-xs mb-1.5">
                <text class="text-gray-400 font-medium">Carbs</text>
                <text class="text-white font-bold">{{ scanResult.carbs }}g</text>
              </view>
              <view class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <view class="h-full bg-[#38e07b] shadow-[0_0_10px_rgba(56,224,123,0.5)] rounded-full" :style="{ width: Math.min((scanResult.carbs / 100) * 100, 100) + '%' }"></view>
              </view>
            </view>
            <view>
              <view class="flex justify-between text-xs mb-1.5">
                <text class="text-gray-400 font-medium">Fat</text>
                <text class="text-white font-bold">{{ scanResult.fat }}g</text>
              </view>
              <view class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <view class="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] rounded-full" :style="{ width: Math.min((scanResult.fat / 30) * 100, 100) + '%' }"></view>
              </view>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="flex gap-4">
            <view @tap="retake" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:bg-white/10 transition">
              <text class="material-symbols-outlined text-white text-xl">refresh</text>
            </view>
            <view @tap="confirmAndDetail" class="flex-1 h-14 rounded-2xl bg-[#38e07b] flex items-center justify-center shadow-[0_0_20px_rgba(56,224,123,0.3)] active:scale-[0.98] transition">
              <text class="text-[#050505] font-bold text-base">Add to Diary</text>
            </view>
          </view>
        </view>

        <!-- 相机控制 -->
        <view v-if="!showResult" class="flex items-center justify-around px-2">
          <view @tap="chooseFromAlbum" class="p-4 rounded-full active:bg-white/5 transition">
            <text class="material-symbols-outlined text-white/60 text-2xl">image</text>
          </view>

          <!-- 快门按钮 -->
          <view @tap="takePhoto" class="relative group">
            <view class="absolute inset-0 bg-[#38e07b] rounded-full blur-xl opacity-20 group-active:opacity-40 transition"></view>
            <view class="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center relative z-10 bg-black/20 backdrop-blur-sm group-active:scale-95 transition">
              <view class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <view v-if="isAnalyzing" class="w-8 h-8 border-2 border-[#38e07b] border-t-transparent rounded-full animate-spin"></view>
              </view>
            </view>
          </view>

          <view class="p-4 rounded-full active:bg-white/5 transition">
            <text class="material-symbols-outlined text-white/60 text-2xl">flip_camera_ios</text>
          </view>
        </view>
      </view>
    </view>
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
/* 激光扫描动画 */
@keyframes laser-scan {
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
.animate-laser-scan {
  animation: laser-scan 2s linear infinite;
}

/* 极光呼吸动画 */
@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

/* 滑入动画 */
@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* 延迟动画 */
.delay-1000 {
  animation-delay: 1s;
}
</style>
