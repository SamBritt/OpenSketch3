import Canvas from '../../components/canvas/Canvas'

export default function Create() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <h1 className="text-gray-200 text-2xl">New Sketch</h1>
      <Canvas />
    </div>
  )
}
