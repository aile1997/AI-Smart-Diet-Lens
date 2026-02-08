<script setup lang="ts">
/**
 * 身体指标填写页面
 *
 * 使用 picker-view 组件实现滚动选择
 */
import { ref, computed, onMounted } from 'vue'
import { logger } from '@diet-lens/core'
import { getApi } from '@diet-lens/core'
import type { ApiClient } from '@diet-lens/core'

// 身体指标（可选）
const height = ref<number>(175)
const weight = ref<number>(70)
const age = ref<number>(28)

// picker-view 索引
const heightIndex = ref(75) // 175 - 100
const weightIndex = ref(40) // 70 - 30
const ageIndex = ref(18) // 28 - 10

// 生成数值数组
const heightValues = Array.from({ length: 151 }, (_, i) => 100 + i) // 100-250
const weightValues = Array.from({ length: 171 }, (_, i) => 30 + i) // 30-200
const ageValues = Array.from({ length: 91 }, (_, i) => 10 + i) // 10-100

// 调试：验证数据是否正确初始化
onMounted(() => {
  logger.debug('[body-metrics] 初始化完成', {
    heightValues: heightValues.length,
    weightValues: weightValues.length,
    ageValues: ageValues.length,
    heightIndex: heightIndex.value,
    weightIndex: weightIndex.value,
    ageIndex: ageIndex.value,
    currentHeight: heightValues[heightIndex.value],
    currentWeight: weightValues[weightIndex.value],
    currentAge: ageValues[ageIndex.value]
  })
})

/**
 * picker-view 统一变化事件
 * e.detail.value 是一个数组 [heightIndex, weightIndex, ageIndex]
 */
const onPickerChange = (e: any) => {
  const [hIdx, wIdx, aIdx] = e.detail.value
  heightIndex.value = hIdx
  weightIndex.value = wIdx
  ageIndex.value = aIdx
  height.value = heightValues[hIdx]
  weight.value = weightValues[wIdx]
  age.value = ageValues[aIdx]
}

// picker-view 指示器样式
const indicatorStyle = 'height: 50px;'

// BMR 计算公式 (Mifflin-St Jeor)
const bmr = computed<number>(() => {
  return Math.round(10 * weight.value + 6.25 * height.value - 5 * age.value + 5)
})

const navigateBack = () => {
  uni.navigateBack()
}

const handleSkip = () => {
  uni.navigateTo({ url: '/pages/onboarding/goals' })
}

const handleContinue = async () => {
  try {
    const api = getApi() as ApiClient
    await api.patch('/user/profile/metrics', {
      height: height.value,
      weight: weight.value,
    })
    logger.debug('保存身体指标成功', { height: height.value, weight: weight.value })
  } catch (err) {
    logger.error('保存身体指标失败:', err)
  }
  uni.navigateTo({ url: '/pages/onboarding/goals' })
}
</script>

