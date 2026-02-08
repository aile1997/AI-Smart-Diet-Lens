// 调试 mockGetSummary 调用
const mockGetSummary = vi.hoisted(() => vi.fn())

// 设置 14 次调用
for (let i = 0; i < 14; i++) {
  mockGetSummary.mockResolvedValueOnce({ date: `2024-01-${i+1}`, totalCalories: 1500 })
}

// 第 15-30 次调用，设置默认返回值
mockGetSummary.mockResolvedValue({ date: '2024-01-15', totalCalories: 0 })

console.log('Mock setup complete')
