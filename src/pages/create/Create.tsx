import { useRef, useState } from 'react'
import Canvas from '@/components/canvas/Canvas'
import SketchForm from '@/components/canvas/SketchForm'

export default function Create() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showForm, setShowForm] = useState(false)
  const [bgColor, setBgColor] = useState('#ffffff')

  const handleDone = (color: string) => {
    setBgColor(color)
    setShowForm(true)
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <h1 className="text-gray-200 text-2xl">New Sketch</h1>
      <div className="flex gap-6 items-start">
        <Canvas canvasRef={canvasRef} onDone={handleDone} />
        {showForm && (
          <SketchForm
            canvasRef={canvasRef}
            bgColor={bgColor}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  )
}
