import React from 'react'
import {
  Image,
  Stack,
  Heading,
  Text,
  Tag,
  HStack,
  Box,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Post } from '../../types'
import '../../styles/crystalGlass.css'

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const dateColor = useColorModeValue('gray.500', 'gray.400')
  const titleColor = useColorModeValue('gray.900', 'white')
  const tagColor = useColorModeValue('gray.600', 'gray.400')
  const linkColor = useColorModeValue('brand.600', 'brand.400')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Box 
      className="glass-card"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
      display="flex"
      flexDirection="column"
      h="100%"
    >
      {/* 通常カードではアイキャッチは表示しない（Featureに委譲） */}
      
      <Box 
        className="crystal-card__body"
        flex="1"
        sx={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 0,
        }}
      >
        <Stack spacing={3} flex="1">
          <Heading 
            size="sm" 
            noOfLines={2}
            fontWeight="600"
            letterSpacing="-0.02em"
            lineHeight="1.3"
            color={titleColor}
          >
            {post.title}
          </Heading>
          
          {post.excerpt && (
            <Text 
              color={textColor} 
              noOfLines={2}
              fontSize="xs"
              lineHeight="1.5"
            >
              {post.excerpt}
            </Text>
          )}

          {post.categories && post.categories.length > 0 && (
            <HStack spacing={1} flexWrap="wrap">
              {post.categories.slice(0, 2).map((category) => (
                <Tag 
                  key={category.id} 
                  size="xs" 
                  borderRadius="4px"
                  bg="transparent"
                  color={tagColor}
                  border="1px solid"
                  borderColor="var(--crystal-edge)"
                  px={1.5}
                  py={0.5}
                  fontSize="2xs"
                  fontWeight="500"
                >
                  {category.name}
                </Tag>
              ))}
            </HStack>
          )}
        </Stack>

        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center"
          pt={2}
          borderTop="1px solid"
          borderColor="var(--crystal-edge)"
          mt="auto"
        >
          <Text 
            fontSize="2xs" 
            color={dateColor}
            fontWeight="500"
          >
            {formatDate(post.published_at || post.created_at)}
          </Text>

          <Text
            as={RouterLink}
            to={`/posts/${post.slug || post.id}`}
            fontSize="2xs"
            fontWeight="600"
            color={linkColor}
            display="flex"
            alignItems="center"
            gap={1}
            transition="all 0.3s ease"
            textDecoration="none"
            _hover={{
              transform: 'translateX(2px)',
              textDecoration: 'none',
            }}
          >
            続きを読む
            <Box as="span" fontSize="2xs">→</Box>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default PostCard
