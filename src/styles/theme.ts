import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
    body: `Meiryo, "メイリオ", "Meiryo UI", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic UI", "Yu Gothic", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
  },
  colors: {
    // Calibrated neutral palette for better contrast on white
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // 紫系アクセント（brand）
    brand: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    // 参考: 緑系アクセント（使う場合はこちら）
    accentGreen: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
  },
  semanticTokens: {
    colors: {
      'text.primary': { default: '#000000', _dark: 'gray.100' },
      'text.muted': { default: '#111111', _dark: 'gray.200' },
      'text.meta': { default: '#333333', _dark: 'gray.400' },
      'link.default': { default: 'brand.700', _dark: 'brand.300' },
      'border.subtle': { default: 'gray.200', _dark: 'gray.700' },
      'bg.canvas': { default: 'white', _dark: 'gray.900' },
      'bg.surface': { default: 'white', _dark: 'gray.800' },
    },
  },
  components: {
    Container: {
      baseStyle: {
        maxW: '1000px',
        px: { base: 4, md: 6 },
      },
    },
  },
  styles: {
    global: (_props: any) => ({
      'html, body': {
        bg: 'bg.canvas',
        color: 'text.primary',
        fontSize: '16px',
        lineHeight: '1.7',
        fontFamily: 'body',
      },
      '::selection': {
        bg: 'rgba(168, 85, 247, 0.18)',
        color: 'black',
      },
    }),
  },
})

export default theme
