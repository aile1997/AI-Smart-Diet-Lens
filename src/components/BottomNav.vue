<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const currentPath = computed(() => route.path);

interface NavItem {
  path: string;
  icon: string;
  label: string;
  isFab?: boolean;
}

const navItems: NavItem[] = [
  { path: '/home', icon: 'home', label: '首页' },
  { path: '/diary', icon: 'menu_book', label: '日记' },
  { path: '/scan', icon: 'photo_camera', label: '', isFab: true },
  { path: '/wiki', icon: 'nutrition', label: '百科' },
  { path: '/profile', icon: 'person', label: '我的' },
];

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <>
    <!-- Floating Action Button - Positioned absolutely -->
    <div class="fixed bottom-[4.5rem] left-1/2 transform -translate-x-1/2 z-50">
      <button 
        @click="navigateTo('/scan')"
        class="group flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-fab hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-background-light"
      >
        <span class="material-symbols-outlined text-[#0a3f21] text-3xl group-hover:animate-pulse">photo_camera</span>
      </button>
    </div>

    <!-- Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex items-center justify-between px-2 pb-2">
      <template v-for="item in navItems" :key="item.path">
        <div v-if="item.isFab" key="fab-spacer" class="flex-[0.8]"></div>
        <div v-else class="flex-1 flex justify-center">
          <button 
            @click="navigateTo(item.path)"
            :class="[
              'flex flex-col items-center gap-1 p-2 transition-colors',
              currentPath === item.path 
                ? 'text-primary' 
                : 'text-slate-400 hover:text-slate-600'
            ]"
          >
            <span 
              :class="[
                'material-symbols-outlined text-[26px]',
                currentPath === item.path ? 'font-variation-FILL-1' : ''
              ]"
            >
              {{ item.icon }}
            </span>
            <span :class="['text-[10px] font-medium', currentPath === item.path ? 'font-bold' : '']">
              {{ item.label }}
            </span>
          </button>
        </div>
      </template>
    </nav>
  </>
</template>

<style scoped>
/* Component-specific styles */
</style>
