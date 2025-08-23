import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
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
// ZennStyleTableOfContents is rendered by PostPage (fixed right). Remove inline TOC here.

interface PostDetailProps {
  post: Post
}

interface TOCItem { id: string; text: string; level: number }

// シンプルなスラッグ生成（見出しテキスト -> id）
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const PostDetail = ({ post }: PostDetailProps) => {
  const { colorMode } = useColorMode()
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  
  const textColor = useColorModeValue('#000000', 'gray.100')
  const metaColor = useColorModeValue('#333333', 'gray.400')
  const codeStyle = colorMode === 'dark' ? oneDark : oneLight

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // マークダウンから見出しを抽出してTOCを生成（slug一致）
  useEffect(() => {
    const headings = post.content.match(/^#{1,6}\s+.+$/gm)
    if (headings) {
      const items: TOCItem[] = headings.map((heading) => {
        const level = heading.match(/^#+/)?.[0].length || 1
        const text = heading.replace(/^#+\s+/, '')
        const id = slugify(text)
        return { id, text, level }
      })
      setTocItems(items)
    } else {
      setTocItems([])
    }
  }, [post.content])

  // 見出しにIDを追加するカスタムレンダラー
  const getText = (children: any): string => {
    if (typeof children === 'string') return children
    if (Array.isArray(children)) return children.map(getText).join('')
    if (children && typeof children === 'object' && 'props' in children) {
      return getText((children as any).props?.children)
    }
    return ''
  }

  const components = {
    h1: ({ children, ...props }: any) => {
      const text = getText(children)
      const id = slugify(text)
      return <Heading as="h1" size="xl" mt={8} mb={4} id={id} {...props}>{children}</Heading>
    },
    h2: ({ children, ...props }: any) => {
      const text = getText(children)
      const id = slugify(text)
      return <Heading as="h2" size="lg" mt={6} mb={3} id={id} {...props}>{children}</Heading>
    },
    h3: ({ children, ...props }: any) => {
      const text = getText(children)
      const id = slugify(text)
      return <Heading as="h3" size="md" mt={4} mb={2} id={id} {...props}>{children}</Heading>
    },
    h4: ({ children, ...props }: any) => {
      const text = getText(children)
      const id = slugify(text)
      return <Heading as="h4" size="sm" mt={3} mb={2} id={id} {...props}>{children}</Heading>
    },
    h5: ({ children, ...props }: any) => {
      const text = getText(children)
      const id = slugify(text)
      return <Heading as="h5" size="sm" mt={2} mb={1} id={id} {...props}>{children}</Heading>
    },
    h6: ({ children, ...props }: any) => {
      const text = getText(children)
      const id = slugify(text)
      return <Heading as="h6" size="xs" mt={2} mb={1} id={id} {...props}>{children}</Heading>
    },
    p: ({ children, ...props }: any) => (
      <Text mb={4} lineHeight="1.7" color={textColor} fontSize="11.5px" {...props}>{children}</Text>
    ),
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <Box my={4}>
          <SyntaxHighlighter
            style={codeStyle}
            language={match[1]}
            PreTag="div"
            wrapLongLines
            customStyle={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowX: 'unset', fontSize: '10.5px' }}
            codeTagProps={{ style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '10.5px' } }}
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
        fontSize="11.5px"
        {...props}
      >
        {children}
      </Box>
    ),
    ul: ({ children, ...props }: any) => (
      <Box as="ul" pl={4} mb={4} fontSize="11.5px" {...props}>{children}</Box>
    ),
    ol: ({ children, ...props }: any) => (
      <Box as="ol" pl={4} mb={4} fontSize="11.5px" {...props}>{children}</Box>
    ),
    li: ({ children, ...props }: any) => (
      <Box as="li" mb={1} fontSize="11.5px" {...props}>{children}</Box>
    ),
  }

  return (
    <Box>
      {/* 記事全体のグラス背景ラッパー */}
      <Box className="crystal-glass crystal-glass--surface no-hover" p={{ base: 4, md: 6 }} borderRadius="md" w="100%">
        {/* 固定幅の本文カラム（上限 790px・左寄せ） */}
        <Box
          className="prose"
          maxW="790px"
          w="100%"
          sx={{
            '& a': { overflowWrap: 'anywhere', wordBreak: 'break-word' },
            '& h1, & h2, & h3, & h4, & h5, & h6': { scrollMarginTop: '100px' },
          }}
        >
          {/* ヘッダー部分（アイキャッチは表示しない） */}
        <VStack spacing={3} align="stretch" mb={6}>
            <Heading as="h1" size="2xl" lineHeight="1.2" color="#000">
              {post.title}
            </Heading>

          <HStack spacing={4} color={metaColor} fontSize="sm">
            <Text>
              {formatDate(post.published_at || post.created_at)}
            </Text>
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
        </VStack>

        <Divider mb={6} />
        <ReactMarkdown
          components={{
            ...components,
            img: ({ src, alt, ...props }: any) => (
              <Box as="img" src={src} alt={alt} my={4} borderRadius="md" maxW="100%" display="block" {...props} />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
        </Box>
      </Box>
    </Box>
  )
}

export default PostDetail
