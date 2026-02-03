<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Simulate splash screen delay
  const timer = setTimeout(() => {
    router.push('/onboarding');
  }, 2000);

  return () => clearTimeout(timer);
});
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-background-light">
    <div class="text-center">
      <div class="mb-8">
        <span class="material-symbols-outlined text-8xl text-primary">nutrition</span>
      </div>
      <h1 class="text-4xl font-bold text-slate-900 mb-2">AI Smart Diet</h1>
      <p class="text-slate-500 text-lg">您的个人健康食谱助手</p>
    </div>
  </div>
</template>

<style scoped>
/* Splash page styles */
</style>
