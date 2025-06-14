# Personal Blog

React、TypeScript、Supabase を使用したモダンな個人ブログアプリケーション

## 機能

### フロントエンド
- 📝 マークダウンエディターでの記事作成・編集
- 🎨 Chakra UI による美しいUI
- 🌙 ダークモード対応
- 📱 レスポンシブデザイン
- 🔍 記事検索機能
- 📖 自動目次生成
- 🖼️ アイキャッチ画像対応

### バックエンド（Supabase）
- 🔐 Google認証
- 📊 PostgreSQLデータベース
- 🛡️ Row Level Security (RLS)
- 💾 ファイルストレージ

## 技術スタック

### フロントエンド
- React 18.x
- TypeScript
- Redux Toolkit + Redux-Saga
- React Router v6
- Chakra UI + Emotion
- react-markdown
- @uiw/react-md-editor
- react-syntax-highlighter
- Framer Motion

### バックエンド
- Supabase (PostgreSQL)
- Supabase Auth with Google OAuth
- Supabase Storage
- Supabase RLS

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定：

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Supabaseの設定

1. [Supabase](https://supabase.io) でプロジェクトを作成
2. SQL Editor でデータベースマイグレーションを実行
3. Google認証の設定
4. ストレージバケットの作成

### 4. アプリケーションの起動

```bash
npm start
```

ブラウザで `http://localhost:3000` を開いてアプリケーションにアクセス

## データベーススキーマ

### posts テーブル
- id (integer, PRIMARY KEY)
- title (text, NOT NULL)
- slug (text, UNIQUE)
- content (text, NOT NULL)
- excerpt (text)
- featured_image (text)
- status (text, 'draft' | 'published')
- published_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
- author_id (uuid, REFERENCES auth.users)
- category_id (integer, REFERENCES categories)

### categories テーブル
- id (integer, PRIMARY KEY)
- name (text, NOT NULL, UNIQUE)
- slug (text, UNIQUE)
- description (text)
- created_at (timestamp)

### tags テーブル
- id (integer, PRIMARY KEY)
- name (text, NOT NULL, UNIQUE)
- slug (text, UNIQUE)
- created_at (timestamp)

### post_tags テーブル
- id (integer, PRIMARY KEY)
- post_id (integer, REFERENCES posts)
- tag_id (integer, REFERENCES tags)

## 使用方法

### 記事の作成・編集
1. `/login` でGoogle認証を行う
2. `/admin` で管理画面にアクセス
3. 「新規記事作成」から記事を作成
4. マークダウンエディターで記事を執筆
5. 下書き保存または公開

### 記事の閲覧
- `/` でホームページ（記事一覧）を表示
- `/posts/:slug` で個別記事を表示
- 目次機能で記事内をナビゲーション

## デプロイ

### Vercel での デプロイ

1. GitHub リポジトリにプッシュ
2. Vercel でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ実行

### Netlify での デプロイ

1. GitHub リポジトリにプッシュ
2. Netlify でプロジェクトをインポート
3. ビルド設定: `npm run build`
4. 環境変数を設定
5. デプロイ実行

## 開発

### ディレクトリ構成

```
src/
├── components/
│   ├── layout/          # レイアウトコンポーネント
│   ├── post/           # 記事関連コンポーネント
│   ├── editor/         # エディターコンポーネント
│   └── common/         # 共通コンポーネント
├── pages/              # ページコンポーネント
│   └── admin/          # 管理画面
├── store/              # Redux関連
│   ├── slices/         # Redux Toolkit slices
│   └── sagas/          # Redux-Saga
├── services/           # API関連
├── types/              # TypeScript型定義
├── styles/             # スタイル設定
└── utils/              # ユーティリティ
```

### 主要なコマンド

```bash
# 開発サーバー起動
npm start

# ビルド
npm run build

# テスト実行
npm test

# リント
npm run lint
```

## ライセンス

MIT License