# OAuth 2.0 クライアントID作成ビジュアルガイド

## ポイント解説

### クライアントIDの見た目
```
クライアント ID: 123456789012-abcdefghijklmnopqrstuvwxyz1234.apps.googleusercontent.com
クライアント シークレット: GOCSPX-1234567890abcdefghijklmn
```

### よくある間違い
1. ❌ リダイレクトURIの末尾にスラッシュを付ける
   - 間違い: `https://rsunbimndlyghdslgvnm.supabase.co/auth/v1/callback/`
   - 正しい: `https://rsunbimndlyghdslgvnm.supabase.co/auth/v1/callback`

2. ❌ HTTPSとHTTPを間違える
   - localhostは `http://`
   - supabase.coは `https://`

3. ❌ JavaScript生成元にパスを含める
   - 間違い: `http://localhost:3000/login`
   - 正しい: `http://localhost:3000`

### 作成後の確認方法
1. 認証情報ページに戻ると、作成したクライアントIDが一覧に表示される
2. 後で確認したい場合は、名前をクリックすると詳細が見られる
3. クライアントシークレットは「表示」ボタンで再表示可能

### 次のステップ
クライアントIDとシークレットを取得したら：
1. Supabaseダッシュボードに入力
2. .env.localファイルにクライアントIDを設定