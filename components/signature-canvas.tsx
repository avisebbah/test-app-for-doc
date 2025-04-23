"use client"

import type React from "react"

import { forwardRef, useImperativeHandle, useRef } from "react"

interface SignatureCanvasProps {
  canvasProps: React.CanvasHTMLAttributes<HTMLCanvasElement>
}

export const SignatureCanvas = forwardRef<any, SignatureCanvasProps>(({ canvasProps }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawing = useRef(false)

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current
      const context = contextRef.current
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
    },
    toDataURL: () => {
      return canvasRef.current?.toDataURL() || ""
    },
  }))

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    isDrawing.current = true

    const context = canvas.getContext("2d")
    if (context) {
      contextRef.current = context
      context.beginPath()
      context.lineWidth = 2
      context.lineCap = "round"
      context.strokeStyle = "#333333"

      // Get the correct position
      const rect = canvas.getBoundingClientRect()
      let x, y

      if ("touches" in e) {
        // Touch event
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
      } else {
        // Mouse event
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      }

      context.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || !canvasRef.current) return

    // Prevent scrolling when drawing on mobile
    e.preventDefault()

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    let x, y

    if ("touches" in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      // Mouse event
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath()
    }
    isDrawing.current = false
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      {...canvasProps}
    />
  )
})

SignatureCanvas.displayName = "SignatureCanvas"
