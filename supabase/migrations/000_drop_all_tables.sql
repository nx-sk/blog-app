-- 既存のテーブルを全て削除
-- 注意: これを実行すると全てのデータが削除されます！

DROP TABLE IF EXISTS post_tags CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 既存の関数も削除
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;