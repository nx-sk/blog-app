import React from 'react'
import { ChakraProvider, Box, Text, VStack, Container } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="blue.500">
              Personal Blog
            </Text>
            <Text fontSize="lg" color="gray.600" mt={2}>
              ブログアプリケーションが正常に起動しました！
            </Text>
          </Box>
          
          <Box p={6} borderWidth={1} borderRadius="lg" w="100%">
            <VStack spacing={4} align="start">
              <Text fontSize="xl" fontWeight="semibold">
                実装済み機能
              </Text>
              <VStack spacing={2} align="start">
                <Text>✅ React + TypeScript セットアップ</Text>
                <Text>✅ Chakra UI インストール</Text>
                <Text>✅ Supabase 設定</Text>
                <Text>✅ Redux Toolkit + Redux-Saga</Text>
                <Text>✅ 基本的なコンポーネント構造</Text>
              </VStack>
            </VStack>
          </Box>

          <Box p={6} borderWidth={1} borderRadius="lg" w="100%" bg="yellow.50">
            <VStack spacing={4} align="start">
              <Text fontSize="xl" fontWeight="semibold">
                次のステップ
              </Text>
              <VStack spacing={2} align="start">
                <Text>🔧 TypeScript エラーの修正</Text>
                <Text>🎨 UI コンポーネントの調整</Text>
                <Text>🔐 Google 認証の設定</Text>
                <Text>📝 マークダウンエディターの統合</Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App