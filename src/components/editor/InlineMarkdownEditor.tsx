import React, { useState, useEffect } from 'react'
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
    <VStack spacing={4} align="stretch">
      {/* ツールバー */}
      <Box
        bg="white"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        p={2}
      >
        <HStack spacing={2} wrap="wrap">
          <ButtonGroup size="sm" variant="ghost">
            <IconButton
              aria-label="Bold"
              icon={<Icon as={FiBold as AnyIcon} />}
              onClick={() => insertText('**', '**')}
              title="太字"
            />
            <IconButton
              aria-label="Italic"
              icon={<Icon as={FiItalic as AnyIcon} />}
              onClick={() => insertText('*', '*')}
              title="斜体"
            />
            <IconButton
              aria-label="Code"
              icon={<Icon as={FiCode as AnyIcon} />}
              onClick={() => insertText('`', '`')}
              title="コード"
            />
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" />

          <ButtonGroup size="sm" variant="ghost">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertHeading(1)}
              title="見出し1"
            >
              H1
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertHeading(2)}
              title="見出し2"
            >
              H2
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertHeading(3)}
              title="見出し3"
            >
              H3
            </Button>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" />

          <ButtonGroup size="sm" variant="ghost">
            <IconButton
              aria-label="Link"
              icon={<Icon as={FiLink as AnyIcon} />}
              onClick={insertLink}
              title="リンク"
            />
            <IconButton
              aria-label="Image"
              icon={<Icon as={FiImage as AnyIcon} />}
              onClick={insertImage}
              title="画像"
            />
            <IconButton
              aria-label="List"
              icon={<Icon as={FiList as AnyIcon} />}
              onClick={() => insertText('- ')}
              title="リスト"
            />
            <IconButton
              aria-label="Code Block"
              icon={<Icon as={FiHash as AnyIcon} />}
              onClick={insertCodeBlock}
              title="コードブロック"
            />
          </ButtonGroup>

          <Box flex={1} />

          <ButtonGroup size="sm">
            <Button
              leftIcon={isPreview ? <Icon as={FiEdit as AnyIcon} /> : <Icon as={FiEye as AnyIcon} />}
              onClick={() => setIsPreview(!isPreview)}
              colorScheme="purple"
              variant="outline"
            >
              {isPreview ? '編集' : 'プレビュー'}
            </Button>
          </ButtonGroup>
        </HStack>
      </Box>

      {/* エディタ本体 */}
      <Box
        border="2px dashed"
        borderColor="purple.300"
        borderRadius="md"
        overflow="hidden"
        minH={minHeight}
        maxH={maxHeight}
        bg="white"
      >
        {isPreview ? (
          <Box p={4} overflowY="auto" h="100%">
            <MDEditor.Markdown
              source={localValue}
              rehypePlugins={[[rehypeSanitize]]}
              style={{
                backgroundColor: 'transparent',
                color: 'inherit',
              }}
            />
          </Box>
        ) : (
          <MDEditor
            value={localValue}
            onChange={handleChange}
            preview="edit"
            hideToolbar
            height={parseInt(minHeight)}
            data-color-mode="light"
            textareaProps={{
              placeholder: placeholder,
              style: {
                fontSize: '16px',
                lineHeight: '1.6',
              },
            }}
          />
        )}
      </Box>
    </VStack>
  )
}

export default InlineMarkdownEditor
