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
      sx={{
        // 親から高さと幅を継承（PostListで計算済み）
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {post.featured_image && (
        <Box 
          position="relative" 
          overflow="hidden" 
          borderRadius="16px 16px 0 0"
          margin="-1px -1px 0 -1px"
          borderBottom="1px solid"
          borderColor="var(--crystal-edge)"
          flex="0 0 55%" // 画像が55%の高さを占める
        >
          <Image
            src={post.featured_image}
            alt={post.title}
            h="100%"
            w="100%"
            objectFit="cover"
            transition="all 0.6s cubic-bezier(0.23, 1, 0.32, 1)"
            _hover={{
              transform: 'scale(1.02)',
            }}
          />
        </Box>
      )}
      
      <Box 
        className="crystal-card__body"
        flex="1" // 残りの高さを占める
        sx={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 0, // flexで正しく縮小されるように
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
            fontSize="2xs"
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
            <Box as="span" fontSize="2xs">→</Box>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default PostCard