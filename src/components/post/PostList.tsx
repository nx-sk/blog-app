import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { Post } from '../../types'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
}

const PostList = ({ posts }: PostListProps) => {
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
    <Box
      display="flex"
      flexWrap="wrap"
      gap={{ base: '24px', md: '32px' }}
      sx={{
        // 記事数に関わらず左寄せ配置を強制
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        
        '& > *': {
          // Container幅(1280px) - パディング(32px*2) - ガップを考慮した正確な計算
          width: { 
            base: '100%', 
            md: 'calc((100% - 32px) / 2)', 
            lg: 'calc((100% - 64px) / 3)' 
          },
          // 5:3の比率で高さを計算
          height: {
            base: 'calc((100vw - 32px) * 3 / 5)', // モバイル
            md: 'calc(((100vw - 96px) / 2) * 3 / 5)', // タブレット  
            lg: 'calc(((1280px - 128px) / 3) * 3 / 5)', // デスクトップ
          },
          flexShrink: 0,
        }
      }}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  )
}

export default PostList