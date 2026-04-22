import { useRef, useState } from 'react'
import SketchForm from './SketchForm'

const MAX_HISTORY = 50

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const undoStackRef = useRef<ImageData[]>([])
  const redoStackRef = useRef<ImageData[]>([])
  const strokeBaseRef = useRef<ImageData | null>(null)
  const strokePointsRef = useRef<{ x: number; y: number }[]>([])

  const [brushSize, setBrushSize] = useState(3)
  const [opacity, setOpacity] = useState(100)
  const [color, setColor] = useState('#000000')
  const [eyedropperActive, setEyedropperActive] = useState(false)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const [undoCount, setUndoCount] = useState(0)
  const [redoCount, setRedoCount] = useState(0)
  const [showForm, setShowForm] = useState(false)

  const getCtx = () => {
    const canvas = canvasRef.current
    return canvas ? canvas.getContext('2d') : null
  }

  const saveSnapshot = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    if (undoStackRef.current.length >= MAX_HISTORY) undoStackRef.current.shift()
    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    redoStackRef.current = []
    setUndoCount(undoStackRef.current.length)
    setRedoCount(0)
  }

  const undo = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx || undoStackRef.current.length === 0) return
    redoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(undoStackRef.current.pop()!, 0, 0)
    setUndoCount(undoStackRef.current.length)
    setRedoCount(redoStackRef.current.length)
  }

  const redo = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx || redoStackRef.current.length === 0) return
    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(redoStackRef.current.pop()!, 0, 0)
    setUndoCount(undoStackRef.current.length)
    setRedoCount(redoStackRef.current.length)
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    saveSnapshot()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const rgbaToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')

  const replayStroke = (ctx: CanvasRenderingContext2D) => {
    const points = strokePointsRef.current
    if (points.length === 0) return
    ctx.save()
    ctx.globalAlpha = opacity / 100
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()
    ctx.restore()
  }

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (eyedropperActive) return
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    saveSnapshot()
    isDrawingRef.current = true
    strokeBaseRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    strokePointsRef.current = [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (eyedropperActive) {
      const ctx = getCtx()
      if (!ctx) return
      const { data } = ctx.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1)
      setHoveredColor(rgbaToHex(data[0], data[1], data[2]))
      return
    }
    if (!isDrawingRef.current || !strokeBaseRef.current) return
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    strokePointsRef.current.push({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    ctx.putImageData(strokeBaseRef.current, 0, 0)
    replayStroke(ctx)
  }

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!eyedropperActive) return
    const ctx = getCtx()
    if (!ctx) return
    const { data } = ctx.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1)
    setColor(rgbaToHex(data[0], data[1], data[2]))
    setEyedropperActive(false)
    setHoveredColor(null)
  }

  const stopDraw = () => {
    isDrawingRef.current = false
    strokeBaseRef.current = null
    strokePointsRef.current = []
  }

  const leaveCanvas = () => {
    stopDraw()
    setHoveredColor(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex gap-3 items-center">
        {[
          { label: 'Undo', action: undo, disabled: undoCount === 0 },
          { label: 'Redo', action: redo, disabled: redoCount === 0 },
          { label: 'Clear', action: clear, disabled: false },
        ].map(({ label, action, disabled }) => (
          <button
            key={label}
            onClick={action}
            disabled={disabled}
            className="px-4 py-1.5 text-sm bg-zinc-700 text-gray-200 rounded disabled:opacity-40 hover:bg-zinc-600 transition-colors"
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setShowForm(true)}
          className="ml-auto px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
        >
          Done
        </button>
      </div>

      {/* Left panel + canvas */}
      <div className="flex gap-5 items-start">
        {/* Left panel */}
        <div className="flex flex-col items-center gap-8 py-1">
          {/* Brush size slider */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Size</span>
            <div style={{ height: 140, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="range"
                min={1}
                max={50}
                value={brushSize}
                onChange={e => setBrushSize(Number(e.target.value))}
                style={{ width: 140, transform: 'rotate(-90deg)' }}
              />
            </div>
            <span className="text-xs text-gray-500">{brushSize}px</span>
          </div>

          {/* Eyedropper */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setEyedropperActive(v => !v)}
              title={eyedropperActive ? 'Cancel' : 'Pick color'}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                eyedropperActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-700 text-gray-200 hover:bg-zinc-600'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </button>
            <div
              className="w-7 h-7 rounded border-2 border-zinc-600"
              style={{ backgroundColor: hoveredColor ?? color }}
              title={hoveredColor ?? color}
            />
          </div>

          {/* Opacity slider */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Alpha</span>
            <div style={{ height: 140, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="range"
                min={1}
                max={100}
                value={opacity}
                onChange={e => setOpacity(Number(e.target.value))}
                style={{ width: 140, transform: 'rotate(-90deg)' }}
              />
            </div>
            <span className="text-xs text-gray-500">{opacity}%</span>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className={`bg-white ${eyedropperActive ? 'cursor-cell' : 'cursor-crosshair'}`}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={leaveCanvas}
          onClick={pickColor}
        />

        {/* Save form */}
        {showForm && (
          <SketchForm canvasRef={canvasRef} onClose={() => setShowForm(false)} />
        )}
      </div>
    </div>
  )
}
