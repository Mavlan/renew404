<script setup lang="ts">
import { useI18n } from '../i18n'

const standalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
const { t } = useI18n()
</script>

<template>
  <div class="install-guide">
    <template v-if="standalone">
      <b>{{ t('已作为独立应用运行') }}</b><p>{{ t('Renew404 已从主屏幕启动，可在离线状态读取和编辑本地数据。') }}</p>
    </template>
    <template v-else-if="ios">
      <b>{{ t('安装到 iPhone') }}</b><ol><li>{{ t('请使用 Safari 打开此网站。') }}</li><li>{{ t('点击底部“分享”按钮。') }}</li><li>{{ t('选择“添加到主屏幕”，再点“添加”。') }}</li></ol>
    </template>
    <template v-else>
      <b>{{ t('安装为 PWA') }}</b><p>{{ t('使用浏览器的“安装应用”菜单将 Renew404 添加到桌面。iPhone 请用 Safari 的“分享 → 添加到主屏幕”。') }}</p>
    </template>
  </div>
</template>
