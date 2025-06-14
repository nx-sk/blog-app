-- まず既存のテーブルを確認
-- このクエリで現在のテーブル構造を確認できます
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- 既存のテーブルがある場合、以下のクエリで削除して再作成できます
-- 注意: データが削除されます！

-- DROP TABLE IF EXISTS post_tags CASCADE;
-- DROP TABLE IF EXISTS posts CASCADE;
-- DROP TABLE IF EXISTS tags CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;

-- もしくは、既存のテーブルを残して、不足している部分だけ追加することもできます
-- 以下は既存のテーブルがある場合の追加設定です：

-- RLSが有効になっているか確認し、有効化
DO $$ 
BEGIN
  -- posts テーブルのRLS
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'posts' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
  END IF;

  -- categories テーブルのRLS
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'categories' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  END IF;

  -- tags テーブルのRLS
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'tags' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
  END IF;

  -- post_tags テーブルのRLS
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'post_tags' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 既存のポリシーを削除して再作成
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can view own posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
DROP POLICY IF EXISTS "Post tags are viewable by everyone" ON post_tags;
DROP POLICY IF EXISTS "Users can manage tags for own posts" ON post_tags;

-- RLS Policies for posts
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- RLS Policies for tags
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

-- RLS Policies for post_tags
CREATE POLICY "Post tags are viewable by everyone" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can manage tags for own posts" ON post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_tags.post_id 
      AND posts.author_id = auth.uid()
    )
  );

-- デフォルトのカテゴリーとタグを挿入（既に存在する場合はスキップ）
INSERT INTO categories (name, slug, description) VALUES
  ('技術', 'tech', 'プログラミング、開発、技術関連の記事'),
  ('ライフスタイル', 'lifestyle', '日常生活、趣味、健康に関する記事'),
  ('ビジネス', 'business', 'ビジネス、キャリア、生産性に関する記事'),
  ('その他', 'others', 'その他の記事')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('TypeScript', 'typescript'),
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('Node.js', 'nodejs'),
  ('Web開発', 'web-development'),
  ('デザイン', 'design'),
  ('チュートリアル', 'tutorial')
ON CONFLICT (name) DO NOTHING;