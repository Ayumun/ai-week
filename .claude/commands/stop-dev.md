---
description: "ローカル開発環境を停止します。クリーンな状態にリセット"
allowed-tools: Bash
---

# ローカル開発環境停止コマンド

## コマンドの目的

起動中の全ての開発関連プロセスを停止し、クリーンな状態にリセットします。

## 実行手順

### 1. Next.js開発サーバー停止
```bash
echo "=== Next.js開発サーバー停止 ==="
echo "Next.jsプロセスを停止中..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2
echo "✅ Next.jsプロセス停止完了"
```

### 2. Prisma Studio停止
```bash
echo "=== Prisma Studio停止 ==="
echo "Prisma Studioプロセスを停止中..."
pkill -f "prisma studio" 2>/dev/null || true
lsof -ti:5555 | xargs kill -9 2>/dev/null || true
sleep 1
echo "✅ Prisma Studio停止完了"
```

### 3. 開発関連プロセス停止
```bash
echo "=== 開発関連プロセス停止 ==="
echo "TypeScript Language Serverを停止中..."
pkill -f "typescript-language-server" 2>/dev/null || true
pkill -f "tsserver" 2>/dev/null || true

echo "MCP関連プロセスを停止中..."
pkill -f "mcp-server-playwright" 2>/dev/null || true
pkill -f "mcp-remote.*asana" 2>/dev/null || true

echo "その他の開発プロセスを停止中..."
pkill -f "contentful-typescript-codegen" 2>/dev/null || true
pkill -f "panda codegen" 2>/dev/null || true

sleep 2
echo "✅ 開発関連プロセス停止完了"
```

### 4. ポートクリーンアップ
```bash
echo "=== ポートクリーンアップ ==="
echo "ポート3000をクリーンアップ中..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "ポート5555をクリーンアップ中..."
lsof -ti:5555 | xargs kill -9 2>/dev/null || true

echo "その他の開発ポートをクリーンアップ中..."
lsof -ti:8025 | xargs kill -9 2>/dev/null || true
sleep 1
echo "✅ ポートクリーンアップ完了"
```

### 5. ログファイルクリーンアップ
```bash
echo "=== ログファイルクリーンアップ ==="
cd tca-member-app 2>/dev/null || cd .
if [ -f "dev.log" ]; then
    echo "" > dev.log
    echo "✅ dev.logクリア完了"
else
    echo "⚠️ dev.logが見つかりません"
fi

echo "一時ファイルクリーンアップ中..."
rm -rf .next/cache 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
echo "✅ 一時ファイルクリーンアップ完了"
```

### 6. Docker状態確認（停止しない）
```bash
echo "=== Docker状態確認 ==="
echo "Dockerサービス状態確認中..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Docker サービス: 継続起動中（データベース維持）"
else
    echo "⚠️ Docker サービス: 停止中"
fi
```

### 7. 停止確認とビープ音
```bash
echo "=== 停止確認 ==="
echo ""
echo "📋 停止済みサービス確認:"

if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "  ✅ Next.js App: 停止済み"
else
    echo "  ⚠️ Next.js App: まだ起動中"
fi

if ! curl -s http://localhost:5555 > /dev/null 2>&1; then
    echo "  ✅ Prisma Studio: 停止済み"
else
    echo "  ⚠️ Prisma Studio: まだ起動中"
fi

if curl -s http://localhost:8025 > /dev/null 2>&1; then
    echo "  ✅ Mailpit: 継続起動中（Docker維持）"
else
    echo "  ⚠️ Mailpit: 停止中"
fi

echo ""
echo "🔄 開発プロセス停止完了 - Dockerサービスは継続起動中"
echo -e '\a'
echo ""
```