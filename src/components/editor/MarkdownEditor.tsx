import React from 'react'
import { Box, useColorMode } from '@chakra-ui/react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const { colorMode } = useColorMode()

  return (
    <Box
      data-color-mode={colorMode}
      sx={{
        '& .w-md-editor': {
          backgroundColor: colorMode === 'dark' ? 'var(--chakra-colors-gray-800)' : 'white',
        },
        '& .w-md-editor-text-pre, & .w-md-editor-text-input, & .w-md-editor-text': {
          backgroundColor: colorMode === 'dark' ? 'var(--chakra-colors-gray-700)' : 'white',
          color: colorMode === 'dark' ? 'var(--chakra-colors-whiteAlpha-900)' : 'black',
        },
        '& .w-md-editor-preview': {
          backgroundColor: colorMode === 'dark' ? 'var(--chakra-colors-gray-700)' : 'white',
          color: colorMode === 'dark' ? 'var(--chakra-colors-whiteAlpha-900)' : 'black',
        },
      }}
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={400}
        preview="edit"
        hideToolbar={false}
        data-color-mode={colorMode}
      />
    </Box>
  )
}

export default MarkdownEditor