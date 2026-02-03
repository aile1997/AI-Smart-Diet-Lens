<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BottomNav from './components/BottomNav.vue';

const router = useRouter();
const route = useRoute();

const currentPath = computed(() => route.path);

// Hide nav on specific pages
const shouldHideNav = computed(() => {
  return ['/', '/scan', '/result', '/onboarding'].includes(currentPath.value) || 
         currentPath.value.startsWith('/recipe');
});
</script>

<template>
  <div class="relative w-full max-w-md mx-auto bg-background-light min-h-screen shadow-2xl overflow-hidden">
    <RouterView />
    <BottomNav v-if="!shouldHideNav" />
  </div>
</template>

<style scoped>
/* App-specific styles can be added here */
</style>
