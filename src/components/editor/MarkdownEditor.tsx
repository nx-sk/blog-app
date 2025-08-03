import React, { useRef, useCallback, useEffect } from 'react'
import { Box, useColorMode, useToast } from '@chakra-ui/react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const editorRef = useRef<HTMLDivElement>(null)

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
      
      // 画像ファイルの場合
      if (item.type.startsWith('image/')) {
        event.preventDefault()
        
        const file = item.getAsFile()
        if (!file) continue

        try {
          // Base64に変換
          const base64 = await fileToBase64(file)
          
          // 現在のカーソル位置に画像マークダウンを挿入
          const imageMarkdown = `\n![画像](${base64})\n`
          
          // テキストエリアの現在位置を取得してマークダウンを挿入
          const textarea = editorRef.current?.querySelector('.w-md-editor-text-textarea') as HTMLTextAreaElement
          if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue = value.slice(0, start) + imageMarkdown + value.slice(end)
            onChange(newValue)
            
            // カーソル位置を画像マークダウンの後に移動
            setTimeout(() => {
              textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
              textarea.focus()
            }, 0)
          } else {
            // フォールバック: 末尾に追加
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

  // より強力なIME対応
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .w-md-editor .w-md-editor-text-textarea,
      .w-md-editor-text-textarea,
      textarea.w-md-editor-text-textarea {
        color: ${colorMode === 'dark' ? '#FFFFFF' : '#2D3748'} !important;
        -webkit-text-fill-color: ${colorMode === 'dark' ? '#FFFFFF' : '#2D3748'} !important;
        caret-color: ${colorMode === 'dark' ? '#FFFFFF' : '#2D3748'} !important;
        background-color: ${colorMode === 'dark' ? '#2D3748' : '#FFFFFF'} !important;
      }
      .w-md-editor .w-md-editor-text-textarea:focus,
      .w-md-editor-text-textarea:focus,
      textarea.w-md-editor-text-textarea:focus {
        color: ${colorMode === 'dark' ? '#FFFFFF' : '#2D3748'} !important;
        -webkit-text-fill-color: ${colorMode === 'dark' ? '#FFFFFF' : '#2D3748'} !important;
        outline: 2px solid #3182CE !important;
      }
      .w-md-editor .w-md-editor-text-textarea::selection,
      .w-md-editor-text-textarea::selection {
        background-color: ${colorMode === 'dark' ? 'rgba(66, 153, 225, 0.5)' : 'rgba(66, 153, 225, 0.3)'} !important;
        color: ${colorMode === 'dark' ? '#FFFFFF' : '#2D3748'} !important;
      }
      /* IME変換中の文字に対する強制スタイル */
      .w-md-editor .w-md-editor-text-textarea[style*="ime"],
      .w-md-editor-text-textarea[style*="ime"] {
        color: ${colorMode === 'dark' ? '#FFFFFF' : '#2D3748'} !important;
      }
    `
    document.head.appendChild(style)
    
    // DOMが更新された後に再適用
    const observer = new MutationObserver(() => {
      const textareas = document.querySelectorAll('.w-md-editor-text-textarea')
      textareas.forEach((textarea) => {
        if (textarea instanceof HTMLTextAreaElement) {
          textarea.style.color = colorMode === 'dark' ? '#FFFFFF' : '#2D3748'
          textarea.style.webkitTextFillColor = colorMode === 'dark' ? '#FFFFFF' : '#2D3748'
        }
      })
    })
    
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => {
      document.head.removeChild(style)
      observer.disconnect()
    }
  }, [colorMode])

  return (
    <Box
      data-color-mode={colorMode}
      sx={{
        '& .w-md-editor': {
          backgroundColor: colorMode === 'dark' ? 'var(--chakra-colors-gray-800)' : 'white',
          border: '1px solid var(--chakra-colors-gray-200)',
        },
        '& .w-md-editor-text-pre, & .w-md-editor-text-input, & .w-md-editor-text': {
          backgroundColor: colorMode === 'dark' ? 'var(--chakra-colors-gray-700)' : 'white',
          color: colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          fontSize: '14px',
          lineHeight: '1.5',
        },
        '& .w-md-editor-text-textarea': {
          color: colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          backgroundColor: colorMode === 'dark' ? 'var(--chakra-colors-gray-700) !important' : 'white !important',
          '-webkit-text-fill-color': colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
        },
        '& .w-md-editor-text-area textarea': {
          color: colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          '-webkit-text-fill-color': colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
        },
        '& textarea.w-md-editor-text-textarea': {
          color: colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          '-webkit-text-fill-color': colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          // IME変換中の文字色を修正
          '&::placeholder': {
            color: colorMode === 'dark' ? '#A0AEC0' : '#718096',
          },
          // IME変換候補の文字色
          '&::-webkit-input-placeholder': {
            color: colorMode === 'dark' ? '#A0AEC0' : '#718096',
          },
          // 変換中の下線付き文字の色
          '&[data-ime-input]': {
            color: colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          },
        },
        // より具体的なIME対応
        '& .w-md-editor-text-textarea:focus': {
          color: colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          '-webkit-text-fill-color': colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
        },
        // 変換中の文字に対するスタイル
        '& .w-md-editor-text-textarea[style*="text-decoration"]': {
          color: colorMode === 'dark' ? 'white !important' : '#2D3748 !important',
          textDecorationColor: colorMode === 'dark' ? 'white' : '#2D3748',
        },
        '& .w-md-editor-preview': {
          backgroundColor: colorMode === 'dark' ? 'var(--chakra-colors-gray-700)' : 'white',
          color: colorMode === 'dark' ? 'white' : '#2D3748',
        },
        '& .token.title': {
          color: colorMode === 'dark' ? '#63B3ED' : '#3182CE',
        },
        '& .token.bold': {
          color: colorMode === 'dark' ? 'white' : '#2D3748',
          fontWeight: 'bold',
        },
      }}
    >
      <div ref={editorRef} onPaste={handlePaste}>
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={400}
          preview="edit"
          hideToolbar={false}
          data-color-mode={colorMode}
        />
      </div>
    </Box>
  )
}

export default MarkdownEditor