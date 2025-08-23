import React, { useState, useEffect, useRef } from 'react'
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
  Collapse,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Image,
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
import { supabase } from '../../services/supabase'
import Loading from '../../components/common/Loading'
import '../../styles/crystalGlass.css'

const PostEditor = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  
  const { currentPost, loading } = useSelector((state: RootState) => state.posts)
  const { user } = useSelector((state: RootState) => state.auth)
  const details = useDisclosure()
  const imagePicker = useDisclosure()
  const [pickerImages, setPickerImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        post: postData,
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
        post: draftData,
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

  // 画像ピッカー
  const listImages = async () => {
    try {
      const prefixes: string[] = []
      if (isEdit && currentPost?.id) prefixes.push(`posts/${currentPost.id}`)
      prefixes.push('temp')
      const urls: string[] = []
      for (const prefix of prefixes) {
        const { data, error } = await supabase.storage.from('media').list(prefix, {
          limit: 50,
          sortBy: { column: 'created_at', order: 'desc' as const },
        })
        if (error) continue
        for (const f of data || []) {
          if (f.name) {
            const { data: pub } = supabase.storage.from('media').getPublicUrl(`${prefix}/${f.name}`)
            if (pub?.publicUrl) urls.push(pub.publicUrl)
          }
        }
      }
      setPickerImages(urls)
    } catch (e) {}
  }

  const uploadFeatured = async (file: File) => {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const prefix = isEdit && currentPost?.id ? `posts/${currentPost.id}` : 'temp'
    const { error } = await supabase.storage.from('media').upload(`${prefix}/${fileName}`, file, { cacheControl: '3600', upsert: false })
    if (!error) {
      const { data: pub } = supabase.storage.from('media').getPublicUrl(`${prefix}/${fileName}`)
      if (pub?.publicUrl) {
        handleChange('featured_image', pub.publicUrl)
        toast({ title: 'アイキャッチを設定しました', status: 'success', duration: 2000, isClosable: true })
      }
    } else {
      toast({ title: 'アップロードに失敗しました', status: 'error' })
    }
  }

  const handlePasteFeatured = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      if (it.type.startsWith('image/')) {
        e.preventDefault()
        const file = it.getAsFile()
        if (!file) continue
        await uploadFeatured(file)
        break
      }
    }
  }

  const handleDropFeatured = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const dt = e.dataTransfer
    if (dt?.files && dt.files.length > 0) {
      const file = dt.files[0]
      if (file.type.startsWith('image/')) {
        await uploadFeatured(file)
      } else {
        toast({ title: '画像ファイルをドロップしてください', status: 'warning', duration: 2000 })
      }
    }
  }

  const handleDragOverFeatured = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeaveFeatured = () => setIsDragging(false)

  const handlePickLocalFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      await uploadFeatured(file)
    }
    e.target.value = ''
  }

  return (
    <>
    <Box w="100%" maxW={{ base: '100%', xl: '1200px', '2xl': '1400px' }} mx="auto" px={4} py={6}>
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

        {/* タイトル行（シンプル） */}
        <Box className="crystal-glass crystal-glass--surface" p={4} borderRadius="md">
          <FormControl isRequired>
            <FormLabel mb={1}>タイトル</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="記事のタイトル"
              size="md"
            />
          </FormControl>
          <HStack justify="flex-end" mt={2}>
            <Button size="sm" variant="ghost" onClick={details.onToggle}>
              {details.isOpen ? '詳細設定を隠す' : '詳細設定を表示'}
            </Button>
          </HStack>
        </Box>

        {/* 詳細設定（折りたたみ） */}
        <Collapse in={details.isOpen} animateOpacity>
          <HStack spacing={4} align="start" className="crystal-glass crystal-glass--elevated" p={4} borderRadius="md">
            <FormControl flex={1}>
              <FormLabel>スラッグ</FormLabel>
              <Input
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="自動生成: YYYYMMDD"
              />
            </FormControl>
            <FormControl flex={2}>
              <FormLabel>概要</FormLabel>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="記事の概要（任意）"
                rows={2}
              />
            </FormControl>
            <FormControl flex={2}>
              <FormLabel>アイキャッチ画像（D&D / PASTE 可）</FormLabel>
              <Box
                onDrop={handleDropFeatured}
                onDragOver={handleDragOverFeatured}
                onDragLeave={handleDragLeaveFeatured}
                p={3}
                border="2px dashed"
                borderColor={isDragging ? 'purple.400' : 'gray.300'}
                borderRadius="md"
                bg={isDragging ? 'purple.50' : 'transparent'}
              >
                <HStack align="center" spacing={3}>
                  {formData.featured_image && (
                    <Image src={formData.featured_image} alt="preview" boxSize="64px" objectFit="cover" borderRadius="md" />
                  )}
                  <Input
                    value={formData.featured_image}
                    onChange={(e) => handleChange('featured_image', e.target.value)}
                    onPaste={handlePasteFeatured}
                    placeholder="画像URL または ここに画像をペースト / ドロップ"
                  />
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePickLocalFile} />
                  <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>選択</Button>
                  <Button size="sm" variant="ghost" onClick={async () => { await listImages(); imagePicker.onOpen() }}>一覧</Button>
                </HStack>
              </Box>
            </FormControl>
          </HStack>
        </Collapse>

        <Divider />

        <Box className="crystal-glass crystal-glass--elevated" p={4} borderRadius="md">
          <FormControl isRequired>
            <FormLabel>本文（Markdown）</FormLabel>
            <EnhancedPlainTextEditor
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
              postId={currentPost?.id?.toString()}
            />
          </FormControl>
        </Box>
      </VStack>
    </Box>
    <Modal isOpen={imagePicker.isOpen} onClose={imagePicker.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>アップロード済み画像から選択</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 3, md: 4 }} spacing={3}>
            {pickerImages.map((url) => (
              <Box key={url} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden" cursor="pointer" onClick={() => { handleChange('featured_image', url); imagePicker.onClose() }}>
                <Image src={url} alt="image" objectFit="cover" w="100%" h="80px" />
              </Box>
            ))}
          </SimpleGrid>
          {pickerImages.length === 0 && (
            <Box color="gray.500" mt={2}>画像が見つかりません。記事本文で画像を貼り付けると候補に表示されます。</Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  )
}

export default PostEditor
