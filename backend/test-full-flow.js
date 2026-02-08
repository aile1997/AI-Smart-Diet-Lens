/**
 * 完整流程测试：
 * 1. 登录获取 Token
 * 2. 获取预签名 URL
 * 3. 上传图片到 COS
 * 4. 调用 AI 识别
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// 读取测试图片
const testImagePath = path.resolve(__dirname, '../frontend/packages/ui/static/images/food/food_1.jpg');
console.log('📸 读取测试图片:', testImagePath);

const imageBuffer = fs.readFileSync(testImagePath);
console.log('📏 图片大小:', imageBuffer.length, 'bytes');

// API 基础地址
const API_BASE = 'http://192.168.10.29:3000/api';

// 步骤 1: 登录
const login = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email: 'test@example.com' });

    const req = http.request({
      hostname: '192.168.10.29',
      port: 3000,
      path: '/api/auth/login/simple',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success && result.data.token) {
            console.log('✅ 登录成功');
            resolve(result.data.token);
          } else {
            reject(new Error('登录失败: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// 步骤 2: 获取预签名 URL
const getPresignedUrl = (token) => {
  return new Promise((resolve, reject) => {
    const filename = `test_food_${Date.now()}.jpg`;
    const contentType = 'image/jpeg';
    const url = `${API_BASE}/upload/presigned?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`;

    http.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ 获取预签名 URL 成功');
            console.log('   uploadUrl:', result.data.uploadUrl.substring(0, 80) + '...');
            console.log('   fileKey:', result.data.fileKey);
            console.log('   publicUrl:', result.data.publicUrl);
            resolve(result.data);
          } else {
            reject(new Error('获取预签名 URL 失败: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

// 步骤 3: 上传到 COS
const uploadToCOS = (presignedData) => {
  return new Promise((resolve, reject) => {
    const url = new URL(presignedData.uploadUrl);

    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': imageBuffer.length
      }
    };

    const req = http.request(options, (res) => {
      console.log('   COS 响应状态:', res.statusCode);
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ 上传到 COS 成功');
        resolve(presignedData.publicUrl);
      } else {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          reject(new Error(`上传失败: ${res.statusCode} - ${data}`));
        });
      }
    });

    req.on('error', reject);
    req.write(imageBuffer);
    req.end();
  });
};

// 步骤 4: AI 识别
const analyzeFood = (token, imageUrl) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ image_url: imageUrl });

    const req = http.request({
      hostname: '192.168.10.29',
      port: 3000,
      path: '/api/ai/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ AI 识别成功');
            console.log('   识别结果:', JSON.stringify(result.data, null, 2));
            resolve(result.data);
          } else {
            reject(new Error('AI 识别失败: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// 执行完整流程
async function runFullTest() {
  try {
    console.log('\n=== 开始完整流程测试 ===\n');

    // 步骤 1
    console.log('步骤 1: 登录...');
    const token = await login();

    // 步骤 2
    console.log('\n步骤 2: 获取预签名 URL...');
    const presignedData = await getPresignedUrl(token);

    // 步骤 3
    console.log('\n步骤 3: 上传图片到 COS...');
    await uploadToCOS(presignedData);

    // 步骤 4
    console.log('\n步骤 4: 调用 AI 识别...');
    const analyzeResult = await analyzeFood(token, presignedData.publicUrl);

    console.log('\n=== ✅ 所有测试通过 ===\n');
    console.log('最终结果:');
    if (analyzeResult.foods && analyzeResult.foods.length > 0) {
      const food = analyzeResult.foods[0];
      console.log(`  食物: ${food.name}`);
      console.log(`  热量: ${food.nutrition.calories} kcal`);
      console.log(`  蛋白质: ${food.nutrition.protein} g`);
      console.log(`  碳水: ${food.nutrition.carbs} g`);
      console.log(`  脂肪: ${food.nutrition.fat} g`);
    }

  } catch (error) {
    console.error('\n=== ❌ 测试失败 ===');
    console.error(error.message);
    process.exit(1);
  }
}

runFullTest();
