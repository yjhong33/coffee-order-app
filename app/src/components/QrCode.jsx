import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function QrCode({ value, size = 122 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!value || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, value, { width: size, margin: 0, color: { dark: '#1F1A14', light: '#ffffff' } }, () => {})
  }, [value, size])

  return <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />
}
