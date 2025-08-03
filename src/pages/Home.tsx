import React, { useEffect } from 'react'
import { Box, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchPostsStart } from '../store/slices/postsSlice'
import PostList from '../components/post/PostList'
import Loading from '../components/common/Loading'
import '../styles/crystalGlass.css'

const Home: React.FC = () => {
  const dispatch = useDispatch()
  const { posts, loading, error } = useSelector((state: RootState) => state.posts)
  
  // Move hooks to top level
  const titleColor = useColorModeValue('gray.900', 'white')
  const subtitleColor = useColorModeValue('gray.600', 'gray.400')

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
      <VStack spacing={20} align="center" mb={20}>
        <Box textAlign="center" maxW="600px">
          <Heading 
            as="h1" 
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="600"
            letterSpacing="-0.03em"
            lineHeight="1.1"
            mb={6}
            color={titleColor}
          >
            Personal Blog
          </Heading>
          <Text 
            fontSize={{ base: 'md', md: 'lg' }}
            color={subtitleColor}
            maxW="480px"
            mx="auto"
            lineHeight="1.6"
            fontWeight="400"
          >
            技術と思考の記録
          </Text>
        </Box>
      </VStack>

      <PostList posts={posts} />
    </Box>
  )
}

export default Home