import React from 'react'
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  Tag,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Post } from '../../types'

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card
      bg={cardBg}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'lg',
      }}
    >
      {post.featured_image && (
        <Image
          src={post.featured_image}
          alt={post.title}
          h="200px"
          objectFit="cover"
        />
      )}
      
      <CardBody>
        <Stack spacing={3}>
          <Heading size="md" noOfLines={2}>
            {post.title}
          </Heading>
          
          {post.excerpt && (
            <Text color={textColor} noOfLines={3}>
              {post.excerpt}
            </Text>
          )}

          <HStack spacing={2} flexWrap="wrap">
            {post.categories && post.categories.map((category) => (
              <Tag key={category.id} size="sm" colorScheme="blue">
                {category.name}
              </Tag>
            ))}
          </HStack>

          <Text fontSize="sm" color={textColor}>
            {formatDate(post.published_at || post.created_at)}
          </Text>

          <Button
            as={RouterLink}
            to={`/posts/${post.slug || post.id}`}
            colorScheme="brand"
            variant="outline"
            size="sm"
          >
            続きを読む
          </Button>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default PostCard