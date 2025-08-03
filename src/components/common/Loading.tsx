import React from 'react'
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

interface LoadingProps {
  message?: string
}

const Loading = ({ message = '読み込み中...' }: LoadingProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      py={10}
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
        <Text color="gray.500">{message}</Text>
      </VStack>
    </Box>
  )
}

export default Loading