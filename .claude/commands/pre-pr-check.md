# PR作成前チェック

PR作成前に実行する品質チェックとビルド確認

## 実行内容

1. **リント実行**: 修正したファイルに対してBiomeでリント・フォーマット適用
2. **ビルド確認**: PRワークフローでのデプロイが通るかローカルビルドで確認

## コマンド

```bash
# 実行時間測定開始
start_time=$(date +%s)

# 1. 修正ファイルのリント・フォーマット
echo "🔍 Step 1/2: Running lint and format check..."
cd tca-member-app && npm run check || { echo "❌ Lint check failed"; exit 1; }

# 2. ローカルビルド確認（PRワークフローと同等）
echo "🏗️  Step 2/2: Running build check..."
cd tca-member-app && timeout 300 npm run build || { echo "❌ Build check failed"; exit 1; }

# 3. 実行時間計算と完了通知
end_time=$(date +%s)
execution_time=$((end_time - start_time))
echo "✅ Pre-PR checks completed in ${execution_time} seconds!"
echo -e '\a'
```

## 使用タイミング

- PR作成前の最終チェック
- コミット前の品質確認
- CIワークフローエラーの事前防止

## 注意事項

- エラーが発生した場合は修正してから再実行
- `npm run build`にはリントも含まれているため、Biomeチェックが重要
- すべてのチェックが通過してからPR作成を推奨
- ビルドが5分以上かかる場合はタイムアウトします
- 各ステップで失敗した場合、具体的なエラーメッセージが表示されます