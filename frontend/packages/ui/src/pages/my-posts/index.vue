<script setup lang="ts">
/**
 * 我的发布页面
 *
 * 显示用户在社区发布的健康日记动态
 */
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 发布的帖子数据
interface PostItem {
  id: number
  image: string
  title: string
  content: string
  aiScore: number
  date: string
  likes: number
  isLiked: boolean
}

const posts = ref<PostItem[]>([
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR51GwUPK1ruZBVzsPdGFwwoRdLGt4yCx2XFVkyEDaymgm0opvrHMXXfRpIlepi7nm4yKbVKMkMVbuRwnyyo1zlJSYLgVlBVsjQrVqho3GmkstgzPYXHPBKjE-GSZK7R_ZOfTbAQAbWm4XrtvruqI22RBpr6reCJFfp1_sAAKBEiqBsEw2velKn_HS5J7pkrUpohSlRqr8be0Jg52lMpyM1PtdBrUJN0oNJv4BvStUeD-v-OZdT-asBps2jgNfG3qLnT9r9mIJfVgi',
    title: '牛油果鲜虾能量碗',
    content: '午餐选择了富含优质脂肪的牛油果搭配高蛋白鲜虾，淋上自制油醋汁，清爽又饱腹。',
    aiScore: 98,
    date: '2023-10-24 12:30',
    likes: 128,
    isLiked: true
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvjxhEwE_W6l4VFnwESobgKPfCu8siiQG0SUZ-fm-Q-S8Vt8vsl-gZpqH_nFrNZg17GaugGuLhTFQ01DgveNlY6OJ4ngipH-I-LWkWx0s-s3xyqrU3PAY-0B05opjovJ5rn6JGi4my6hWKxQzWf0QYV8ZrfSpBOtj3uEnswOAza6oQoBszC72fwhHDy5nEl46S7ms29itcuCTgPZMdxNN7ZoSVbrC0OQ-a00WtR-gLm3VNoXwlZboiQfTXpLoIeU4ZGK7VlrOJz768',
    title: '轻断食：缤纷时蔬沙拉',
    content: '周一轻断食日，用五色蔬菜补充维生素，简单调味还原食材本味。',
    aiScore: 92,
    date: '2023-10-23 08:15',
    likes: 45,
    isLiked: false
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcFRtb3rVN4YUeuDo225bugquZd8Y3qS0Q1bByTX-apo9Q6XJLdzrrWBZ3fKSZ3GKeuZsU_YDRJVv-fX6Jv2Sst_hBRyjdH62Zr1b_JqFAE_5bLKsBV2y9BSHTHUyVsFHxA05pdRAE7ss93dYYCachWQieQhzVrTutQGb_edalJPt6tcwRx0Kp0aXp6OxVKxpmSoYNVNgyS_Em_2Yv3LkgFHzXca4iU0FuNJ85ZqCwQQuNX056p7MUqQ0ITCmBCDRSbGcbmZJTjk_e',
    title: '低温慢煮鸡胸肉',
    content: '尝试了新的低温慢煮法，鸡胸肉嫩滑多汁，完全不柴！健身后的完美补给。',
    aiScore: 88,
    date: '2023-10-22 18:45',
    likes: 216,
    isLiked: true
  }
])

// 用户统计
const userStats = ref({
  name: 'Alex Chen',
  totalPosts: 12
})

// 返回
const navigateBack = () => {
  uni.navigateBack()
}

// 新建发布
const createNewPost = () => {
  uni.navigateTo({
    url: '/pages/discover/index'
  })
}

// 切换点赞
const toggleLike = (post: PostItem) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

// 编辑帖子
const editPost = (id: number) => {
  uni.showToast({
    title: '编辑功能开发中',
    icon: 'none'
  })
}

// 删除帖子
const deletePost = (id: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这篇发布吗？',
    success: (res) => {
      if (res.confirm) {
        posts.value = posts.value.filter(p => p.id !== id)
        uni.showToast({
          title: '已删除',
          icon: 'success'
        })
      }
    }
  })
}

