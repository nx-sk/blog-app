import React from 'react'
import { Box, Container, Text, useColorModeValue } from '@chakra-ui/react'

const Footer: React.FC = () => {
  const bg = useColorModeValue('gray.50', 'gray.900')
  const color = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box as="footer" bg={bg} py={6} mt={8}>
      <Container maxW="container.xl">
        <Text textAlign="center" color={color} fontSize="sm">
          © {new Date().getFullYear()} Personal Blog. All rights reserved.
        </Text>
      </Container>
    </Box>
  )
}

export default Footer