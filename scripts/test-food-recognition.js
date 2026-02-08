const https = require('https');
const fs = require('fs');

// 读取 .env 文件
const envPath = __dirname + '/../backend/.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKey = envContent.match(/DASHSCOPE_API_KEY=([^\s\n]+)/)[1];

// 使用一张本地食物图片的 URL 进行测试
const testImageUrl = 'https://static.diet-lens.com/images/food/food_1.jpg';

console.log('🍎 测试食物识别功能...');
console.log('🖼️  测试图片:', testImageUrl);

const foodRecognitionPrompt = `你是一个专业的营养分析助手。请分析图片中的食物，返回 JSON 格式：

{
  "food_name": "食物名称",
  "calories_per_100g": 卡路里数值,
  "protein_g": 蛋白质含量,
  "carbs_g": 碳水含量,
  "fat_g": 脂肪含量,
  "portion_estimate_g": 估计份量
}

只返回 JSON，不要其他文字。`;

const testData = {
  model: 'qwen-vl-max',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: testImageUrl } },
        { type: 'text', text: foodRecognitionPrompt }
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
      const content = parsed.choices[0].message.content;
      console.log('\n✅ 食物识别成功！');
      console.log('\n📊 识别结果:');
      console.log(content);

      console.log('\n📈 Token 使用情况:');
      console.log(`  输入: ${parsed.usage.prompt_tokens} tokens`);
      console.log(`  输出: ${parsed.usage.completion_tokens} tokens`);
      console.log(`  总计: ${parsed.usage.total_tokens} tokens`);
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
