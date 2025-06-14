import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Image,
  HStack,
  Tag,
  VStack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useColorMode } from '@chakra-ui/react'
import { Post } from '../../types'
import TableOfContents from './TableOfContents'

interface PostDetailProps {
  post: Post
}

interface TOCItem {
  id: string
  text: string
  level: number
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  const { colorMode } = useColorMode()
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const metaColor = useColorModeValue('gray.500', 'gray.400')
  const codeStyle = colorMode === 'dark' ? oneDark : oneLight

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // マークダウンから見出しを抽出してTOCを生成
  useEffect(() => {
    const headings = post.content.match(/^#{1,6}\s+.+$/gm)
    if (headings) {
      const items: TOCItem[] = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 1
        const text = heading.replace(/^#+\s+/, '')
        const id = `heading-${index}`
        return { id, text, level }
      })
      setTocItems(items)
    }
  }, [post.content])

  // 見出しにIDを追加するカスタムレンダラー
  const components = {
    h1: ({ children, ...props }: any) => {
      const index = tocItems.findIndex(item => item.text === children[0] && item.level === 1)
      const id = index !== -1 ? tocItems[index].id : undefined
      return <Heading as="h1" size="xl" mt={8} mb={4} id={id} {...props}>{children}</Heading>
    },
    h2: ({ children, ...props }: any) => {
      const index = tocItems.findIndex(item => item.text === children[0] && item.level === 2)
      const id = index !== -1 ? tocItems[index].id : undefined
      return <Heading as="h2" size="lg" mt={6} mb={3} id={id} {...props}>{children}</Heading>
    },
    h3: ({ children, ...props }: any) => {
      const index = tocItems.findIndex(item => item.text === children[0] && item.level === 3)
      const id = index !== -1 ? tocItems[index].id : undefined
      return <Heading as="h3" size="md" mt={4} mb={2} id={id} {...props}>{children}</Heading>
    },
    h4: ({ children, ...props }: any) => {
      const index = tocItems.findIndex(item => item.text === children[0] && item.level === 4)
      const id = index !== -1 ? tocItems[index].id : undefined
      return <Heading as="h4" size="sm" mt={3} mb={2} id={id} {...props}>{children}</Heading>
    },
    h5: ({ children, ...props }: any) => {
      const index = tocItems.findIndex(item => item.text === children[0] && item.level === 5)
      const id = index !== -1 ? tocItems[index].id : undefined
      return <Heading as="h5" size="sm" mt={2} mb={1} id={id} {...props}>{children}</Heading>
    },
    h6: ({ children, ...props }: any) => {
      const index = tocItems.findIndex(item => item.text === children[0] && item.level === 6)
      const id = index !== -1 ? tocItems[index].id : undefined
      return <Heading as="h6" size="xs" mt={2} mb={1} id={id} {...props}>{children}</Heading>
    },
    p: ({ children, ...props }: any) => (
      <Text mb={4} lineHeight="1.7" color={textColor} {...props}>{children}</Text>
    ),
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <Box my={4}>
          <SyntaxHighlighter
            style={codeStyle}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </Box>
      ) : (
        <Box
          as="code"
          px={2}
          py={1}
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
          borderRadius="md"
          fontSize="sm"
          {...props}
        >
          {children}
        </Box>
      )
    },
    blockquote: ({ children, ...props }: any) => (
      <Box
        borderLeft="4px solid"
        borderColor="brand.500"
        pl={4}
        py={2}
        my={4}
        bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
        fontStyle="italic"
        {...props}
      >
        {children}
      </Box>
    ),
    ul: ({ children, ...props }: any) => (
      <Box as="ul" pl={4} mb={4} {...props}>{children}</Box>
    ),
    ol: ({ children, ...props }: any) => (
      <Box as="ol" pl={4} mb={4} {...props}>{children}</Box>
    ),
    li: ({ children, ...props }: any) => (
      <Box as="li" mb={1} {...props}>{children}</Box>
    ),
  }

  return (
    <Box maxW="4xl" mx="auto">
      {/* ヘッダー部分 */}
      <VStack spacing={4} align="stretch" mb={8}>
        <Heading as="h1" size="2xl" lineHeight="1.2">
          {post.title}
        </Heading>
        
        <HStack spacing={4} color={metaColor} fontSize="sm">
          <Text>
            {formatDate(post.published_at || post.created_at)}
          </Text>
          {post.categories && post.categories.length > 0 && (
            <HStack spacing={2}>
              {post.categories.map((category) => (
                <Tag key={category.id} size="sm" colorScheme="blue">
                  {category.name}
                </Tag>
              ))}
            </HStack>
          )}
        </HStack>

        {post.featured_image && (
          <Image
            src={post.featured_image}
            alt={post.title}
            borderRadius="md"
            maxH="400px"
            objectFit="cover"
            w="100%"
          />
        )}
      </VStack>

      <Box display="flex" gap={8} alignItems="flex-start">
        {/* メインコンテンツ */}
        <Box flex={1}>
          <Divider mb={6} />
          <ReactMarkdown components={components}>
            {post.content}
          </ReactMarkdown>
        </Box>

        {/* 目次 */}
        {tocItems.length > 0 && (
          <Box
            position="sticky"
            top="100px"
            w="250px"
            display={{ base: 'none', lg: 'block' }}
          >
            <TableOfContents items={tocItems} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PostDetail