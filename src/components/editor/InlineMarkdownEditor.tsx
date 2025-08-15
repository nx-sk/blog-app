import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Button,
  ButtonGroup,
  IconButton,
  Divider,
  Icon,
} from '@chakra-ui/react'
import {
  FiBold,
  FiItalic,
  FiCode,
  FiLink,
  FiImage,
  FiList,
  FiHash,
  FiEye,
  FiEdit,
} from 'react-icons/fi'
import MDEditor from '@uiw/react-md-editor'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import rehypeSanitize from 'rehype-sanitize'
import { supabase } from '../../services/supabase'

type AnyIcon = React.ComponentType<any>

interface InlineMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
}

const InlineMarkdownEditor: React.FC<InlineMarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '記事の内容をマークダウンで入力してください...',
  minHeight = '400px',
  maxHeight = '800px',
}) => {
  const [localValue, setLocalValue] = useState(value)
  const [isPreview, setIsPreview] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // const toast = useToast()

  const { isAdminMode, isEditingMode } = useSelector(
    (state: RootState) => state.adminMode
  )

  // 編集可能かどうか
  const canEdit = isAdminMode && isEditingMode

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: string | undefined) => {
    const updatedValue = newValue || ''
    setLocalValue(updatedValue)
    onChange(updatedValue)
  }

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = localValue.substring(start, end)
    const newText =
      localValue.substring(0, start) +
      before +
      selectedText +
      after +
      localValue.substring(end)

    handleChange(newText)
    
    // カーソル位置を調整
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + before.length + selectedText.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' '
    insertText(prefix)
  }

  const insertLink = () => {
    const url = prompt('URLを入力してください:')
    if (url) {
      insertText('[', `](${url})`)
    }
  }

  const insertImage = () => {
    const url = prompt('画像のURLを入力してください:')
    if (url) {
      insertText('![画像の説明](', `${url})`)
    }
  }

  const insertCodeBlock = () => {
    insertText('```\n', '\n```')
  }

  // 画像アップロード（Supabase Storage /media バケット）
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `inline/${fileName}`
      const { error } = await supabase.storage.from('media').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
      return publicUrl
    } catch (e) {
      console.error('Inline image upload failed:', e)
      return null
    }
  }, [])

  // 画像のペーストに対応
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue
        const url = await uploadImage(file)
        if (url) {
          const insert = `\n![画像](${url})\n`
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement | null
          if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newText = localValue.substring(0, start) + insert + localValue.substring(end)
            handleChange(newText)
            setTimeout(() => {
              textarea.focus()
              textarea.setSelectionRange(start + insert.length, start + insert.length)
            }, 0)
          } else {
            handleChange(localValue + insert)
          }
        }
        break
      }
    }
  }, [localValue, handleChange, uploadImage])

  // 編集不可の場合はプレビューのみ表示
  if (!canEdit) {
    return (
      <Box>
        <MDEditor.Markdown
          source={value}
          rehypePlugins={[[rehypeSanitize]]}
          style={{
            backgroundColor: 'transparent',
            color: 'inherit',
          }}
        />
      </Box>
    )
  }

  return (
    <VStack spacing={3} align="stretch" ref={containerRef} onPaste={handlePaste}>
      <HStack spacing={2} justify="space-between">
        <HStack spacing={1}>
          <IconButton aria-label="Bold" size="sm" variant="ghost" icon={<Icon as={FiBold as AnyIcon} />} onClick={() => insertText('**', '**')} />
          <IconButton aria-label="Italic" size="sm" variant="ghost" icon={<Icon as={FiItalic as AnyIcon} />} onClick={() => insertText('*', '*')} />
          <IconButton aria-label="Code" size="sm" variant="ghost" icon={<Icon as={FiCode as AnyIcon} />} onClick={() => insertText('`', '`')} />
        </HStack>
        <Button size="sm" leftIcon={isPreview ? <Icon as={FiEdit as AnyIcon} /> : <Icon as={FiEye as AnyIcon} />} onClick={() => setIsPreview(!isPreview)} variant="outline" colorScheme="purple">
          {isPreview ? '編集' : 'プレビュー'}
        </Button>
      </HStack>

      <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden" minH={minHeight} maxH={maxHeight} bg="white">
        {isPreview ? (
          <Box p={4} overflowY="auto" h="100%">
            <MDEditor.Markdown source={localValue} rehypePlugins={[[rehypeSanitize]]} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
          </Box>
        ) : (
          <MDEditor value={localValue} onChange={handleChange} preview="edit" hideToolbar height={parseInt(minHeight)} data-color-mode="light" textareaProps={{ placeholder, style: { fontSize: '16px', lineHeight: '1.6' } }} />
        )}
      </Box>

      <Box as="p" fontSize="xs" color="gray.500">画像はコピー＆ペーストで自動挿入されます（Supabase Storage）。</Box>
    </VStack>
  )
}

export default InlineMarkdownEditor
