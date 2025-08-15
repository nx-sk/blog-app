import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Input,
  Textarea,
  Text,
  Heading,
  useOutsideClick,
  Tooltip,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

interface InlineEditableFieldProps {
  value: string
  onChange: (value: string) => void
  as?: 'text' | 'heading' | 'textarea'
  fontSize?: string | object
  fontWeight?: string | number
  placeholder?: string
  multiline?: boolean
  maxLength?: number
  isRequired?: boolean
  tooltip?: string
}

const InlineEditableField: React.FC<InlineEditableFieldProps> = ({
  value,
  onChange,
  as = 'text',
  fontSize,
  fontWeight,
  placeholder = 'クリックして編集',
  multiline = false,
  maxLength,
  isRequired = false,
  tooltip,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { isAdminMode, isEditingMode } = useSelector(
    (state: RootState) => state.adminMode
  )

  // 編集可能かどうか
  const canEdit = isAdminMode && isEditingMode

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if ('select' in inputRef.current) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  useOutsideClick({
    ref: containerRef,
    handler: () => {
      if (isEditing) {
        handleSave()
      }
    },
  })

  const handleClick = () => {
    if (canEdit && !isEditing) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (isRequired && !localValue.trim()) {
      setLocalValue(value) // 元の値に戻す
    } else {
      onChange(localValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      return
    }
    setLocalValue(e.target.value)
  }

  // 表示用のコンポーネントを選択
  const DisplayComponent = as === 'heading' ? Heading : Text

  // 編集中の表示
  if (isEditing) {
    return (
      <Box ref={containerRef} position="relative">
        {multiline || as === 'textarea' ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            fontSize={fontSize}
            fontWeight={fontWeight}
            placeholder={placeholder}
            resize="vertical"
            minH="100px"
            bg="white"
            borderColor="purple.500"
            _focus={{
              borderColor: 'purple.600',
              boxShadow: '0 0 0 1px var(--chakra-colors-purple-600)',
            }}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            fontSize={fontSize}
            fontWeight={fontWeight}
            placeholder={placeholder}
            bg="white"
            borderColor="purple.500"
            _focus={{
              borderColor: 'purple.600',
              boxShadow: '0 0 0 1px var(--chakra-colors-purple-600)',
            }}
          />
        )}
        {maxLength && (
          <Text
            position="absolute"
            right={2}
            bottom={2}
            fontSize="xs"
            color="gray.500"
          >
            {localValue.length} / {maxLength}
          </Text>
        )}
      </Box>
    )
  }

  // 通常表示（編集可能な場合はホバー効果あり）
  const content = (
    <DisplayComponent
      fontSize={fontSize}
      fontWeight={fontWeight}
      onClick={handleClick}
      cursor={canEdit ? 'text' : 'default'}
      position="relative"
      transition="all 0.2s"
      borderRadius="md"
      px={canEdit ? 2 : 0}
      py={canEdit ? 1 : 0}
      _hover={
        canEdit
          ? {
              bg: 'purple.50',
              outline: '2px dashed',
              outlineColor: 'purple.300',
              outlineOffset: '2px',
            }
          : {}
      }
      _after={
        canEdit
          ? {
              content: '""',
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '6px',
              height: '6px',
              bg: 'purple.500',
              borderRadius: 'full',
              opacity: 0.8,
            }
          : {}
      }
    >
      {value || (canEdit && <Text color="gray.400">{placeholder}</Text>)}
    </DisplayComponent>
  )

  // ツールチップがある場合はラップ
  if (tooltip && canEdit) {
    return (
      <Tooltip label={tooltip} placement="top" hasArrow>
        {content}
      </Tooltip>
    )
  }

  return content
}

export default InlineEditableField