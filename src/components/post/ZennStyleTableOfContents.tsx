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
  
  const bg = useColorModeValue('rgba(255,255,255,0.65)', 'rgba(17,24,39,0.72)')
  const borderColor = useColorModeValue('rgba(168,85,247,0.28)', 'rgba(168,85,247,0.35)')
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('brand.600', 'brand.300')
  const activeLinkColor = useColorModeValue('brand.700', 'brand.200')
  const activeBorderColor = useColorModeValue('brand.500', 'brand.400')
  const headerColor = useColorModeValue('brand.700','brand.200')

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
      backdropFilter="blur(12px) saturate(160%)"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="16px"
      p={4}
      boxShadow="0 8px 24px rgba(0,0,0,0.2)"
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
        color={headerColor}
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
              bg={activeId === item.id ? (colorMode === 'dark' ? 'rgba(88,28,135,0.35)' : 'rgba(233,213,255,0.8)') : 'transparent'}
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
