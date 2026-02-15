---
description: "ローカル開発環境を起動します。環境構築済みの場合に使用"
allowed-tools: Bash
---

# ローカル開発環境起動コマンド

## コマンドの目的

既に環境構築が完了している環境でローカル開発環境を起動します。

## 実行手順

### 1. Docker サービス起動
```bash
echo "=== Docker サービス起動 ==="
docker-compose up -d
echo "✅ Docker起動完了"
```

### 2. 作業ディレクトリ確認と依存関係インストール
```bash
echo "=== 作業ディレクトリ確認 ==="
pwd
echo "✅ 現在のディレクトリ: $(pwd)"

echo "=== アプリケーションディレクトリ移動 ==="
cd tca-member-app
echo "✅ 現在のディレクトリ: $(pwd)"

echo "=== 依存関係インストール ==="
npm install
echo "✅ npm install完了"
```

### 3. 既存プロセス終了とログクリア
```bash
echo "=== 既存プロセス終了とログクリア ==="
echo "=== アプリケーションディレクトリ移動 ==="
cd tca-member-app
echo "" > dev.log
echo "既存のNext.jsプロセスを終了中..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2
echo "✅ プロセス終了とログクリア完了"
```

### 4. Next.js アプリケーション起動
```bash
echo "=== Next.js サーバー起動 ==="
cd tca-member-app
npm run dev > dev.log 2>&1 &
echo "✅ Next.jsサーバー起動中..."
echo "起動ログ: tail -f tca-member-app/dev.log で確認可能"
```

### 5. 起動確認
```bash
echo "=== 起動確認 ==="
sleep 15
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Next.js App: 起動完了 (http://localhost:3000)"
else
    echo "⏳ サーバーはまだ起動中です"
    echo "ログを確認してください: tail -f tca-member-app/dev.log"
fi

echo ""
echo "📋 利用可能なサービス:"
echo "  • PostgreSQL: localhost:25432"
echo "  • Mailpit: http://localhost:8025"
echo "  • Next.js App: http://localhost:3000"
echo ""
```
