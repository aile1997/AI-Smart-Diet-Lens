<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const scanned = ref(false);
let timer: number | undefined;

onMounted(() => {
  timer = setTimeout(() => {
    scanned.value = true;
  }, 2500);
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});

const navigateBack = () => {
  router.go(-1);
};

const navigateToResult = () => {
  router.push('/result');
};
</script>

<template>
  <div class="relative h-screen w-full bg-black overflow-hidden">
    <!-- Background Camera Feed (Simulated) -->
    <div class="absolute inset-0 z-0">
      <img 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP9ZqyvoNOkfUKn5kUom1CwhefOCGiIdSYFYymfFT1VUmw6O-k3omUWe5luc3WeEs-uBCmKtQLsTg9IQUkb8xHVOQ56ozg4Bawg1pQQlmj5rbvHS-AfoduqbnrupeBU1FNX3owz6befdRHYWoSgOlr-sLcpQ56f2KWbRzjXJ-VhuvxilFUGTrGIqZ9IF8h1_Vfe_BM05yXui0Ce61rsDJ8s_CMrdJuhmJTLq1siOmcBk7hCVEmEOxTQ8D2IlzGIoiDE4377mGFAy63" 
        class="w-full h-full object-cover opacity-90"
        alt="Camera Feed"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
    </div>

    <!-- Controls -->
    <div class="relative z-10 flex flex-col h-full justify-between py-12 px-4">
      <!-- Top Bar -->
      <div class="flex justify-between items-center w-full">
        <button @click="navigateBack" class="flex items-center justify-center size-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="flex gap-4">
          <button class="flex items-center justify-center size-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
            <span class="material-symbols-outlined">flash_on</span>
          </button>
        </div>
      </div>

      <!-- Reticle Area -->
      <div :class="['absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500', scanned ? 'opacity-0' : 'opacity-100']">
        <div class="relative size-72">
          <div class="absolute w-full h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(56,224,123,0.8)] animate-[scan_2s_linear_infinite] z-10 top-0"></div>
          <!-- Reticle Corners -->
          <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
          <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
          <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
          <div class="absolute inset-4 border border-white/20 rounded-lg"></div>
        </div>
        <p class="mt-6 text-white font-bold tracking-widest text-sm drop-shadow-md animate-pulse">正在识别...</p>
      </div>

      <!-- Result Card (Slides Up) -->
      <div v-if="scanned" class="w-full bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl animate-slide-up">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-1.5 mb-1 text-primary">
              <span class="material-symbols-outlined text-xl">check_circle</span>
              <span class="text-xs font-bold uppercase tracking-wider">识别成功</span>
            </div>
            <h2 class="text-slate-900 text-2xl font-bold">牛油果吐司</h2>
            <p class="text-slate-500 text-sm font-medium">健康脂肪来源</p>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-3xl font-extrabold text-primary">320</span>
            <span class="text-xs text-slate-500 font-bold uppercase">kcal</span>
          </div>
        </div>
        <!-- Macros -->
        <div class="grid grid-cols-3 gap-3 mb-6">
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-end">
              <span class="text-[10px] font-bold text-slate-500 uppercase">蛋白质</span>
              <span class="text-xs font-bold text-slate-900">12g</span>
            </div>
            <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-blue-400 rounded-full w-[40%]"></div>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-end">
              <span class="text-[10px] font-bold text-slate-500 uppercase">碳水</span>
              <span class="text-xs font-bold text-slate-900">24g</span>
            </div>
            <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full w-[65%]"></div>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-end">
              <span class="text-[10px] font-bold text-slate-500 uppercase">脂肪</span>
              <span class="text-xs font-bold text-slate-900">18g</span>
            </div>
            <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-amber-400 rounded-full w-[55%]"></div>
            </div>
          </div>
        </div>
        <button @click="navigateToResult" class="w-full py-4 bg-primary text-slate-900 font-bold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
          <span class="material-symbols-outlined">add_circle</span>
          确认并添加
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

@keyframes slideUp {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
</style>
