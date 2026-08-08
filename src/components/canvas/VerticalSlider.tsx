import { useRef } from 'react'

interface Props {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  label: string
  valueLabel: string
}

export default function VerticalSlider({ min, max, value, onChange, label, valueLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const updateFromPointer = (clientY: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (rect.bottom - clientY) / rect.height))
    onChange(Math.round(min + ratio * (max - min)))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromPointer(e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return
    updateFromPointer(e.clientY)
  }

  const fillPercent = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-da-muted uppercase tracking-wider">{label}</span>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-8 h-36 rounded-md bg-da-elevated border border-da-border overflow-hidden relative touch-none select-none cursor-pointer"
      >
        <div
          className="absolute bottom-0 left-0 w-full bg-da-green"
          style={{ height: `${fillPercent}%` }}
        />
      </div>
      <span className="text-xs text-da-subtle">{valueLabel}</span>
    </div>
  )
}
