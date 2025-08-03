import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Switch,
  useToast,
  Heading,
  Divider,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  createPostStart,
  updatePostStart,
  fetchPostStart,
  clearCurrentPost,
} from '../../store/slices/postsSlice'
import EnhancedPlainTextEditor from '../../components/editor/EnhancedPlainTextEditor'
import Loading from '../../components/common/Loading'

const PostEditor = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  
  const { currentPost, loading } = useSelector((state: RootState) => state.posts)
  const { user } = useSelector((state: RootState) => state.auth)

  const isEdit = Boolean(id && id !== 'new')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft' as 'draft' | 'published',
  })

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchPostStart(id))
    } else {
      dispatch(clearCurrentPost())
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (currentPost && isEdit) {
      setFormData({
        title: currentPost.title || '',
        slug: currentPost.slug || '',
        content: currentPost.content || '',
        excerpt: currentPost.excerpt || '',
        featured_image: currentPost.featured_image || '',
        status: currentPost.status || 'draft',
      })
    }
  }, [currentPost, isEdit])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    // タイトルが変更されたときにスラッグを自動生成（新規作成時のみ）
    if (field === 'title' && !isEdit && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({
        ...prev,
        slug,
      }))
    }
  }

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'エラー',
        description: 'タイトルと本文は必須です',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // スラッグが空の場合はYYYYMMDD形式で自動生成
    let finalSlug = formData.slug.trim()
    if (!finalSlug) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      finalSlug = `${year}${month}${day}`
    }

    const postData = {
      ...formData,
      slug: finalSlug,
      author_id: user?.id || '',
      published_at: formData.status === 'published' ? new Date().toISOString() : undefined,
    }

    if (isEdit && currentPost) {
      dispatch(updatePostStart({
        id: currentPost.id,
        updates: postData,
      }))
    } else {
      dispatch(createPostStart(postData))
    }

    toast({
      title: isEdit ? '記事を更新しました' : '記事を作成しました',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    navigate('/admin/posts')
  }

  const handleSaveDraft = () => {
    // スラッグが空の場合はYYYYMMDD形式で自動生成
    let finalSlug = formData.slug.trim()
    if (!finalSlug) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      finalSlug = `${year}${month}${day}`
    }

    const draftData = {
      ...formData,
      slug: finalSlug,
      status: 'draft' as const,
      author_id: user?.id || '',
    }

    if (isEdit && currentPost) {
      dispatch(updatePostStart({
        id: currentPost.id,
        updates: draftData,
      }))
    } else {
      dispatch(createPostStart(draftData))
    }

    toast({
      title: '下書きを保存しました',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  if (loading && isEdit) {
    return <Loading />
  }

  return (
    <Box maxW="100%" mx="auto" px={4} py={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading as="h1" size="xl">
            {isEdit ? '記事編集' : '新規記事作成'}
          </Heading>
          
          <HStack spacing={4}>
            <FormControl display="flex" alignItems="center" width="auto">
              <FormLabel htmlFor="publish-switch" mb="0" mr={2}>
                公開する
              </FormLabel>
              <Switch
                id="publish-switch"
                isChecked={formData.status === 'published'}
                onChange={(e) =>
                  handleChange('status', e.target.checked ? 'published' : 'draft')
                }
              />
            </FormControl>
            
            <Button
              variant="outline"
              onClick={() => navigate('/admin/posts')}
            >
              キャンセル
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              isLoading={loading}
            >
              下書き保存
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              isLoading={loading}
            >
              {isEdit ? '更新' : '作成'}
            </Button>
          </HStack>
        </HStack>

        <HStack spacing={4} align="start">
          <FormControl isRequired flex={2}>
            <FormLabel>タイトル</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="記事のタイトル"
            />
          </FormControl>

          <FormControl flex={1}>
            <FormLabel>スラッグ</FormLabel>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="自動生成: YYYYMMDD"
            />
          </FormControl>
        </HStack>

        <HStack spacing={4} align="start">
          <FormControl flex={2}>
            <FormLabel>概要</FormLabel>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="記事の概要（任意）"
              rows={2}
            />
          </FormControl>

          <FormControl flex={1}>
            <FormLabel>アイキャッチ画像URL</FormLabel>
            <Input
              value={formData.featured_image}
              onChange={(e) => handleChange('featured_image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </FormControl>
        </HStack>

        <Divider />

        <FormControl isRequired>
          <FormLabel>本文</FormLabel>
          <EnhancedPlainTextEditor
            value={formData.content}
            onChange={(value) => handleChange('content', value)}
            postId={currentPost?.id?.toString()}
          />
        </FormControl>
      </VStack>
    </Box>
  )
}

export default PostEditor