# Privacy

[简体中文](#简体中文) · [English](#english)

## 简体中文

Renew404 是本地优先应用。服务、金额、续费日期、付款记录、分类和设置均保存在当前浏览器的 IndexedDB 中。应用不包含账号系统、云同步、广告、分析追踪、在线 Logo API 或第三方数据上传功能。

使用公开演示站或自行部署时，Web 服务器、CDN、DNS 或网络服务商仍可能按其配置记录常规请求信息，例如 IP 地址、User-Agent、访问时间和请求路径。这些基础设施日志不包含 Renew404 保存在 IndexedDB 中的订阅记录。自行部署者应按自己的隐私政策配置和管理服务器日志。

JSON 备份和 `.ics` 日历文件仅在用户主动导出时生成。之后如何保存、分享或导入这些文件由用户控制。删除 PWA、清除站点数据或浏览器存储空间回收都可能删除本地记录，请定期保存 JSON 备份。

## English

Renew404 is local-first. Services, prices, renewal dates, payment history, categories, and settings are stored in IndexedDB in the current browser. The app has no account system, cloud sync, advertising, analytics, online logo API, or third-party record upload.

When using the public demo or a self-hosted deployment, the web server, CDN, DNS provider, or network provider may still retain ordinary request metadata according to its configuration, such as IP address, user agent, access time, and request path. These infrastructure logs do not contain the subscription records stored by Renew404 in IndexedDB. Self-hosters are responsible for configuring and disclosing their own server logging.

JSON backups and `.ics` calendar files are generated only after a user explicitly exports them. The user controls where those files are stored, shared, and imported. Removing the PWA, clearing site data, or browser storage eviction can delete local records, so regular JSON backups are recommended.
