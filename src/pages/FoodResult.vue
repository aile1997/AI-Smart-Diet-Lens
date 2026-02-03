<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const portion = ref(250);

const navigateBack = () => {
  router.go(-1);
};

const saveToDiary = () => {
  router.push('/diary');
};
</script>

<template>
  <div class="relative h-screen w-full flex flex-col bg-background-light">
    <!-- Top Image Area -->
    <div class="relative h-[40vh] w-full shrink-0">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4okC0hHdn3KHTuhDrx6xp8mDEkn5jbe7BZiwHFYNGahUNYOKaU-P-wp4QPUaoE_-BCukvONG3Sae8E0mfPO3Y_06RQNmL_7k9xY0yDEjb9STqrajykm7h_P-GJy90l1QKgmPIELcCu7QWIpKcVFjc2MXU46MW4pZAX078eN02KA6KUebKHDU54pfwir8U9sU5ic4ki7-QYykkUCwsS62DQoA5oakcMbvNAQx_f69msJTTsiOE_gZU36fX8O86ZT3UGhSn1MTjx7GG')">
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      <div class="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-10">
        <button @click="navigateBack" class="flex items-center justify-center size-10 rounded-full bg-white/20 backdrop-blur-md text-white">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <button class="flex items-center gap-2 px-4 h-10 rounded-full bg-white/20 backdrop-blur-md text-white">
          <span class="material-symbols-outlined text-[20px]">photo_camera</span>
          <span class="text-sm font-semibold">重拍</span>
        </button>
      </div>

      <div class="absolute bottom-10 left-6 z-10">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-black uppercase tracking-wider">AI 置信度 98%</span>
        </div>
        <h2 class="text-3xl font-bold text-white leading-tight drop-shadow-sm font-display">香煎三文鱼<br/>蔬菜沙拉碗</h2>
      </div>
    </div>

    <!-- Detail Sheet -->
    <div class="flex-1 relative -mt-8 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col z-20">
      <div class="w-full flex justify-center pt-3 pb-1 shrink-0">
        <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      <div class="flex-1 overflow-y-auto px-6 pt-2 pb-28">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-sm font-medium text-slate-500 mb-1">总热量</p>
            <h1 class="text-5xl font-extrabold text-slate-900 tracking-tight font-display">450 <span class="text-2xl font-semibold text-slate-400 ml-1">kcal</span></h1>
          </div>
          <div class="text-right pb-1">
            <div class="flex items-center gap-1 justify-end text-primary font-bold">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>健康</span>
            </div>
            <p class="text-xs text-slate-400">在日常目标内</p>
          </div>
        </div>

        <!-- Slider -->
        <div class="mb-8 p-5 bg-background-light rounded-2xl border border-slate-100">
          <div class="flex justify-between items-center mb-4">
            <label class="text-base font-bold text-slate-900">分量大小</label>
            <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <span class="font-bold text-slate-900">{{ portion }}</span>
              <span class="text-sm font-medium text-slate-400">g</span>
            </div>
          </div>
          <input 
            v-model.number="portion"
            type="range" 
            min="50" 
            max="500" 
            class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
          />
          <div class="flex justify-between mt-2 text-xs font-medium text-slate-400">
            <span>50g</span>
            <span>500g</span>
          </div>
        </div>

        <!-- Macros List -->
        <div class="space-y-6">
          <h3 class="text-sm uppercase tracking-wider font-bold text-slate-500">宏量营养素</h3>

          <div class="group">
            <div class="flex justify-between items-end mb-2">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary"></span>
                <span class="font-semibold text-slate-700">蛋白质</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-slate-900">35g</span>
                <span class="text-xs font-medium text-slate-400 ml-1">/ 140g</span>
              </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-primary h-full rounded-full" style="width: 31%"></div>
            </div>
          </div>

          <div class="group">
            <div class="flex justify-between items-end mb-2">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span class="font-semibold text-slate-700">碳水</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-slate-900">12g</span>
                <span class="text-xs font-medium text-slate-400 ml-1">/ 250g</span>
              </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-amber-400 h-full rounded-full" style="width: 10%"></div>
            </div>
          </div>

          <div class="group">
            <div class="flex justify-between items-end mb-2">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                <span class="font-semibold text-slate-700">脂肪</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-slate-900">18g</span>
                <span class="text-xs font-medium text-slate-400 ml-1">/ 70g</span>
              </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-sky-400 h-full rounded-full" style="width: 25%"></div>
            </div>
          </div>
        </div>

        <div class="h-px w-full bg-slate-100 my-8"></div>

        <div class="grid grid-cols-3 gap-4 pb-4">
          <div class="bg-background-light p-3 rounded-xl text-center border border-slate-100">
            <p class="text-xs text-slate-500 mb-1">钠</p>
            <p class="font-bold text-slate-900">450mg</p>
          </div>
          <div class="bg-background-light p-3 rounded-xl text-center border border-slate-100">
            <p class="text-xs text-slate-500 mb-1">膳食纤维</p>
            <p class="font-bold text-slate-900">6.2g</p>
          </div>
          <div class="bg-background-light p-3 rounded-xl text-center border border-slate-100">
            <p class="text-xs text-slate-500 mb-1">糖</p>
            <p class="font-bold text-slate-900">3.1g</p>
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
        <button 
          @click="saveToDiary"
          class="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold text-lg h-14 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>保存到日记</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* FoodResult page styles */
</style>
