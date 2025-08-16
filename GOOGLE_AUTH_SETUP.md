# Google認証セットアップガイド

## Supabaseダッシュボードでの設定

1. **Supabaseダッシュボードにアクセス**
   - https://app.supabase.com/project/rsunbimndlyghdslgvnm/auth/providers を開く
   - または、ダッシュボードから: Authentication → Providers

2. **Google Providerを有効化**
   - Googleの行を見つけて「Enabled」をONに
   - 以下の情報を入力：
     - **Client ID**: Google Cloud Consoleで取得したクライアントID
     - **Client Secret**: Google Cloud Consoleで取得したクライアントシークレット
   - 「Save」をクリック

3. **Redirect URLの確認**
   - Supabaseが表示する「Callback URL」をコピー
   - 通常は: `https://rsunbimndlyghdslgvnm.supabase.co/auth/v1/callback`
   - これがGoogle Cloud Consoleで設定したリダイレクトURIと一致することを確認

## 環境変数の更新

`.env.local`ファイルのVITE_GOOGLE_CLIENT_IDを更新：

```
VITE_GOOGLE_CLIENT_ID=あなたのクライアントID
```

## テスト方法

1. アプリケーションを再起動
   ```bash
   npm start
   ```

2. http://localhost:3000/login にアクセス

3. 「Googleでログイン」ボタンをクリック

4. Googleアカウントでログインを試みる

## トラブルシューティング

### エラー: redirect_uri_mismatch
- Google Cloud ConsoleのリダイレクトURIが正しく設定されているか確認
- Supabaseのコールバック URLと一致しているか確認

### エラー: invalid_client
- クライアントIDとシークレットが正しくコピーされているか確認
- Supabaseダッシュボードで正しく保存されているか確認
