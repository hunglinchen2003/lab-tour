/**
 * 之後補上 02–05 時，只要填入對應 YouTube 網址與聲音檔路徑即可。
 * 影片：貼上 youtu.be 或 youtube.com 連結
 * 聲音：把檔案放到 audio/ 資料夾，路徑例如 audio/02_audio_CH.mp3
 */
window.LAB_TOUR = {
  ui: {
    zh: {
      brand: "實驗室導覽",
      kicker: "Core Facility",
      chooseLang: "請選擇語言",
      chooseLangHint: "選擇語言後，接著挑選影像或聲音導覽",
      chooseMode: "選擇導覽方式",
      chooseModeHint: "觀看各站點影片，或聆聽解說音檔",
      video: "影像導覽",
      videoHint: "嵌入 YouTube，點選後直接播放",
      audio: "聲音導覽",
      audioHint: "播放各站點解說音檔",
      stations: "導覽站點",
      play: "播放",
      soon: "即將推出",
      back: "返回",
      prev: "上一站",
      next: "下一站",
      missing: "此站點媒體尚未上架",
    },
    en: {
      brand: "Lab Tour",
      kicker: "Core Facility",
      chooseLang: "Choose your language",
      chooseLangHint: "Next, pick a video or audio guide",
      chooseMode: "Choose a tour mode",
      chooseModeHint: "Watch station videos or listen to narration",
      video: "Video tour",
      videoHint: "YouTube videos play right on this page",
      audio: "Audio tour",
      audioHint: "Listen to the station narration",
      stations: "Stations",
      play: "Play",
      soon: "Coming soon",
      back: "Back",
      prev: "Previous",
      next: "Next",
      missing: "This station is not available yet",
    },
    ja: {
      brand: "研究室ガイド",
      kicker: "Core Facility",
      chooseLang: "言語を選択",
      chooseLangHint: "次に映像または音声ガイドを選べます",
      chooseMode: "ガイドの種類を選択",
      chooseModeHint: "各ステーションの映像または音声を再生します",
      video: "映像ガイド",
      videoHint: "YouTube をこのページで再生します",
      audio: "音声ガイド",
      audioHint: "各ステーションの解説を再生します",
      stations: "ステーション",
      play: "再生",
      soon: "近日公開",
      back: "戻る",
      prev: "前へ",
      next: "次へ",
      missing: "このステーションはまだ公開されていません",
    },
  },
  languages: [
    { id: "zh", label: "中文", native: "繁體中文", code: "中" },
    { id: "en", label: "English", native: "English", code: "EN" },
    { id: "ja", label: "日本語", native: "日本語", code: "日" },
  ],
  stations: [
    {
      id: "01",
      title: {
        zh: "實驗室簡介",
        en: "Lab Introduction",
        ja: "研究室紹介",
      },
      video: {
        zh: "https://youtu.be/p-1Bpvfvg7g",
        en: "https://youtu.be/pFsitogKI2k",
        ja: "https://youtu.be/9mPs5jmMBgQ",
      },
      audio: {
        zh: "audio/01_audio_Chinese.mp3",
        en: "audio/01_audio_English.mp3",
        ja: "audio/01_audio_Japan.mp3",
      },
    },
    {
      id: "02",
      title: {
        zh: "基因體分析平台",
        en: "Genomics Analysis Platform",
        ja: "ゲノム解析プラットフォーム",
      },
      video: {
        zh: "https://youtu.be/Fr0x0pwaE0A",
        en: "https://youtu.be/8D27JXJnVrc",
        ja: "https://youtu.be/cTgho3K7ZuI",
      },
      audio: {
        zh: "audio/02_audio_Chinese.mp3",
        en: "audio/02_audio_English.mp3",
        ja: "audio/02_audio_Japan.mp3",
      },
    },
    {
      id: "03",
      title: {
        zh: "AI製藥分析平台",
        en: "AI Drug Discovery Platform",
        ja: "AI創薬解析プラットフォーム",
      },
      video: { zh: "", en: "", ja: "" },
      audio: {
        zh: "audio/03_audio_Chinese.mp3",
        en: "audio/03_audio_English.mp3",
        ja: "audio/03_audio_Japan.mp3",
      },
    },
    {
      id: "04",
      title: {
        zh: "醣醫學核心資源",
        en: "Glycomedicine Core Resources",
        ja: "糖医学コアリソース",
      },
      video: {
        zh: "https://youtu.be/Z0VE6mDA35I",
        en: "https://youtu.be/y1Ex68WP7hs",
        ja: "https://youtu.be/P3EinHxaHMc",
      },
      audio: {
        zh: "audio/4_audio_Chinese.mp3",
        en: "audio/4_audio_ENG.mp3",
        ja: "audio/4_audio_JPN.mp3",
      },
    },
    {
      id: "05",
      title: {
        zh: "跨領域軟硬體開發",
        en: "Cross-disciplinary Hardware & Software",
        ja: "学際的ソフト・ハードウェア開発",
      },
      video: { zh: "", en: "", ja: "" },
      audio: {
        zh: "audio/05_audio_Chinese.mp3",
        en: "audio/05_audio_English.mp3",
        ja: "audio/05_audio_Japan.mp3",
      },
    },
  ],
};
