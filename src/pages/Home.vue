<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 卡路里数据
const consumed = ref(530);
const target = ref(2200);
const remaining = computed(() => target.value - consumed.value);
const consumedPercent = computed(() => Math.round((consumed.value / target.value) * 100));

const navigateTo = (path: string) => {
  router.push(path);
};

const addWater = () => {
  // 添加水分逻辑
  console.log('Added water');
};
</script>

<template>
  <div class="flex flex-col h-full min-h-screen pb-24 overflow-y-auto no-scrollbar">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 pt-12 pb-4 bg-background-light/90 sticky top-0 z-30 backdrop-blur-md">
      <div class="flex flex-col">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">周一, 11月 24日</p>
        <h2 class="text-2xl font-bold text-slate-900 leading-tight">早安, Alex</h2>
      </div>
      <div class="relative group cursor-pointer" @click="navigateTo('/profile')">
        <div class="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4ARIueyn7oeLTPKejOMX_pPCmp0S85Xj29ku1HwdDtPDdRoJLpgvSEU23aY8xES40OHagpkPIqfDk5h8PItc2_ZuNCkUoO83GnslRZ4Gx9UhngYaK5meHb23uRdd1Ue7r6Bjz93OPt83tMVKCviO5oMtJvKgZOPTe5t_pOF9YKnKnqVpqMMP0f3XfNWt1iZ5Kc46ID7smBu2WqYsT__xkslaaSj5fpZsEypEKjwo_BMUp4cmuwKUxEHETmtlH3YOqCR9fNO3K127-')"></div>
        <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full"></div>
      </div>
    </header>

    <main class="flex-1 px-6 space-y-8">
      <!-- Calorie Ring -->
      <section class="flex flex-col items-center pt-4" @click="navigateTo('/diary')">
        <div class="relative w-64 h-64 flex items-center justify-center cursor-pointer">
          <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-30 animate-pulse-slow"></div>
          <svg class="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 256 256">
            <circle class="text-sage-100" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-width="18"></circle>
            <circle class="text-primary transition-all duration-1000 ease-out" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-dasharray="691" stroke-dashoffset="200" stroke-linecap="round" stroke-width="18"></circle>
          </svg>
          <div class="absolute flex flex-col items-center justify-center text-center inset-0 z-10">
            <span class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">剩余</span>
            <h1 class="text-5xl font-extrabold text-slate-900 tracking-tight font-display">{{ remaining }}</h1>
            <p class="text-slate-500 text-xs font-medium mt-1">Kcal 预算</p>
          </div>
        </div>
        <div class="flex items-center justify-center gap-12 mt-[-10px] z-10">
          <div class="flex flex-col items-center">
            <div class="w-2 h-2 rounded-full bg-primary mb-2"></div>
            <p class="text-xl font-bold text-slate-900 leading-none">{{ consumed }}</p>
            <span class="text-xs font-medium text-slate-500 mt-1">已摄入</span>
          </div>
          <div class="w-px h-8 bg-slate-200"></div>
          <div class="flex flex-col items-center">
            <div class="w-2 h-2 rounded-full bg-slate-300 mb-2"></div>
            <p class="text-xl font-bold text-slate-900 leading-none">{{ target }}</p>
            <span class="text-xs font-medium text-slate-500 mt-1">目标</span>
          </div>
        </div>
      </section>

      <!-- Metric Grid -->
      <section class="grid grid-cols-2 gap-4">
        <div class="p-5 bg-white rounded-3xl border border-sage-100 shadow-card flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-colors" @click="navigateTo('/achievements')">
          <div class="absolute top-2 right-2 p-2 opacity-10">
            <span class="material-symbols-outlined text-6xl">footprint</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-primary text-xl">footprint</span>
            <h3 class="text-sm font-bold text-slate-700">步数</h3>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">4,200</p>
            <p class="text-xs text-slate-500 mb-3">/ 10,000</p>
            <div class="h-1.5 w-full bg-sage-50 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width: 42%"></div>
            </div>
          </div>
        </div>

        <div class="p-5 bg-[#ebf7fd] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
          <div class="absolute top-2 right-2 p-2 opacity-10">
            <span class="material-symbols-outlined text-6xl text-sky-500">water_drop</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-sky-500 text-xl">water_drop</span>
            <h3 class="text-sm font-bold text-slate-700">水分</h3>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-2xl font-bold text-slate-900">4</p>
              <p class="text-xs text-slate-500">/ 8 杯</p>
            </div>
            <button @click="addWater" class="bg-white text-sky-500 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-lg font-bold">add</span>
            </button>
          </div>
        </div>

        <div class="p-5 bg-[#f0f0fa] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
          <div class="absolute top-2 right-2 p-2 opacity-10">
            <span class="material-symbols-outlined text-6xl text-indigo-500">bedtime</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-indigo-500 text-xl">bedtime</span>
            <h3 class="text-sm font-bold text-slate-700">睡眠</h3>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">7<span class="text-base text-slate-500 font-medium">h</span> 20<span class="text-base text-slate-500 font-medium">m</span></p>
            <p class="text-xs text-indigo-500 font-bold mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[10px]">trending_up</span> 恢复佳
            </p>
          </div>
        </div>

        <div class="p-5 bg-[#fff8e6] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
          <div class="absolute top-2 right-2 p-2 opacity-10">
            <span class="material-symbols-outlined text-6xl text-amber-500">sentiment_satisfied</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-amber-500 text-xl">sentiment_satisfied</span>
            <h3 class="text-sm font-bold text-slate-700">心情</h3>
          </div>
          <div>
            <p class="text-xl font-bold text-slate-900">精力充沛</p>
            <p class="text-xs text-slate-500 mt-1">10:30 AM</p>
          </div>
        </div>
      </section>

      <!-- Meal Log Empty State -->
      <section class="pb-8">
        <div class="flex items-center justify-between mb-4 px-1">
          <h2 class="text-lg font-bold text-slate-900">今日餐食</h2>
          <button class="text-primary text-sm font-bold hover:text-primary-dark" @click="navigateTo('/diary')">查看全部</button>
        </div>

        <!-- Quick Access to Recipe -->
        <div @click="navigateTo('/recipe')" class="w-full rounded-3xl bg-white border border-sage-100 p-4 flex gap-4 items-center shadow-card active:scale-[0.98] transition-transform cursor-pointer">
          <div class="w-20 h-20 bg-cover bg-center rounded-2xl" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjzSEoi6HdN7_oDhZ1YSC_cxw8HLvaz15PmOoZBhJsWUfsRtTFhRh0iWcGq1oJQXIxGnh7carV5qEUHOSau3MVSUpBLpVF--Fogwn__vECHTzsWfbZlYMQJIlKW7lgGNreZra2Ga9iwmn7Azn2t2Ecn9kcjULEF6NLAIeMe5RViTl-EbsQHB4hjYpTN6tY3Y6TLXHfKSit9IHrF3U0nPTpNsq1K2fYBboezJt3N7KntyVDDB64o-U2V05l46-OFzFTwW9dpUxYEQuq')"></div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">推荐食谱</span>
              <span class="text-[10px] text-slate-400">450 kcal</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 leading-tight mb-1">香煎三文鱼配芦笋</h3>
            <p class="text-xs text-slate-500">15分钟快手菜 · 优质蛋白</p>
          </div>
          <div class="size-8 rounded-full bg-slate-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </div>

        <div class="w-full mt-4 rounded-3xl bg-white border-2 border-dashed border-sage-200 p-8 flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
            <span class="material-symbols-outlined text-4xl">restaurant_menu</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 mb-1">您的日记还没满</h3>
          <p class="text-sm text-slate-500 max-w-[200px] leading-relaxed mb-5">
            记录您的第一餐以解锁个性化建议。
          </p>
          <button @click="navigateTo('/scan')" class="px-6 py-2.5 rounded-full bg-sage-100 text-slate-700 text-sm font-bold hover:bg-sage-200 inline-flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">add</span>
            记录早餐
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Home page styles */
</style>
