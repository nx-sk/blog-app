import React, { useRef, useCallback } from 'react'
import { 
  Box, 
  Textarea, 
  HStack, 
  VStack,
  Button, 
  useColorMode, 
  useToast,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
  Divider
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
// Material Design Icons は型の問題があるため削除

interface PlainTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const PlainTextEditor = ({ value, onChange }: PlainTextEditorProps) => {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 画像をBase64に変換
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  // クリップボードペーストイベント処理
  const handlePaste = useCallback(async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.type.startsWith('image/')) {
        event.preventDefault()
        
        const file = item.getAsFile()
        if (!file) continue

        try {
          const base64 = await fileToBase64(file)
          const imageMarkdown = `\n![画像](${base64})\n`
          
          const textarea = textareaRef.current
          if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue = value.slice(0, start) + imageMarkdown + value.slice(end)
            onChange(newValue)
            
            setTimeout(() => {
              textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
              textarea.focus()
            }, 0)
          } else {
            onChange(value + imageMarkdown)
          }

          toast({
            title: '画像を挿入しました',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        } catch (error) {
          console.error('画像の処理中にエラーが発生しました:', error)
          toast({
            title: 'エラー',
            description: '画像の処理に失敗しました',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
        break
      }
    }
  }, [value, onChange, fileToBase64, toast])

  // Markdownボタン機能
  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.slice(start, end)
    
    const newText = before + selectedText + after
    const newValue = value.slice(0, start) + newText + value.slice(end)
    
    onChange(newValue)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }, [value, onChange])

  return (
    <VStack spacing={4} align="stretch">
      {/* スタイリッシュなツールバー */}
      <Box
        p={3}
        bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
        borderRadius="lg"
        border="1px solid"
        borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
      >
        <HStack spacing={1} flexWrap="wrap">
          {/* 見出しグループ */}
          <HStack spacing={1} mr={2}>
            <Tooltip label="見出し1" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('# ')}
                colorScheme="blue"
                fontSize="xs"
                fontWeight="bold"
              >
                H1
              </Button>
            </Tooltip>
            <Tooltip label="見出し2" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('## ')}
                colorScheme="blue"
                fontSize="xs"
                fontWeight="bold"
              >
                H2
              </Button>
            </Tooltip>
            <Tooltip label="見出し3" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('### ')}
                colorScheme="blue"
                fontSize="xs"
                fontWeight="bold"
              >
                H3
              </Button>
            </Tooltip>
          </HStack>

          <Divider orientation="vertical" height="30px" />

          {/* テキスト装飾グループ */}
          <HStack spacing={1} mx={2}>
            <Tooltip label="太字" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('**', '**')}
                colorScheme="blue"
                fontSize="xs"
                fontWeight="bold"
              >
                B
              </Button>
            </Tooltip>
            <Tooltip label="斜体" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('*', '*')}
                colorScheme="blue"
                fontSize="xs"
                fontStyle="italic"
              >
                I
              </Button>
            </Tooltip>
            <Tooltip label="インラインコード" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('`', '`')}
                colorScheme="blue"
                fontSize="xs"
                fontFamily="mono"
              >
                {'<>'}
              </Button>
            </Tooltip>
          </HStack>

          <Divider orientation="vertical" height="30px" />

          {/* リスト・リンクグループ */}
          <HStack spacing={1} mx={2}>
            <Tooltip label="リスト" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('- ')}
                colorScheme="blue"
                fontSize="xs"
              >
                • List
              </Button>
            </Tooltip>
            <Tooltip label="リンク" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('[', '](url)')}
                colorScheme="blue"
                fontSize="xs"
              >
                🔗
              </Button>
            </Tooltip>
          </HStack>

          <Divider orientation="vertical" height="30px" />

          {/* その他グループ */}
          <HStack spacing={1} ml={2}>
            <Tooltip label="コードブロック" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('```\n', '\n```')}
                colorScheme="blue"
                fontFamily="mono"
                fontSize="xs"
              >
                ```
              </Button>
            </Tooltip>
            <Tooltip label="画像（Ctrl+V/Cmd+V でペースト可能）" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('![', '](url)')}
                colorScheme="blue"
                fontSize="xs"
              >
                🖼️
              </Button>
            </Tooltip>
          </HStack>
        </HStack>
      </Box>

      {/* エディタ部分をタブで切り替え */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>編集</Tab>
          <Tab>プレビュー</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={2}>
                Markdownで記事を書いてください（画像はCtrl+V/Cmd+Vで貼り付け可能）
              </Text>
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPaste={handlePaste}
                placeholder="# タイトル

記事の内容をここに書きます...

## 見出し2

- リスト項目1
- リスト項目2

**太字** *斜体* `コード`

```
コードブロック
```

[リンク](https://example.com)"
                height="500px"
                resize="vertical"
                fontSize="14px"
                lineHeight="1.6"
                fontFamily="'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
                bg={colorMode === 'dark' ? 'gray.800' : 'white'}
                color={colorMode === 'dark' ? 'white' : 'gray.800'}
                border="2px solid"
                borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                borderRadius="md"
                p={4}
                _hover={{
                  borderColor: colorMode === 'dark' ? 'gray.500' : 'gray.300',
                }}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                  outline: 'none',
                }}
              />
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Box
              height="500px"
              overflowY="auto"
              border="2px solid"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              borderRadius="md"
              bg={colorMode === 'dark' ? 'gray.800' : 'white'}
              color={colorMode === 'dark' ? 'white' : 'gray.800'}
              p={6}
              sx={{
                '& h1': {
                  fontSize: '2xl',
                  fontWeight: 'bold',
                  mb: 4,
                  color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
                },
                '& h2': {
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  mb: 3,
                  mt: 6,
                  color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
                },
                '& h3': {
                  fontSize: 'lg',
                  fontWeight: 'bold',
                  mb: 2,
                  mt: 4,
                  color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
                },
                '& p': {
                  mb: 3,
                  lineHeight: 1.7,
                },
                '& ul, & ol': {
                  mb: 3,
                  pl: 6,
                },
                '& li': {
                  mb: 1,
                },
                '& code': {
                  bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
                  color: colorMode === 'dark' ? 'pink.300' : 'pink.600',
                  px: 1,
                  py: 0.5,
                  borderRadius: 'sm',
                  fontSize: 'sm',
                  fontFamily: 'mono',
                },
                '& pre': {
                  bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
                  p: 4,
                  borderRadius: 'md',
                  overflowX: 'auto',
                  mb: 3,
                },
                '& a': {
                  color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
                  textDecoration: 'underline',
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 'md',
                  mb: 3,
                },
              }}
            >
              {value ? (
                <ReactMarkdown>{value}</ReactMarkdown>
              ) : (
                <Text color="gray.500" fontStyle="italic">
                  プレビューするには左側の「編集」タブで記事を書いてください
                </Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export default PlainTextEditor