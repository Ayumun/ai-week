# メイン画面背景色変更（スカイブルー） 設計書

## 概要
メイン画面の背景色を`#D3D3D3`から`#00bfff`に変更。`style.css`の1行変更のみ。

## 変更対象

| ファイル | 変更箇所 | 変更内容 |
|---------|---------|----------|
| style.css | 105行目 | `background: #D3D3D3;` → `background: #00bfff;` |

## 変更前後の比較

**変更前**:
```css
.content-area {
  margin-top: 60px; margin-bottom: 50px; flex: 1;
  background: #D3D3D3;
  min-height: calc(100vh - 60px);
}
```

**変更後**:
```css
.content-area {
  margin-top: 60px; margin-bottom: 50px; flex: 1;
  background: #00bfff;
  min-height: calc(100vh - 60px);
}
```

## 影響範囲
- **影響あり**: メイン画面（フィード画面）のみ
- **影響なし**: 認証画面、Explore、プロフィール、いいね一覧（`#fafafa`維持）
- **HTML/JS変更**: 不要

## テスト方針
1. メイン画面の背景色が`#00bfff`であることを確認
2. 他画面の背景色が`#fafafa`のままであることを確認
3. デスクトップ・モバイル両方で表示確認
4. 投稿カードとのコントラストが十分であることを確認
