import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../pages/Splash.vue'),
  },
  {
    path: '/onboarding',
    component: () => import('../pages/Onboarding.vue'),
  },
  {
    path: '/home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/scan',
    component: () => import('../pages/Scan.vue'),
  },
  {
    path: '/result',
    component: () => import('../pages/FoodResult.vue'),
  },
  {
    path: '/diary',
    component: () => import('../pages/Diary.vue'),
  },
  {
    path: '/wiki',
    component: () => import('../pages/Wiki.vue'),
  },
  {
    path: '/list',
    component: () => import('../pages/ShoppingList.vue'),
  },
  {
    path: '/profile',
    component: () => import('../pages/Profile.vue'),
  },
  {
    path: '/achievements',
    component: () => import('../pages/Achievements.vue'),
  },
  {
    path: '/recipe',
    component: () => import('../pages/RecipeDetail.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
