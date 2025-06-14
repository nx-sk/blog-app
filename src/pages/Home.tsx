import React, { useEffect } from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchPostsStart } from '../store/slices/postsSlice'
import PostList from '../components/post/PostList'
import Loading from '../components/common/Loading'

const Home: React.FC = () => {
  const dispatch = useDispatch()
  const { posts, loading, error } = useSelector((state: RootState) => state.posts)

  useEffect(() => {
    dispatch(fetchPostsStart())
  }, [dispatch])

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

  return (
    <Box>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" mb={4}>
          Personal Blog
        </Heading>
        <Text fontSize="lg" color="gray.600">
          技術記事や日常の思考を綴るブログ
        </Text>
      </Box>

      <PostList posts={posts} />
    </Box>
  )
}

export default Home