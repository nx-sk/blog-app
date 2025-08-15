import React from 'react'
import { Box, Heading, Text, HStack, Tag, Image, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Post } from '../../types'
import '../../styles/crystalGlass.css'

interface FeaturePostCardProps {
  post: Post
}

const FeaturePostCard = ({ post }: FeaturePostCardProps) => {
  const metaColor = useColorModeValue('gray.300', 'gray.300')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Box position="relative" borderRadius="xl" overflow="hidden" className="crystal-glass crystal-glass--elevated" h={{ base: '220px', md: '280px', lg: '360px' }}>
      {post.featured_image && (
        <Image src={post.featured_image} alt={post.title} position="absolute" inset={0} w="100%" h="100%" objectFit="cover" transform="scale(1.02)" transition="transform 0.8s ease" _groupHover={{ transform: 'scale(1.06)' }} />
      )}
      <Box position="absolute" inset={0} bgGradient="linear(to-b, blackAlpha.200, blackAlpha.700)" />
      <Box position="absolute" inset={0} display="flex" flexDirection="column" justifyContent="flex-end" p={{ base: 4, md: 6 }}>
        <HStack spacing={3} color={metaColor} fontSize="xs" mb={2}>
          <Text>{formatDate(post.published_at || post.created_at)}</Text>
          {post.categories && post.categories.length > 0 && (
            <HStack spacing={2}>
              {post.categories.slice(0, 2).map((category) => (
                <Tag key={category.id} size="sm" colorScheme="purple" variant="subtle">
                  {category.name}
                </Tag>
              ))}
            </HStack>
          )}
        </HStack>
        <Heading as={RouterLink} to={`/posts/${post.slug || post.id}`} size="lg" lineHeight="1.2" color="white" _hover={{ textDecoration: 'none', opacity: 0.95 }}>
          {post.title}
        </Heading>
        {post.excerpt && (
          <Text noOfLines={2} mt={2} color="gray.200" fontSize="sm">
            {post.excerpt}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default FeaturePostCard

