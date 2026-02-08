const https = require('https');
const fs = require('fs');

// 读取 .env 文件
const envPath = __dirname + '/../backend/.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKey = envContent.match(/DASHSCOPE_API_KEY=([^\s\n]+)/)[1];

console.log('🍎 测试 Qwen-VL 食物识别...\n');

// 使用一张清晰的沙拉图片
const imageUrl = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400';

console.log('🖼️  测试图片:', imageUrl);
console.log('🔑 API Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));

const prompt = `请识别图中的食物。
要求：
1. 返回严格的 JSON 格式，不要 Markdown 格式。
2. 字段包括：
   - food_name (菜名)
   - calories (预估热量kcal)
   - weight_g (预估重量g)
   - macros (对象: protein, fat, carbs)
   - tips (一句话健康建议)

请只返回 JSON，不要有其他文字。`;

const testData = {
  model: 'qwen-vl-max',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageUrl } },
        { type: 'text', text: prompt }
      ]
    }
  ]
};

const req = https.request({
  hostname: 'dashscope.aliyuncs.com',
  path: '/compatible-mode/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
}, (res) => {
  let data = '';

  res.on('data', (chunk) => { data += chunk; });

  res.on('end', () => {
    console.log('\n📡 响应状态码:', res.statusCode);

    if (res.statusCode === 200) {
      const parsed = JSON.parse(data);
      let content = parsed.choices[0]?.message?.content || '';

      // 清理可能的 Markdown 标记
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();

      console.log('\n✅ Qwen-VL 识别成功！');
      console.log('\n📊 识别结果:');
      console.log(content);

      try {
        const result = JSON.parse(content);
        console.log('\n🍽️  食物名称:', result.food_name);
        console.log('🔥 热量:', result.calories, 'kcal');
        console.log('⚖️  重量:', result.weight_g, 'g');
        console.log('💪 蛋白质:', result.macros?.protein, 'g');
        console.log('🍞 碳水:', result.macros?.carbs, 'g');
        console.log('🧈 脂肪:', result.macros?.fat, 'g');
        console.log('💡 建议:', result.tips);
      } catch (e) {
        console.log('\n⚠️  无法解析 JSON，原始内容:', content);
      }

      console.log('\n📈 Token 使用情况:');
      console.log(`  输入: ${parsed.usage.prompt_tokens} tokens`);
      console.log(`  输出: ${parsed.usage.completion_tokens} tokens`);
    } else {
      console.log('\n❌ 识别失败');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
});

req.write(JSON.stringify(testData));
req.end();
