import React from 'react'
import { Box, Text, HStack, Link, useColorModeValue } from '@chakra-ui/react'
import Container from './Container'

const Footer = () => {
  const textColor = useColorModeValue('gray.500', 'gray.500')
  const linkColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box as="footer" py={16} mt={20}>
      <Container>
        <Box textAlign="center">
          <HStack spacing={6} justify="center" mb={4}>
            <Link 
              href="mailto:contact@example.com"
              color={linkColor}
              fontSize="sm"
              fontWeight="500"
              _hover={{
                color: useColorModeValue('gray.900', 'white'),
                textDecoration: "none",
              }}
              transition="color 0.3s ease"
            >
              Contact
            </Link>
            <Box w="1px" h="16px" bg={textColor} opacity="0.3" />
            <Link 
              href="/privacy"
              color={linkColor}
              fontSize="sm"
              fontWeight="500"
              _hover={{
                color: useColorModeValue('gray.900', 'white'),
                textDecoration: "none",
              }}
              transition="color 0.3s ease"
            >
              Privacy
            </Link>
            <Box w="1px" h="16px" bg={textColor} opacity="0.3" />
            <Link 
              href="/terms"
              color={linkColor}
              fontSize="sm"
              fontWeight="500"
              _hover={{
                color: useColorModeValue('gray.900', 'white'),
                textDecoration: "none",
              }}
              transition="color 0.3s ease"
            >
              Terms
            </Link>
          </HStack>
          
          <Text 
            color={textColor} 
            fontSize="sm"
            fontWeight="400"
          >
            © {new Date().getFullYear()} Personal Blog
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer