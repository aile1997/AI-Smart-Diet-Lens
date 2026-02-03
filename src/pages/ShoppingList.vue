<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface ShoppingItem {
  id: number;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

const items = ref<ShoppingItem[]>([
  { id: 1, name: '三文鱼排', quantity: '200g', category: '海鲜', checked: false },
  { id: 2, name: '鲜嫩芦笋', quantity: '100g', category: '蔬菜', checked: false },
  { id: 3, name: '初榨橄榄油', quantity: '1瓶', category: '油类', checked: false },
  { id: 4, name: '海盐', quantity: '1罐', category: '调味', checked: false },
  { id: 5, name: '黑胡椒', quantity: '1罐', category: '调味', checked: false },
]);

const navigateToHome = () => {
  router.push('/home');
};

const toggleItem = (id: number) => {
  const item = items.value.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
  }
};

const deleteItem = (id: number) => {
  items.value = items.value.filter(i => i.id !== id);
};
</script>

<template>
  <div class="flex flex-col h-full min-h-screen pb-24 overflow-y-auto no-scrollbar">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 pt-12 pb-4 bg-background-light/90 sticky top-0 z-30 backdrop-blur-md">
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold text-slate-900 leading-tight">购物清单</h2>
      </div>
      <button @click="navigateToHome" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
        <span class="material-symbols-outlined text-slate-900">add</span>
      </button>
    </header>

    <main class="flex-1 px-6 space-y-6 py-6">
      <div v-if="items.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-slate-300">shopping_cart</span>
        <h3 class="text-lg font-bold text-slate-900 mt-4">购物清单为空</h3>
        <p class="text-slate-500 text-sm mt-2">添加食材来创建购物清单</p>
      </div>

      <div v-else class="space-y-3">
        <template v-for="item in items" :key="item.id">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm transition-colors group">
            <input 
              :checked="item.checked"
              @change="toggleItem(item.id)"
              type="checkbox" 
              class="peer size-5 appearance-none rounded border border-gray-300 bg-transparent checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer" 
            />
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h4 :class="['font-bold text-slate-900', item.checked ? 'line-through text-slate-400' : '']">{{ item.name }}</h4>
                <span class="text-xs text-slate-500">{{ item.quantity }}</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">{{ item.category }}</p>
            </div>
            <button 
              @click="deleteItem(item.id)"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
            >
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ShoppingList page styles */
</style>
