<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const aiAssistantEnabled = ref(true);

interface NutritionStat {
  label: string;
  val: string;
  pct: number;
  color: string;
}

interface Ingredient {
  n: string;
  q: string;
}

interface CookingStep {
  t: string;
  d: string;
}

const nutritionStats: NutritionStat[] = [
  { label: '蛋白质', val: '35g', pct: 85, color: 'text-primary' },
  { label: '脂肪', val: '12g', pct: 40, color: 'text-orange-400' },
  { label: '碳水', val: '5g', pct: 15, color: 'text-blue-400' }
];

const ingredients: Ingredient[] = [
  { n: '三文鱼排', q: '200g' },
  { n: '鲜嫩芦笋', q: '100g' },
  { n: '初榨橄榄油', q: '1勺' },
  { n: '海盐与黑胡椒', q: '适量' }
];

const cookingSteps: CookingStep[] = [
  { t: '腌制调味', d: '在鱼肉两面均匀撒上海盐和现磨黑胡椒，静置5分钟入味。同时在芦笋上淋少许橄榄油。' },
  { t: '煎制鱼皮', d: '平底锅中火加热，倒入橄榄油。将三文鱼皮朝下放入锅中，用铲子轻压，中小火煎3-4分钟至鱼皮金黄酥脆。' },
  { t: '完成出锅', d: '翻面继续煎2-3分钟，同时放入芦笋一同煎熟。待鱼肉变色且熟透后即可装盘。' }
];

const navigateBack = () => {
  router.go(-1);
};

const navigateToScan = () => {
  router.push('/scan');
};

const navigateToList = () => {
  router.push('/list');
};

const startCooking = () => {
  console.log('Started cooking');
};
</script>

