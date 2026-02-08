const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');

// 读取 .env
const envPath = __dirname + '/../backend/.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const secretId = envContent.match(/TENCENT_SECRET_ID=([^\s\n]+)/)[1];
const secretKey = envContent.match(/TENCENT_SECRET_KEY=([^\s\n]+)/)[1];

console.log('🔑 使用密钥:', secretId.substring(0, 15) + '...');

const cos = new COS({
  SecretId: secretId,
  SecretKey: secretKey
});

// 读取测试图片
const filePath = __dirname + '/../frontend/packages/ui/static/images/food/food_1.jpg';
const fileContent = fs.readFileSync(filePath);

console.log('📤 直接上传到 COS（使用后端密钥）...');

cos.putObject({
  Bucket: 'smart-diet-1622598684-1309736368',
  Region: 'ap-beijing',
  Key: 'uploads/test-direct-upload.jpg',
  Body: fileContent,
}, (err, data) => {
  if (err) {
    console.error('❌ 上传失败:', err.message);
    console.error('错误详情:', err);
  } else {
    console.log('✅ 上传成功！');
    console.log('ETag:', data.ETag);
    console.log('Location:', data.Location);
    console.log('公开访问 URL:', 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/uploads/test-direct-upload.jpg');
  }
});
