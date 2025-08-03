import { useEffect } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchPostsStart } from '../store/slices/postsSlice'
import PostList from '../components/post/PostList'
import Loading from '../components/common/Loading'
import '../styles/crystalGlass.css'

const Home = () => {
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
        <Box className="crystal-glass crystal-glass--elevated" maxW="400px" mx="auto">
          <Text color="red.500" fontSize="sm">
            エラーが発生しました: {error}
          </Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <PostList posts={posts} />
    </Box>
  )
}

export default Home