import React from 'react'
import {
  Box,
  Heading,
  Text,
  HStack,
  Tag,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Post } from '../../types'
import '../../styles/crystalGlass.css'

interface FullPostCardProps {
  post: Post
}

const FullPostCard = ({ post }: FullPostCardProps) => {
  const textColor = useColorModeValue('text.primary', 'text.primary')
  const metaColor = useColorModeValue('text.meta', 'text.meta')
  // Match the purple tone you preferred (align all titles consistently)
  const titleColor = useColorModeValue('#551A8B', 'brand.300')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Box className="crystal-glass crystal-glass--surface no-hover" borderRadius="md" p={{ base: 4, md: 6 }}>
      <Heading
        as={RouterLink}
        to={`/posts/${post.slug || post.id}`}
        className="post-title-link"
        size="lg"
        fontWeight="700"
        letterSpacing="-0.02em"
        color={titleColor}
        mb={2}
        _hover={{ textDecoration: 'none', color: '#4A148C' }}
      >
        {post.title}
      </Heading>

      <HStack spacing={4} color={metaColor} fontSize="sm" mb={4}>
        <Text>{formatDate(post.published_at || post.created_at)}</Text>
        {post.categories && post.categories.length > 0 && (
          <HStack spacing={2}>
            {post.categories.map((category) => (
              <Tag key={category.id} size="sm" colorScheme="purple">
                {category.name}
              </Tag>
            ))}
          </HStack>
        )}
      </HStack>

      <Box
        className="prose"
        color={textColor}
        lineHeight={1.8}
        fontSize="md"
        maxW="790px"
        mx="auto"
        sx={{
          '& a': { overflowWrap: 'anywhere', wordBreak: 'break-word' },
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </Box>
    </Box>
  )
}

export default FullPostCard
