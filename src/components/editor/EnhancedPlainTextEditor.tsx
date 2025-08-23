import React, { useRef, useCallback, useState, useEffect } from 'react'
import { 
  Box, 
  Textarea, 
  HStack, 
  VStack,
  Button, 
  useColorMode, 
  useToast,
  Text,
  Tooltip,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '../../services/supabase'

interface EnhancedPlainTextEditorProps {
  value: string
  onChange: (value: string) => void
  postId?: string
  enableFloatingPreview?: boolean
}

interface TOCItem {
  id: string
  text: string
  level: number
}

const EnhancedPlainTextEditor = ({ value, onChange, postId, enableFloatingPreview = true }: EnhancedPlainTextEditorProps) => {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [imageWidth, setImageWidth] = useState('')
  const [imageHeight, setImageHeight] = useState('')
  const [showSidePreview, setShowSidePreview] = useState(enableFloatingPreview)
  const [tocItems, setTocItems] = useState<TOCItem[]>([])

  // マークダウンから目次を生成
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(value)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
      
      // #と##のみを目次に含める
      if (level <= 2) {
        items.push({ id, text, level })
      }
    }

    setTocItems(items)
  }, [value])

  // 画像アップロード処理
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      if (import.meta.env.DEV) {
        console.log('画像アップロード開始:', file.name, 'サイズ:', file.size)
      }
      
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = postId ? `posts/${postId}/${fileName}` : `temp/${fileName}`

      if (import.meta.env.DEV) {
        console.log('アップロードパス:', filePath)
      }

      // まずStorageバケットの存在確認
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      if (import.meta.env.DEV) {
        console.log('利用可能なバケット:', buckets)
      }
      
      if (bucketsError) {
        console.error('バケット一覧取得エラー:', bucketsError)
        throw new Error(`バケット取得エラー: ${bucketsError.message}`)
      }

      // ファイルサイズとタイプの確認
      if (import.meta.env.DEV) {
        console.log('ファイル詳細:', {
          name: file.name,
          size: file.size,
          type: file.type,
          maxSize: 50 * 1024 * 1024 // 50MB
        })
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error('ファイルサイズが大きすぎます（50MB以下にしてください）')
      }

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('アップロードエラー詳細:', {
          message: error.message,
          cause: error.cause,
          fullError: error
        })
        console.error('エラーオブジェクト全体:', JSON.stringify(error, null, 2))
        throw error
      }

      if (import.meta.env.DEV) {
        console.log('アップロード成功:', data)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(data.path)

      if (import.meta.env.DEV) {
        console.log('公開URL:', publicUrl)
      }

      return publicUrl
    } catch (error) {
      console.error('画像アップロードエラー:', error)
      toast({
        title: 'エラー',
        description: `画像のアップロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return null
    }
  }, [postId, toast])

  // ファイル選択からの画像アップロード
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'エラー',
        description: '画像ファイルを選択してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const url = await uploadImage(file)
    if (url) {
      insertImage(url)
    }
  }

  // 画像を挿入
  const insertImage = useCallback((url: string) => {
    const imageMarkdown = `\n![画像](${url})\n`
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
  }, [value, onChange, toast])

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

        const url = await uploadImage(file)
        if (url) {
          insertImage(url)
        }
        break
      }
    }
  }, [uploadImage, insertImage])

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

  // 画像クリックハンドラ
  const handleImageClick = (src: string) => {
    setSelectedImageUrl(src)
    
    // 現在のサイズを取得
    const match = src.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    if (match) {
      const params = new URLSearchParams(match[2].split('?')[1] || '')
      setImageWidth(params.get('w') || '')
      setImageHeight(params.get('h') || '')
    }
    
    onOpen()
  }

  // 画像リサイズ適用
  const applyImageResize = () => {
    if (!selectedImageUrl) return

    const newUrl = imageWidth || imageHeight
      ? `${selectedImageUrl.split('?')[0]}?w=${imageWidth}&h=${imageHeight}`
      : selectedImageUrl

    const oldPattern = new RegExp(`!\\[[^\\]]*\\]\\(${selectedImageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`)
    const newMarkdown = `![画像](${newUrl})`
    
    const newValue = value.replace(oldPattern, newMarkdown)
    onChange(newValue)
    
    onClose()
    setSelectedImageUrl('')
    setImageWidth('')
    setImageHeight('')
  }

  // プレビューコンテンツ
  const PreviewContent = () => (
    <Box
      className="prose"
      height="100%"
      overflowY="auto"
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      color={colorMode === 'dark' ? 'white' : 'gray.800'}
      p={4}
      fontSize="sm"
      lineHeight={1.7}
      sx={{
        '& h1': {
          fontSize: 'lg',
          fontWeight: 'bold',
          mb: 3,
          color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
        },
        '& h2': {
          fontSize: 'md',
          fontWeight: 'bold',
          mb: 2,
          mt: 4,
          color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
        },
        '& h3': {
          fontSize: 'sm',
          fontWeight: 'bold',
          mb: 1,
          mt: 3,
          color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
        },
        '& p': {
          mb: 2,
          lineHeight: 1.7,
          fontSize: '11.5px',
        },
        '& ul, & ol': {
          mb: 2,
          pl: 5,
          fontSize: '11.5px',
        },
        '& li': {
          mb: 1,
          fontSize: '11.5px',
        },
        '& code': {
          bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
          color: colorMode === 'dark' ? 'pink.300' : 'pink.600',
          px: 1,
          py: 0.5,
          borderRadius: 'sm',
          fontSize: '10.5px',
          fontFamily: 'mono',
        },
        '& pre': {
          bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
          p: 3,
          borderRadius: 'md',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowX: 'unset',
          mb: 2,
          fontSize: '9px',
        },
        '& pre code': {
          fontSize: '9px',
        },
        '& a': {
          color: colorMode === 'dark' ? 'blue.300' : 'blue.600',
          textDecoration: 'underline',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 'md',
          mb: 2,
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      }}
    >
      {/* コンテンツ */}
      {value ? (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                onClick={() => handleImageClick(src || '')}
                style={{ cursor: 'pointer' }}
              />
            ),
            h1: ({ children, ...props }) => {
              const text = String(children)
              const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
              return <h1 id={id} {...props}>{children}</h1>
            },
            h2: ({ children, ...props }) => {
              const text = String(children)
              const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
              return <h2 id={id} {...props}>{children}</h2>
            },
          }}
        >
          {value}
        </ReactMarkdown>
      ) : (
        <Text color="gray.500" fontStyle="italic">
          記事を書いてください
        </Text>
      )}
    </Box>
  )

  return (
    <VStack spacing={4} align="stretch" h="calc(100vh - 200px)" pr={{ lg: showSidePreview ? '380px' : 0 }}>
      {/* 目次（編集画面用） */}
      {tocItems.length > 0 && (
        <Box
          p={4}
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
          borderRadius="md"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
        >
          <Text fontWeight="bold" mb={3} fontSize="sm">📋 目次プレビュー</Text>
          <HStack spacing={1} flexWrap="wrap">
            {tocItems.map((item, index) => (
              <Text
                key={item.id}
                fontSize="xs"
                color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                bg={colorMode === 'dark' ? 'gray.600' : 'gray.100'}
                px={2}
                py={1}
                borderRadius="sm"
                mr={item.level === 1 ? 2 : 0}
                fontWeight={item.level === 1 ? 'bold' : 'normal'}
              >
                {item.level === 1 ? '# ' : '## '}{item.text}
              </Text>
            ))}
          </HStack>
        </Box>
      )}

      {/* ツールバー */}
      <Box
        p={3}
        bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
        borderRadius="lg"
        border="1px solid"
        borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
      >
        <HStack spacing={1} flexWrap="wrap">
          <HStack spacing={1} mr={2}>
            <Tooltip label="見出し1" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('# ')} colorScheme="blue">
                H1
              </Button>
            </Tooltip>
            <Tooltip label="見出し2" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('## ')} colorScheme="blue">
                H2
              </Button>
            </Tooltip>
            <Tooltip label="見出し3" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('### ')} colorScheme="blue">
                H3
              </Button>
            </Tooltip>
          </HStack>

          <Divider orientation="vertical" height="30px" />

          <HStack spacing={1} mx={2}>
            <Tooltip label="太字" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('**', '**')} colorScheme="blue">
                B
              </Button>
            </Tooltip>
            <Tooltip label="斜体" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('*', '*')} colorScheme="blue">
                I
              </Button>
            </Tooltip>
            <Tooltip label="インラインコード" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('`', '`')} colorScheme="blue">
                {'<>'}
              </Button>
            </Tooltip>
          </HStack>

          <Divider orientation="vertical" height="30px" />

          <HStack spacing={1} mx={2}>
            <Tooltip label="リスト" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('- ')} colorScheme="blue">
                • List
              </Button>
            </Tooltip>
            <Tooltip label="リンク" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('[', '](url)')} colorScheme="blue">
                🔗
              </Button>
            </Tooltip>
          </HStack>

          <Divider orientation="vertical" height="30px" />

          <HStack spacing={1} mx={2}>
            <Tooltip label="コードブロック" placement="top">
              <Button size="sm" variant="ghost" onClick={() => insertMarkdown('```\n', '\n```')} colorScheme="blue">
                ```
              </Button>
            </Tooltip>
            <Tooltip label="画像を挿入" placement="top">
              <Button size="sm" variant="ghost" onClick={() => fileInputRef.current?.click()} colorScheme="blue">
                🖼️ 画像
              </Button>
            </Tooltip>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </HStack>

          <Divider orientation="vertical" height="30px" />

          <Box flex={1} />
          {enableFloatingPreview && (
            <Button size="sm" variant="outline" onClick={() => setShowSidePreview(v => !v)}>
              {showSidePreview ? 'サイドプレビューを隠す' : 'サイドプレビューを表示'}
            </Button>
          )}
        </HStack>
      </Box>

      {/* メインエディタ（フル幅） */}
      <Box
        border="2px solid"
        borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
        borderRadius="md"
        overflow="hidden"
      >
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

[リンク](https://example.com)

画像はCtrl+V/Cmd+Vで貼り付けるか、画像ボタンから選択できます。"
          height="100%"
          resize="none"
          fontSize="14px"
          lineHeight="1.6"
          fontFamily="'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          color={colorMode === 'dark' ? 'white' : 'gray.800'}
          p={4}
          border="none"
          _focus={{
            outline: 'none',
          }}
        />
      </Box>

      {/* サイドの小さな全体プレビュー（固定配置） */}
      {enableFloatingPreview && showSidePreview && (
        <Box
          position="fixed"
          right={{ base: 4, xl: 12 }}
          top={{ base: '96px', md: '110px' }}
          w={{ base: '240px', xl: '300px' }}
          maxH="70vh"
          overflowY="auto"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          borderRadius="md"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          boxShadow="0 8px 24px rgba(0,0,0,0.12)"
          zIndex={5}
          display={{ base: 'none', lg: 'block' }}
        >
          <PreviewContent />
        </Box>
      )}

      {/* 画像リサイズモーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>画像サイズ調整</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>幅 (px)</FormLabel>
                <Input
                  type="number"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                  placeholder="例: 800"
                />
              </FormControl>
              <FormControl>
                <FormLabel>高さ (px)</FormLabel>
                <Input
                  type="number"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(e.target.value)}
                  placeholder="例: 600"
                />
              </FormControl>
              <Text fontSize="sm" color="gray.500">
                ※ 空欄の場合は元のサイズが維持されます
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="blue" onClick={applyImageResize}>
              適用
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default EnhancedPlainTextEditor
