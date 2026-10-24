// Copy for the bilingual support page (/support/), Chinese first, English second.
// Facts follow the first App Store release's verified behaviour; keep answers within them.
// Contact is the existing CHEKUSU company form and its public postal address. No email inbox
// is published here and no reply time is promised.

export const SUPPORT = {
  path: '/support/',
  title: '支持与帮助 / Support — Dropack',
  description: 'Dropack 常见问题与联系方式。Dropack answers to common questions, and how to contact support.',
  skip: '跳到正文 / Skip to content',
  navAria: '页面导航 / Site',
  nav: { home: '首页 / Home', privacy: '隐私 / Privacy' },
  heading: { zh: '支持与帮助', en: 'Support' },
  intro: {
    zh: '需要帮忙？先看看下面的常见问题。仍有疑问，可以通过 CHEKUSU 的联系表单告诉我们。',
    en: 'Need a hand? Start with the answers below. For more help, reach us through the CHEKUSU contact form.',
  },
  contact: {
    title: { zh: '联系支持', en: 'Contact support' },
    url: 'https://chekusu.com/#contact',
    cta: '联系支持 / Contact support',
    note: {
      zh: '打开 chekusu.com 上的 CHEKUSU 联系表单。',
      en: 'Opens the CHEKUSU contact form on chekusu.com.',
    },
    context: {
      zh: '请在留言中写明 Dropack、设备型号、系统版本，以及遇到问题前的操作步骤。无需发送私人照片或完整视频。',
      en: 'Mention Dropack, your device model, OS version, and the steps that led to the issue. You do not need to send private photos or full videos.',
    },
    company: 'chekusu Inc.',
    address: {
      ja: '〒106-0044 東京都港区東麻布2-35-1 KCビル 6F 19号室',
      en: 'Higashiazabu 2-35-1, KC Bldg 6F #19, Minato-ku, Tokyo 106-0044, Japan',
    },
  },
  faqTitle: { zh: '常见问题', en: 'Questions and answers' },
  faq: [
    {
      "q": {
        "zh": "发送照片和视频",
        "en": "Send photos and videos"
      },
      "a": {
        "zh": "在首页点“发送”，从“相册”或“文件”选择素材。选好后进入分享相册页面，可以查看缩略图、修改名称，再用右上角的分享按钮打包并打开系统分享面板，选择 AirDrop 和接收设备。默认发送 .dropack 包，也可导出普通 ZIP。",
        "en": "Tap Send on the home screen, then choose Album or Files. Your selection opens as a shared album, where you can preview items and rename it. Use the share button at the top right to prepare the package and open the system share sheet, then choose AirDrop and the recipient. The default is a .dropack package; standard ZIP export is also available."
      }
    },
    {
      "q": {
        "zh": "收取分享相册或文件",
        "en": "Receive a shared album or file"
      },
      "a": {
        "zh": "在首页点“收取”，直接从系统“文件”中选择。有效的 Dropack 分享包会打开分享相册，点“同步到相册”开始保存；普通 ZIP、文件夹、照片或视频会打开一次性导入任务，点“保存到相册”，不会加入“收到的”分享相册列表。AirDrop 接收后若系统先显示文件预览，请选择“在 Dropack 中打开”，或从分享菜单选择 Dropack。",
        "en": "Tap Receive on the home screen to open the system Files picker. A valid Dropack shared package opens its album; tap Sync to Photos to save it. An ordinary ZIP, folder, photo or video opens a one-time import; tap Save to Photos. It does not become an album in Received. If AirDrop opens a file preview first, choose Open in Dropack or select Dropack from the share menu."
      }
    },
    {
      "q": {
        "zh": "暂停与继续",
        "en": "Pause and resume"
      },
      "a": {
        "zh": "可以暂停打包和相册导入任务。安全暂停会等正在提交的相册项目完成；确认保存的项目会保留进度。ZIP 未完成的条目需重新解压，存入相册的单个视频由系统整项提交。Dropack 无法续传 AirDrop，也无法从半个视频继续写入相册。",
        "en": "Packaging and import tasks can be paused. A safe pause waits for an active Photos save to finish, and keeps confirmed completed items. An unfinished ZIP entry is extracted again; Photos saves each video as a whole asset. Dropack cannot resume an AirDrop transfer or continue writing half a video into Photos."
      }
    },
    {
      "q": {
        "zh": "相机素材与外置存储",
        "en": "Camera media and external drives"
      },
      "a": {
        "zh": "把 U 盘或读卡器接好后，点首页“收取”，在系统“文件”中选择外置盘上的素材或文件夹。可导入系统支持的照片、视频、文件夹或未加密 ZIP；原文件保留，目标是设备的照片图库，不是解压到 U 盘。请保持连接，并为临时文件和新增相册内容预留空间。",
        "en": "Connect a USB drive or card reader, tap Receive, then choose its media or a folder in the system Files picker. Import supported photos, videos, folders or unencrypted ZIP files into the device’s Photos library. Source files are kept; this does not extract files onto the drive. Keep it connected and leave room for temporary files and new Photos items."
      }
    },
    {
      "q": {
        "zh": "再次分享与本地管理",
        "en": "Share again and manage albums"
      },
      "a": {
        "zh": "首页“分享相册”分为“我分享的”和“收到的”，可以查看缩略图和管理本地记录。允许完整照片访问后，分享相册可关联到系统“照片”中的普通相册；在系统相册中新增内容后，重新打开并分享可更新包。接收端会按内容核对之前经 Dropack 确认保存的项目，避免重复保存；这不是全图库的相似照片搜索。",
        "en": "Shared albums on the home screen has My albums and Received tabs, with previews and local management. With full Photos access, an album can link to an ordinary album in Photos. After adding media there, reopen and share it to update the package. The receiver checks content against items previously confirmed saved by Dropack to avoid saving them again. This is not a library-wide search for visually similar photos."
      }
    },
    {
      "q": {
        "zh": "语言、外观与更新",
        "en": "Language, appearance and updates"
      },
      "a": {
        "zh": "首页右上角“设置”可切换 16 种语言，选择跟随系统、浅色或深色外观。“检查更新”由你主动发起，向 Apple 查询设备所设地区的 App Store 版本；该地区未上架时无法确认更新。TestFlight 版本会打开 TestFlight 检查测试版更新。",
        "en": "Open Settings at the top right of the home screen to choose from 16 languages, or use System, Light or Dark appearance. Check for updates is a manual query to Apple for the App Store version in your device’s region. If the app is not listed there, an update cannot be confirmed. TestFlight versions open TestFlight to check for beta updates."
      }
    },
    {
      "q": {
        "zh": "中断或失败的项目",
        "en": "Interrupted or failed items"
      },
      "a": {
        "zh": "请保持 App 在前台，确认相册权限、设备可用空间和原文件访问正常后继续。待核对项目可能在中断前已保存，请先查看相册，再决定是否重试。不要为了重试而先清除仍有用的进度。",
        "en": "Keep the app in the foreground and check Photos permission, free storage and access to the source before continuing. An item marked for review may already have been saved before an interruption; check Photos before retrying it. Keep useful progress records instead of clearing them just to retry."
      }
    }
  ],
  privacy: {
    zh: { text: '本机处理，无需账号。', link: '隐私说明', href: '/privacy/' },
    en: { text: 'Processed on your device. No account required.', link: 'Privacy policy', href: '/en/privacy/' },
  },
  back: { zh: '返回首页', en: 'Back to home' },
  footer: {
    trademark: {
      zh: 'iPhone、AirDrop（隔空投送）和 iCloud 是 Apple Inc. 的商标。Dropack 与 Apple 没有关联。',
      en: 'iPhone, AirDrop and iCloud are trademarks of Apple Inc. Dropack is not affiliated with Apple.',
    },
    siteSource: '网站源代码 / Website source',
    top: '回到顶部 / Back to top',
  },
};
