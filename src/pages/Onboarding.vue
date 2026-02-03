<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToHome = () => {
  router.push('/home');
};
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center bg-background-light p-6">
    <div class="text-center space-y-8">
      <div>
        <span class="material-symbols-outlined text-8xl text-primary">auto_awesome</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-4">欢迎来到 AI Smart Diet</h1>
        <p class="text-slate-500 text-lg mb-6">开始您的健康饮食之旅</p>
      </div>
      <button
        @click="navigateToHome"
        class="px-8 py-4 bg-primary text-slate-900 font-bold text-lg rounded-2xl shadow-lg hover:bg-primary-dark transition-colors"
      >
        开始使用
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Onboarding page styles */
</style>
