# 實驗室導覽

手機導覽網頁：先選語言（中／英／日），再選影像或聲音，然後播放各站點內容。

公開網址：https://hunglinchen2003.github.io/lab-tour/

## 目前已上架

- 01 實驗室簡介：中／英／日 YouTube 影片與聲音檔

02–05 與所有聲音檔標示為「即將推出」，補上後會自動出現播放鍵。

## 之後怎麼補內容

編輯 `js/content.js`：

- 影片：把 YouTube 連結貼到對應語言的 `video` 欄位
- 聲音：把 mp3 放到 `audio/`，檔名見該資料夾的說明，路徑填入 `audio`

例如：

```js
video: {
  zh: "https://youtu.be/xxxxx",
  en: "https://youtu.be/xxxxx",
  ja: "https://youtu.be/xxxxx",
}
```
