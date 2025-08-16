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
  const titleColor = useColorModeValue('#000000', 'gray.100')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Box className="crystal-glass crystal-glass--surface" borderRadius="xl" p={{ base: 4, md: 6 }}>
      <Heading
        as={RouterLink}
        to={`/posts/${post.slug || post.id}`}
        size="lg"
        fontWeight="700"
        letterSpacing="-0.02em"
        color={titleColor}
        sx={{ '&:visited': { color: '#000' } }}
        mb={2}
        _hover={{ textDecoration: 'none', opacity: 0.9 }}
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
        maxW="740px"
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
