import { useState } from 'react'
import { Tldraw } from 'tldraw'
import { GarmentSelector } from './components/GarmentSelector'
import './App.css'

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState(null)

  if (selectedGarment) {
    return (
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw persistenceKey="ThreadSketch" />
      </div>
    )
  }

  return <GarmentSelector onGarmentSelect={setSelectedGarment} />
}
