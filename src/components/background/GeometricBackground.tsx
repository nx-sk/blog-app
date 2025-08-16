import React, { useEffect, useRef } from 'react'
import { Box, usePrefersReducedMotion } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const GeometricBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Ensure keyframes exist in production (Vercel) even if CSS order changes
  const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスサイズ設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 幾何学模様のオブジェクト
    class GeometricShape {
      x: number
      y: number
      size: number
      rotation: number
      rotationSpeed: number
      color: string
      type: 'triangle' | 'square' | 'hexagon'
      opacity: number
      pulsePhase: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 36 + 12
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.008
        this.opacity = Math.random() * 0.1 + 0.05
        this.pulsePhase = Math.random() * Math.PI * 2
        
        const colors = [
          'rgba(99, 102, 241, ',   // Indigo 500
          'rgba(168, 85, 247, ',   // Purple 500
          'rgba(14, 165, 233, ',   // Sky 500
          'rgba(203, 213, 225, ',  // Slate 300
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        
        const types: ('triangle' | 'square' | 'hexagon')[] = ['triangle', 'square', 'hexagon']
        this.type = types[Math.floor(Math.random() * types.length)]
      }

      update() {
        this.rotation += this.rotationSpeed
        this.pulsePhase += 0.02
        this.opacity = 0.08 + Math.sin(this.pulsePhase) * 0.04 + 0.12
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.strokeStyle = this.color + this.opacity + ')'
        ctx.lineWidth = 1

        switch (this.type) {
          case 'triangle':
            ctx.beginPath()
            for (let i = 0; i < 3; i++) {
              const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2
              const x = Math.cos(angle) * this.size
              const y = Math.sin(angle) * this.size
              if (i === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.stroke()
            break

          case 'square':
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size)
            break

          case 'hexagon':
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const angle = (i * Math.PI) / 3
              const x = Math.cos(angle) * this.size
              const y = Math.sin(angle) * this.size
              if (i === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.stroke()
            break
        }

        ctx.restore()
      }
    }

    // 接続線のクラス
    class ConnectionLine {
      shape1: GeometricShape
      shape2: GeometricShape
      opacity: number

      constructor(shape1: GeometricShape, shape2: GeometricShape) {
        this.shape1 = shape1
        this.shape2 = shape2
        this.opacity = 0
      }

      update() {
        const distance = Math.sqrt(
          Math.pow(this.shape2.x - this.shape1.x, 2) +
          Math.pow(this.shape2.y - this.shape1.y, 2)
        )
        
        if (distance < 200) {
          this.opacity = (1 - distance / 200) * 0.15
        } else {
          this.opacity = 0
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.opacity > 0) {
          ctx.save()
          ctx.strokeStyle = `rgba(148, 163, 184, ${this.opacity * 0.6})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(this.shape1.x, this.shape1.y)
          ctx.lineTo(this.shape2.x, this.shape2.y)
          ctx.stroke()
          ctx.restore()
        }
      }
    }

    // 初期化
    const shapes: GeometricShape[] = []
    const connections: ConnectionLine[] = []
    // 画面幅に応じて図形の数を調整（モバイルで負荷軽減）
    const baseCount = 12
    const shapeCount = window.innerWidth < 480 ? Math.max(8, Math.floor(baseCount * 0.6))
                      : window.innerWidth < 768 ? Math.floor(baseCount * 0.8)
                      : baseCount

    for (let i = 0; i < shapeCount; i++) {
      shapes.push(new GeometricShape())
    }

    // 接続線の作成
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        connections.push(new ConnectionLine(shapes[i], shapes[j]))
      }
    }

    // マウス追従エフェクト
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // アニメーションループ
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // マウスに近い図形を強調
      shapes.forEach(shape => {
        const distance = Math.sqrt(
          Math.pow(mouseX - shape.x, 2) +
          Math.pow(mouseY - shape.y, 2)
        )
        
        if (distance < 150) {
          shape.size = Math.min(shape.size + 0.3, 60)
        } else {
          shape.size = Math.max(shape.size - 0.15, 15)
        }
        
        shape.update()
      })

      // 接続線の描画
      connections.forEach(connection => {
        connection.update()
        connection.draw(ctx)
      })

      // 図形の描画
      shapes.forEach(shape => {
        shape.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={0}
      bg="linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #f1f5f9 100%)"
      backgroundSize="200% 200%"
      animation={prefersReducedMotion ? undefined : `${gradientShift} 40s ease infinite`}
      willChange="background-position"
      pointerEvents="none"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.06) 0%, transparent 50%)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'multiply',
        }}
      />
    </Box>
  )
}

export default GeometricBackground
