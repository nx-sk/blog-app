import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Post } from '../../types'
import PostCard from './PostCard'
import FeaturePostCard from './FeaturePostCard'
import NewPostCard from './NewPostCard'

interface PostListProps {
  posts: Post[]
}

const PostList = ({ posts }: PostListProps) => {
  const { isAdminMode } = useSelector((state: RootState) => state.adminMode)

  if (posts.length === 0 && !isAdminMode) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.400">
          記事がありません
        </Text>
      </Box>
    )
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }}
      gap={{ base: 4, md: 6 }}
    >
      {/* 管理モード時は新規記事作成カードを最初に表示 */}
      {isAdminMode && <NewPostCard />}
      
      {posts.length > 0 && (
        <Box gridColumn={{ base: 'auto', md: '1 / -1', lg: '1 / span 2' }}>
          <FeaturePostCard post={posts[0]} />
        </Box>
      )}

      {posts.slice(1).map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* 記事がない場合のメッセージ（管理モード時） */}
      {posts.length === 0 && isAdminMode && (
        <Box
          gridColumn="1 / -1"
          textAlign="center"
          py={10}
          color="gray.400"
          fontSize="sm"
        >
          まだ記事がありません。新規記事作成カードから記事を作成してみましょう。
        </Box>
      )}
    </Box>
  )
}

export default PostList
