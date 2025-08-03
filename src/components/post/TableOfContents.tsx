import React from 'react'
import {
  Box,
  Heading,
  VStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TOCItem[]
}

const TableOfContents = ({ items }: TableOfContentsProps) => {
  const bg = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const linkColor = useColorModeValue('gray.600', 'gray.300')
  const linkHoverColor = useColorModeValue('brand.500', 'brand.300')

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <Box
      bg={bg}
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      maxH="60vh"
      overflowY="auto"
    >
      <Heading as="h3" size="sm" mb={3}>
        目次
      </Heading>
      
      <VStack spacing={1} align="stretch">
        {items.map((item) => (
          <Link
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            color={linkColor}
            fontSize="sm"
            pl={`${(item.level - 1) * 12}px`}
            py={1}
            _hover={{
              color: linkHoverColor,
              textDecoration: 'none',
            }}
            cursor="pointer"
            noOfLines={2}
          >
            {item.text}
          </Link>
        ))}
      </VStack>
    </Box>
  )
}

export default TableOfContents