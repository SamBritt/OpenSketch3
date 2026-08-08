import { useEffect, useState } from 'react'
import { usePaletteStore } from '@/store/paletteStore'

interface Props {
  defaultColors: string[]
  color: string
  onColorChange: (color: string) => void
}

interface DisplayPalette {
  id: string
  name: string
  colors: string[]
  editable: boolean
}

export default function PaletteSwitcher({ defaultColors, color, onColorChange }: Props) {
  const { palettes, fetchPalettes, addPalette, deletePalette, renamePalette, addColorToPalette, removeColorFromPalette } = usePaletteStore()

  const [activeId, setActiveId] = useState('default')
  const [creatingPalette, setCreatingPalette] = useState(false)
  const [newPaletteName, setNewPaletteName] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')

  useEffect(() => {
    fetchPalettes()
  }, [fetchPalettes])

  const displayPalettes: DisplayPalette[] = [
    { id: 'default', name: 'Default', colors: defaultColors, editable: false },
    ...palettes.map(p => ({ id: String(p.id), name: p.name, colors: p.colors, editable: true })),
  ]

  const activePalette = displayPalettes.find(p => p.id === activeId) ?? displayPalettes[0]

  const handleCreatePalette = async () => {
    const name = newPaletteName.trim()
    if (!name) return
    const created = await addPalette(name)
    setActiveId(String(created.id))
    setNewPaletteName('')
    setCreatingPalette(false)
  }

  const handleRename = async () => {
    const name = renameValue.trim()
    if (!name || activePalette.id === 'default') return
    await renamePalette(Number(activePalette.id), name)
    setRenaming(false)
  }

  const handleDelete = async () => {
    if (activePalette.id === 'default') return
    if (!window.confirm('Delete this palette?')) return
    await deletePalette(Number(activePalette.id))
    setActiveId('default')
  }

  return (
    <>
      <span className="text-xs text-da-muted uppercase tracking-wider">Color</span>

      <div className="flex items-center gap-1">
        <div className="flex gap-1 overflow-x-auto max-w-[140px]">
          {displayPalettes.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              title={p.name}
              className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] border whitespace-nowrap ${
                activeId === p.id ? 'border-da-green bg-da-elevated' : 'border-da-border'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCreatingPalette(v => !v)}
          title="New palette"
          className="shrink-0 w-4 h-4 flex items-center justify-center rounded border border-da-border text-da-subtle text-xs"
        >
          +
        </button>
      </div>

      {creatingPalette && (
        <div className="flex items-center gap-1">
          <input
            type="text"
            autoFocus
            value={newPaletteName}
            onChange={e => setNewPaletteName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCreatePalette()
            }}
            placeholder="Palette name"
            className="w-20 text-[10px] bg-da-elevated border border-da-border rounded px-1 py-0.5 text-da-text"
          />
          <button
            type="button"
            onClick={handleCreatePalette}
            className="text-[10px] text-da-green"
          >
            OK
          </button>
        </div>
      )}

      {activePalette.editable && (
        <div className="flex items-center gap-2">
          {renaming ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRename()
                }}
                className="w-20 text-[10px] bg-da-elevated border border-da-border rounded px-1 py-0.5 text-da-text"
              />
              <button type="button" onClick={handleRename} className="text-[10px] text-da-green">
                OK
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setRenameValue(activePalette.name)
                setRenaming(true)
              }}
              title="Rename palette"
              className="text-da-subtle hover:text-da-text text-xs"
            >
              &#9998;
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            title="Delete palette"
            className="text-da-subtle hover:text-red-400 text-xs"
          >
            &#215;
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1">
        {activePalette.colors.map((swatch, index) => (
          <button
            key={`${swatch}-${index}`}
            onClick={() => onColorChange(swatch)}
            title={swatch}
            className={`group relative w-5 h-5 rounded-sm border transition-transform hover:scale-110 ${
              color === swatch ? 'border-da-green scale-110' : 'border-da-border'
            }`}
            style={{ backgroundColor: swatch }}
          >
            {activePalette.editable && (
              <span
                onClick={e => {
                  e.stopPropagation()
                  removeColorFromPalette(Number(activePalette.id), swatch)
                }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full hidden group-hover:flex items-center justify-center bg-red-500 text-white text-[8px] leading-none z-10"
              >
                &#215;
              </span>
            )}
          </button>
        ))}
        {activePalette.editable && (
          <button
            type="button"
            onClick={() => addColorToPalette(Number(activePalette.id), color)}
            title="Add current color"
            className="w-5 h-5 rounded-sm border border-da-border flex items-center justify-center text-da-subtle text-xs"
          >
            +
          </button>
        )}
      </div>
    </>
  )
}
