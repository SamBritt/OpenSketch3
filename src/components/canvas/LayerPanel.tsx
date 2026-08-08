import { useState } from 'react'
import { Button } from '@/components'
import { LayerMeta } from '@/types'

interface Props {
  layers: LayerMeta[]
  activeLayerId: string
  thumbnails: Record<string, string>
  onSelect: (id: string) => void
  onToggleVisibility: (id: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onOpacityChange: (id: string, value: number) => void
  onAddLayer: () => void
}

export default function LayerPanel({
  layers,
  activeLayerId,
  thumbnails,
  onSelect,
  onToggleVisibility,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
  onOpacityChange,
  onAddLayer,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const startRename = (layer: LayerMeta) => {
    setEditingId(layer.id)
    setEditingName(layer.name)
  }

  const commitRename = (id: string) => {
    const trimmed = editingName.trim()
    if (trimmed) onRename(id, trimmed)
    setEditingId(null)
  }

  return (
    <div className="flex flex-col gap-2 w-56">
      <div className="flex items-center justify-between">
        <span className="text-xs text-da-muted uppercase tracking-wider">Layers</span>
        <Button variant="secondary" size="sm" onClick={onAddLayer}>+ Layer</Button>
      </div>

      <div className="flex flex-col gap-1 max-h-[420px] overflow-y-auto">
        {[...layers].reverse().map(layer => {
          const index = layers.findIndex(l => l.id === layer.id)
          const isTop = index === layers.length - 1
          const isBottom = index === 0

          return (
            <div
              key={layer.id}
              className={`border rounded-md p-2 flex flex-col gap-1 cursor-pointer ${
                layer.id === activeLayerId ? 'border-da-green' : 'border-da-border'
              }`}
              onClick={() => onSelect(layer.id)}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onToggleVisibility(layer.id) }}
                  className="text-sm w-5 shrink-0"
                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                >
                  {layer.visible ? '👁' : '🚫'}
                </button>

                {thumbnails[layer.id] ? (
                  <img
                    src={thumbnails[layer.id]}
                    className="w-8 h-8 rounded border border-da-border object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded border border-da-border bg-da-elevated shrink-0" />
                )}

                {editingId === layer.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onClick={e => e.stopPropagation()}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={() => commitRename(layer.id)}
                    onKeyDown={e => { if (e.key === 'Enter') commitRename(layer.id) }}
                    className="flex-1 min-w-0 bg-da-elevated border border-da-border rounded px-1 text-xs text-da-text"
                  />
                ) : (
                  <span
                    className="flex-1 min-w-0 truncate text-xs text-da-text"
                    onDoubleClick={e => { e.stopPropagation(); startRename(layer) }}
                  >
                    {layer.name}
                  </span>
                )}

                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onDelete(layer.id) }}
                  disabled={layers.length <= 1}
                  className="text-da-muted hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm leading-none shrink-0"
                  title="Delete layer"
                >
                  &#215;
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onMoveUp(layer.id) }}
                  disabled={isTop}
                  className="text-da-muted hover:text-da-text disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  title="Move layer up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onMoveDown(layer.id) }}
                  disabled={isBottom}
                  className="text-da-muted hover:text-da-text disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  title="Move layer down"
                >
                  ▼
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={layer.opacity}
                  onClick={e => e.stopPropagation()}
                  onChange={e => onOpacityChange(layer.id, Number(e.target.value))}
                  className="accent-da-green w-16"
                />
                <span className="text-xs text-da-subtle">{layer.opacity}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
