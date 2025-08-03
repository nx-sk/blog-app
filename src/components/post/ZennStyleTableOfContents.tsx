import React, { useState, useEffect } from 'react'
import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface ZennStyleTableOfContentsProps {
  items: TOCItem[]
}

const ZennStyleTableOfContents = ({ items }: ZennStyleTableOfContentsProps) => {
  const { colorMode } = useColorMode()
  const [activeId, setActiveId] = useState<string>('')
  
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const linkColor = useColorModeValue('gray.600', 'gray.300')
  const linkHoverColor = useColorModeValue('blue.600', 'blue.300')
  const activeLinkColor = useColorModeValue('blue.600', 'blue.300')
  const activeBorderColor = useColorModeValue('blue.500', 'blue.400')

  // スクロール位置に基づいてアクティブな見出しを更新
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // 最初に見えている見出しをアクティブにする
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    )

    // 全ての見出し要素を監視
    items.forEach(item => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (items.length === 0) return null

  return (
    <Box
      position="fixed"
      right="40px"
      top="50%"
      transform="translateY(-50%)"
      w="240px"
      maxH="70vh"
      overflowY="auto"
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      boxShadow="lg"
      zIndex={10}
      display={{ base: 'none', xl: 'block' }}
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: colorMode === 'dark' ? '#4A5568' : '#CBD5E0',
          borderRadius: '2px',
        },
      }}
    >
      <Text 
        fontSize="xs" 
        fontWeight="bold" 
        color={linkColor}
        mb={3}
        textTransform="uppercase"
        letterSpacing="wider"
      >
        目次
      </Text>
      
      <VStack spacing={0} align="stretch">
        {items.map((item) => (
          <Box
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            cursor="pointer"
            position="relative"
            _hover={{
              '& .toc-text': {
                color: linkHoverColor,
              }
            }}
          >
            {/* アクティブインジケータ */}
            {activeId === item.id && (
              <Box
                position="absolute"
                left="-12px"
                top="0"
                bottom="0"
                w="2px"
                bg={activeBorderColor}
                borderRadius="1px"
              />
            )}
            
            <Text
              className="toc-text"
              fontSize="sm"
              color={activeId === item.id ? activeLinkColor : linkColor}
              fontWeight={activeId === item.id ? '600' : '400'}
              pl={`${(item.level - 1) * 12}px`}
              py={2}
              px={2}
              borderRadius="md"
              transition="all 0.2s"
              noOfLines={2}
              lineHeight="1.4"
              bg={activeId === item.id ? 
                (colorMode === 'dark' ? 'blue.900' : 'blue.50') : 
                'transparent'
              }
            >
              {item.text}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default ZennStyleTableOfContents