<script setup lang="ts">
/**
 * AI 营养分析洞察页面
 *
 * 显示热量趋势、营养分布、AI 智能建议
 */
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

const timeRange = ref('周')

const setTimeRange = (range: string) => {
  timeRange.value = range
}

// AI 建议列表
const aiSuggestions = ref([
  {
    type: 'warning',
    icon: 'warning',
    title: '周末热量偏高提醒',
    desc: '过去两周六的热量摄入比工作日高出 30%，建议周末也保持规律饮食。',
    color: 'amber'
  },
  {
    type: 'success',
    icon: 'check_circle',
    title: '优质蛋白摄入充足',
    desc: '您的蛋白质来源多样且优质，有助于维持肌肉含量和基础代谢。',
    color: 'sage'
  },
  {
    type: 'tip',
    icon: 'lightbulb',
    title: '增加微量元素摄入',
    desc: '本周深色蔬菜比例略低，建议增加菠菜或西兰花的摄入以补充镁元素。',
    color: 'sky'
  }
])
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7F8]">
    <!-- Header -->
    <view class="sticky top-0 z-30 px-6 pt-14 pb-4 bg-[#F5F7F8]/90 backdrop-blur-md flex flex-col items-center">
      <text class="text-lg font-bold text-slate-900 mb-4">AI 营养分析洞察</text>
      <view class="flex w-full bg-slate-200/50 p-1 rounded-xl">
        <view
          @tap="setTimeRange('周')"
          :class="[
            'flex-1 py-1.5 text-sm rounded-lg transition-all',
            timeRange === '周' ? 'font-semibold bg-white shadow-sm text-slate-900' : 'font-medium text-slate-500'
          ]"
        >
          周
        </view>
        <view
          @tap="setTimeRange('月')"
          :class="[
            'flex-1 py-1.5 text-sm rounded-lg transition-all',
            timeRange === '月' ? 'font-semibold bg-white shadow-sm text-slate-900' : 'font-medium text-slate-500'
          ]"
        >
          月
        </view>
      </view>
    </view>

    <view class="px-5 pb-10 space-y-6">
      <!-- 摄入热量趋势 -->
      <view class="bg-white rounded-3xl p-6 shadow-card">
        <view class="flex justify-between items-center mb-6">
          <view>
            <text class="text-sm font-medium text-slate-500 block">摄入热量趋势</text>
            <text class="text-2xl font-bold text-slate-900">1,840 <text class="text-sm font-normal text-slate-400">平均 Kcal</text></text>
          </view>
          <view class="text-right">
            <text class="text-xs font-bold text-[#34C759] bg-[#34C759]/10 px-2 py-1 rounded-full">-12% 较上周</text>
          </view>
        </view>

        <!-- 柱状图 -->
        <view class="relative h-40 w-full flex items-end justify-between px-1">
          <view class="w-2 bg-slate-100 rounded-t-full h-[60%]"></view>
          <view class="w-2 bg-slate-100 rounded-t-full h-[75%]"></view>
          <view class="w-2 bg-slate-100 rounded-t-full h-[45%]"></view>
          <view class="w-2 bg-[#34C759] rounded-t-full h-[90%] relative">
            <view class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded-md whitespace-nowrap">2,100</view>
          </view>
          <view class="w-2 bg-slate-100 rounded-t-full h-[65%]"></view>
          <view class="w-2 bg-slate-100 rounded-t-full h-[80%]"></view>
          <view class="w-2 bg-slate-100 rounded-t-full h-[55%]"></view>
        </view>
        <view class="flex justify-between mt-3 px-0.5 text-[10px] font-medium text-slate-400">
          <text>周一</text>
          <text>周二</text>
          <text>周三</text>
          <text class="text-[#34C759] font-bold">今天</text>
          <text>周五</text>
          <text>周六</text>
          <text>周日</text>
        </view>
      </view>

      <!-- 营养平衡分布 -->
      <view>
        <view class="flex items-center justify-between mb-3 px-1">
          <text class="text-base font-bold text-slate-900">营养平衡分布</text>
        </view>
        <view class="bg-white rounded-3xl p-6 shadow-card">
          <view class="flex items-center gap-8">
            <!-- SVG 圆环图 -->
            <view class="relative w-32 h-32 flex items-center justify-center">
              <view class="w-full h-full rounded-full border-8 border-slate-200 absolute"></view>
              <!-- 模拟圆环图 - 使用 CSS 渐变 -->
              <view class="w-full h-full rounded-full" style="
                background: conic-gradient(
                  #34C759 0deg 126deg,
                  #FFCC00 126deg 288deg,
                  #FF3B30 288deg 360deg
                );
                mask: radial-gradient(transparent 60%, black 61%);
                -webkit-mask: radial-gradient(transparent 60%, black 61%);
              "></view>
              <view class="absolute text-center">
                <text class="text-xs font-bold text-slate-400 block">均衡度</text>
                <text class="text-lg font-bold text-slate-900">85</text>
              </view>
            </view>

            <!-- 图例 -->
            <view class="flex-1 space-y-4">
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-2">
                  <view class="w-2 h-2 rounded-full bg-[#34C759]"></view>
                  <text class="text-xs font-medium text-slate-600">蛋白质</text>
                </view>
                <text class="text-xs font-bold text-slate-900">35%</text>
              </view>
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-2">
                  <view class="w-2 h-2 rounded-full bg-[#FFCC00]"></view>
                  <text class="text-xs font-medium text-slate-600">碳水</text>
                </view>
                <text class="text-xs font-bold text-slate-900">45%</text>
              </view>
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-2">
                  <view class="w-2 h-2 rounded-full bg-[#FF3B30]"></view>
                  <text class="text-xs font-medium text-slate-600">脂肪</text>
                </view>
                <text class="text-xs font-bold text-slate-900">20%</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- AI 智能建议 -->
      <view class="space-y-3">
        <view class="flex items-center gap-2 px-1">
          <text class="material-symbols-outlined text-[#34C759] text-xl filled">auto_awesome</text>
          <text class="text-base font-bold text-slate-900">AI 智能建议</text>
        </view>
        <view class="space-y-3">
          <view
            v-for="(item, index) in aiSuggestions"
            :key="index"
            class="bg-white p-4 rounded-2xl shadow-card flex gap-4"
            :class="[
              item.color === 'amber' ? 'border-l-4 border-amber-400' : '',
              item.color === 'sage' ? 'border-l-4 border-[#34C759]' : '',
              item.color === 'sky' ? 'border-l-4 border-sky-400' : ''
            ]"
          >
            <view
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                item.color === 'amber' ? 'bg-amber-50 text-amber-500' : '',
                item.color === 'sage' ? 'bg-[#34C759]/10 text-[#34C759]' : '',
                item.color === 'sky' ? 'bg-sky-50 text-sky-500' : ''
              ]"
            >
              <text class="material-symbols-outlined">{{ item.icon }}</text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-bold text-slate-900 block">{{ item.title }}</text>
              <text class="text-xs text-slate-500 mt-1 leading-relaxed block">{{ item.desc }}</text>
            </view>
          </view>
        </view>
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
.shadow-card {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
