import { useRef, useEffect } from 'react'
import { renderKitchenSplash } from '../../glass/splash'

interface HeroCanvasProps {
  width?: number
  height?: number
  className?: string
}

export function HeroCanvas({ width = 400, height = 200, className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Render the kitchen splash (scales automatically)
    renderKitchenSplash(ctx, width, height)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
