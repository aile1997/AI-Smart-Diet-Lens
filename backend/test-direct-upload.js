const http = require('http');
const fs = require('fs');

// 读取测试图片并转换为 Base64
const imageBuffer = fs.readFileSync('../frontend/packages/ui/static/images/food/food_1.jpg');
const base64 = imageBuffer.toString('base64');
const dataUrl = `data:image/jpeg;base64,${base64}`;

console.log('📸 读取图片成功，大小:', imageBuffer.length, 'bytes');

// 获取 Token
const loginReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login/simple',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const loginData = JSON.parse(data);
    const token = loginData.data.token;

    console.log('🔑 Token 获取成功');

    // 测试直接上传
    const postData = JSON.stringify({
      fileKey: 'uploads/test-direct-api.jpg',
      base64: dataUrl
    });

    console.log('📤 开始上传...');

    const uploadReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/upload/direct',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let responseData = '';
      res.on('data', chunk => { responseData += chunk; });
      res.on('end', () => {
        console.log('📤 上传响应状态:', res.statusCode);
        const result = JSON.parse(responseData);
        if (result.success) {
          console.log('✅ 上传成功！');
          console.log('公开 URL:', result.data.publicUrl);
        } else {
          console.log('❌ 上传失败:', result);
        }
      });
    });

    uploadReq.on('error', (e) => {
      console.error('❌ 上传请求错误:', e);
    });

    uploadReq.write(postData);
    uploadReq.end();
  });
});

loginReq.on('error', (e) => {
  console.error('❌ 登录请求错误:', e);
});

loginReq.write(JSON.stringify({ email: 'test@example.com' }));
loginReq.end();
