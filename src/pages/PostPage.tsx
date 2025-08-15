import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchPostStart } from '../store/slices/postsSlice'
import {
  setCurrentEditingPost,
  updateCurrentEditingPost,
  markPostAsSaved,
} from '../store/slices/adminModeSlice'
import PostDetail from '../components/post/PostDetail'
import Loading from '../components/common/Loading'
import ZennStyleTableOfContents from '../components/post/ZennStyleTableOfContents'
import InlineEditableField from '../components/editor/InlineEditableField'
import InlineMarkdownEditor from '../components/editor/InlineMarkdownEditor'
import {
  Box,
  Text,
  Container,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  Button,
  useToast,
  Divider,
} from '@chakra-ui/react'

interface TOCItem {
  id: string
  text: string
  level: number
}

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useDispatch()
  const toast = useToast()
  
  const { currentPost, loading, error } = useSelector((state: RootState) => state.posts)
  const { isAdminMode, isEditingMode, currentEditingPost } = useSelector(
    (state: RootState) => state.adminMode
  )
  
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [newTag, setNewTag] = useState('')
  
  const isNewPost = slug === 'new'

  useEffect(() => {
    if (isNewPost && isAdminMode) {
      // 新規投稿の場合
      const newPost = {
        title: '',
        content: '',
        slug: '',
        excerpt: '',
        coverImage: '',
        tags: [],
        isDraft: true,
        hasUnsavedChanges: false,
      }
      dispatch(setCurrentEditingPost(newPost))
    } else if (slug && !isNewPost) {
      // 既存投稿を取得
      dispatch(fetchPostStart(slug))
    }
  }, [dispatch, slug, isNewPost, isAdminMode])

  useEffect(() => {
    // 既存投稿を編集用にセット
    if (currentPost && isAdminMode && !isNewPost) {
      dispatch(setCurrentEditingPost({
        id: currentPost.id,
        title: currentPost.title,
        content: currentPost.content,
        slug: currentPost.slug || '',
        excerpt: currentPost.excerpt || '',
        featured_image: currentPost.featured_image || '',
        tags: currentPost.tags?.map(tag => tag.name) || [],
        isDraft: currentPost.status === 'draft',
        hasUnsavedChanges: false,
        created_at: currentPost.created_at,
        updated_at: currentPost.updated_at,
        author_id: currentPost.author_id,
        status: currentPost.status,
      }))
    }
  }, [currentPost, isAdminMode, isNewPost, dispatch])

  useEffect(() => {
    // 目次の生成
    const content = currentEditingPost?.content || currentPost?.content
    if (content) {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm
      const items: TOCItem[] = []
      let match

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length
        const text = match[2]
        const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
        
        if (level <= 2) {
          items.push({ id, text, level })
        }
      }

      setTocItems(items)
    }
  }, [currentPost, currentEditingPost])

  const handleAutoSave = React.useCallback(async () => {
    if (!currentEditingPost) return

    try {
      const postData = {
        ...currentEditingPost,
        isDraft: true,
      }
      
      // 実際の保存処理はあとで実装
      localStorage.setItem('draft_post', JSON.stringify(postData))
      dispatch(markPostAsSaved())
      
      toast({
        title: '下書きを自動保存しました',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      })
    } catch (error) {
      console.error('Auto save failed:', error)
    }
  }, [currentEditingPost, dispatch, toast])

  // 自動保存
  useEffect(() => {
    if (currentEditingPost?.hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleAutoSave()
      }, 30000) // 30秒後に自動保存

      return () => clearTimeout(timer)
    }
  }, [currentEditingPost, handleAutoSave])

  /* const handleSave = async () => {
    if (!currentEditingPost) return

    try {
      // バリデーション
      if (!currentEditingPost.title.trim()) {
        toast({
          title: 'タイトルを入力してください',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      if (!currentEditingPost.slug.trim() && isNewPost) {
        toast({
          title: 'URLスラッグを入力してください',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      // 保存処理（実際のAPI呼び出しはあとで実装）
      if (isNewPost) {
        // 新規作成
        const postData = {
          title: currentEditingPost.title,
          content: currentEditingPost.content,
          slug: currentEditingPost.slug,
          excerpt: currentEditingPost.excerpt,
          featured_image: currentEditingPost.featured_image,
          status: currentEditingPost.isDraft ? 'draft' as const : 'published' as const,
          author_id: currentEditingPost.author_id || '',
          // tagsは後で実装
        }
        dispatch(createPostStart(postData))
        navigate(`/posts/${currentEditingPost.slug}`)
      } else {
        // 更新
        const postData = {
          title: currentEditingPost.title,
          content: currentEditingPost.content,
          slug: currentEditingPost.slug,
          excerpt: currentEditingPost.excerpt,
          featured_image: currentEditingPost.featured_image,
          status: currentEditingPost.isDraft ? 'draft' as const : 'published' as const,
          // tagsは後で実装
        }
        dispatch(updatePostStart({ id: Number(currentEditingPost.id!), post: postData }))
      }

      dispatch(markPostAsSaved())
      
      toast({
        title: '記事を保存しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: '保存に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  } */

  const handleUpdateField = (field: string, value: any) => {
    dispatch(updateCurrentEditingPost({ [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && currentEditingPost) {
      const tags = [...(currentEditingPost.tags || []), newTag.trim()]
      handleUpdateField('tags', tags)
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (currentEditingPost) {
      const tags = currentEditingPost.tags.filter(tag => tag !== tagToRemove)
      handleUpdateField('tags', tags)
    }
  }

  if (loading && !isNewPost) {
    return <Loading />
  }

  if (error && !isNewPost) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">エラーが発生しました: {error}</Text>
      </Box>
    )
  }

  if (!currentPost && !isNewPost && !loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>記事が見つかりません</Text>
      </Box>
    )
  }

  // 編集モードの表示
  if (isAdminMode && isEditingMode && currentEditingPost) {
    return (
      <Box position="relative">
        <Container maxW="container.lg" py={8}>
          <VStack spacing={8} align="stretch">
            {/* タイトル編集 */}
            <InlineEditableField
              value={currentEditingPost.title}
              onChange={(value) => handleUpdateField('title', value)}
              as="heading"
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
              placeholder="記事のタイトルを入力"
              isRequired
              tooltip="クリックして編集"
            />

            {/* メタ情報編集 */}
            <VStack spacing={4} align="stretch" p={4} bg="gray.50" borderRadius="md">
              <HStack>
                <Text fontWeight="bold" minW="100px">URLスラッグ:</Text>
                <Input
                  value={currentEditingPost.slug}
                  onChange={(e) => handleUpdateField('slug', e.target.value)}
                  placeholder="url-slug"
                  size="sm"
                  isDisabled={!isNewPost}
                />
              </HStack>

              <HStack>
                <Text fontWeight="bold" minW="100px">概要:</Text>
                <Input
                  value={currentEditingPost.excerpt}
                  onChange={(e) => handleUpdateField('excerpt', e.target.value)}
                  placeholder="記事の概要（検索結果などに表示されます）"
                  size="sm"
                />
              </HStack>

              <HStack>
                <Text fontWeight="bold" minW="100px">カバー画像:</Text>
                <Input
                  value={currentEditingPost.featured_image || ''}
                  onChange={(e) => handleUpdateField('featured_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  size="sm"
                />
              </HStack>

              <HStack align="start">
                <Text fontWeight="bold" minW="100px">タグ:</Text>
                <VStack align="stretch" flex={1}>
                  <HStack wrap="wrap">
                    {currentEditingPost.tags.map((tag) => (
                      <Tag key={tag} size="md" colorScheme="purple">
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                      </Tag>
                    ))}
                  </HStack>
                  <HStack>
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="新しいタグを追加"
                      size="sm"
                    />
                    <Button size="sm" onClick={handleAddTag}>追加</Button>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>

            <Divider />

            {/* 本文編集 */}
            <InlineMarkdownEditor
              value={currentEditingPost.content}
              onChange={(value) => handleUpdateField('content', value)}
              minHeight="500px"
            />
          </VStack>
        </Container>

        {/* 目次 */}
        {tocItems.length > 0 && (
          <ZennStyleTableOfContents items={tocItems} />
        )}
      </Box>
    )
  }

  // 通常の表示（プレビューモード）
  if (!currentPost && !currentEditingPost) {
    return null
  }

  return (
    <Box position="relative">
      <Container maxW="container.lg" py={8}>
        {isAdminMode && currentEditingPost ? (
          // 管理モードでのプレビュー表示
          <VStack spacing={8} align="stretch">
            <InlineEditableField
              value={currentEditingPost.title}
              onChange={(value) => handleUpdateField('title', value)}
              as="heading"
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
              placeholder="記事のタイトルを入力"
              isRequired
            />
            
            {currentEditingPost.tags.length > 0 && (
              <HStack wrap="wrap">
                {currentEditingPost.tags.map((tag) => (
                  <Tag key={tag} size="md" colorScheme="purple">
                    <TagLabel>{tag}</TagLabel>
                  </Tag>
                ))}
              </HStack>
            )}

            <InlineMarkdownEditor
              value={currentEditingPost.content}
              onChange={(value) => handleUpdateField('content', value)}
            />
          </VStack>
        ) : currentPost ? (
          // 通常の表示
          <PostDetail post={currentPost} />
        ) : null}
      </Container>
      
      {/* 目次 */}
      {tocItems.length > 0 && (
        <ZennStyleTableOfContents items={tocItems} />
      )}
    </Box>
  )
}

export default PostPage
