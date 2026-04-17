import { useState } from 'react'
const ZoomableImage = ({ src, alt }) => {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const onMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setOrigin(`${x}% ${y}%`)
  }
  return (
    <div
      onMouseMove={onMove}
      onClick={() => setZoom((v) => !v)}
      style={{
        width: 'min(92vw, 860px)',
        height: 'min(82vh, 620px)',
        overflow: 'hidden',
        borderRadius: 18,
        background: '#fff',
        border: '1px solid #D9E6EA',
        cursor: zoom ? 'zoom-out' : 'zoom-in',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transformOrigin: origin,
          transform: zoom ? 'scale(2)' : 'scale(1)',
          transition: 'transform 0.2s ease',
          userSelect: 'none',
        }}
      />
    </div>
  )
}
export default ZoomableImage
