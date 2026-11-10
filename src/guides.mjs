// Guides: short answer pages for the questions people ask search engines and AI assistants
// before they know Dropack exists (sending a large batch with AirDrop, a big ZIP that has to go
// into Photos, camera cards and USB drives, the .dropack file). English, Simplified Chinese and
// Japanese. Each page answers first, shows the built-in way honestly, then the Dropack way and
// its limits.
// Product facts follow the App Store release and the support page; keep claims within them:
// Dropack packs and saves on the device, Apple's AirDrop moves the file, pause and continue
// apply to packing and saving into Photos (never to AirDrop), encrypted and split ZIPs are
// unsupported, saving depends on the formats Photos supports and videos are not converted.

export const GUIDES_UPDATED = '2026-11-10';

// Same slugs in every language, so the language versions of a guide pair up for hreflang.
export const GUIDE_SLUGS = ['airdrop-many-photos', 'large-zip-to-photos', 'sd-card-usb-to-photos', 'dropack-file'];

// Language tag → guides index path. Guide pages live at <index><slug>/.
export const GUIDE_LANGS = { en: '/en/guides/', 'zh-CN': '/guides/', ja: '/ja/guides/' };

export const GUIDES = {
  en: {
    ui: {
      kicker: 'Guide',
      nav: 'Guides',
      navAria: 'Site',
      skip: 'Skip to content',
      questions: 'Questions',
      more: 'More guides',
      updated: 'Updated',
      back: 'Back to Dropack',
      indexTitle: 'Guides — Dropack',
      indexDescription: 'Short answers for sending many photos and videos with AirDrop, getting a large ZIP into Photos, importing from SD cards and USB drives, and opening .dropack files.',
      indexH1: 'Guides',
      indexLede: 'Short, practical answers for moving large batches of photos and videos on iPhone and iPad.',
    },
    pages: {
      'airdrop-many-photos': {
        title: 'How to AirDrop hundreds of photos and videos at once — Dropack',
        description: 'Send a large batch of original photos and videos from iPhone as one file with AirDrop, then save it to Photos on the other iPhone item by item.',
        h1: 'How to AirDrop hundreds of photos and videos at once',
        link: 'Send hundreds of photos and videos as one file with AirDrop, and save them on the other iPhone item by item.',
        answer: 'For a few photos, AirDrop from the Photos app works well. For a large batch, pack the selection into one file first: Dropack puts the original photos and videos into a single .dropack album (or a standard ZIP), you send that one file with AirDrop, and the receiving iPhone saves the items to Photos one by one, with progress, and can continue where it stopped.',
        sections: [
          {
            h2: 'With the Photos app alone',
            text: 'Select the photos and videos in Photos, tap Share and choose AirDrop and the recipient. Options at the top of the share sheet decide whether location and all photos data are included. A large selection takes a while, both devices have to stay close, and AirDrop cannot resume an interrupted transfer, so a failed batch has to be sent again.',
          },
          {
            h2: 'With Dropack: one file, one AirDrop',
            steps: [
              'On the sending iPhone or iPad, open Dropack, tap Send and choose photos and videos from Photos or Files.',
              'Review the shared album and rename it if you like.',
              'Tap the share button at the top right. Dropack packs the originals into one .dropack file without extra image compression, then opens the share sheet.',
              'Choose AirDrop and the recipient.',
              'On the receiving device, open the file in Dropack. If a preview appears first, choose Open in Dropack or pick Dropack from the share menu. Then tap Sync to Photos.',
            ],
            text: 'Dropack saves the items into Photos one by one, with thumbnails and progress. You can pause and continue, and items that were already saved are recognised and skipped, so an interrupted save does not start over.',
          },
          {
            h2: 'Good to know',
            list: [
              'Dropack does not make AirDrop faster and cannot resume an AirDrop transfer. Pause and continue apply to packing and to saving into Photos.',
              'Opening a .dropack album needs Dropack on the receiving iPhone or iPad. For someone without Dropack, export a standard ZIP instead.',
              'Leave free space for the package and for unpacking it, and keep Dropack open while it packs or saves: iOS pauses it in the background.',
              'Originals kept only in iCloud are downloaded from Apple first. Originals can keep their capture dates and locations, so share them only with people you trust with that.',
              'There is no account, and nothing is uploaded to Dropack servers.',
            ],
          },
        ],
        faq: [
          ['Do the photos keep their original quality?', 'Yes. Dropack packs the original files without extra image compression, and it does not convert videos.'],
          ['What if I add more photos to the album later?', 'Add them and share the album again. On the receiving side, Dropack recognises the items it already saved and skips them.'],
          ['Do both devices need Dropack?', 'For a .dropack album, yes, on iOS or iPadOS 17 or later. To send to someone without Dropack, export a standard ZIP from the same album.'],
        ],
      },
      'large-zip-to-photos': {
        title: 'A large ZIP won’t open on iPhone? Save its photos and videos to Photos — Dropack',
        description: 'Get the photos and videos from a large ZIP, for example one received by AirDrop, into the iPhone Photos app item by item, with progress, using the Files app or Dropack.',
        h1: 'A large ZIP on iPhone: how to get its photos and videos into Photos',
        link: 'Unzip in Files, or let Dropack save the photos and videos from a ZIP straight into Photos with progress.',
        answer: 'The Files app can unzip a ZIP, but the photos and videos end up in a folder in Files, not in Photos, and unzipping needs free space for the ZIP and everything inside it. Dropack imports an ordinary ZIP straight into Photos instead: it extracts the items one by one, saves each into Photos with thumbnails and progress, and can continue after a pause, skipping items already saved.',
        sections: [
          {
            h2: 'With the Files app',
            steps: [
              'Save the ZIP to Files, from the AirDrop prompt or the share sheet.',
              'Tap the ZIP. Files extracts it into a folder next to it.',
              'Open the folder, select the photos and videos, tap Share and save them to Photos.',
            ],
            text: 'If nothing happens or extraction fails, check free space first: you need room for the ZIP, its extracted contents and the new items in Photos.',
          },
          {
            h2: 'With Dropack: from ZIP to Photos in one task',
            steps: [
              'Open Dropack and tap Receive.',
              'Choose the ZIP in Files. Dropack opens it as a one-time import.',
              'Tap Save to Photos. Dropack extracts the items one by one and saves each into Photos, with thumbnails and progress.',
              'If you pause, continue later: items already saved are recognised and skipped.',
            ],
            text: 'The ZIP itself stays where it is. The destination is your Photos library, not a folder in Files.',
          },
          {
            h2: 'Good to know',
            list: [
              'Dropack opens ordinary unencrypted ZIP files, folders, and single photos and videos. Encrypted and split ZIP archives are not supported.',
              'Whether an item can be saved depends on the formats Photos supports. Dropack does not convert videos.',
              'Each video is saved to Photos as a whole. An unfinished ZIP entry is extracted again when you continue.',
              'Keep Dropack open while it saves, and leave free space for temporary files and the new items in Photos.',
            ],
          },
        ],
        faq: [
          ['Does Dropack also unzip into Files?', 'No. Dropack saves the photos and videos into your Photos library; it does not create an extracted folder.'],
          ['What if the ZIP came from someone using Dropack?', 'Ask for the .dropack album instead. It opens directly in Dropack as a shared album, and items you already saved are skipped when it is shared again.'],
        ],
      },
      'sd-card-usb-to-photos': {
        title: 'Import photos and videos from an SD card or USB drive to iPhone Photos — Dropack',
        description: 'Save camera photos and videos from an SD card reader, USB drive or SSD into the iPhone or iPad Photos library, item by item with progress.',
        h1: 'How to import photos and videos from an SD card or USB drive into iPhone Photos',
        link: 'From a card reader, USB drive or SSD into the Photos library, item by item with progress.',
        answer: 'Connect the card reader or drive to the iPhone or iPad. For a camera’s card, the Photos app can import directly. For other folders on a drive, or a ZIP of footage, Dropack saves the compatible photos and videos into Photos one by one, with thumbnails and progress, and can continue after a pause, skipping items it already saved.',
        sections: [
          {
            h2: 'With the Photos app',
            steps: [
              'Connect the SD card reader or the camera.',
              'Open Photos and tap Import when it appears.',
              'Choose the items to import, or import them all.',
            ],
            text: 'For photos and videos in other folders on a USB drive or SSD, open the drive in the Files app, select the items and save them to Photos from the share sheet.',
          },
          {
            h2: 'With Dropack',
            steps: [
              'Connect the card reader, USB drive or SSD. It appears under Locations in Files.',
              'Open Dropack and tap Receive.',
              'In Files, choose photos, videos, a folder or an unencrypted ZIP on the drive.',
              'Tap Save to Photos. Dropack saves the compatible items into Photos one by one, with thumbnails and progress.',
            ],
            text: 'You can pause and continue; items already saved are recognised and skipped. The files on the drive are left as they are, and nothing is extracted onto the drive.',
          },
          {
            h2: 'Good to know',
            list: [
              'Keep the drive connected until saving finishes, and keep Dropack open: iOS pauses it in the background.',
              'Leave free space on the iPhone or iPad for temporary files and the new items in Photos.',
              'Which items can be saved depends on the formats Photos supports. Dropack does not convert videos.',
              'The drive has to be one that iOS shows in Files.',
            ],
          },
        ],
        faq: [
          ['Does this work on iPad?', 'Yes. Dropack runs on iPhone and iPad with iOS or iPadOS 17 or later.'],
          ['Are the files on the card changed?', 'No. Dropack reads them and saves copies into Photos; the originals stay on the card or drive.'],
        ],
      },
      'dropack-file': {
        title: 'What is a .dropack file, and how do you open it? — Dropack',
        description: 'A .dropack file is a shared album made with Dropack: original photos and videos and the album’s details in one file. Open it with Dropack on iPhone or iPad.',
        h1: 'What is a .dropack file, and how do you open it?',
        link: 'What a .dropack album is, how to open it on iPhone or iPad, and what to do without Dropack.',
        answer: 'A .dropack file is a Dropack shared album: the original photos and videos and the album’s details, packed into one file so they travel together by AirDrop. Open it with Dropack on iPhone or iPad (iOS or iPadOS 17 or later), review the album, and tap Sync to Photos to save the items into your Photos library.',
        sections: [
          {
            h2: 'How to open a .dropack file',
            steps: [
              'Install Dropack from the App Store on the iPhone or iPad that received the file.',
              'If AirDrop shows a preview first, choose Open in Dropack, or pick Dropack from the share menu. A file already in Files opens from Receive in Dropack.',
              'Review the album, then tap Sync to Photos.',
            ],
            text: 'The album stays in Dropack under Received. If the sender adds items and shares the album again, Dropack recognises the items you already saved and skips them.',
          },
          {
            h2: 'Without Dropack',
            text: 'A .dropack album is meant to be opened in Dropack. If you cannot install it, ask the sender to export a standard ZIP from Dropack instead; the Files app and other ZIP tools open that.',
          },
          {
            h2: 'Good to know',
            list: [
              'A .dropack album holds the original files without extra image compression, so it can be large. Leave free space for it and for saving its contents.',
              'Originals can include capture dates and locations.',
              'Nothing passes through Dropack servers: the file moves by AirDrop or however the sender shares it.',
            ],
          },
        ],
        faq: [
          ['Is a .dropack file safe to open?', 'It contains photos, videos and the album’s details. Dropack shows the album before anything is saved, and only saves to Photos when you tap Sync to Photos.'],
          ['Can I open it on a Mac, Android phone or PC?', 'Dropack is an iPhone and iPad app. For other devices, ask the sender for a standard ZIP.'],
        ],
      },
    },
  },
  'zh-CN': {
    ui: {
      kicker: '使用指南',
      nav: '使用指南',
      navAria: '页面导航',
      skip: '跳到正文',
      questions: '常见问题',
      more: '更多指南',
      updated: '更新于',
      back: '返回 Dropack 首页',
      indexTitle: '使用指南 — Dropack',
      indexDescription: '一次隔空投送大量照片和视频、把大压缩包里的素材存进相册、从 SD 卡和 U 盘导入相册、打开 .dropack 文件：简短实用的解答。',
      indexH1: '使用指南',
      indexLede: '在 iPhone 和 iPad 上搬运大量照片和视频时最常遇到的问题，简短实用的解答。',
    },
    pages: {
      'airdrop-many-photos': {
        title: '如何一次隔空投送几百张照片和视频 — Dropack',
        description: '把一大批原图和视频打成一个文件，用 AirDrop（隔空投送）发给另一台 iPhone，再逐项存进相册。',
        h1: '如何一次隔空投送几百张照片和视频',
        link: '把几百张照片和视频打成一个文件，用 AirDrop 发出，对方逐项存进相册。',
        answer: '只发几张照片，直接在“照片”里用 AirDrop（隔空投送）就够了。要发一大批，先把它们打成一个文件：Dropack 把原图和原视频装进一个 .dropack 相册包（也可以导出普通 ZIP），你用 AirDrop 发出这一个文件，接收的 iPhone 再把内容逐项存进相册，全程有进度，中断后可以接着存。',
        sections: [
          {
            h2: '只用“照片”',
            text: '在“照片”里选好照片和视频，点分享，选 AirDrop 和接收设备。分享面板顶部的“选项”决定是否包含位置和所有照片数据。选得越多越耗时，两台设备要一直靠近；AirDrop 中断后不能续传，失败的那一批只能重新发送。',
          },
          {
            h2: '用 Dropack：一个文件，一次 AirDrop',
            steps: [
              '在发送的 iPhone 或 iPad 上打开 Dropack，点“发送”，从相册或“文件”中选择照片和视频。',
              '在分享相册页面检查内容，需要的话改个名字。',
              '点右上角的分享按钮。Dropack 把原图打成一个 .dropack 文件，不额外压缩画质，然后打开系统分享面板。',
              '选择 AirDrop 和接收设备。',
              '在接收设备上用 Dropack 打开文件。如果系统先显示预览，选择“在 Dropack 中打开”，或从分享菜单选择 Dropack；然后点“同步到相册”。',
            ],
            text: 'Dropack 会逐项存入相册，显示缩略图和进度。可以暂停再继续，已经存好的项目会被识别并跳过，中断后不用从头再来。',
          },
          {
            h2: '注意事项',
            list: [
              'Dropack 不会让 AirDrop 变快，也不能续传 AirDrop。暂停与继续指的是打包和存入相册这两步。',
              '打开 .dropack 相册包需要接收方也安装 Dropack。对方没有 Dropack 时，可以导出普通 ZIP。',
              '请为照片包和解压预留空间；打包和保存时让 Dropack 留在前台，进入后台会暂停。',
              '只存在 iCloud 的原片会先从 Apple 下载。原片可能带有拍摄日期和位置，请只发给你信任的人。',
              '不需要账号，也不会上传到 Dropack 的服务器。',
            ],
          },
        ],
        faq: [
          ['照片会保持原画质吗？', '会。Dropack 打包的是原始文件，不额外压缩画质，也不会转码视频。'],
          ['之后往相册里加了新照片怎么办？', '加好后再分享一次相册。接收方的 Dropack 会识别已经存过的项目并跳过。'],
          ['两台设备都要装 Dropack 吗？', '收 .dropack 相册包需要，系统为 iOS 或 iPadOS 17 及以上。发给没有 Dropack 的人，可以从同一个相册导出普通 ZIP。'],
        ],
      },
      'large-zip-to-photos': {
        title: 'AirDrop 收到的大压缩包打不开？把 ZIP 里的照片视频存进相册 — Dropack',
        description: '把大 ZIP 压缩包（比如隔空投送收到的）里的照片和视频逐项存进 iPhone 相册，全程有进度：用“文件”或 Dropack。',
        h1: 'iPhone 上的大压缩包：怎么把里面的照片和视频存进相册',
        link: '在“文件”里解压，或者让 Dropack 把 ZIP 里的照片视频直接逐项存进相册。',
        answer: '“文件”可以解压 ZIP，但照片和视频会解压到“文件”里的一个文件夹，而不是相册，而且解压需要同时容纳压缩包和全部内容的空间。Dropack 则把普通 ZIP 直接导入相册：逐项解压、逐项存进相册，显示缩略图和进度；暂停后可以接着存，已经存好的项目自动跳过。',
        sections: [
          {
            h2: '用“文件”',
            steps: [
              '从 AirDrop 提示或分享面板把 ZIP 存到“文件”。',
              '轻点 ZIP，“文件”会在旁边解压出一个文件夹。',
              '打开文件夹，选中照片和视频，点分享，存储到相册。',
            ],
            text: '如果没有反应或解压失败，先检查剩余空间：压缩包、解压后的内容和存进相册的新项目都需要空间。',
          },
          {
            h2: '用 Dropack：从 ZIP 到相册，一步完成',
            steps: [
              '打开 Dropack，点“收取”。',
              '在“文件”中选择这个 ZIP，Dropack 会打开一次性导入任务。',
              '点“保存到相册”。Dropack 逐项解压、逐项存入相册，显示缩略图和进度。',
              '暂停后可以稍后继续，已经存好的项目会被识别并跳过。',
            ],
            text: 'ZIP 文件本身保持原样。目标是你的照片图库，而不是“文件”里的文件夹。',
          },
          {
            h2: '注意事项',
            list: [
              'Dropack 支持普通未加密的 ZIP、文件夹以及单个照片和视频；不支持加密或分卷 ZIP。',
              '能否存进相册取决于“照片”支持的格式，Dropack 不会转码视频。',
              '每个视频由系统整项存入相册；未完成的 ZIP 条目在继续时会重新解压。',
              '保存时让 Dropack 留在前台，并为临时文件和新增的相册内容预留空间。',
            ],
          },
        ],
        faq: [
          ['Dropack 也会把 ZIP 解压到“文件”吗？', '不会。Dropack 把照片和视频存进照片图库，不会生成解压后的文件夹。'],
          ['如果 ZIP 是用 Dropack 的人发来的呢？', '请对方改发 .dropack 相册包。它会在 Dropack 中直接作为分享相册打开，再次分享时已经存过的项目会被跳过。'],
        ],
      },
      'sd-card-usb-to-photos': {
        title: '如何把 SD 卡、U 盘里的照片和视频导入 iPhone 相册 — Dropack',
        description: '把读卡器、U 盘或移动硬盘里的相机照片和视频逐项存进 iPhone 或 iPad 的照片图库，全程显示进度。',
        h1: '如何把 SD 卡、U 盘里的照片和视频导入 iPhone 相册',
        link: '从读卡器、U 盘或移动硬盘逐项存进相册，全程显示进度。',
        answer: '先把读卡器或 U 盘接到 iPhone 或 iPad 上。相机存储卡可以直接用“照片”导入；U 盘里其他文件夹中的素材、或者打包成 ZIP 的素材，可以用 Dropack 把兼容的照片和视频逐项存进相册，显示缩略图和进度，暂停后可以接着存，已经存好的项目自动跳过。',
        sections: [
          {
            h2: '用“照片”',
            steps: [
              '接上 SD 读卡器或相机。',
              '打开“照片”，出现“导入”时轻点它。',
              '选择要导入的项目，或全部导入。',
            ],
            text: 'U 盘或移动硬盘上其他文件夹里的照片和视频，可以在“文件”中打开外接盘，选中后从分享面板存储到相册。',
          },
          {
            h2: '用 Dropack',
            steps: [
              '接上读卡器、U 盘或移动硬盘，它会出现在“文件”的位置列表中。',
              '打开 Dropack，点“收取”。',
              '在“文件”中选择外接盘上的照片、视频、文件夹或未加密的 ZIP。',
              '点“保存到相册”。Dropack 把兼容的项目逐项存入相册，显示缩略图和进度。',
            ],
            text: '可以暂停再继续，已经存好的项目会被识别并跳过。外接盘上的文件保持原样，也不会解压到外接盘上。',
          },
          {
            h2: '注意事项',
            list: [
              '保存完成前请保持外接盘连接，并让 Dropack 留在前台，进入后台会暂停。',
              '请在 iPhone 或 iPad 上为临时文件和新增的相册内容预留空间。',
              '能否存进相册取决于“照片”支持的格式，Dropack 不会转码视频。',
              '外接盘需要能在“文件”中显示。',
            ],
          },
        ],
        faq: [
          ['iPad 也能用吗？', '可以。Dropack 支持 iOS 或 iPadOS 17 及以上的 iPhone 和 iPad。'],
          ['存储卡上的文件会被改动吗？', '不会。Dropack 只读取它们，把副本存进相册，原文件留在存储卡或外接盘上。'],
        ],
      },
      'dropack-file': {
        title: '.dropack 是什么文件？怎么打开 — Dropack',
        description: '.dropack 文件是用 Dropack 制作的分享相册：原图、原视频和相册信息装在一个文件里。在 iPhone 或 iPad 上用 Dropack 打开。',
        h1: '.dropack 是什么文件？怎么打开',
        link: '.dropack 相册包是什么、怎样在 iPhone 或 iPad 上打开，以及没有 Dropack 时怎么办。',
        answer: '.dropack 文件是 Dropack 的分享相册：原图、原视频和相册信息打包在一个文件里，便于用 AirDrop 一起发送。在 iPhone 或 iPad（iOS 或 iPadOS 17 及以上）上用 Dropack 打开，检查相册后点“同步到相册”，就会存进你的照片图库。',
        sections: [
          {
            h2: '怎么打开 .dropack 文件',
            steps: [
              '在收到文件的 iPhone 或 iPad 上，从 App Store 安装 Dropack。',
              '如果 AirDrop 先显示预览，选择“在 Dropack 中打开”，或从分享菜单选择 Dropack。已经在“文件”里的照片包，可以在 Dropack 中点“收取”打开。',
              '检查相册内容，然后点“同步到相册”。',
            ],
            text: '相册会保留在 Dropack 的“收到的”里。发送方加了新内容再次分享时，Dropack 会识别你已经存过的项目并跳过。',
          },
          {
            h2: '没有 Dropack 时',
            text: '.dropack 相册包需要用 Dropack 打开。如果没法安装，请发送方在 Dropack 中改为导出普通 ZIP，“文件”和其他解压工具都能打开。',
          },
          {
            h2: '注意事项',
            list: [
              '.dropack 相册包里是原始文件，不额外压缩画质，所以可能比较大。请为它和存入相册的内容预留空间。',
              '原片可能带有拍摄日期和位置信息。',
              '文件不经过 Dropack 的服务器：它通过 AirDrop 或发送方选择的其他方式传递。',
            ],
          },
        ],
        faq: [
          ['打开 .dropack 文件安全吗？', '里面是照片、视频和相册信息。Dropack 会先展示相册，只有在你点“同步到相册”后才会存进相册。'],
          ['能在 Mac、安卓手机或电脑上打开吗？', 'Dropack 是 iPhone 和 iPad 应用。其他设备请让发送方改发普通 ZIP。'],
        ],
      },
    },
  },
  ja: {
    ui: {
      kicker: 'ガイド',
      nav: '使い方ガイド',
      navAria: 'サイト',
      skip: '本文へ移動',
      questions: 'よくある質問',
      more: 'ほかのガイド',
      updated: '更新日',
      back: 'Dropack のトップへ',
      indexTitle: '使い方ガイド — Dropack',
      indexDescription: '大量の写真とビデオをAirDropでまとめて送る、大きなZIPの中身を「写真」に保存する、SDカードやUSBメモリから取り込む、.dropackファイルを開く方法をまとめました。',
      indexH1: '使い方ガイド',
      indexLede: 'iPhoneとiPadで大量の写真やビデオを移すときによくある疑問に、短く答えます。',
    },
    pages: {
      'airdrop-many-photos': {
        title: '大量の写真とビデオをAirDropでまとめて送る方法 — Dropack',
        description: 'たくさんのオリジナルの写真とビデオを1つのファイルにまとめてAirDropで送り、受け取ったiPhoneで1項目ずつ「写真」に保存します。',
        h1: '大量の写真とビデオをAirDropでまとめて送る方法',
        link: '数百枚の写真とビデオを1つのファイルにしてAirDropで送り、相手のiPhoneで1項目ずつ保存します。',
        answer: '数枚なら「写真」アプリからAirDropで送れば十分です。大量に送るときは、先に1つのファイルにまとめます。Dropackはオリジナルの写真とビデオを1つの.dropackアルバム（または通常のZIP）にまとめ、そのファイルをAirDropで送ると、受け取ったiPhoneが1項目ずつ「写真」に保存します。進捗が表示され、中断しても続きから保存できます。',
        sections: [
          {
            h2: '「写真」アプリだけで送る場合',
            text: '「写真」で写真とビデオを選び、共有からAirDropと相手を選びます。共有シート上部の「オプション」で、位置情報とすべての写真データを含めるかを選べます。枚数が多いほど時間がかかり、2台を近くに置いたまま待つ必要があります。AirDropは中断した転送を再開できないため、失敗したらもう一度送り直しです。',
          },
          {
            h2: 'Dropackなら：1つのファイルを、1回のAirDropで',
            steps: [
              '送る側のiPhoneまたはiPadでDropackを開き、「送る」から「写真」か「ファイル」の写真とビデオを選びます。',
              '共有アルバムの内容を確認し、必要なら名前を変えます。',
              '右上の共有ボタンをタップします。Dropackはオリジナルを画質を落とさずに1つの.dropackファイルにまとめ、共有シートを開きます。',
              'AirDropと相手を選びます。',
              '受け取る側でファイルをDropackで開きます。先にプレビューが出たら「Dropackで開く」を選ぶか、共有メニューからDropackを選び、「写真」に同期をタップします。',
            ],
            text: 'Dropackは1項目ずつ「写真」に保存し、サムネイルと進捗を表示します。一時停止して再開でき、保存済みの項目は認識してスキップするので、中断しても最初からやり直す必要はありません。',
          },
          {
            h2: '知っておきたいこと',
            list: [
              'DropackはAirDropを速くしたり、AirDropの転送を再開したりはできません。一時停止と再開は、まとめる作業と「写真」への保存の話です。',
              '.dropackアルバムを開くには、受け取る側のiPhoneやiPadにもDropackが必要です。Dropackがない相手には通常のZIPを書き出してください。',
              'ファイルと展開のための空き容量を用意し、まとめる間と保存中はDropackを開いたままにしてください。バックグラウンドでは一時停止します。',
              'iCloudにしかないオリジナルは、先にAppleからダウンロードされます。オリジナルには撮影日時や位置情報が含まれることがあるので、信頼できる相手にだけ送ってください。',
              'アカウントは不要で、Dropackのサーバーにアップロードされることもありません。',
            ],
          },
        ],
        faq: [
          ['元の画質のまま送れますか？', 'はい。Dropackはオリジナルのファイルを画質を落とさずにまとめ、ビデオの変換もしません。'],
          ['あとでアルバムに写真を追加したら？', '追加してからもう一度アルバムを共有してください。受け取る側のDropackが、保存済みの項目を認識してスキップします。'],
          ['両方の端末にDropackが必要ですか？', '.dropackアルバムの場合は必要です（iOSまたはiPadOS 17以降）。Dropackがない相手には、同じアルバムから通常のZIPを書き出せます。'],
        ],
      },
      'large-zip-to-photos': {
        title: 'AirDropで届いた大きなZIPが開けないとき：中の写真とビデオを「写真」に保存する方法 — Dropack',
        description: 'AirDropなどで受け取った大きなZIPの写真とビデオを、進捗を見ながら1項目ずつiPhoneの「写真」に保存する方法。「ファイル」とDropackの2通りです。',
        h1: 'iPhoneで大きなZIPの写真とビデオを「写真」に保存する方法',
        link: '「ファイル」で展開するか、DropackでZIPの写真とビデオを直接「写真」に保存します。',
        answer: '「ファイル」アプリでもZIPは展開できますが、写真とビデオは「ファイル」内のフォルダに展開され、「写真」には入りません。展開にはZIPと中身の両方が入る空き容量も必要です。Dropackなら通常のZIPを直接「写真」に取り込めます。1項目ずつ展開して保存し、サムネイルと進捗を表示。一時停止しても続きから保存でき、保存済みの項目はスキップします。',
        sections: [
          {
            h2: '「ファイル」アプリで展開する',
            steps: [
              'AirDropの確認画面か共有シートから、ZIPを「ファイル」に保存します。',
              'ZIPをタップすると、同じ場所にフォルダとして展開されます。',
              'フォルダを開いて写真とビデオを選び、共有から「写真」に保存します。',
            ],
            text: '反応がない、または展開に失敗するときは、まず空き容量を確認してください。ZIP、展開した中身、「写真」に追加される項目の分が必要です。',
          },
          {
            h2: 'Dropackなら：ZIPから「写真」まで1回で',
            steps: [
              'Dropackを開いて「受け取る」をタップします。',
              '「ファイル」でZIPを選ぶと、1回限りの取り込みとして開きます。',
              '「写真」に保存をタップすると、1項目ずつ展開して「写真」に保存し、サムネイルと進捗を表示します。',
              '一時停止しても、あとから続きを保存できます。保存済みの項目は認識してスキップします。',
            ],
            text: 'ZIPファイルはそのまま残ります。保存先は「ファイル」のフォルダではなく、写真ライブラリです。',
          },
          {
            h2: '知っておきたいこと',
            list: [
              'Dropackが開けるのは、暗号化されていない通常のZIP、フォルダ、写真やビデオです。暗号化・分割ZIPには対応していません。',
              '保存できるかどうかは「写真」が対応する形式によります。Dropackはビデオを変換しません。',
              'ビデオは1本ずつまとめて「写真」に保存されます。途中だったZIPの項目は、再開時にもう一度展開します。',
              '保存中はDropackを開いたままにし、一時ファイルと「写真」に追加される項目の空き容量を用意してください。',
            ],
          },
        ],
        faq: [
          ['Dropackは「ファイル」にも展開しますか？', 'いいえ。Dropackは写真とビデオを写真ライブラリに保存し、展開したフォルダは作りません。'],
          ['ZIPを送ってきた相手がDropackを使っている場合は？', '.dropackアルバムで送ってもらってください。Dropackでそのまま共有アルバムとして開け、再共有されたときは保存済みの項目をスキップします。'],
        ],
      },
      'sd-card-usb-to-photos': {
        title: 'SDカードやUSBメモリの写真・ビデオをiPhoneの「写真」に取り込む方法 — Dropack',
        description: 'カードリーダー、USBメモリ、外付けSSDのカメラ素材を、進捗を見ながら1項目ずつiPhoneやiPadの写真ライブラリに保存する方法。',
        h1: 'SDカードやUSBメモリの写真・ビデオをiPhoneの「写真」に取り込む方法',
        link: 'カードリーダー、USBメモリ、外付けSSDから、進捗を見ながら1項目ずつ「写真」へ。',
        answer: 'まずカードリーダーやドライブをiPhoneまたはiPadにつなぎます。カメラのカードなら「写真」アプリから直接読み込めます。ドライブの別のフォルダにある素材やZIPにまとめた素材は、Dropackで対応する写真とビデオを1項目ずつ「写真」に保存できます。サムネイルと進捗を表示し、一時停止しても続きから保存でき、保存済みの項目はスキップします。',
        sections: [
          {
            h2: '「写真」アプリで読み込む',
            steps: [
              'SDカードリーダーかカメラをつなぎます。',
              '「写真」を開き、「読み込む」が表示されたらタップします。',
              '読み込む項目を選ぶか、すべて読み込みます。',
            ],
            text: 'USBメモリや外付けSSDの別のフォルダにある写真とビデオは、「ファイル」でドライブを開いて選び、共有シートから「写真」に保存します。',
          },
          {
            h2: 'Dropackで取り込む',
            steps: [
              'カードリーダー、USBメモリ、外付けSSDをつなぎます。「ファイル」の「場所」に表示されます。',
              'Dropackを開いて「受け取る」をタップします。',
              '「ファイル」で、ドライブ上の写真、ビデオ、フォルダ、または暗号化されていないZIPを選びます。',
              '「写真」に保存をタップすると、対応する項目を1項目ずつ「写真」に保存し、サムネイルと進捗を表示します。',
            ],
            text: '一時停止して再開でき、保存済みの項目は認識してスキップします。ドライブ上のファイルはそのままで、ドライブに展開することもありません。',
          },
          {
            h2: '知っておきたいこと',
            list: [
              '保存が終わるまでドライブをつないだままにし、Dropackも開いたままにしてください。バックグラウンドでは一時停止します。',
              'iPhoneやiPadに、一時ファイルと「写真」に追加される項目の空き容量を用意してください。',
              '保存できるかどうかは「写真」が対応する形式によります。Dropackはビデオを変換しません。',
              'ドライブは「ファイル」に表示されるものである必要があります。',
            ],
          },
        ],
        faq: [
          ['iPadでも使えますか？', 'はい。DropackはiOSまたはiPadOS 17以降のiPhoneとiPadで使えます。'],
          ['カードのファイルは変更されますか？', 'いいえ。Dropackは読み取ってコピーを「写真」に保存するだけで、元のファイルはカードやドライブに残ります。'],
        ],
      },
      'dropack-file': {
        title: '.dropackファイルとは？開き方 — Dropack',
        description: '.dropackファイルは、Dropackで作った共有アルバムです。オリジナルの写真とビデオ、アルバムの情報が1つのファイルに入っています。iPhoneやiPadのDropackで開きます。',
        h1: '.dropackファイルとは？開き方',
        link: '.dropackアルバムとは何か、iPhoneやiPadでの開き方、Dropackがない場合の対処。',
        answer: '.dropackファイルはDropackの共有アルバムです。オリジナルの写真とビデオ、アルバムの情報を1つのファイルにまとめ、AirDropでまとめて送れるようにしたものです。iPhoneやiPad（iOSまたはiPadOS 17以降）のDropackで開き、アルバムを確認して「写真」に同期をタップすると、写真ライブラリに保存されます。',
        sections: [
          {
            h2: '.dropackファイルの開き方',
            steps: [
              'ファイルを受け取ったiPhoneまたはiPadに、App StoreからDropackをインストールします。',
              'AirDropで先にプレビューが出たら「Dropackで開く」を選ぶか、共有メニューからDropackを選びます。「ファイル」にあるファイルは、Dropackの「受け取る」から開けます。',
              'アルバムを確認して、「写真」に同期をタップします。',
            ],
            text: 'アルバムはDropackの「受信したアルバム」に残ります。送り手が項目を追加してもう一度共有したときは、保存済みの項目を認識してスキップします。',
          },
          {
            h2: 'Dropackがない場合',
            text: '.dropackアルバムはDropackで開くためのファイルです。インストールできない場合は、送り手にDropackから通常のZIPを書き出してもらってください。「ファイル」アプリやほかのZIPツールで開けます。',
          },
          {
            h2: '知っておきたいこと',
            list: [
              '.dropackアルバムにはオリジナルのファイルが画質を落とさずに入っているため、サイズが大きくなることがあります。ファイルと保存のための空き容量を用意してください。',
              'オリジナルには撮影日時や位置情報が含まれることがあります。',
              'Dropackのサーバーは経由しません。ファイルはAirDropなど、送り手が選んだ方法で届きます。',
            ],
          },
        ],
        faq: [
          ['.dropackファイルを開いても安全ですか？', '中身は写真、ビデオ、アルバムの情報です。Dropackは保存する前にアルバムを表示し、「写真」に同期をタップしたときだけ保存します。'],
          ['Mac、Android、パソコンで開けますか？', 'DropackはiPhoneとiPadのアプリです。ほかの端末には、送り手に通常のZIPを送ってもらってください。'],
        ],
      },
    },
  },
};

// The path of a guide (or of the guides index when slug is empty) in a language.
export const guidePath = (tag, slug = '') => GUIDE_LANGS[tag] + (slug ? `${slug}/` : '');
