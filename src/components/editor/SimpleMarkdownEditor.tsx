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
  TabPanel
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'

interface SimpleMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

const SimpleMarkdownEditor: React.FC<SimpleMarkdownEditorProps> = ({ value, onChange }) => {
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
      {/* ツールバー */}
      <HStack spacing={2} flexWrap="wrap">
        <Button size="sm" onClick={() => insertMarkdown('**', '**')}>太字</Button>
        <Button size="sm" onClick={() => insertMarkdown('*', '*')}>斜体</Button>
        <Button size="sm" onClick={() => insertMarkdown('# ')}>見出し1</Button>
        <Button size="sm" onClick={() => insertMarkdown('## ')}>見出し2</Button>
        <Button size="sm" onClick={() => insertMarkdown('### ')}>見出し3</Button>
        <Button size="sm" onClick={() => insertMarkdown('- ')}>リスト</Button>
        <Button size="sm" onClick={() => insertMarkdown('[', '](url)')}>リンク</Button>
        <Button size="sm" onClick={() => insertMarkdown('`', '`')}>コード</Button>
        <Button size="sm" onClick={() => insertMarkdown('```\n', '\n```')}>コードブロック</Button>
      </HStack>

      {/* エディタ */}
      <Tabs variant="enclosed">
        <TabList>
          <Tab>編集</Tab>
          <Tab>プレビュー</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onPaste={handlePaste}
              placeholder="Markdownで記事を書いてください..."
              height="400px"
              resize="vertical"
              fontSize="14px"
              lineHeight="1.5"
              fontFamily="Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
              color={colorMode === 'dark' ? 'white' : 'gray.800'}
              bg={colorMode === 'dark' ? 'gray.700' : 'white'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
              sx={{
                '&:focus': {
                  color: colorMode === 'dark' ? 'white !important' : 'gray.800 !important',
                },
                // IME入力時の文字色を強制
                '&[data-ime-input="true"]': {
                  color: colorMode === 'dark' ? 'white !important' : 'gray.800 !important',
                },
              }}
            />
          </TabPanel>
          <TabPanel p={4}>
            <Box
              height="400px"
              overflowY="auto"
              border="1px solid"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              borderRadius="md"
              bg={colorMode === 'dark' ? 'gray.700' : 'white'}
              color={colorMode === 'dark' ? 'white' : 'gray.800'}
              p={4}
            >
              {value ? (
                <ReactMarkdown>{value}</ReactMarkdown>
              ) : (
                <Text color="gray.500">プレビューするには左側で記事を書いてください</Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export default SimpleMarkdownEditor