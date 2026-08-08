import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components'
import VerticalSlider from '@/components/canvas/VerticalSlider'
import LayerPanel from '@/components/canvas/LayerPanel'
import PaletteSwitcher from '@/components/canvas/PaletteSwitcher'
import { LayerMeta } from '@/types'

const MAX_HISTORY = 50

const PALETTE = [
  '#000000', '#ffffff', '#6b7280',
  '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6',
  '#8b5cf6', '#ec4899', '#92400e',
]

type HistoryEntry = {
  layers: LayerMeta[]
  pixelSnapshot?: { layerId: string; imageData: ImageData }
}

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>
  onDone: (bgColor: string) => void
}

export default function Canvas({ canvasRef, onDone }: Props) {
  const isDrawingRef = useRef(false)
  const layerCanvasesRef = useRef<Map<string, HTMLCanvasElement>>(new Map())
  const undoStackRef = useRef<HistoryEntry[]>([])
  const redoStackRef = useRef<HistoryEntry[]>([])
  const strokeBaseRef = useRef<ImageData | null>(null)
  const strokePointsRef = useRef<{ x: number; y: number }[]>([])
  const firstLayerIdRef = useRef<string>('')

  const [layers, setLayers] = useState<LayerMeta[]>(() => {
    const id = crypto.randomUUID()
    firstLayerIdRef.current = id
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 600
    layerCanvasesRef.current.set(id, canvas)
    return [{ id, name: 'Layer 1', visible: true, opacity: 100 }]
  })
  const [activeLayerId, setActiveLayerId] = useState<string>(() => firstLayerIdRef.current)
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})

  const [brushSize, setBrushSize] = useState(3)
  const [opacity, setOpacity] = useState(100)
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [undoCount, setUndoCount] = useState(0)
  const [redoCount, setRedoCount] = useState(0)
  const [eyedropperActive, setEyedropperActive] = useState<boolean>(false)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)

  const getCtx = () => {
    const canvas = canvasRef.current
    return canvas ? canvas.getContext('2d') : null
  }

  const getLayerCtx = (id: string) => layerCanvasesRef.current.get(id)?.getContext('2d') ?? null

  const rgbaToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')

  const compositeLayers = (layersOverride?: LayerMeta[]) => {
    const ctx = getCtx()
    if (!ctx) return
    const list = layersOverride ?? layers
    ctx.clearRect(0, 0, 600, 600)
    for (const layer of list) {
      if (!layer.visible) continue
      const layerCanvas = layerCanvasesRef.current.get(layer.id)
      if (!layerCanvas) continue
      ctx.globalAlpha = layer.opacity / 100
      ctx.drawImage(layerCanvas, 0, 0)
    }
    ctx.globalAlpha = 1
  }

  useEffect(() => {
    compositeLayers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers])

  const updateThumbnail = (id: string) => {
    const src = layerCanvasesRef.current.get(id)
    if (!src) return
    const smallCanvas = document.createElement('canvas')
    smallCanvas.width = 64
    smallCanvas.height = 64
    const smallCtx = smallCanvas.getContext('2d')
    if (!smallCtx) return
    smallCtx.drawImage(src, 0, 0, 600, 600, 0, 0, 64, 64)
    setThumbnails(t => ({ ...t, [id]: smallCanvas.toDataURL('image/png') }))
  }

  useEffect(() => {
    updateThumbnail(firstLayerIdRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reconcileLayerCanvases = (targetLayers: LayerMeta[]) => {
    const targetIds = new Set(targetLayers.map(l => l.id))
    for (const id of targetIds) {
      if (!layerCanvasesRef.current.has(id)) {
        const canvas = document.createElement('canvas')
        canvas.width = 600
        canvas.height = 600
        layerCanvasesRef.current.set(id, canvas)
      }
    }
    for (const id of [...layerCanvasesRef.current.keys()]) {
      if (!targetIds.has(id)) layerCanvasesRef.current.delete(id)
    }
  }

  const pushHistory = (entry: HistoryEntry) => {
    if (undoStackRef.current.length >= MAX_HISTORY) undoStackRef.current.shift()
    undoStackRef.current.push(entry)
    redoStackRef.current = []
    setUndoCount(undoStackRef.current.length)
    setRedoCount(0)
  }

  const undo = () => {
    if (undoStackRef.current.length === 0) return
    const entry = undoStackRef.current.pop()!

    let redoPixelSnapshot: HistoryEntry['pixelSnapshot']
    if (entry.pixelSnapshot) {
      const ctx = getLayerCtx(entry.pixelSnapshot.layerId)
      redoPixelSnapshot = ctx
        ? { layerId: entry.pixelSnapshot.layerId, imageData: ctx.getImageData(0, 0, 600, 600) }
        : undefined
    }
    redoStackRef.current.push({ layers: [...layers], pixelSnapshot: redoPixelSnapshot })

    reconcileLayerCanvases(entry.layers)
    setLayers(entry.layers)

    if (entry.pixelSnapshot && layerCanvasesRef.current.has(entry.pixelSnapshot.layerId)) {
      getLayerCtx(entry.pixelSnapshot.layerId)!.putImageData(entry.pixelSnapshot.imageData, 0, 0)
    }

    if (!entry.layers.some(l => l.id === activeLayerId)) {
      setActiveLayerId(entry.layers[entry.layers.length - 1]?.id ?? '')
    }

    compositeLayers(entry.layers)
    entry.layers.forEach(l => updateThumbnail(l.id))

    setUndoCount(undoStackRef.current.length)
    setRedoCount(redoStackRef.current.length)
  }

  const redo = () => {
    if (redoStackRef.current.length === 0) return
    const entry = redoStackRef.current.pop()!

    let undoPixelSnapshot: HistoryEntry['pixelSnapshot']
    if (entry.pixelSnapshot) {
      const ctx = getLayerCtx(entry.pixelSnapshot.layerId)
      undoPixelSnapshot = ctx
        ? { layerId: entry.pixelSnapshot.layerId, imageData: ctx.getImageData(0, 0, 600, 600) }
        : undefined
    }
    undoStackRef.current.push({ layers: [...layers], pixelSnapshot: undoPixelSnapshot })

    reconcileLayerCanvases(entry.layers)
    setLayers(entry.layers)

    if (entry.pixelSnapshot && layerCanvasesRef.current.has(entry.pixelSnapshot.layerId)) {
      getLayerCtx(entry.pixelSnapshot.layerId)!.putImageData(entry.pixelSnapshot.imageData, 0, 0)
    }

    if (!entry.layers.some(l => l.id === activeLayerId)) {
      setActiveLayerId(entry.layers[entry.layers.length - 1]?.id ?? '')
    }

    compositeLayers(entry.layers)
    entry.layers.forEach(l => updateThumbnail(l.id))

    setUndoCount(undoStackRef.current.length)
    setRedoCount(redoStackRef.current.length)
  }

  // Clears only the active layer's content (Procreate convention) — other layers are untouched.
  const clear = () => {
    const ctx = getLayerCtx(activeLayerId)
    if (!ctx) return
    pushHistory({
      layers: [...layers],
      pixelSnapshot: { layerId: activeLayerId, imageData: ctx.getImageData(0, 0, 600, 600) },
    })
    ctx.clearRect(0, 0, 600, 600)
    compositeLayers()
    updateThumbnail(activeLayerId)
  }

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
    const ctx = getLayerCtx(activeLayerId)
    if (!ctx) return
    isDrawingRef.current = true
    strokeBaseRef.current = ctx.getImageData(0, 0, 600, 600)
    pushHistory({ layers: [...layers], pixelSnapshot: { layerId: activeLayerId, imageData: strokeBaseRef.current } })
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
    const ctx = getLayerCtx(activeLayerId)
    if (!ctx) return
    strokePointsRef.current.push({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    ctx.putImageData(strokeBaseRef.current, 0, 0)
    replayStroke(ctx)
    compositeLayers()
  }

  const stopDraw = () => {
    if (isDrawingRef.current) updateThumbnail(activeLayerId)
    isDrawingRef.current = false
    strokeBaseRef.current = null
    strokePointsRef.current = []
    setHoveredColor(null)
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

  const addLayer = () => {
    pushHistory({ layers: [...layers] })
    const id = crypto.randomUUID()
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 600
    layerCanvasesRef.current.set(id, canvas)
    setLayers(ls => [...ls, { id, name: `Layer ${layers.length + 1}`, visible: true, opacity: 100 }])
    setActiveLayerId(id)
  }

  const deleteLayer = (id: string) => {
    if (layers.length <= 1) return
    if (!window.confirm('Delete this layer?')) return
    pushHistory({
      layers: [...layers],
      pixelSnapshot: { layerId: id, imageData: getLayerCtx(id)!.getImageData(0, 0, 600, 600) },
    })
    layerCanvasesRef.current.delete(id)
    const deletedIndex = layers.findIndex(l => l.id === id)
    const newLayers = layers.filter(l => l.id !== id)
    setLayers(newLayers)
    if (activeLayerId === id) {
      setActiveLayerId(newLayers[Math.min(deletedIndex, newLayers.length - 1)].id)
    }
  }

  const renameLayer = (id: string, name: string) => {
    pushHistory({ layers: [...layers] })
    setLayers(ls => ls.map(l => (l.id === id ? { ...l, name } : l)))
  }

  const toggleVisibility = (id: string) => {
    pushHistory({ layers: [...layers] })
    setLayers(ls => ls.map(l => (l.id === id ? { ...l, visible: !l.visible } : l)))
  }

  const updateLayerOpacity = (id: string, value: number) => {
    pushHistory({ layers: [...layers] })
    setLayers(ls => ls.map(l => (l.id === id ? { ...l, opacity: value } : l)))
  }

  const moveLayerUp = (id: string) => {
    const index = layers.findIndex(l => l.id === id)
    if (index === -1 || index === layers.length - 1) return
    pushHistory({ layers: [...layers] })
    const newLayers = [...layers]
    ;[newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]]
    setLayers(newLayers)
  }

  const moveLayerDown = (id: string) => {
    const index = layers.findIndex(l => l.id === id)
    if (index <= 0) return
    pushHistory({ layers: [...layers] })
    const newLayers = [...layers]
    ;[newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]]
    setLayers(newLayers)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex gap-3 items-center">
        {[
          { label: 'Undo', action: undo, disabled: undoCount === 0 },
          { label: 'Redo', action: redo, disabled: redoCount === 0 },
          { label: 'Clear', action: clear, disabled: false },
        ].map(({ label, action, disabled }) => (
          <Button
            key={label}
            variant="secondary"
            size="sm"
            onClick={action}
            disabled={disabled}
          >
            {label}
          </Button>
        ))}
        <Button
          variant="primary"
          size="sm"
          onClick={() => onDone(bgColor)}
          className="ml-auto"
        >
          Done
        </Button>
      </div>

      {/* Left panel + canvas + right panel */}
      <div className="flex gap-5 items-start">
        {/* Left panel */}
        <div className="flex flex-col items-center gap-8 py-1">

          {/* Brush size */}
          <VerticalSlider
            label="Size"
            min={1}
            max={50}
            value={brushSize}
            onChange={setBrushSize}
            valueLabel={`${brushSize}px`}
          />

          {/* Color preview / eyedropper */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setEyedropperActive(v => !v)}
              className={`w-8 h-8 rounded border-2 overflow-hidden ${
                eyedropperActive ? 'border-da-green' : 'border-da-border'
              }`}
              style={{ backgroundColor: hoveredColor ?? color }}
              title={eyedropperActive ? 'Click canvas to pick a color' : 'Pick color from canvas'}
            />
          </div>

          {/* Opacity */}
          <VerticalSlider
            label="Alpha"
            min={1}
            max={100}
            value={opacity}
            onChange={setOpacity}
            valueLabel={`${opacity}%`}
          />

        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className={eyedropperActive ? 'cursor-cell' : 'cursor-crosshair'}
          style={{ background: bgColor }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onClick={pickColor}
        />

        {/* Right panel: color pickers */}
        <div className="flex flex-col items-start gap-2 py-1">
          <div className="relative w-8 h-8 rounded border-2 border-da-border overflow-hidden" title="Custom color">
            <div className="w-full h-full" style={{ backgroundColor: color }} />
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <PaletteSwitcher defaultColors={PALETTE} color={color} onColorChange={setColor} />

          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">BG</span>
            <div className="relative w-8 h-8 rounded border-2 border-zinc-500 overflow-hidden" title="Background color">
              <div className="w-full h-full" style={{ backgroundColor: bgColor }} />
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-4 w-full">
            <LayerPanel
              layers={layers}
              activeLayerId={activeLayerId}
              thumbnails={thumbnails}
              onSelect={setActiveLayerId}
              onToggleVisibility={toggleVisibility}
              onRename={renameLayer}
              onDelete={deleteLayer}
              onMoveUp={moveLayerUp}
              onMoveDown={moveLayerDown}
              onOpacityChange={updateLayerOpacity}
              onAddLayer={addLayer}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
