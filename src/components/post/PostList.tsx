import React from 'react'
import { SimpleGrid, Box, Text } from '@chakra-ui/react'
import { Post } from '../../types'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          記事がありません
        </Text>
      </Box>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </SimpleGrid>
  )
}

export default PostList