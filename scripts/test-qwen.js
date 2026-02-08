const https = require('https');
const fs = require('fs');

// 读取 .env 文件
const envPath = __dirname + '/../backend/.env';
const envContent = fs.readFileSync(envPath, 'utf-8');

// 提取 DASHSCOPE_API_KEY
const apiKeyMatch = envContent.match(/DASHSCOPE_API_KEY=([^\s\n]+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;

if (!apiKey) {
  console.error('❌ 未找到 DASHSCOPE_API_KEY');
  process.exit(1);
}

console.log('🔑 测试 Qwen-VL API Key...');
console.log('密钥:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));

// 测试请求 - 使用简单的文本请求先验证 API Key
const testData = {
  model: 'qwen-vl-max',
  messages: [
    {
      role: 'user',
      content: '你好，请回复确认连接正常'
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

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n📡 响应状态码:', res.statusCode);
    console.log('📄 响应内容:');

    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));

      if (res.statusCode === 200) {
        console.log('\n✅ Qwen-VL API Key 有效！');
      } else if (res.statusCode === 401) {
        console.log('\n❌ API Key 无效或已过期');
        console.log('请前往阿里云百炼控制台重新获取:');
        console.log('https://bailian.console.aliyun.com/');
      } else if (res.statusCode === 400) {
        console.log('\n⚠️ 请求参数错误 (可能模型名称不正确)');
      } else if (res.statusCode === 403) {
        console.log('\n⚠️ 账户余额不足或未开通服务');
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
});

req.write(JSON.stringify(testData));
req.end();
