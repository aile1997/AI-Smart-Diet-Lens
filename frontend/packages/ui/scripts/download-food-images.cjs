/**
 * 食物图片下载脚本
 *
 * 从 Unsplash 获取高质量食物图片并保存到本地
 * 运行: node scripts/download-food-images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 目标目录
const targetDir = path.join(__dirname, '../src/static/images/food');

// 确保目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 食物图片映射 - 使用 Unsplash Source API
const foodImages = [
  { name: '牛油果', file: 'food_1.jpg', keywords: 'avocado' },
  { name: '三文鱼', file: 'food_2.jpg', keywords: 'salmon' },
  { name: '藜麦', file: 'food_3.jpg', keywords: 'quinoa' },
  { name: '蓝莓', file: 'food_4.jpg', keywords: 'blueberries' },
  { name: '奇亚籽', file: 'food_5.jpg', keywords: 'chia seeds' },
  { name: '羽衣甘蓝', file: 'food_6.jpg', keywords: 'kale' },
  { name: '土鸡蛋', file: 'food_7.jpg', keywords: 'eggs' },
  { name: '鸡胸肉', file: 'food_8.jpg', keywords: 'chicken breast' },
  { name: '虾仁', file: 'food_9.jpg', keywords: 'shrimp' },
  { name: '燕麦', file: 'food_10.jpg', keywords: 'oatmeal' },
  { name: '红薯', file: 'food_11.jpg', keywords: 'sweet potato' },
  { name: '糙米', file: 'food_12.jpg', keywords: 'brown rice' },
  { name: '菠菜', file: 'food_13.jpg', keywords: 'spinach' },
  { name: '胡萝卜', file: 'food_14.jpg', keywords: 'carrot' },
  { name: '西兰花', file: 'food_15.jpg', keywords: 'broccoli' },
  { name: '西红柿', file: 'food_16.jpg', keywords: 'tomato' },
];

// Unsplash Source API (免费，无需密钥)
const UNSPLASH_BASE = 'https://source.unsplash.com/400x300/?food';

// 备用图片源 - 使用 raw.githubusercontent.com 从可靠的食品图片仓库
const backupImages = {
  'food_1.jpg': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop', // 牛油果
  'food_2.jpg': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', // 三文鱼
  'food_3.jpg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop', // 藜麦
  'food_4.jpg': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop', // 蓝莓
  'food_5.jpg': 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=300&fit=crop', // 奇亚籽
  'food_6.jpg': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop', // 羽衣甘蓝
  'food_7.jpg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop', // 鸡蛋
  'food_8.jpg': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop', // 鸡胸肉
  'food_9.jpg': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', // 虾仁
  'food_10.jpg': 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop', // 燕麦
  'food_11.jpg': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50b0?w=400&h=300&fit=crop', // 红薯
  'food_12.jpg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop', // 糙米
  'food_13.jpg': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop', // 菠菜
  'food_14.jpg': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop', // 胡萝卜
  'food_15.jpg': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop', // 西兰花
  'food_16.jpg': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop', // 西红柿
};

/**
 * 下载单个文件
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    console.log(`下载: ${url}`);
    console.log(`保存到: ${filepath}`);

    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        console.log(`重定向到: ${redirectUrl}`);
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(redirectUrl, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ 完成: ${path.basename(filepath)}`);
        resolve();
      });

      file.on('error', (err) => {
        file.close();
        fs.unlinkSync(filepath);
        reject(err);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

/**
 * 主下载函数
 */
async function downloadAll() {
  console.log('开始下载食物图片...\n');

  let successCount = 0;
  let failCount = 0;

  for (const food of foodImages) {
    const filepath = path.join(targetDir, food.file);
    const url = backupImages[food.file];

    try {
      await downloadFile(url, filepath);
      successCount++;
    } catch (error) {
      console.error(`❌ 失败: ${food.name} - ${error.message}`);
      failCount++;
    }

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n========== 下载完成 ==========');
  console.log(`成功: ${successCount}/${foodImages.length}`);
  console.log(`失败: ${failCount}/${foodImages.length}`);
}

// 运行下载
downloadAll().catch(console.error);
