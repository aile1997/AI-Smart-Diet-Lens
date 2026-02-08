/**
 * 批量替换静态图片路径为 COS URL
 *
 * 运行方式：pnpm tsx scripts/replace-image-paths.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { glob } from 'glob'

// COS 基础 URL
const COS_BASE_URL = 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food'

// 需要处理的文件
const PATTERNS = [
  // 匹配 /static/images/food/food_XX.jpg
  {
    regex: /\/static\/images\/food\/food_(\d+)\.jpg/g,
    replacement: `${COS_BASE_URL}/food_$1.jpg`,
  },
]

// 需要处理的 Vue 文件
const vueFiles = join(process.cwd(), 'src/pages/**/*.vue')

async function main() {
  const files = await glob(vueFiles, { windowsPathsNoEscape: true })

  console.log(`🔍 找到 ${files.length} 个 Vue 文件`)

  let totalReplacements = 0

  for (const file of files) {
    let content = readFileSync(file, 'utf-8')
    let hasChanges = false

    for (const pattern of PATTERNS) {
      const matches = content.match(pattern.regex)
      if (matches) {
        content = content.replace(pattern.regex, pattern.replacement)
        hasChanges = true
        totalReplacements += matches.length
        console.log(`  ✏️  ${file}: 替换 ${matches.length} 处`)
      }
    }

    if (hasChanges) {
      writeFileSync(file, content, 'utf-8')
    }
  }

  console.log(`\n✅ 完成！共替换 ${totalReplacements} 处图片路径`)
}

main().catch(console.error)
