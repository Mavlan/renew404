import { readonly, ref } from 'vue'
import type { AppLocale, ServiceCategory } from '../domain/models'

type Params = Record<string, string | number>
type Messages = Record<string, string>

export const LOCALE_OPTIONS: readonly { value: AppLocale; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

const zhCN: Messages = {
  'launch.eyebrow': 'LOCAL-FIRST / RENEWAL TRACKER',
  'launch.tagline': '周期有迹 · 续费有期',
  'category.ai-creative': 'AI 与创作',
  'category.development-tools': '开发工具',
  'category.cloud-servers': '云服务与服务器',
  'category.domains-websites': '域名与网站',
  'category.office-productivity': '办公与效率',
  'category.storage-backup': '存储与备份',
  'category.video-streaming': '视频与流媒体',
  'category.music-audio': '音乐与音频',
  'category.gaming': '游戏',
  'category.social-membership': '社交与会员',
  'category.network-proxy': '网络与代理',
  'category.communications': '通讯与运营商',
  'category.shopping-lifestyle': '购物与生活',
  'category.finance-insurance': '金融与保险',
  'category.education-learning': '教育与学习',
  'category.travel-transport': '旅行与交通',
  'category.other': '其他',
  'template.generic-vps': '通用 VPS',
  'template.generic-domain': '通用域名续费',
  'template.clash-subscription': 'Clash 订阅',
  'template.vpn-service': 'VPN 服务',
  'template.mobile-plan': '手机套餐',
  'template.home-broadband': '家庭宽带',
  'greeting.morning': '早上好',
  'greeting.afternoon': '下午好',
  'greeting.evening': '晚上好',
  'month.renewals': '{month}续费',
  'count.items': '{count} 项',
  'count.records': '{count} 条',
  'count.servicesHistory': '{services} 个服务 · {payments} 条历史',
  'countdown.overdue': '已逾期 {days} 天',
  'countdown.today': '今天',
  'countdown.remaining': '还有 {days} 天',
  'recurrence.label': '每 {value} {unit}',
  'unit.day': '天',
  'unit.week': '周',
  'unit.month': '个月',
  'unit.year': '年',
  'preview.schedule': '下次将在 {date} {time} 提醒，之后{recurrence}续费一次。',
  'reminder.daysBefore': '{days} 天前 · {timeZone}',
  'exported.at': '导出于 {date}',
  'money.maxDecimals': '{currency} 最多支持 {digits} 位小数',
  'error.invalidDate': '无效日期：{value}',
  'error.invalidInterval': '续费周期必须是 1 到 999 之间的整数',
  'error.serviceNotFound': '服务不存在',
  'calendar.service': '服务：{name}', 'calendar.amount': '金额：{amount}', 'calendar.interval': '周期：{interval}',
  'calendar.website': '官网：{url}', 'calendar.notes': '备注：{notes}', 'calendar.generated': '由 Renew404 生成',
  'calendar.summary': '续费：{name}（{amount}）', 'calendar.reminder': '续费提醒：{name}',
}

const zhTW: Messages = {
  ...zhCN,
  'launch.eyebrow': '本機優先 / 續費管理', 'launch.tagline': '週期有跡 · 續費有期',
  'category.ai-creative': 'AI 與創作', 'category.development-tools': '開發工具',
  'category.cloud-servers': '雲端服務與伺服器', 'category.domains-websites': '網域與網站',
  'category.office-productivity': '辦公與效率', 'category.storage-backup': '儲存與備份',
  'category.video-streaming': '影片與串流媒體', 'category.music-audio': '音樂與音訊',
  'category.gaming': '遊戲', 'category.social-membership': '社群與會員',
  'category.network-proxy': '網路與代理', 'category.communications': '通訊與電信商',
  'category.shopping-lifestyle': '購物與生活', 'category.finance-insurance': '金融與保險',
  'category.education-learning': '教育與學習', 'category.travel-transport': '旅行與交通',
  'category.other': '其他', 'template.generic-vps': '通用 VPS',
  'template.generic-domain': '通用網域續費', 'template.clash-subscription': 'Clash 訂閱',
  'template.vpn-service': 'VPN 服務', 'template.mobile-plan': '手機方案',
  'template.home-broadband': '家庭寬頻', 'greeting.morning': '早安',
  'greeting.afternoon': '午安', 'greeting.evening': '晚安', 'month.renewals': '{month}續費',
  'count.items': '{count} 項', 'count.records': '{count} 筆',
  'count.servicesHistory': '{services} 個服務 · {payments} 筆歷史',
  'countdown.overdue': '已逾期 {days} 天', 'countdown.today': '今天',
  'countdown.remaining': '還有 {days} 天', 'recurrence.label': '每 {value} {unit}',
  'unit.day': '天', 'unit.week': '週', 'unit.month': '個月', 'unit.year': '年',
  'preview.schedule': '下次將於 {date} {time} 提醒，之後{recurrence}續費一次。',
  'reminder.daysBefore': '{days} 天前 · {timeZone}', 'exported.at': '匯出於 {date}',
  'money.maxDecimals': '{currency} 最多支援 {digits} 位小數',
  'error.invalidDate': '無效日期：{value}',
  'error.invalidInterval': '續費週期必須是 1 到 999 之間的整數',
  'error.serviceNotFound': '服務不存在',
  'calendar.service': '服務：{name}', 'calendar.amount': '金額：{amount}', 'calendar.interval': '週期：{interval}',
  'calendar.website': '官網：{url}', 'calendar.notes': '備註：{notes}', 'calendar.generated': '由 Renew404 產生',
  'calendar.summary': '續費：{name}（{amount}）', 'calendar.reminder': '續費提醒：{name}',
}

const en: Messages = {
  'launch.eyebrow': 'LOCAL-FIRST / RENEWAL TRACKER', 'launch.tagline': 'Track every cycle. Renew on time.',
  'category.ai-creative': 'AI & Creation', 'category.development-tools': 'Development Tools',
  'category.cloud-servers': 'Cloud & Servers', 'category.domains-websites': 'Domains & Websites',
  'category.office-productivity': 'Office & Productivity', 'category.storage-backup': 'Storage & Backup',
  'category.video-streaming': 'Video & Streaming', 'category.music-audio': 'Music & Audio',
  'category.gaming': 'Gaming', 'category.social-membership': 'Social & Memberships',
  'category.network-proxy': 'Network & Proxy', 'category.communications': 'Telecom & Carriers',
  'category.shopping-lifestyle': 'Shopping & Lifestyle', 'category.finance-insurance': 'Finance & Insurance',
  'category.education-learning': 'Education & Learning', 'category.travel-transport': 'Travel & Transport',
  'category.other': 'Other', 'template.generic-vps': 'Generic VPS',
  'template.generic-domain': 'Generic Domain Renewal', 'template.clash-subscription': 'Clash Subscription',
  'template.vpn-service': 'VPN Service', 'template.mobile-plan': 'Mobile Plan',
  'template.home-broadband': 'Home Broadband', 'greeting.morning': 'Good morning',
  'greeting.afternoon': 'Good afternoon', 'greeting.evening': 'Good evening',
  'month.renewals': '{month} Renewals', 'count.items': '{count} items', 'count.records': '{count} records',
  'count.servicesHistory': '{services} services · {payments} history records',
  'countdown.overdue': '{days} days overdue', 'countdown.today': 'Today',
  'countdown.remaining': '{days} days left', 'recurrence.label': 'Every {value} {unit}',
  'unit.day': 'day(s)', 'unit.week': 'week(s)', 'unit.month': 'month(s)', 'unit.year': 'year(s)',
  'preview.schedule': 'Next reminder: {date} at {time}; renews {recurrence}.',
  'reminder.daysBefore': '{days} days before · {timeZone}', 'exported.at': 'Exported {date}',
  'money.maxDecimals': '{currency} supports up to {digits} decimal places',
  'error.invalidDate': 'Invalid date: {value}',
  'error.invalidInterval': 'The renewal interval must be an integer from 1 to 999',
  'error.serviceNotFound': 'Service not found',
  'calendar.service': 'Service: {name}', 'calendar.amount': 'Amount: {amount}', 'calendar.interval': 'Interval: {interval}',
  'calendar.website': 'Website: {url}', 'calendar.notes': 'Notes: {notes}', 'calendar.generated': 'Generated by Renew404',
  'calendar.summary': 'Renewal: {name} ({amount})', 'calendar.reminder': 'Renewal reminder: {name}',
}

const ja: Messages = {
  'launch.eyebrow': 'ローカル優先 / 更新管理', 'launch.tagline': '周期を記録 · 期限を管理',
  'category.ai-creative': 'AI・クリエイティブ', 'category.development-tools': '開発ツール',
  'category.cloud-servers': 'クラウド・サーバー', 'category.domains-websites': 'ドメイン・ウェブサイト',
  'category.office-productivity': 'オフィス・生産性', 'category.storage-backup': 'ストレージ・バックアップ',
  'category.video-streaming': '動画・ストリーミング', 'category.music-audio': '音楽・オーディオ',
  'category.gaming': 'ゲーム', 'category.social-membership': 'ソーシャル・会員',
  'category.network-proxy': 'ネットワーク・プロキシ', 'category.communications': '通信・キャリア',
  'category.shopping-lifestyle': 'ショッピング・生活', 'category.finance-insurance': '金融・保険',
  'category.education-learning': '教育・学習', 'category.travel-transport': '旅行・交通',
  'category.other': 'その他', 'template.generic-vps': '汎用 VPS',
  'template.generic-domain': '汎用ドメイン更新', 'template.clash-subscription': 'Clash サブスクリプション',
  'template.vpn-service': 'VPN サービス', 'template.mobile-plan': 'モバイルプラン',
  'template.home-broadband': 'ホームブロードバンド', 'greeting.morning': 'おはようございます',
  'greeting.afternoon': 'こんにちは', 'greeting.evening': 'こんばんは',
  'month.renewals': '{month}の更新', 'count.items': '{count} 件', 'count.records': '{count} 件',
  'count.servicesHistory': 'サービス {services} 件 · 履歴 {payments} 件',
  'countdown.overdue': '{days} 日超過', 'countdown.today': '今日',
  'countdown.remaining': 'あと {days} 日', 'recurrence.label': '{value} {unit}ごと',
  'unit.day': '日', 'unit.week': '週間', 'unit.month': 'か月', 'unit.year': '年',
  'preview.schedule': '次回は {date} {time} に通知し、以後{recurrence}更新します。',
  'reminder.daysBefore': '{days} 日前 · {timeZone}', 'exported.at': 'エクスポート日時：{date}',
  'money.maxDecimals': '{currency} は小数点以下 {digits} 桁まで対応しています',
  'error.invalidDate': '無効な日付：{value}',
  'error.invalidInterval': '更新間隔は 1〜999 の整数で入力してください',
  'error.serviceNotFound': 'サービスが見つかりません',
  'calendar.service': 'サービス：{name}', 'calendar.amount': '金額：{amount}', 'calendar.interval': '周期：{interval}',
  'calendar.website': '公式サイト：{url}', 'calendar.notes': 'メモ：{notes}', 'calendar.generated': 'Renew404 で作成',
  'calendar.summary': '更新：{name}（{amount}）', 'calendar.reminder': '更新通知：{name}',
}

const staticTranslations: Record<Exclude<AppLocale, 'zh-CN'>, Messages> = {
  'zh-TW': {
    '本月': '本月', '服务': '服務', '统计': '統計', '设置': '設定', '返回': '返回', '编辑': '編輯',
    '确认': '確認', '取消': '取消', '刷新': '重新整理', '全部': '全部', '分类': '分類', '自定义': '自訂',
    '金额': '金額', '货币': '幣別', '官网': '官網', '备注': '備註', '时区': '時區', '名称': '名稱',
    '使用中': '使用中', '已暂停': '已暫停', '已取消': '已取消', '已支付': '已支付', '已跳过': '已略過',
    '跳过': '略過', '保存': '儲存', '创建': '建立', '其他': '其他', '主导航': '主要導覽',
    '新建自定义分类': '新增自訂分類', '输入分类名称': '輸入分類名稱', '关闭提示': '關閉提示',
    '发现新版本，点击刷新': '發現新版本，點擊重新整理', '正在应用新版本…': '正在套用新版本…',
    '正在更新…': '正在更新…', '正在完成更新，请稍候…': '正在完成更新，請稍候…', '更新未完成，请重试': '更新未完成，請重試', '选择常用服务': '選擇常用服務',
    '关闭服务选择器': '關閉服務選擇器', '搜索常用服务': '搜尋常用服務',
    '搜索英文、中文或常见别名': '搜尋英文、中文或常見別名', '按分类筛选': '依分類篩選',
    '没有匹配的模板。你仍可关闭面板后完全自定义。': '沒有符合的範本。你仍可關閉面板後完全自訂。',
    '下次': '下次', '安装到 iPhone': '安裝到 iPhone', '安装为 PWA': '安裝為 PWA',
    '已作为独立应用运行': '已作為獨立應用程式執行',
    'Renew404 已从主屏幕启动，可在离线状态读取和编辑本地数据。': 'Renew404 已從主畫面啟動，可在離線狀態讀取和編輯本機資料。',
    '请使用 Safari 打开此网站。': '請使用 Safari 開啟此網站。', '点击底部“分享”按钮。': '點擊底部「分享」按鈕。',
    '选择“添加到主屏幕”，再点“添加”。': '選擇「加入主畫面」，再點「加入」。',
    '使用浏览器的“安装应用”菜单将 Renew404 添加到桌面。iPhone 请用 Safari 的“分享 → 添加到主屏幕”。': '使用瀏覽器的「安裝應用程式」選單將 Renew404 加到桌面。iPhone 請使用 Safari 的「分享 → 加入主畫面」。',
    '续费不该突然 404。': '續費不該突然 404。',
    'Renew404 在本机记录周期性续费。没有账号，没有云端，也没有付费 API。': 'Renew404 在本機記錄週期性續費。沒有帳號、沒有雲端，也沒有付費 API。',
    '数据默认只保存在此设备的 IndexedDB。': '資料預設只儲存在此裝置的 IndexedDB。',
    '建议定期导出 JSON 备份。': '建議定期匯出 JSON 備份。',
    '精确提醒通过手动导入 .ics 日历文件实现。': '精確提醒透過手動匯入 .ics 行事曆檔案實現。',
    '添加第一个服务': '新增第一個服務', '从备份恢复': '從備份還原', '新增服务': '新增服務',
    '本月计划': '本月計畫', '暂无计划': '暫無計畫', '本月已支付': '本月已支付', '暂无记录': '暫無記錄',
    '未来 7 天': '未來 7 天', '已逾期': '已逾期', '本月全部': '本月全部',
    '本月没有待续费项目': '本月沒有待續費項目', '新服务会按下一次续费日期出现在这里。': '新服務會依下一次續費日期顯示在這裡。',
    '正在读取本地账本…': '正在讀取本機帳本…', '确认本期已支付？': '確認本期已支付？',
    '确认已支付': '確認已支付', '本次金额': '本次金額', '本次日期': '本次日期', '下次日期': '下次日期',
    '全部服务': '全部服務', '搜索服务名称': '搜尋服務名稱', '状态': '狀態', '全部状态': '全部狀態',
    '全部分类': '全部分類', '没有匹配的服务': '沒有符合的服務',
    '调整筛选条件，或添加一项新的周期服务。': '調整篩選條件，或新增一項週期服務。',
    '所有金额按原始币种分别展示，不做未经授权的汇率换算。': '所有金額依原始幣別分別顯示，不進行未經授權的匯率換算。',
    '暂无': '暫無', '未来 30 天': '未來 30 天', '近 12 月实付': '近 12 個月實付', '本月按分类': '本月依分類',
    '本月没有计划支出。': '本月沒有計畫支出。', '还没有可统计的数据': '還沒有可統計的資料',
    '添加服务并记录付款后，这里会按币种展示计划与实际支出。': '新增服務並記錄付款後，這裡會依幣別顯示計畫與實際支出。',
    '编辑服务': '編輯服務', '添加服务': '新增服務', '选择常用服务（可选）': '選擇常用服務（選填）',
    '快速带入公开信息，价格、日期和账号仍由你填写。': '快速帶入公開資訊，價格、日期和帳號仍由你填寫。',
    '更换服务': '更換服務', '打开服务库': '開啟服務庫', '已应用模板': '已套用範本', '品牌色': '品牌色',
    '基本信息': '基本資訊', '名称 *': '名稱 *', '例如 ChatGPT Plus': '例如 ChatGPT Plus', '金额 *': '金額 *',
    '自定义货币符号': '自訂貨幣符號', '例如 ₿': '例如 ₿', '官网链接': '官網連結',
    '续费计划': '續費計畫', '每': '每', '周期单位': '週期單位', '天': '天', '周': '週', '个月': '個月', '年': '年',
    '下一次续费日期 *': '下一次續費日期 *', '提醒时间': '提醒時間', '提前提醒天数': '提前提醒天數',
    '用逗号分隔；0 表示当天。': '用逗號分隔；0 表示當天。', '计划预览': '計畫預覽',
    '填写日期后显示续费预览。': '填寫日期後顯示續費預覽。', '此时间仅用于提醒，不一定等于实际扣费时间。': '此時間僅用於提醒，不一定等於實際扣款時間。',
    '账号与备注': '帳號與備註', '账号提示': '帳號提示', '例如 a***@mail.com': '例如 a***@mail.com',
    '只填写脱敏信息。': '只填寫去識別化資訊。', '不要填写密码、银行卡号、CVV 或其他敏感凭证。': '不要填寫密碼、銀行卡號、CVV 或其他敏感憑證。',
    '高级自定义': '進階自訂', '图标': '圖示', '品牌 Logo': '品牌 Logo', '名称首字母': '名稱首字母',
    '自定义文字（可选）': '自訂文字（選填）', '强调色': '強調色', '正在保存…': '正在儲存…', '保存服务': '儲存服務',
    '请填写服务名称': '請填寫服務名稱', '请填写金额': '請填寫金額', '请选择下一次续费日期': '請選擇下一次續費日期',
    '周期必须是 1 到 999 的整数': '週期必須是 1 到 999 的整數', '提醒天数必须是 0 到 365 的整数': '提醒天數必須是 0 到 365 的整數',
    '官网链接必须以 http:// 或 https:// 开头': '官網連結必須以 http:// 或 https:// 開頭', '请选择分类': '請選擇分類', '保存失败': '儲存失敗',
    '下一次续费': '下一次續費', '标记已支付': '標記已支付', '跳过本期': '略過本期', '订阅信息': '訂閱資訊',
    '周期': '週期', '提醒': '提醒', '当天': '當天', '安全打开 ↗': '安全開啟 ↗', '导出此服务日历': '匯出此服務行事曆',
    '日期改变后需要重新导出；导入前请检查旧事件。': '日期變更後需要重新匯出；匯入前請檢查舊事件。',
    '历史记录': '歷史記錄', '还没有付款或跳过记录。': '還沒有付款或略過記錄。', '状态与数据': '狀態與資料',
    '恢复使用': '恢復使用', '暂停服务': '暫停服務', '恢复服务': '恢復服務', '标记为已取消（保留记录）': '標記為已取消（保留記錄）',
    '永久删除服务': '永久刪除服務', '未找到服务': '找不到服務', '返回列表': '返回列表',
    '将保存本次付款历史，并推进到下一个续费日期。': '將儲存本次付款歷史，並推進到下一個續費日期。',
    '永久删除此服务？': '永久刪除此服務？', '永久删除': '永久刪除',
    '历史付款和跳过记录也将删除，且无法恢复。如仅需停止追踪，请标记为已取消并保留记录。': '歷史付款和略過記錄也會刪除，且無法恢復。若只需停止追蹤，請標記為已取消並保留記錄。',
    '偏好': '偏好設定', '语言': '語言', '界面语言立即切换，保存后下次启动继续使用': '介面語言會立即切換，儲存後下次啟動繼續使用',
    '选择后立即切换并自动保存': '選擇後立即切換並自動儲存', '语言已自动保存在本机。': '語言已自動儲存在本機。',
    '主题': '主題', '跟随系统或固定显示': '跟隨系統或固定顯示', '跟随系统': '跟隨系統', '浅色': '淺色', '深色': '深色',
    '默认货币': '預設幣別', '新服务的初始值': '新服務的初始值', '默认时区': '預設時區',
    '提醒时间不会随旅行自动变化': '提醒時間不會隨旅行自動變更', '默认提醒天数': '預設提醒天數',
    '逗号分隔，0 表示当天': '以逗號分隔，0 表示當天', '保存偏好': '儲存偏好設定', '设置已保存在本机。': '設定已儲存在本機。',
    '备份与日历': '備份與行事曆', '已有一段时间没有备份。建议现在导出一份 JSON 并保存到“文件”。': '已有一段時間沒有備份。建議現在匯出一份 JSON 並儲存到「檔案」。',
    '导出 JSON 备份': '匯出 JSON 備份', '导入 JSON 备份': '匯入 JSON 備份', '导出全部日历事件': '匯出全部行事曆事件',
    '日历不是自动同步。建议建立专用“Renew404”日历；日期改变后请重新导出，重复导入前先检查旧事件。': '行事曆不會自動同步。建議建立專用的「Renew404」行事曆；日期變更後請重新匯出，重複匯入前先檢查舊事件。',
    '安装与隐私': '安裝與隱私', '数据只在本机': '資料只在本機',
    '删除 PWA 或清除网站数据可能导致记录丢失，请定期导出备份。不收集分析、广告或位置数据。': '刪除 PWA 或清除網站資料可能導致記錄遺失，請定期匯出備份。不收集分析、廣告或位置資料。',
    '应用版本': '應用程式版本', '危险操作': '危險操作', '清空服务、历史记录和设置。此操作无法撤销。': '清空服務、歷史記錄和設定。此操作無法復原。',
    '清空全部数据': '清空全部資料', '清空全部本地数据？': '清空全部本機資料？', '确认清空': '確認清空',
    '输入 DELETE 以继续': '輸入 DELETE 以繼續', '确认导入备份': '確認匯入備份', '合并数据': '合併資料',
    '覆盖现有数据': '覆蓋現有資料', '覆盖前会自动下载当前数据备份。合并时相同 ID 保留更新时间较新的记录。': '覆蓋前會自動下載目前資料備份。合併時，相同 ID 會保留更新時間較新的記錄。',
    '备份已生成，请保存到“文件”。': '備份已產生，請儲存到「檔案」。', '无法读取备份': '無法讀取備份',
    '已覆盖恢复；导入前备份也已下载。': '已覆蓋還原；匯入前備份也已下載。', '备份已合并。': '備份已合併。',
    '导入失败，原数据未改变。': '匯入失敗，原資料未變更。', '没有使用中的服务可导出。': '沒有使用中的服務可匯出。',
    '日历已生成。重复导入前请检查或删除旧事件。': '行事曆已產生。重複匯入前請檢查或刪除舊事件。', '全部本地数据已清空。': '全部本機資料已清空。',
    '请输入有效金额': '請輸入有效金額', '金额超出可保存范围': '金額超出可儲存範圍',
    '备份不是有效的 JSON 文件': '備份不是有效的 JSON 檔案', '备份格式无效': '備份格式無效', '未知字段': '未知欄位',
  },
  en: {
    '本月': 'Month', '服务': 'Services', '统计': 'Stats', '设置': 'Settings', '返回': 'Back', '编辑': 'Edit',
    '确认': 'Confirm', '取消': 'Cancel', '刷新': 'Refresh', '全部': 'All', '分类': 'Category', '自定义': 'Custom',
    '金额': 'Amount', '货币': 'Currency', '官网': 'Website', '备注': 'Notes', '时区': 'Time zone', '名称': 'Name',
    '使用中': 'Active', '已暂停': 'Paused', '已取消': 'Cancelled', '已支付': 'Paid', '已跳过': 'Skipped',
    '跳过': 'Skip', '保存': 'Save', '创建': 'Create', '其他': 'Other', '主导航': 'Primary navigation',
    '新建自定义分类': 'New custom category', '输入分类名称': 'Enter category name', '关闭提示': 'Dismiss',
    '发现新版本，点击刷新': 'A new version is available', '正在应用新版本…': 'Applying the new version…',
    '正在更新…': 'Updating…', '正在完成更新，请稍候…': 'Finishing the update, please wait…', '更新未完成，请重试': 'The update did not finish. Please try again.', '选择常用服务': 'Choose a popular service',
    '关闭服务选择器': 'Close service picker', '搜索常用服务': 'Search popular services',
    '搜索英文、中文或常见别名': 'Search names or common aliases', '按分类筛选': 'Filter by category',
    '没有匹配的模板。你仍可关闭面板后完全自定义。': 'No matching template. Close this panel to create a fully custom service.',
    '下次': 'Next', '安装到 iPhone': 'Install on iPhone', '安装为 PWA': 'Install as a PWA',
    '已作为独立应用运行': 'Running as a standalone app',
    'Renew404 已从主屏幕启动，可在离线状态读取和编辑本地数据。': 'Renew404 was opened from your home screen. Local data remains available offline.',
    '请使用 Safari 打开此网站。': 'Open this website in Safari.', '点击底部“分享”按钮。': 'Tap the Share button.',
    '选择“添加到主屏幕”，再点“添加”。': 'Choose “Add to Home Screen”, then tap “Add”.',
    '使用浏览器的“安装应用”菜单将 Renew404 添加到桌面。iPhone 请用 Safari 的“分享 → 添加到主屏幕”。': 'Use your browser’s install menu to add Renew404. On iPhone, use Safari: Share → Add to Home Screen.',
    '续费不该突然 404。': 'Renewals should never suddenly 404.',
    'Renew404 在本机记录周期性续费。没有账号，没有云端，也没有付费 API。': 'Renew404 tracks recurring renewals on this device. No account, no cloud, and no paid API.',
    '数据默认只保存在此设备的 IndexedDB。': 'Data stays in IndexedDB on this device by default.',
    '建议定期导出 JSON 备份。': 'Export a JSON backup regularly.',
    '精确提醒通过手动导入 .ics 日历文件实现。': 'For precise reminders, manually import the generated .ics calendar file.',
    '添加第一个服务': 'Add your first service', '从备份恢复': 'Restore from backup', '新增服务': 'Add service',
    '本月计划': 'Planned this month', '暂无计划': 'Nothing planned', '本月已支付': 'Paid this month', '暂无记录': 'No records',
    '未来 7 天': 'Next 7 days', '已逾期': 'Overdue', '本月全部': 'All this month',
    '本月没有待续费项目': 'No renewals due this month', '新服务会按下一次续费日期出现在这里。': 'New services appear here based on their next renewal date.',
    '正在读取本地账本…': 'Reading the local ledger…', '确认本期已支付？': 'Confirm this renewal was paid?',
    '确认已支付': 'Confirm paid', '本次金额': 'Amount', '本次日期': 'Due date', '下次日期': 'Next date',
    '全部服务': 'All services', '搜索服务名称': 'Search services', '状态': 'Status', '全部状态': 'All statuses',
    '全部分类': 'All categories', '没有匹配的服务': 'No matching services',
    '调整筛选条件，或添加一项新的周期服务。': 'Adjust the filters or add a recurring service.',
    '所有金额按原始币种分别展示，不做未经授权的汇率换算。': 'Amounts stay separated by their original currencies. No implicit exchange-rate conversion.',
    '暂无': 'None', '未来 30 天': 'Next 30 days', '近 12 月实付': 'Paid in last 12 months', '本月按分类': 'This month by category',
    '本月没有计划支出。': 'No planned spending this month.', '还没有可统计的数据': 'No data to analyze yet',
    '添加服务并记录付款后，这里会按币种展示计划与实际支出。': 'Add services and record payments to compare planned and actual spending by currency.',
    '编辑服务': 'Edit service', '添加服务': 'Add service', '选择常用服务（可选）': 'Choose a popular service (optional)',
    '快速带入公开信息，价格、日期和账号仍由你填写。': 'Fill public service details quickly. Price, date, and account details stay blank.',
    '更换服务': 'Change service', '打开服务库': 'Open service library', '已应用模板': 'Template applied', '品牌色': 'Brand color',
    '基本信息': 'Basic information', '名称 *': 'Name *', '例如 ChatGPT Plus': 'e.g. ChatGPT Plus', '金额 *': 'Amount *',
    '自定义货币符号': 'Custom currency symbol', '例如 ₿': 'e.g. ₿', '官网链接': 'Official website',
    '续费计划': 'Renewal schedule', '每': 'Every', '周期单位': 'Billing unit', '天': 'Day', '周': 'Week', '个月': 'Month', '年': 'Year',
    '下一次续费日期 *': 'Next renewal date *', '提醒时间': 'Reminder time', '提前提醒天数': 'Reminder days',
    '用逗号分隔；0 表示当天。': 'Separate with commas; 0 means the due date.', '计划预览': 'Schedule preview',
    '填写日期后显示续费预览。': 'Choose a date to preview the schedule.', '此时间仅用于提醒，不一定等于实际扣费时间。': 'This time is for reminders and may differ from the actual charge time.',
    '账号与备注': 'Account & notes', '账号提示': 'Account hint', '例如 a***@mail.com': 'e.g. a***@mail.com',
    '只填写脱敏信息。': 'Use masked information only.', '不要填写密码、银行卡号、CVV 或其他敏感凭证。': 'Do not enter passwords, card numbers, CVVs, or other sensitive credentials.',
    '高级自定义': 'Advanced customization', '图标': 'Icon', '品牌 Logo': 'Brand logo', '名称首字母': 'Name initial',
    '自定义文字（可选）': 'Custom text (optional)', '强调色': 'Accent color', '正在保存…': 'Saving…', '保存服务': 'Save service',
    '请填写服务名称': 'Enter a service name', '请填写金额': 'Enter an amount', '请选择下一次续费日期': 'Choose the next renewal date',
    '周期必须是 1 到 999 的整数': 'The interval must be an integer from 1 to 999', '提醒天数必须是 0 到 365 的整数': 'Reminder days must be integers from 0 to 365',
    '官网链接必须以 http:// 或 https:// 开头': 'The website URL must start with http:// or https://', '请选择分类': 'Choose a category', '保存失败': 'Could not save',
    '下一次续费': 'Next renewal', '标记已支付': 'Mark as paid', '跳过本期': 'Skip this renewal', '订阅信息': 'Subscription details',
    '周期': 'Interval', '提醒': 'Reminders', '当天': 'Due date', '安全打开 ↗': 'Open safely ↗', '导出此服务日历': 'Export this service calendar',
    '日期改变后需要重新导出；导入前请检查旧事件。': 'Export again after changing the date. Check existing events before importing.',
    '历史记录': 'History', '还没有付款或跳过记录。': 'No payment or skipped-renewal history yet.', '状态与数据': 'Status & data',
    '恢复使用': 'Resume service', '暂停服务': 'Pause service', '恢复服务': 'Restore service', '标记为已取消（保留记录）': 'Mark as cancelled (keep records)',
    '永久删除服务': 'Delete service permanently', '未找到服务': 'Service not found', '返回列表': 'Back to list',
    '将保存本次付款历史，并推进到下一个续费日期。': 'This records the payment and advances the next renewal date.',
    '永久删除此服务？': 'Delete this service permanently?', '永久删除': 'Delete permanently',
    '历史付款和跳过记录也将删除，且无法恢复。如仅需停止追踪，请标记为已取消并保留记录。': 'Payment and skipped-renewal history will also be deleted and cannot be restored. To stop tracking only, mark the service as cancelled and keep its records.',
    '偏好': 'Preferences', '语言': 'Language', '界面语言立即切换，保存后下次启动继续使用': 'The interface changes immediately. Save to keep this language for future launches.',
    '选择后立即切换并自动保存': 'Switches immediately and saves automatically', '语言已自动保存在本机。': 'Language saved automatically on this device.',
    '主题': 'Theme', '跟随系统或固定显示': 'Follow the system or use a fixed theme', '跟随系统': 'System', '浅色': 'Light', '深色': 'Dark',
    '默认货币': 'Default currency', '新服务的初始值': 'Initial value for new services', '默认时区': 'Default time zone',
    '提醒时间不会随旅行自动变化': 'Reminder times do not change automatically while travelling', '默认提醒天数': 'Default reminder days',
    '逗号分隔，0 表示当天': 'Comma-separated; 0 means the due date', '保存偏好': 'Save preferences', '设置已保存在本机。': 'Settings saved on this device.',
    '备份与日历': 'Backup & calendar', '已有一段时间没有备份。建议现在导出一份 JSON 并保存到“文件”。': 'It has been a while since your last backup. Export a JSON file now and keep it somewhere safe.',
    '导出 JSON 备份': 'Export JSON backup', '导入 JSON 备份': 'Import JSON backup', '导出全部日历事件': 'Export all calendar events',
    '日历不是自动同步。建议建立专用“Renew404”日历；日期改变后请重新导出，重复导入前先检查旧事件。': 'The calendar is not synced automatically. Use a dedicated Renew404 calendar, export again after date changes, and check existing events before importing.',
    '安装与隐私': 'Install & privacy', '数据只在本机': 'Data stays on this device',
    '删除 PWA 或清除网站数据可能导致记录丢失，请定期导出备份。不收集分析、广告或位置数据。': 'Removing the PWA or clearing site data may erase records. Export backups regularly. Renew404 collects no analytics, ads, or location data.',
    '应用版本': 'App version', '危险操作': 'Danger zone', '清空服务、历史记录和设置。此操作无法撤销。': 'Erase services, history, and settings. This cannot be undone.',
    '清空全部数据': 'Erase all data', '清空全部本地数据？': 'Erase all local data?', '确认清空': 'Confirm erase',
    '输入 DELETE 以继续': 'Type DELETE to continue', '确认导入备份': 'Confirm backup import', '合并数据': 'Merge data',
    '覆盖现有数据': 'Replace existing data', '覆盖前会自动下载当前数据备份。合并时相同 ID 保留更新时间较新的记录。': 'A safety backup is downloaded before replacement. During merge, the newer record wins when IDs match.',
    '备份已生成，请保存到“文件”。': 'Backup created. Save the JSON file somewhere safe.', '无法读取备份': 'Could not read the backup',
    '已覆盖恢复；导入前备份也已下载。': 'Restore complete. A safety backup was also downloaded.', '备份已合并。': 'Backup merged.',
    '导入失败，原数据未改变。': 'Import failed. Existing data was not changed.', '没有使用中的服务可导出。': 'There are no active services to export.',
    '日历已生成。重复导入前请检查或删除旧事件。': 'Calendar created. Check or delete old events before importing again.', '全部本地数据已清空。': 'All local data has been erased.',
    '请输入有效金额': 'Enter a valid amount', '金额超出可保存范围': 'The amount is too large to save',
    '备份不是有效的 JSON 文件': 'The backup is not valid JSON', '备份格式无效': 'Invalid backup format', '未知字段': 'unknown field',
  },
  ja: {
    '本月': '今月', '服务': 'サービス', '统计': '統計', '设置': '設定', '返回': '戻る', '编辑': '編集',
    '确认': '確認', '取消': 'キャンセル', '刷新': '更新', '全部': 'すべて', '分类': 'カテゴリー', '自定义': 'カスタム',
    '金额': '金額', '货币': '通貨', '官网': '公式サイト', '备注': 'メモ', '时区': 'タイムゾーン', '名称': '名前',
    '使用中': '利用中', '已暂停': '一時停止', '已取消': 'キャンセル済み', '已支付': '支払済み', '已跳过': 'スキップ済み',
    '跳过': 'スキップ', '保存': '保存', '创建': '作成', '其他': 'その他', '主导航': 'メインナビゲーション',
    '新建自定义分类': 'カスタムカテゴリーを作成', '输入分类名称': 'カテゴリー名を入力', '关闭提示': '閉じる',
    '发现新版本，点击刷新': '新しいバージョンがあります', '正在应用新版本…': '新しいバージョンを適用中…',
    '正在更新…': '更新中…', '正在完成更新，请稍候…': '更新を完了しています。しばらくお待ちください…', '更新未完成，请重试': '更新が完了しませんでした。もう一度お試しください。', '选择常用服务': 'よく使うサービスを選択',
    '关闭服务选择器': 'サービス選択を閉じる', '搜索常用服务': 'サービスを検索',
    '搜索英文、中文或常见别名': '名前・別名で検索', '按分类筛选': 'カテゴリーで絞り込む',
    '没有匹配的模板。你仍可关闭面板后完全自定义。': '一致するテンプレートがありません。閉じてカスタムサービスを作成できます。',
    '下次': '次回', '安装到 iPhone': 'iPhone にインストール', '安装为 PWA': 'PWA としてインストール',
    '已作为独立应用运行': 'スタンドアロンアプリとして実行中',
    'Renew404 已从主屏幕启动，可在离线状态读取和编辑本地数据。': 'Renew404 はホーム画面から起動されています。ローカルデータはオフラインでも利用できます。',
    '请使用 Safari 打开此网站。': 'Safari でこのサイトを開いてください。', '点击底部“分享”按钮。': '共有ボタンをタップします。',
    '选择“添加到主屏幕”，再点“添加”。': '「ホーム画面に追加」を選び、「追加」をタップします。',
    '使用浏览器的“安装应用”菜单将 Renew404 添加到桌面。iPhone 请用 Safari 的“分享 → 添加到主屏幕”。': 'ブラウザのインストールメニューから Renew404 を追加します。iPhone では Safari の「共有 → ホーム画面に追加」を使用してください。',
    '续费不该突然 404。': '更新を突然 404 にしない。',
    'Renew404 在本机记录周期性续费。没有账号，没有云端，也没有付费 API。': 'Renew404 は定期更新をこの端末に記録します。アカウント、クラウド、有料 API は不要です。',
    '数据默认只保存在此设备的 IndexedDB。': 'データは既定でこの端末の IndexedDB のみに保存されます。',
    '建议定期导出 JSON 备份。': 'JSON バックアップを定期的にエクスポートしてください。',
    '精确提醒通过手动导入 .ics 日历文件实现。': '正確な通知には、生成した .ics カレンダーを手動で読み込みます。',
    '添加第一个服务': '最初のサービスを追加', '从备份恢复': 'バックアップから復元', '新增服务': 'サービスを追加',
    '本月计划': '今月の予定', '暂无计划': '予定なし', '本月已支付': '今月の支払済み', '暂无记录': '記録なし',
    '未来 7 天': '今後 7 日間', '已逾期': '期限超過', '本月全部': '今月のすべて',
    '本月没有待续费项目': '今月の更新予定はありません', '新服务会按下一次续费日期出现在这里。': '新しいサービスは次回更新日に基づいてここに表示されます。',
    '正在读取本地账本…': 'ローカル台帳を読み込み中…', '确认本期已支付？': '今回の支払いを確認しますか？',
    '确认已支付': '支払済みにする', '本次金额': '今回の金額', '本次日期': '今回の日付', '下次日期': '次回の日付',
    '全部服务': 'すべてのサービス', '搜索服务名称': 'サービスを検索', '状态': 'ステータス', '全部状态': 'すべてのステータス',
    '全部分类': 'すべてのカテゴリー', '没有匹配的服务': '一致するサービスがありません',
    '调整筛选条件，或添加一项新的周期服务。': 'フィルターを変更するか、定期サービスを追加してください。',
    '所有金额按原始币种分别展示，不做未经授权的汇率换算。': '金額は元の通貨ごとに表示し、無断で為替換算しません。',
    '暂无': 'なし', '未来 30 天': '今後 30 日間', '近 12 月实付': '直近 12 か月の支払額', '本月按分类': '今月のカテゴリー別',
    '本月没有计划支出。': '今月の支出予定はありません。', '还没有可统计的数据': '集計できるデータがありません',
    '添加服务并记录付款后，这里会按币种展示计划与实际支出。': 'サービスと支払いを記録すると、通貨別の予定額と実績額を確認できます。',
    '编辑服务': 'サービスを編集', '添加服务': 'サービスを追加', '选择常用服务（可选）': 'よく使うサービスを選択（任意）',
    '快速带入公开信息，价格、日期和账号仍由你填写。': '公開情報をすばやく入力します。価格、日付、アカウント情報は空欄のままです。',
    '更换服务': 'サービスを変更', '打开服务库': 'サービス一覧を開く', '已应用模板': 'テンプレート適用済み', '品牌色': 'ブランドカラー',
    '基本信息': '基本情報', '名称 *': '名前 *', '例如 ChatGPT Plus': '例：ChatGPT Plus', '金额 *': '金額 *',
    '自定义货币符号': 'カスタム通貨記号', '例如 ₿': '例：₿', '官网链接': '公式サイト URL',
    '续费计划': '更新スケジュール', '每': '間隔', '周期单位': '単位', '天': '日', '周': '週', '个月': 'か月', '年': '年',
    '下一次续费日期 *': '次回更新日 *', '提醒时间': '通知時刻', '提前提醒天数': '事前通知日数',
    '用逗号分隔；0 表示当天。': 'カンマ区切り。0 は当日です。', '计划预览': 'スケジュール確認',
    '填写日期后显示续费预览。': '日付を選ぶと更新予定を表示します。', '此时间仅用于提醒，不一定等于实际扣费时间。': 'この時刻は通知専用で、実際の決済時刻とは限りません。',
    '账号与备注': 'アカウント・メモ', '账号提示': 'アカウントのヒント', '例如 a***@mail.com': '例：a***@mail.com',
    '只填写脱敏信息。': 'マスクした情報のみ入力してください。', '不要填写密码、银行卡号、CVV 或其他敏感凭证。': 'パスワード、カード番号、CVV などの機密情報は入力しないでください。',
    '高级自定义': '詳細カスタマイズ', '图标': 'アイコン', '品牌 Logo': 'ブランドロゴ', '名称首字母': '名前の頭文字',
    '自定义文字（可选）': 'カスタム文字（任意）', '强调色': 'アクセントカラー', '正在保存…': '保存中…', '保存服务': 'サービスを保存',
    '请填写服务名称': 'サービス名を入力してください', '请填写金额': '金額を入力してください', '请选择下一次续费日期': '次回更新日を選択してください',
    '周期必须是 1 到 999 的整数': '間隔は 1〜999 の整数にしてください', '提醒天数必须是 0 到 365 的整数': '通知日数は 0〜365 の整数にしてください',
    '官网链接必须以 http:// 或 https:// 开头': '公式サイト URL は http:// または https:// で始めてください', '请选择分类': 'カテゴリーを選択してください', '保存失败': '保存できませんでした',
    '下一次续费': '次回更新', '标记已支付': '支払済みにする', '跳过本期': '今回はスキップ', '订阅信息': 'サブスクリプション情報',
    '周期': '周期', '提醒': '通知', '当天': '当日', '安全打开 ↗': '安全に開く ↗', '导出此服务日历': 'このサービスのカレンダーを書き出す',
    '日期改变后需要重新导出；导入前请检查旧事件。': '日付変更後は再度書き出してください。読み込み前に既存イベントを確認してください。',
    '历史记录': '履歴', '还没有付款或跳过记录。': '支払いまたはスキップの履歴はまだありません。', '状态与数据': 'ステータス・データ',
    '恢复使用': '利用を再開', '暂停服务': 'サービスを一時停止', '恢复服务': 'サービスを復元', '标记为已取消（保留记录）': '解約済みにする（記録を保持）',
    '永久删除服务': 'サービスを完全に削除', '未找到服务': 'サービスが見つかりません', '返回列表': '一覧に戻る',
    '将保存本次付款历史，并推进到下一个续费日期。': '今回の支払いを記録し、次回更新日を進めます。',
    '永久删除此服务？': 'このサービスを完全に削除しますか？', '永久删除': '完全に削除',
    '历史付款和跳过记录也将删除，且无法恢复。如仅需停止追踪，请标记为已取消并保留记录。': '支払い・スキップ履歴も削除され、復元できません。追跡のみ停止する場合は、解約済みにして記録を保持してください。',
    '偏好': '環境設定', '语言': '言語', '界面语言立即切换，保存后下次启动继续使用': '表示言語はすぐに切り替わります。保存すると次回起動時も使用されます。',
    '选择后立即切换并自动保存': '選択後すぐに切り替わり、自動保存されます', '语言已自动保存在本机。': '言語をこの端末に自動保存しました。',
    '主题': 'テーマ', '跟随系统或固定显示': 'システムに合わせるか固定テーマを使用', '跟随系统': 'システム', '浅色': 'ライト', '深色': 'ダーク',
    '默认货币': '既定の通貨', '新服务的初始值': '新しいサービスの初期値', '默认时区': '既定のタイムゾーン',
    '提醒时间不会随旅行自动变化': '旅行中も通知時刻は自動変更されません', '默认提醒天数': '既定の通知日数',
    '逗号分隔，0 表示当天': 'カンマ区切り。0 は当日', '保存偏好': '設定を保存', '设置已保存在本机。': '設定をこの端末に保存しました。',
    '备份与日历': 'バックアップ・カレンダー', '已有一段时间没有备份。建议现在导出一份 JSON 并保存到“文件”。': '前回のバックアップから時間が経っています。JSON を書き出して安全な場所に保存してください。',
    '导出 JSON 备份': 'JSON バックアップを書き出す', '导入 JSON 备份': 'JSON バックアップを読み込む', '导出全部日历事件': 'すべてのカレンダー予定を書き出す',
    '日历不是自动同步。建议建立专用“Renew404”日历；日期改变后请重新导出，重复导入前先检查旧事件。': 'カレンダーは自動同期されません。Renew404 専用カレンダーを作成し、日付変更後は再度書き出してください。再読み込み前に既存イベントを確認してください。',
    '安装与隐私': 'インストール・プライバシー', '数据只在本机': 'データはこの端末のみ',
    '删除 PWA 或清除网站数据可能导致记录丢失，请定期导出备份。不收集分析、广告或位置数据。': 'PWA の削除やサイトデータの消去で記録を失う場合があります。定期的にバックアップしてください。分析、広告、位置情報は収集しません。',
    '应用版本': 'アプリバージョン', '危险操作': '危険な操作', '清空服务、历史记录和设置。此操作无法撤销。': 'サービス、履歴、設定を消去します。この操作は元に戻せません。',
    '清空全部数据': 'すべてのデータを消去', '清空全部本地数据？': 'すべてのローカルデータを消去しますか？', '确认清空': '消去を確認',
    '输入 DELETE 以继续': '続行するには DELETE と入力', '确认导入备份': 'バックアップ読み込みを確認', '合并数据': 'データを統合',
    '覆盖现有数据': '既存データを置換', '覆盖前会自动下载当前数据备份。合并时相同 ID 保留更新时间较新的记录。': '置換前に現在のデータを自動でバックアップします。統合時、同じ ID は更新日時が新しい記録を残します。',
    '备份已生成，请保存到“文件”。': 'バックアップを作成しました。安全な場所に保存してください。', '无法读取备份': 'バックアップを読み込めません',
    '已覆盖恢复；导入前备份也已下载。': '復元が完了しました。読み込み前のバックアップも保存しました。', '备份已合并。': 'バックアップを統合しました。',
    '导入失败，原数据未改变。': '読み込みに失敗しました。既存データは変更されていません。', '没有使用中的服务可导出。': '書き出せる利用中のサービスがありません。',
    '日历已生成。重复导入前请检查或删除旧事件。': 'カレンダーを作成しました。再読み込み前に既存イベントを確認または削除してください。', '全部本地数据已清空。': 'すべてのローカルデータを消去しました。',
    '请输入有效金额': '有効な金額を入力してください', '金额超出可保存范围': '保存できる金額の範囲を超えています',
    '备份不是有效的 JSON 文件': 'バックアップは有効な JSON ではありません', '备份格式无效': 'バックアップ形式が無効です', '未知字段': '不明なフィールド',
  },
}

const dictionaries: Record<AppLocale, Messages> = {
  'zh-CN': zhCN,
  'zh-TW': { ...zhTW, ...staticTranslations['zh-TW'] },
  en: { ...en, ...staticTranslations.en },
  ja: { ...ja, ...staticTranslations.ja },
}

const currentLocale = ref<AppLocale>('zh-CN')

export function detectSystemLocale(
  languages: readonly string[] = typeof navigator === 'undefined'
    ? []
    : navigator.languages?.length
      ? navigator.languages
      : [navigator.language],
): AppLocale {
  for (const language of languages) {
    const normalized = language.toLowerCase()
    if (/^zh(?:-|$)/.test(normalized)) {
      return /(?:hant|tw|hk|mo)/.test(normalized) ? 'zh-TW' : 'zh-CN'
    }
    if (/^ja(?:-|$)/.test(normalized)) return 'ja'
    if (/^en(?:-|$)/.test(normalized)) return 'en'
  }
  return 'zh-CN'
}

function interpolate(message: string, params: Params): string {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`))
}

export function t(key: string, params: Params = {}): string {
  const message = dictionaries[currentLocale.value][key] ?? zhCN[key] ?? key
  return interpolate(message, params)
}

export function hasTranslation(key: string, locale: AppLocale): boolean {
  return locale === 'zh-CN' || dictionaries[locale][key] !== undefined
}

export function setLocale(locale: AppLocale) {
  currentLocale.value = locale
  document.documentElement.lang = locale
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n
    if (key) element.textContent = t(key)
  })
}

export function useI18n() {
  return { locale: readonly(currentLocale), t, setLocale }
}

export function getLocale(): AppLocale {
  return currentLocale.value
}

export function localizedCategoryName(category?: Pick<ServiceCategory, 'id' | 'name' | 'isSystem'>): string {
  if (!category) return ''
  return category.isSystem ? t(`category.${category.id}`) : category.name
}

const localizedTemplateIds = new Set([
  'generic-vps', 'generic-domain', 'clash-subscription', 'vpn-service', 'mobile-plan', 'home-broadband',
])

export function localizedTemplateName(id: string, fallback: string): string {
  return localizedTemplateIds.has(id) ? t(`template.${id}`) : fallback
}

export function formatLocalizedDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(currentLocale.value, {
    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function formatLocalizedDateTime(value: string | Date): string {
  return new Intl.DateTimeFormat(currentLocale.value, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function formatLocalizedMonth(value: string): string {
  const [year, month] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(currentLocale.value, { timeZone: 'UTC', month: 'long' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
}
