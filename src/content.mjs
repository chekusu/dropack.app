// Copy for the privacy pages and the 404 page (zh and en). The landing pages are in src/landing.mjs.
// Product facts follow the current internal-testing build; keep claims within them:
// Dropack packs and imports, Apple's AirDrop moves the bytes.

// The site's public origin, used for canonical, hreflang and Open Graph URLs. Set DROPACK_SITE_URL
// when you deploy your own copy (for example https://example.com).
export const SITE = (process.env.DROPACK_SITE_URL || 'https://dropack.app').replace(/\/+$/, '');
export const UPDATED = '2026-10-12';
const PRIVACY_UPDATED = '2026-10-14';

export const locales = {
  zh: {
    lang: 'zh-CN',
    ogLocale: 'zh_CN',
    base: '/',
    other: 'en',
    switchLabel: 'English',
    switchAria: 'Switch to English',
    skip: '跳到正文',
    nav: { how: '怎么用', notes: '写在前面', privacy: '隐私' },
    navAria: '页面导航',
    hero: {
      title: ['整批照片，一次 AirDrop。'],
      figure: '示意图：照片和视频被装进一个包裹',
    },
    footer: {
      trademark: 'iPhone、AirDrop（隔空投送）和 iCloud 是 Apple Inc. 的商标。Dropack 与 Apple 没有关联。',
      privacy: '隐私说明',
      siteSource: '网站源代码',
      top: '回到顶部',
    },
    privacyPage: {
      title: '隐私说明 — Dropack',
      description: 'Dropack 应用和 dropack.app 网站会处理哪些数据，又不会处理哪些数据。',
      heading: '隐私说明',
      updated: `更新于 ${PRIVACY_UPDATED}`,
      intro: "这份说明覆盖 Dropack iPhone、iPad 应用和你正在看的 dropack.app 网站。",
      back: '返回首页',
      sections: [
        {
          "title": "在你的设备上处理",
          "items": [
            "打包、解压和存入照片图库都在你的设备上完成。Dropack 不会把你的照片或视频上传到 Dropack 的服务器，也不需要注册或登录账号。应用不包含广告或第三方分析 SDK。",
            "你可以通过系统选择器提供照片、视频、文件或文件夹。存入照片图库需要相应的“照片”权限；关联和更新系统相册需要完整照片访问。使用系统照片选择器不要求开放整个图库。",
            "应用在本机保留你创建的分享包、缩略图、任务进度和已保存项目的内容校验信息，便于继续任务并避免重复保存。相关的系统照片标识、所选文件的访问记录，以及语言和外观偏好也保存在本机。",
            "你主动分享的包可能保留原文件中的拍摄日期、位置等元数据。请只向你愿意分享这些内容的人发送。"
          ]
        },
        {
          "title": "会涉及 Apple 的部分",
          "items": [
            "如果原片只保存在 iCloud 照片中，系统会先从 Apple 下载原片。系统“文件”中的 iCloud 或其他存储提供方也可能需要联网读取你选择的文件。",
            "通过系统分享面板和 AirDrop 发送文件、在“照片”中保存和同步内容，都由系统及相应服务处理，适用这些服务的隐私政策。",
            "只有当你主动点“检查更新”时，应用才向 Apple 的 App Store 查询接口发送 Dropack 的应用编号和设备设置的地区代码。Apple 会收到普通 HTTP 请求信息，例如 IP 地址。此请求不包含你的照片、视频、文件列表或照片标识；已安装版本在本机比较。",
            "TestFlight 版本的更新入口会打开 TestFlight，由 Apple 管理测试版更新。"
          ]
        },
        {
          "title": "这个网站与支持联系",
          "items": [
            "dropack.app 是一个静态网站：不使用统计分析，不设 Cookie，不嵌入第三方内容，也没有表单。",
            "网站托管在 Cloudflare。和访问任何网站一样，你的浏览器会发出普通的 HTTP 请求，托管服务会因此收到 IP 地址、请求的网址和浏览器信息等，并可能按其政策保留日志。我们不会用这些信息识别你。",
            "支持页的联系按钮会打开 CHEKUSU 公司网站的表单。你在那里主动提交的联系信息和问题描述由该网站处理；请勿提交不必要的私人照片或完整视频。"
          ]
        }
      ],
      changes: '如果应用或网站的做法有变化，我们会更新这份说明和上面的日期。',
    },
    notFound: {
      title: '找不到这个页面 — Dropack',
      heading: '这个包裹是空的。',
      body: '你要找的页面不存在，或者已经搬走了。',
      home: '返回首页',
    },
  },

  en: {
    lang: 'en',
    ogLocale: 'en_US',
    base: '/en/',
    other: 'zh',
    switchLabel: '中文',
    switchAria: '切换到中文',
    skip: 'Skip to content',
    nav: { how: 'How it works', notes: 'Good to know', privacy: 'Privacy' },
    navAria: 'Page sections',
    hero: {
      title: ['Many photos, one AirDrop.'],
      figure: 'Illustration: photos and videos going into one package',
    },
    footer: {
      trademark: 'iPhone, AirDrop and iCloud are trademarks of Apple Inc. Dropack is not affiliated with Apple.',
      privacy: 'Privacy notes',
      siteSource: 'Website source',
      top: 'Back to top',
    },
    privacyPage: {
      title: 'Privacy notes — Dropack',
      description: 'What the Dropack app and the dropack.app website handle, and what they don’t.',
      heading: 'Privacy notes',
      updated: `Updated ${PRIVACY_UPDATED}`,
      intro: "These notes cover the Dropack app for iPhone and iPad and the dropack.app website you’re reading.",
      back: 'Back to home',
      sections: [
        {
          "title": "Processing on your device",
          "items": [
            "Packing, extracting and saving to Photos happen on your device. Dropack does not upload your photos or videos to Dropack servers, and no account is required. The app has no ads or third-party analytics SDKs.",
            "You choose photos, videos, files or folders through system pickers. Saving to Photos needs the relevant Photos permission; linking and updating an album in Photos needs full Photos access. Using the system photo picker does not require access to your entire library.",
            "The app keeps your created packages, previews, task progress and content checks for saved items on your device, so tasks can resume and avoid duplicate saves. Related Photos identifiers, access records for selected files, and language and appearance preferences are also stored locally.",
            "Packages you choose to share may retain the original files’ metadata, such as capture dates and locations. Send them only to people with whom you want to share that information."
          ]
        },
        {
          "title": "Where Apple is involved",
          "items": [
            "If an original is only in iCloud Photos, the system downloads it from Apple. iCloud or other storage providers in Files may also need a network connection to read the files you select.",
            "Sending files through the system share sheet and AirDrop, and saving or syncing content in Photos, are handled by the system and the relevant services under their privacy policies.",
            "Only when you tap Check for updates does the app send Dropack’s app identifier and the region code from your device settings to Apple’s App Store lookup service. Apple receives ordinary HTTP request information, such as your IP address. This request contains no photos, videos, file lists or Photos identifiers; the installed version is compared locally.",
            "In a TestFlight version, the update button opens TestFlight, where Apple manages beta updates."
          ]
        },
        {
          "title": "This website and support",
          "items": [
            "dropack.app is a static website: no analytics, no cookies, no third-party embeds and no forms.",
            "It is hosted on Cloudflare. As with any website, your browser sends ordinary HTTP requests, so the host receives things like your IP address, the requested URL and browser details, and may keep logs under its own policies. We do not use them to identify you.",
            "The support page’s contact button opens the form on the CHEKUSU company website. That site handles contact details and issue descriptions you choose to submit there. Please do not submit unnecessary private photos or full videos."
          ]
        }
      ],
      changes: 'If the app or the website changes how it handles data, we’ll update these notes and the date above.',
    },
    notFound: {
      title: 'Page not found — Dropack',
      heading: 'This package is empty.',
      body: 'The page you’re looking for doesn’t exist or has moved.',
      home: 'Back to home',
    },
  },
};