// 格式化点赞数
const formatLikes = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7F8]">
    <!-- Header -->
    <view class="sticky top-0 z-30 px-4 pt-12 pb-4 bg-[#F5F7F8]/90 backdrop-blur-md flex justify-between items-center">
      <view class="flex items-center gap-3">
        <view @tap="navigateBack" class="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#5a847b] active:bg-black/5 transition-colors">
          <text class="material-symbols-outlined">arrow_back_ios_new</text>
        </view>
        <text class="text-[28px] font-extrabold text-[#273936] tracking-tight">我的发布</text>
      </view>
      <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5a847b]">
        <text class="material-symbols-outlined">search</text>
      </view>
    </view>

    <!-- User Stats Card -->
    <view class="px-4 mt-2 mb-6">
      <view class="bg-white rounded-3xl p-5 shadow-soft border border-white/50 relative overflow-hidden">
        <view class="absolute -right-10 -top-10 w-40 h-40 bg-[#e3ebe5] rounded-full blur-3xl opacity-60 pointer-events-none"></view>
        <view class="flex items-center gap-5 relative z-10">
          <view class="w-[60px] h-[60px] rounded-full bg-[#c5d8cb] flex items-center justify-center text-[#5a847b] shadow-inner overflow-hidden border-[3px] border-white">
            <text class="material-symbols-outlined text-3xl filled">person</text>
          </view>
          <view class="flex-1">
            <view class="flex items-center justify-between">
              <view>
                <text class="text-lg font-bold text-slate-900 leading-tight">{{ userStats.name }}</text>
                <text class="text-xs text-[#5a847b] font-medium mt-0.5 block">共发布 {{ userStats.totalPosts }} 篇健康日记</text>
              </view>
              <view
                @tap="createNewPost"
                class="flex items-center gap-1 bg-[#f4f7f5] px-3 py-1.5 rounded-full border border-[#e3ebe5] active:scale-95 transition-transform"
              >
                <text class="material-symbols-outlined text-[16px] text-[#5a847b] filled">add_circle</text>
                <text class="text-[11px] font-bold text-[#456960]">新建</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Posts List -->
    <view class="px-4 space-y-5">
      <view
        v-for="post in posts"
        :key="post.id"
        class="bg-white p-3.5 rounded-[24px] shadow-soft border border-white/60"
      >
        <!-- Post Image -->
        <view class="relative h-48 w-full rounded-2xl overflow-hidden mb-3.5">
          <image :src="post.image" class="w-full h-full" mode="aspectFill" />
          <!-- AI Score Badge -->
          <view class="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm flex flex-col items-center min-w-[50px]">
            <text class="text-[9px] text-[#5a847b] uppercase tracking-wide">AI 评分</text>
            <text class="text-lg text-[#5a847b] font-extrabold">{{ post.aiScore }}</text>
          </view>
          <!-- Date Badge -->
          <view class="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <text class="text-[10px] text-white font-medium tracking-wide">{{ post.date }}</text>
          </view>
        </view>

        <!-- Post Content -->
        <view class="px-1">
          <text class="font-bold text-[17px] text-slate-800 leading-snug mb-1.5 block">{{ post.title }}</text>
          <text class="text-sm text-slate-500 mb-4 block leading-relaxed">{{ post.content }}</text>

          <!-- Actions -->
          <view class="flex items-center justify-between pt-3 border-t border-gray-100">
            <!-- Likes -->
            <view
              @tap="toggleLike(post)"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              :class="post.isLiked ? 'text-red-500 bg-red-50' : 'text-[#5a847b] bg-[#f4f7f5]'"
            >
              <text class="material-symbols-outlined text-[16px]" :class="post.isLiked ? 'filled' : ''">favorite</text>
              <text class="text-xs font-bold">{{ formatLikes(post.likes) }}</text>
            </view>

            <!-- Edit/Delete Buttons -->
            <view class="flex gap-2">
              <view
                @tap="editPost(post.id)"
                class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-slate-600 rounded-xl text-xs font-semibold active:scale-95 transition-all"
              >
                <text class="material-symbols-outlined text-[16px]">edit</text>
                <text>编辑</text>
              </view>
              <view
                @tap="deletePost(post.id)"
                class="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-semibold active:scale-95 transition-all"
              >
                <text class="material-symbols-outlined text-[16px]">delete</text>
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- End of List -->
      <view class="text-center py-6">
        <text class="text-xs text-[#769f96] font-medium">没有更多记录了</text>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
.shadow-soft {
  box-shadow: 0 8px 30px -4px rgba(90, 132, 123, 0.08);
}
</style>
