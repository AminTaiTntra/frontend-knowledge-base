import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NormalList from './components/ReactWindow/NormalList'
import VirtualizedList from './components/ReactWindow/VirtualizedList'
import Demo1 from './components/ProfilingDemo/demo1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          Welcome User

          <h2>Normal List Rendering (10,000 Items)</h2>
          <NormalList /> 

          <h2>Virtualized List Rendering</h2>
          <VirtualizedList /> 
       
          <h2>Perfomace profiling</h2>
          <Demo1/>

      </div>
    </>
  )
}

export default App
