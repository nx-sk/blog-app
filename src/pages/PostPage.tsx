import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchPostStart } from '../store/slices/postsSlice'
import PostDetail from '../components/post/PostDetail'
import Loading from '../components/common/Loading'
import { Box, Text } from '@chakra-ui/react'

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useDispatch()
  const { currentPost, loading, error } = useSelector((state: RootState) => state.posts)

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostStart(slug))
    }
  }, [dispatch, slug])

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

  return <PostDetail post={currentPost} />
}

export default PostPage