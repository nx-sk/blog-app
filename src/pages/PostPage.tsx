import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchPostStart } from '../store/slices/postsSlice'
import PostDetail from '../components/post/PostDetail'
import Loading from '../components/common/Loading'
import ZennStyleTableOfContents from '../components/post/ZennStyleTableOfContents'
import { Box, Text, Container } from '@chakra-ui/react'

interface TOCItem {
  id: string
  text: string
  level: number
}

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useDispatch()
  const { currentPost, loading, error } = useSelector((state: RootState) => state.posts)
  const [tocItems, setTocItems] = useState<TOCItem[]>([])

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostStart(slug))
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (currentPost?.content) {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm
      const items: TOCItem[] = []
      let match

      while ((match = headingRegex.exec(currentPost.content)) !== null) {
        const level = match[1].length
        const text = match[2]
        const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
        
        // #と##のみを目次に含める
        if (level <= 2) {
          items.push({ id, text, level })
        }
      }

      setTocItems(items)
    }
  }, [currentPost])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">エラーが発生しました: {error}</Text>
      </Box>
    )
  }

  if (!currentPost) {
    return (
      <Box textAlign="center" py={10}>
        <Text>記事が見つかりません</Text>
      </Box>
    )
  }

  return (
    <Box position="relative">
      <Container maxW="container.lg" py={8}>
        <PostDetail post={currentPost} />
      </Container>
      
      {/* Zennスタイルの目次 */}
      {tocItems.length > 0 && (
        <ZennStyleTableOfContents items={tocItems} />
      )}
    </Box>
  )
}

export default PostPage