<template>
  <div class="relative h-screen w-full flex flex-col bg-background-light overflow-y-auto no-scrollbar">
    <!-- Hero Section -->
    <div class="relative w-full h-[460px] shrink-0 group">
      <div 
        class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
        style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjzSEoi6HdN7_oDhZ1YSC_cxw8HLvaz15PmOoZBhJsWUfsRtTFhRh0iWcGq1oJQXIxGnh7carV5qEUHOSau3MVSUpBLpVF--Fogwn__vECHTzsWfbZlYMQJIlKW7lgGNreZra2Ga9iwmn7Azn2t2Ecn9kcjULEF6NLAIeMe5RViTl-EbsQHB4hjYpTN6tY3Y6TLXHfKSit9IHrF3U0nPTpNsq1K2fYBboezJt3N7KntyVDDB64o-U2V05l46-OFzFTwW9dpUxYEQuq')"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

      <!-- Navigation Bar -->
      <div class="absolute top-0 left-0 right-0 flex items-center justify-between p-6 pt-12 z-20">
        <button 
          @click="navigateBack"
          class="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors text-white"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="flex gap-3">
          <button class="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors text-white">
            <span class="material-symbols-outlined">share</span>
          </button>
          <button class="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors text-white">
            <span class="material-symbols-outlined">bookmark_border</span>
          </button>
        </div>
      </div>

      <!-- Content Overlay -->
      <div class="absolute bottom-0 left-0 w-full p-6 pb-8 z-10">
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary text-xs font-semibold tracking-wide uppercase shadow-sm">
            Keto Friendly
          </span>
          <div class="flex items-center gap-1 text-gray-200 text-xs font-medium bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
            <span class="material-symbols-outlined text-primary text-sm font-variation-FILL-1">star</span>
            <span>4.9</span>
            <span class="text-gray-400 mx-1">•</span>
            <span>128 评价</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white leading-tight mb-2 tracking-tight font-display drop-shadow-md">香煎三文鱼配芦笋</h1>
        <p class="text-gray-200 text-sm line-clamp-2 leading-relaxed opacity-90">富含 Omega-3 的优质蛋白，搭配鲜嫩芦笋，15分钟即可享受的米其林级美味。</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative flex-1 px-6 -mt-4 z-10 bg-background-light rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <!-- Handle Bar -->
      <div class="w-full flex justify-center pt-3 pb-1">
        <div class="w-12 h-1.5 bg-gray-300/50 rounded-full"></div>
      </div>

      <!-- Quick Stats -->
      <div class="flex gap-3 py-4 overflow-x-auto no-scrollbar">
        <div class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <span class="material-symbols-outlined text-primary text-[18px]">schedule</span>
          <p class="text-slate-800 text-sm font-medium">20 分钟</p>
        </div>
        <div class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <span class="material-symbols-outlined text-primary text-[18px]">signal_cellular_alt</span>
          <p class="text-slate-800 text-sm font-medium">简单</p>
        </div>
        <div class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <span class="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
          <p class="text-slate-800 text-sm font-medium">450 kcal</p>
        </div>
      </div>

      <!-- Nutrition Charts -->
      <div class="mt-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-slate-900">营养分析</h2>
          <button @click="navigateToScan" class="text-xs text-primary font-bold flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors">
            查看详情 <span class="material-symbols-outlined text-xs">chevron_right</span>
          </button>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <template v-for="(stat, idx) in nutritionStats" :key="idx">
            <div class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
              <div class="relative size-12 mb-2">
                <svg class="size-full -rotate-90" viewBox="0 0 36 36">
                  <path class="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                  <path :class="[stat.color, 'drop-shadow-[0_0_2px_rgba(0,0,0,0.1)]']" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" :stroke-dasharray="`${stat.pct}, 100`" stroke-width="3"></path>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-900">{{ stat.pct }}%</div>
              </div>
              <span class="text-2xl font-bold text-slate-900 leading-none">{{ stat.val }}</span>
              <span class="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-bold">{{ stat.label }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- AI Assistant -->
      <div class="mt-8 mb-6 p-4 rounded-2xl bg-white border border-gray-100 shadow-lg flex items-center justify-between relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div class="flex items-center gap-3 z-10">
          <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined animate-pulse">mic</span>
          </div>
          <div>
            <h3 class="text-slate-900 font-bold text-sm">AI 语音助手</h3>
            <p class="text-xs text-slate-500">实时语音指导步骤</p>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer z-10">
          <input v-model="aiAssistantEnabled" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <!-- Ingredients -->
      <div class="mt-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-slate-900">所需食材 <span class="text-slate-400 font-normal text-sm ml-1">(4项)</span></h2>
          <button @click="navigateToList" class="text-emerald-600 text-sm font-medium border border-emerald-600/30 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">add</span> 加入清单
          </button>
        </div>
        <div class="space-y-3">
          <template v-for="(item, idx) in ingredients" :key="idx">
            <label class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm transition-colors cursor-pointer group select-none">
              <div class="relative flex items-center justify-center shrink-0">
                <input type="checkbox" class="peer size-5 appearance-none rounded border border-gray-300 bg-transparent checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all" />
                <span class="material-symbols-outlined absolute text-black text-sm opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-50 peer-checked:scale-100 transition-transform duration-200">check</span>
              </div>
              <div class="flex-1 flex justify-between items-center group-hover:text-slate-700">
                <span class="text-slate-900 text-sm font-medium">{{ item.n }}</span>
                <span class="text-slate-400 text-sm">{{ item.q }}</span>
              </div>
            </label>
          </template>
        </div>
      </div>

      <!-- Steps -->
      <div class="mt-8 pb-32">
        <h2 class="text-lg font-bold text-slate-900 mb-6">烹饪步骤</h2>
        <div class="relative border-l-2 border-gray-200 ml-3 space-y-8">
          <div class="relative pl-8">
            <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-primary shadow-[0_0_8px_rgba(54,226,123,0.5)]"></div>
            <h3 class="text-slate-900 font-semibold text-base mb-2">准备食材</h3>
            <p class="text-slate-600 text-sm leading-relaxed mb-3">将三文鱼清洗干净，用厨房纸吸干水分。芦笋去除老根，洗净沥干。</p>
            <div class="w-full h-32 rounded-lg bg-cover bg-center shadow-sm" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEeOkuz8wFtmc8Le9AW9cFnaASz41uWIYEgBFEE6QAZDQywM2cKClq4WVWYLGlCsxo-r7qL3vokK5I5F0kIUU_BhTS-Q2E-JWPkZmdn5GUOaSwCsDRgfigz5BOPiCoJ4tsSLgl9Y7c5kz2O9IlEn61PXX0o0JBRr66U1C27aKg-1Drn5iayVMf71NYe7yNy_jZ3gZ2Jh3NEY129dQg-mYj7RAS4GhV6V0u8Ym3RnKv9EXAIhjtySJW-isymWQ4feDzXjsgvBzPVKF2')"></div>
          </div>
          <template v-for="(step, idx) in cookingSteps" :key="idx">
            <div class="relative pl-8">
              <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-white border-2 border-gray-300"></div>
              <h3 class="text-slate-900 font-semibold text-base mb-2">{{ step.t }}</h3>
              <p class="text-slate-600 text-sm leading-relaxed">{{ step.d }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Floating Footer -->
    <div class="fixed bottom-0 left-0 right-0 p-4 pt-0 bg-gradient-to-t from-background-light via-background-light to-transparent z-30 max-w-md mx-auto pointer-events-none">
      <div class="pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 uppercase tracking-wide font-medium">预计耗时</span>
          <span class="text-slate-900 font-bold font-display text-lg">20:00</span>
        </div>
        <button @click="startCooking" class="flex-1 bg-primary text-slate-900 font-bold text-base py-3 px-6 rounded-xl hover:bg-[#2ed66e] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(54,226,123,0.4)]">
          <span class="material-symbols-outlined text-2xl">play_arrow</span>
          开始烹饪
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* RecipeDetail page styles */
</style>
