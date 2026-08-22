import path from 'node:path'
import process from 'node:process'
import { Buffer } from 'node:buffer'
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const WIDTH = 1600
const HEIGHT = 1000
const projectRoot = path.resolve(import.meta.dirname, '..')
const sourceDir = path.resolve(process.argv[2] ?? '')
const backgroundPath = path.join(projectRoot, 'docs', 'assets', 'gallery-background.png')
const outputDir = path.join(projectRoot, 'docs', 'screenshots')

if (!process.argv[2]) {
  throw new Error('Pass the directory containing the IMG_*.PNG source screenshots.')
}

const galleries = [
  {
    output: 'overview-en.webp',
    eyebrow: '01 / OVERVIEW',
    title: 'Every renewal, in one place',
    subtitle: 'Month · Services · Stats',
    screens: [
      ['IMG_1466.PNG', 'Month'],
      ['IMG_1467.PNG', 'Services'],
      ['IMG_1468.PNG', 'Stats'],
    ],
  },
  {
    output: 'workflow-en.webp',
    eyebrow: '02 / WORKFLOW',
    title: 'From template to renewal',
    subtitle: 'Search · Add · Track',
    screens: [
      ['IMG_1475.PNG', 'Templates'],
      ['IMG_1474.PNG', 'Add service'],
      ['IMG_1472.PNG', 'Service detail'],
    ],
  },
  {
    output: 'local-first-en.webp',
    eyebrow: '03 / LOCAL FIRST',
    title: 'Private by default',
    subtitle: 'No account · Offline ready · Portable backup',
    screens: [
      ['IMG_1469.PNG', 'Local settings'],
      ['IMG_1454.PNG', 'Offline PWA'],
    ],
  },
  {
    output: 'overview-zh-CN.webp',
    eyebrow: '01 / 概览',
    title: '每一笔续费，都清清楚楚',
    subtitle: '本月 · 服务 · 统计',
    screens: [
      ['IMG_1455.PNG', '本月'],
      ['IMG_1456.PNG', '服务'],
      ['IMG_1459.PNG', '统计'],
    ],
  },
  {
    output: 'workflow-zh-CN.webp',
    eyebrow: '02 / 使用流程',
    title: '从服务模板到续费记录',
    subtitle: '选择 · 添加 · 管理',
    screens: [
      ['IMG_1463.PNG', '服务模板'],
      ['IMG_1462.PNG', '添加服务'],
      ['IMG_1457.PNG', '服务详情'],
    ],
  },
  {
    output: 'local-first-zh-CN.webp',
    eyebrow: '03 / 本地优先',
    title: '隐私默认就该如此',
    subtitle: '无需账号 · 支持离线 · 备份可迁移',
    screens: [
      ['IMG_1460.PNG', '本地设置'],
      ['IMG_1454.PNG', '离线 PWA'],
    ],
  },
]

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function headerSvg(gallery) {
  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .font { font-family: Arial, "Microsoft YaHei", "PingFang SC", sans-serif; }
      </style>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#090908" opacity="0.18"/>
      <text x="88" y="78" class="font" fill="#ff681a" font-size="22" font-weight="700" letter-spacing="4">${escapeXml(gallery.eyebrow)}</text>
      <text x="88" y="142" class="font" fill="#fff8ec" font-size="50" font-weight="800">${escapeXml(gallery.title)}</text>
      <text x="90" y="188" class="font" fill="#c7c0b5" font-size="24" font-weight="500">${escapeXml(gallery.subtitle)}</text>
      <line x1="88" y1="216" x2="1512" y2="216" stroke="#ff681a" stroke-width="2" opacity="0.75"/>
      <circle cx="1476" cy="78" r="7" fill="#ff681a"/>
      <circle cx="1500" cy="78" r="7" fill="#ff681a" opacity="0.5"/>
    </svg>
  `)
}

function phoneFrameSvg(x, y, outerWidth, outerHeight, label) {
  const escapedLabel = escapeXml(label)
  const labelY = y + outerHeight + 42
  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#000" flood-opacity="0.62"/>
        </filter>
      </defs>
      <rect x="${x}" y="${y}" width="${outerWidth}" height="${outerHeight}" rx="42" fill="#080807" stroke="#3f3b35" stroke-width="3" filter="url(#shadow)"/>
      <rect x="${x + outerWidth / 2 - 30}" y="${y + 8}" width="60" height="6" rx="3" fill="#4a4640" opacity="0.9"/>
      <rect x="${x - 5}" y="${y + 118}" width="5" height="72" rx="2" fill="#25231f"/>
      <rect x="${x + outerWidth}" y="${y + 150}" width="5" height="94" rx="2" fill="#25231f"/>
      <text x="${x + outerWidth / 2}" y="${labelY}" text-anchor="middle" fill="#fff8ec" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="22" font-weight="700">${escapedLabel}</text>
    </svg>
  `)
}

async function clippedScreenshot(fileName, width, height, radius) {
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" rx="${radius}" fill="white"/></svg>`,
  )

  return sharp(path.join(sourceDir, fileName))
    .resize(width, height, { fit: 'fill' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

async function buildGallery(gallery) {
  const background = await sharp(backgroundPath)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer()

  const isPair = gallery.screens.length === 2
  const innerWidth = isPair ? 310 : 286
  const innerHeight = Math.round((innerWidth * 2532) / 1170)
  const bezel = 12
  const outerWidth = innerWidth + bezel * 2
  const outerHeight = innerHeight + bezel * 2
  const y = isPair ? 242 : 248
  const gap = isPair ? 170 : 112
  const totalWidth = gallery.screens.length * outerWidth + (gallery.screens.length - 1) * gap
  const startX = Math.round((WIDTH - totalWidth) / 2)
  const layers = [{ input: background }, { input: headerSvg(gallery) }]

  for (const [index, [fileName, label]] of gallery.screens.entries()) {
    const x = startX + index * (outerWidth + gap)
    layers.push({ input: phoneFrameSvg(x, y, outerWidth, outerHeight, label) })
    layers.push({
      input: await clippedScreenshot(fileName, innerWidth, innerHeight, 31),
      left: x + bezel,
      top: y + bezel,
    })
  }

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: '#171613',
    },
  })
    .composite(layers)
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(outputDir, gallery.output))
}

await mkdir(outputDir, { recursive: true })

for (const gallery of galleries) {
  await buildGallery(gallery)
  process.stdout.write(`Created docs/screenshots/${gallery.output}\n`)
}
