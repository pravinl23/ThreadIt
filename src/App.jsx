import { Tldraw } from 'tldraw'

export default function App() {
  return (
    // full-viewport wrapper
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* persistenceKey auto-saves to localStorage under “ThreadSketch” */}
      <Tldraw persistenceKey="ThreadSketch" />
    </div>
  )
}