<template>
  <view class="page">
    <!-- Header & Nav -->
    <view class="header">
      <view @tap="navigateBack" class="back-btn">
        <text class="icon">←</text>
      </view>
      <view class="progress">
        <view class="dot active"></view>
        <view class="dot"></view>
      </view>
    </view>

    <!-- Content -->
    <view class="content">
      <!-- Headlines -->
      <view class="section">
        <text class="step-badge">Step 1 of 2</text>
        <text class="title">身体指标（可选）</text>
        <text class="subtitle">填写身体指标可以帮助 AI 更准确地为你推荐食谱。也可以跳过直接选择目标模式。</text>
      </view>

      <!-- BMR Live Preview Card -->
      <view class="bmr-card">
        <view class="bmr-badge">LIVE PREVIEW</view>
        <view class="bmr-value">
          <text class="bmr-number">{{ bmr.toLocaleString() }}</text>
          <text class="bmr-unit">kcal/day</text>
        </view>
        <text class="bmr-label">基础代谢率 (BMR)</text>
      </view>

      <!-- Picker View Container -->
      <view class="picker-container">
        <!-- Picker View -->
        <picker-view
          class="picker-view"
          :indicator-style="indicatorStyle"
          :value="[heightIndex, weightIndex, ageIndex]"
          @change="onPickerChange"
        >
          <!-- Height Column -->
          <picker-view-column class="picker-column">
            <view class="picker-item" v-for="(item, index) in heightValues" :key="item">
              <text class="picker-text" :class="{ 'picker-selected': index === heightIndex }">{{ item }}</text>
              <text class="picker-unit" :class="{ 'picker-selected': index === heightIndex }">cm</text>
            </view>
          </picker-view-column>

          <!-- Weight Column -->
          <picker-view-column class="picker-column">
            <view class="picker-item" v-for="(item, index) in weightValues" :key="item">
              <text class="picker-text" :class="{ 'picker-selected': index === weightIndex }">{{ item }}</text>
              <text class="picker-unit" :class="{ 'picker-selected': index === weightIndex }">kg</text>
            </view>
          </picker-view-column>

          <!-- Age Column -->
          <picker-view-column class="picker-column">
            <view class="picker-item" v-for="(item, index) in ageValues" :key="item">
              <text class="picker-text" :class="{ 'picker-selected': index === ageIndex }">{{ item }}</text>
            </view>
          </picker-view-column>
        </picker-view>

        <!-- Column Labels (Below picker) -->
        <view class="picker-labels">
          <text class="picker-label">身高</text>
          <text class="picker-label">体重</text>
          <text class="picker-label">年龄</text>
        </view>
      </view>

      <view class="hint">
        <text>上下滚动选择数值</text>
      </view>
    </view>

    <!-- Fixed Bottom Action Buttons -->
    <view class="footer">
      <view class="button-group">
        <view @tap="handleSkip" class="btn btn-secondary">
          <text>跳过</text>
        </view>
        <view @tap="handleContinue" class="btn btn-primary">
          <text>继续</text>
          <text class="arrow">→</text>
        </view>
      </view>
    </view>
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
.page {
  min-height: 100vh;
  background: #F5F7F8;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  background: #F5F7F8;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.back-btn .icon {
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
}

.progress {
  display: flex;
  gap: 4px;
}

.dot {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
}

.dot.active {
  background: #34C759;
}

/* Content */
.content {
  flex: 1;
  padding: 0 16px 16px;
  padding-bottom: 100px;
}

.section {
  margin-bottom: 16px;
  margin-top: 8px;
}

.step-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(52, 199, 89, 0.1);
  color: #34C759;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 16px;
  margin-bottom: 8px;
}

.title {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  line-height: 32px;
  margin-bottom: 8px;
}

.subtitle {
  display: block;
  font-size: 14px;
  color: #64748b;
  line-height: 22px;
}

/* BMR Card */
.bmr-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.bmr-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(52, 199, 89, 0.1);
  color: #34C759;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 16px;
  margin-bottom: 10px;
}

.bmr-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
}

.bmr-number {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.bmr-unit {
  font-size: 12px;
  color: #64748b;
}

.bmr-label {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

/* Picker Container */
.picker-container {
  background: white;
  border-radius: 16px;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #f1f5f9;
}

.picker-view {
  width: 100%;
  height: 180px;
}

.picker-column {
  display: flex;
  flex-direction: column;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  flex-direction: row;
  gap: 2px;
}

.picker-text {
  font-size: 18px;
  font-weight: 600;
  color: #cbd5e1;
}

.picker-text.picker-selected {
  font-size: 24px;
  font-weight: 700;
  color: #34C759;
}

.picker-unit {
  font-size: 12px;
  color: #cbd5e1;
}

.picker-unit.picker-selected {
  font-size: 14px;
  color: #34C759;
  font-weight: 600;
}

/* Picker Labels */
.picker-labels {
  display: flex;
  justify-content: space-around;
  padding: 8px 0 4px;
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
}

.picker-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hint {
  text-align: center;
  margin-top: 8px;
}

.hint text {
  font-size: 12px;
  color: #94a3b8;
}

/* Footer */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #F5F7F8;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
}

.button-group {
  display: flex;
  gap: 8px;
}

.btn {
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.btn-secondary {
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-primary {
  flex: 2;
  background: #34C759;
  color: white;
  gap: 4px;
}

.arrow {
  font-size: 16px;
}
</style>
