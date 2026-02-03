<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="flex flex-col h-full min-h-screen pb-24 overflow-y-auto no-scrollbar">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 pt-12 pb-4 bg-background-light/90 sticky top-0 z-30 backdrop-blur-md">
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold text-slate-900 leading-tight">食谱详情</h2>
      </div>
      <button @click="navigateBack" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
        <span class="material-symbols-outlined text-slate-900">close</span>
      </button>
    </header>

    <main class="flex-1 px-6 space-y-6 py-6">
      <div class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-slate-300">restaurant_menu</span>
        <h3 class="text-lg font-bold text-slate-900 mt-4">食谱详情</h3>
        <p class="text-slate-500 text-sm mt-2">内容开发中...</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* RecipeDetail page styles */
</style>
