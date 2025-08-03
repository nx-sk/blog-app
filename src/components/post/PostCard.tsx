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

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const dateColor = useColorModeValue('gray.500', 'gray.400')
  const titleColor = useColorModeValue('gray.900', 'white')
  const tagColor = useColorModeValue('gray.600', 'gray.400')
  const linkColor = useColorModeValue('blue.600', 'blue.400')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Box 
      as={RouterLink}
      to={`/posts/${post.slug || post.id}`}
      className="crystal-card"
      display="block"
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
      transition="all 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
    >
      {post.featured_image && (
        <Box 
          position="relative" 
          overflow="hidden" 
          borderRadius="16px 16px 0 0"
          margin="-1px -1px 0 -1px"
          borderBottom="1px solid"
          borderColor="var(--crystal-edge)"
        >
          <Image
            src={post.featured_image}
            alt={post.title}
            h="240px"
            w="100%"
            objectFit="cover"
            transition="all 0.6s cubic-bezier(0.23, 1, 0.32, 1)"
            _hover={{
              transform: 'scale(1.02)',
            }}
          />
        </Box>
      )}
      
      <Box className="crystal-card__body">
        <Stack spacing={4}>
          <Heading 
            size="md" 
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
              fontSize="sm"
              lineHeight="1.6"
            >
              {post.excerpt}
            </Text>
          )}

          <HStack spacing={2} flexWrap="wrap">
            {post.categories && post.categories.map((category) => (
              <Tag 
                key={category.id} 
                size="sm" 
                borderRadius="6px"
                bg="transparent"
                color={tagColor}
                border="1px solid"
                borderColor="var(--crystal-edge)"
                px={2}
                py={0.5}
                fontSize="xs"
                fontWeight="500"
              >
                {category.name}
              </Tag>
            ))}
          </HStack>

          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            pt={3}
            borderTop="1px solid"
            borderColor="var(--crystal-edge)"
          >
            <Text 
              fontSize="xs" 
              color={dateColor}
              fontWeight="500"
            >
              {formatDate(post.published_at || post.created_at)}
            </Text>

            <Text
              fontSize="xs"
              fontWeight="600"
              color={linkColor}
              display="flex"
              alignItems="center"
              gap={1}
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateX(2px)',
              }}
            >
              続きを読む
              <Box as="span" fontSize="xs">→</Box>
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default PostCard